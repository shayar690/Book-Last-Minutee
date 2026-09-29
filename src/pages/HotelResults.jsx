import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2, Search } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useI18n } from "@/lib/i18n";
import HotelCard from "@/components/results/HotelCard";
import SearchLoading from "@/components/results/SearchLoading";
import DateDisplay from "@/components/results/DateDisplay";

const hotelCache = new Map();

export default function HotelResults() {
  const { t, lang, localePath } = useI18n();
  const [searchParams] = useSearchParams();
  const [hotels, setHotels] = useState([]);
  const [totalFound, setTotalFound] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("popularity");
  const loadedNamesRef = useRef(new Set());
  const [hasMore, setHasMore] = useState(true);
  const [batchNum, setBatchNum] = useState(1);
  const [filterQuery, setFilterQuery] = useState("");
  // Bumped whenever we want to force a fresh search (e.g. auto-retry after the
  // mobile browser killed the in-flight request while the tab was backgrounded).
  const [retryCount, setRetryCount] = useState(0);
  // Counts auto-retries for the current search query. Mobile browsers suspend
  // backgrounded tabs and can abort the in-flight hotel search request; when the
  // user returns we re-run the search instead of leaving a dead "Network Error".
  const MAX_AUTO_RETRIES = 3;
  const retryAttemptsRef = useRef(0);

  const sortedHotels = useMemo(() => {
    const arr = [...hotels];
    switch (sortBy) {
      case "price_low_high": return arr.sort((a, b) => (a.pricePerNight || 0) - (b.pricePerNight || 0));
      case "price_high_low": return arr.sort((a, b) => (b.pricePerNight || 0) - (a.pricePerNight || 0));
      case "distance_center": return arr.sort((a, b) => (a.distanceToCenter || 999) - (b.distanceToCenter || 999));
      case "rating_high_low": return arr.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default: return arr.sort((a, b) => (b.reviews || 0) - (a.reviews || 0) || (b.rating || 0) - (a.rating || 0));
    }
  }, [hotels, sortBy]);

  const filteredHotels = useMemo(() => {
    if (!filterQuery.trim()) return sortedHotels;
    const q = filterQuery.trim().toLowerCase();
    return sortedHotels.filter((h) => (h.name || "").toLowerCase().includes(q));
  }, [sortedHotels, filterQuery]);

  const destination = searchParams.get("destination") || "";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const adults = searchParams.get("adults") || "2";
  const rooms = searchParams.get("rooms") || "1";
  const stars = searchParams.get("stars") || "";
  const meal = searchParams.get("meal") || "";
  const earlyIn = searchParams.get("earlyIn") || "";
  const lateOut = searchParams.get("lateOut") || "";
  const freeCancel = searchParams.get("freeCancel") === "1";
  const citizenship = searchParams.get("citizenship") || "";

  // Cache key for this search — preserves results when navigating back from hotel detail.
  const searchKey = `${destination}|${checkIn}|${checkOut}|${adults}|${rooms}|${lang}|${stars}|${meal}|${earlyIn}|${lateOut}|${freeCancel}|${citizenship}`;

  const formatDateWithDay = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const locale = lang === "he" ? "he-IL" : "en-US";
    const weekday = date.toLocaleDateString(locale, { weekday: "long" });
    const weekdayClean = lang === "he" ? weekday.replace("יום ", "") : weekday;
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}.${mm}.${yyyy} (${weekdayClean})`;
  };

  // Reset the auto-retry counter whenever the search query itself changes.
  useEffect(() => { retryAttemptsRef.current = 0; }, [searchKey]);

  // Batch 1 — fast initial results (with cache for back-navigation).
  useEffect(() => {
    if (!destination) { setLoading(false); return; }
    const cached = hotelCache.get(searchKey);
    if (cached) {
      setHotels(cached.hotels);
      setTotalFound(cached.totalFound ?? null);
      setError(cached.error || null);
      loadedNamesRef.current = new Set(cached.hotels.map((h) => h.name));
      setBatchNum(cached.batchNum || 1);
      setHasMore(cached.hasMore !== false);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    setHotels([]);
    setTotalFound(null);
    setHasMore(true);
    setBatchNum(1);
    loadedNamesRef.current = new Set();

    base44.functions.invoke("hotelSearch", {
      destination, checkIn, checkOut, adults: Number(adults), rooms: Number(rooms), lang,
      stars, meal, earlyIn, lateOut, freeCancel, citizenship, batch: 1,
    })
      .then((res) => {
        const batchHotels = res.data?.hotels || [];
        batchHotels.forEach((h) => loadedNamesRef.current.add(h.name));
        setHotels(batchHotels);
        setTotalFound(res.data?.totalFound ?? batchHotels.length);
        setError(res.data?.error || null);
        hotelCache.set(searchKey, { hotels: batchHotels, totalFound: res.data?.totalFound ?? batchHotels.length, error: res.data?.error, batchNum: 1, hasMore: true });
      })
      .catch((err) => {
        setError(err.message);
        // Auto-retry network errors that happen when a mobile browser kills the
        // request while the tab is backgrounded. Only retry while the page is
        // actually visible so we don't burn through attempts in the background.
        if (document.visibilityState === "visible" && retryAttemptsRef.current < MAX_AUTO_RETRIES) {
          retryAttemptsRef.current += 1;
          setTimeout(() => setRetryCount((c) => c + 1), 1200);
        }
      })
      .finally(() => setLoading(false));
  }, [searchKey, retryCount]);

  // Mobile browsers suspend backgrounded tabs and can abort the in-flight
  // search request, leaving a dead "Network Error". When the user returns to
  // the app, automatically re-run the search if it died with no results.
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "visible" && error && hotels.length === 0 && !loading && retryAttemptsRef.current < MAX_AUTO_RETRIES) {
        retryAttemptsRef.current += 1;
        setRetryCount((c) => c + 1);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [error, hotels.length, loading]);

  // Load more — user-triggered batch 2+.
  const loadMore = () => {
    if (loadingMore) return;
    const nextBatch = batchNum + 1;
    setBatchNum(nextBatch);
    setLoadingMore(true);

    base44.functions.invoke("hotelSearch", {
      destination, checkIn, checkOut, adults: Number(adults), rooms: Number(rooms), lang,
      stars, meal, earlyIn, lateOut, freeCancel, citizenship, batch: nextBatch,
      exclude: Array.from(loadedNamesRef.current),
    })
      .then((res) => {
        const moreHotels = (res.data?.hotels || []).filter((h) => !loadedNamesRef.current.has(h.name));
        if (moreHotels.length === 0) {
          setHasMore(false);
          const cached = hotelCache.get(searchKey);
          hotelCache.set(searchKey, { ...cached, hasMore: false });
        } else {
          moreHotels.forEach((h) => loadedNamesRef.current.add(h.name));
          setHotels((prev) => {
            const updated = [...prev, ...moreHotels];
            const cached = hotelCache.get(searchKey);
            hotelCache.set(searchKey, { hotels: updated, error: cached?.error || null, batchNum: nextBatch, hasMore: true });
            return updated;
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoadingMore(false));
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] pt-20">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {!loading && (
          <Link to={localePath("/")} className="inline-flex items-center gap-1.5 px-3 h-10 rounded-lg bg-white border border-[#E5E5E5] text-sm text-[#2D3035] hover:border-[#2D3035] transition-colors mb-4 shadow-sm">
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" strokeWidth={1.5} />
            {t("results.backToSearch")}
          </Link>
        )}
        {!loading && (
          <h1 className="text-2xl font-body font-semibold text-[#2D3035] mb-1">
            {`${t("results.showing")} ${totalFound ?? hotels.length} ${t("results.hotelsIn")}${destination}`}
          </h1>
        )}
        {!loading && (
          <div className="text-sm text-[#7D7D7D] mb-4">
            <div>{t("results.checkInLabel")} <DateDisplay dateStr={checkIn} /></div>
            <div>{t("results.checkOutLabel")} <DateDisplay dateStr={checkOut} /></div>
            <div className="mt-1">{adults} {t("results.adults")} · {rooms} {t("results.rooms")}</div>
            {checkIn && checkOut && (() => {
              const nights = Math.round((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
              return (
                <div className="mt-1 font-medium text-[#2D3035]">
                  {nights} {t("results.nights")}, {nights + 1} {t("results.days")}
                </div>
              );
            })()}
          </div>
        )}
        {loading && <div className="mb-4" />}
        {hotels.length > 0 && (
          <div className="relative mb-4">
            <Search className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-[#7D7D7D]" strokeWidth={1.5} />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder={t("results.filterHotels")}
              className="w-full h-11 ps-10 pe-4 rounded-lg bg-white border border-[#C5C5C5] text-sm text-[#2D3035] outline-none focus:border-[#2D3035] transition-colors"
            />
          </div>
        )}
        {hotels.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-[#7D7D7D]">{t("results.sortBy")}</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 h-10 rounded-lg bg-white border border-[#C5C5C5] text-sm text-[#2D3035] outline-none focus:border-[#2D3035]"
            >
              <option value="popularity">{t("results.sort.popularity")}</option>
              <option value="price_low_high">{t("results.sort.priceLowHigh")}</option>
              <option value="price_high_low">{t("results.sort.priceHighLow")}</option>
              <option value="distance_center">{t("results.sort.distanceCenter")}</option>
              <option value="rating_high_low">{t("results.sort.ratingHighLow")}</option>
            </select>
          </div>
        )}
        {loading ? (
          <SearchLoading destination={destination} checkIn={checkIn} checkOut={checkOut} />
        ) : hotels.length === 0 ? (
          <div className="text-center py-20">
            {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
            <p className="text-sm text-[#7D7D7D] mb-4">{t("results.noHotels")}</p>
            <button
              onClick={() => { retryAttemptsRef.current = 0; setRetryCount((c) => c + 1); }}
              className="px-5 h-10 rounded-lg bg-[#2D3035] text-white text-sm font-medium hover:bg-[#1a1d20] transition"
            >
              {lang === "he" ? "נסה שוב" : "Try again"}
            </button>
          </div>
        ) : filteredHotels.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm text-[#7D7D7D]">{t("results.noMatchingHotels")}</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              {filteredHotels.map((hotel, i) => (
                <HotelCard key={`${hotel.name}-${i}`} hotel={hotel} searchContext={{ destination, checkIn, checkOut, adults, rooms }} />
              ))}
            </div>
            {loadingMore && (
              <div className="flex items-center justify-center gap-2 py-6">
                <Loader2 className="w-5 h-5 text-[#F5D166] animate-spin" />
                <span className="text-sm text-[#7D7D7D]">{t("results.hotelsLoading")}</span>
              </div>
            )}
          </>
        )}
        {hasMore && !loading && hotels.length > 0 && filteredHotels.length > 0 && (
          <div className="flex justify-center mt-6">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="px-6 h-11 rounded-lg bg-[#2D3035] text-white text-sm font-medium hover:bg-[#1a1d20] transition disabled:opacity-50"
            >
              {loadingMore ? t("results.hotelsLoading") : t("results.loadMore")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}