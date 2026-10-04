import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);

    let body;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: 'Invalid request' }, { status: 400 });
    }

    const email = (body?.email || '').trim().toLowerCase();
    if (!email) return Response.json({ error: 'Email required' }, { status: 400 });

    const result = await base44.asServiceRole.entities.User.filter({ email });
    const users = Array.isArray(result) ? result : (result.items || []);
    return Response.json({ invited: users.length > 0 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}