import { supabase } from './supabase.js';

export async function saveComplaint(context) {
  if (!supabase) return;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const { error } = await supabase.from('user_history').upsert({
    user_id: user.id,
    claim_id: context.claim_id,
    issue_type: context.type,
    description: context.description,
    ai_score: Math.round((context.detection?.confidence || 0) * 100),
    status: 'policy_chat_open',
    resolution_data: { order_id: context.order_id, detection: context.detection, policies: context.policies || [] },
  }, { onConflict: 'user_id,claim_id' });
  if (error) console.error('Could not save complaint:', error.message);
}

export async function saveComplaintLog(claimId, eventType, payload = {}) {
  if (!supabase) return;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const { error } = await supabase.from('complaint_logs').insert({
    user_id: user.id, claim_id: claimId, event_type: eventType, payload,
  });
  if (error) console.error('Could not save complaint log:', error.message);
}
