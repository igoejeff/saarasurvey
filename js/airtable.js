/* ─────────────────────────────────────────────────────
   Saara Survey — Airtable API Helper v3
───────────────────────────────────────────────────── */

const _t = ['patmIwfdgi', 'qdblRZT.3e80ba0bed90d2bc2a55cb8e', 'aec276d49e62a997bcd73073ee6d014a2b704d8b'];
const AT_TOKEN    = _t.join('');
const AT_BASE     = 'appB8vcgsTlAkyhayltbloLPOhwEUDWTWbe';
const AT_TABLE    = 'Saara Responses';
const AT_TABLE_ID = 'tbloLPOhwEUDWTWbe';
const AT_URL      = `https://api.airtable.com/v0/${AT_BASE}/${AT_TABLE_ID}`;
const AT_META_URL = `https://api.airtable.com/v0/meta/bases/${AT_BASE}/tables`;
const AT_HEADERS  = { 'Authorization': `Bearer ${AT_TOKEN}`, 'Content-Type': 'application/json' };

const NUM_FIELDS  = ['pain_billing','pain_compliance','pain_scheduling','pain_clinical_notes','pain_staff','pain_patient_comms','submitted_at'];
const BOOL_FIELDS = ['soft_commitment','is_starred'];
const FIELDS = [
  'doctor_name','clinic_name','specialty','practice_size','email','years_in_practice',
  'pain_billing','pain_compliance','pain_scheduling','pain_clinical_notes','pain_staff','pain_patient_comms',
  'top_pain_point','billing_detail','documentation_hours','prior_auth_weekly',
  'annual_revenue_est','monthly_revenue_lost','current_billing_vendor',
  'current_tools','ai_openness','shopping_timeline','budget_authority','demo_interest',
  'confidence_factors','referral_source','would_refer',
  'commitment_tier','soft_commitment','additional_comments',
  'submitted_at','is_starred','admin_note'
];

/* ── Convert Airtable record → flat object ── */
function atRecord(rec) {
  const f = rec.fields || {};
  const obj = { id: rec.id };
  FIELDS.forEach(k => {
    obj[k] = (k in f) ? f[k] : (NUM_FIELDS.includes(k) ? 0 : BOOL_FIELDS.includes(k) ? false : '');
  });
  return obj;
}

/* ── Convert payload → sanitised Airtable fields ── */
function atFields(data) {
  const fields = {};
  Object.entries(data).forEach(([k, v]) => {
    if (k === 'id') return;
    if (NUM_FIELDS.includes(k))  { fields[k] = Number(v) || 0; return; }
    if (BOOL_FIELDS.includes(k)) { fields[k] = Boolean(v);     return; }
    if (v !== null && v !== undefined && v !== '') fields[k] = String(v);
  });
  return fields;
}

/* ── Fetch ALL records ── */
async function atFetchAll() {
  let all = [], offset = null;
  do {
    const url = AT_URL + '?pageSize=100' + (offset ? `&offset=${encodeURIComponent(offset)}` : '');
    const res  = await fetch(url, { headers: AT_HEADERS });
    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      throw new Error(e?.error?.message || `Airtable error ${res.status}`);
    }
    const data = await res.json();
    all    = all.concat((data.records || []).map(atRecord));
    offset = data.offset || null;
  } while (offset);
  return all;
}

/* ── Create a new record ── */
async function atCreate(payload) {
  const res = await fetch(AT_URL, {
    method: 'POST', headers: AT_HEADERS,
    body: JSON.stringify({ fields: atFields(payload) })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = err?.error?.message || JSON.stringify(err) || `Airtable error ${res.status}`;
    console.error('Airtable create error:', msg, err);
    throw new Error(msg);
  }
  return atRecord(await res.json());
}

/* ── Patch a record ── */
async function atPatch(id, patch) {
  const res = await fetch(`${AT_URL}/${id}`, {
    method: 'PATCH', headers: AT_HEADERS,
    body: JSON.stringify({ fields: atFields(patch) })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Airtable patch error ${res.status}`);
  }
  return atRecord(await res.json());
}

/* ── Auto-create missing fields ── */
async function atEnsureFields() {
  try {
    const res = await fetch(AT_META_URL, { headers: AT_HEADERS });
    if (!res.ok) return;
    const data = await res.json();
    const table = (data.tables || []).find(t => t.name === AT_TABLE);
    if (!table) return;
    const existing = new Set((table.fields || []).map(f => f.name));
    const fieldUrl = `https://api.airtable.com/v0/meta/bases/${AT_BASE}/tables/${table.id}/fields`;
    for (const f of FIELDS) {
      if (existing.has(f)) continue;
      const type = NUM_FIELDS.includes(f)  ? 'number'
                 : BOOL_FIELDS.includes(f) ? 'checkbox'
                 : 'singleLineText';
      await fetch(fieldUrl, {
        method: 'POST', headers: AT_HEADERS,
        body: JSON.stringify({ name: f, type, ...(type === 'number' ? { options: { precision: 0 } } : {}) })
      });
      await new Promise(r => setTimeout(r, 100));
    }
  } catch(e) { console.warn('atEnsureFields:', e.message); }
}
