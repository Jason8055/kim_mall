// js/utils/policyManager.js
/**
 * 공약 데이터 관리 — Supabase 오버라이드
 * 기본 공약 데이터 위에 관리자가 수정한 내용을 DB에서 가져와 덮어씀
 */
import { supabase } from './supabase.js';

/** 저장된 공약 오버라이드 가져오기 { policyId: { field: value } } */
export async function getPolicyOverrides() {
  try {
    const { data, error } = await supabase
      .from('policy_overrides')
      .select('*');

    if (error) {
      console.error('Error fetching policy overrides:', error);
      alert('공약 데이터 불러오기 실패 (Supabase):\n' + error.message);
      return {};
    }

    // 배열을 객체로 변환 { id: { data } }
    const overrides = {};
    data.forEach(item => {
      overrides[item.id] = item.data;
    });
    return overrides;
  } catch (e) {
    console.error('Policy overrides fetch failed:', e);
    return {};
  }
}

/** 기본 공약 배열에 오버라이드 적용 (비동기) */
export async function applyOverrides(defaultPolicies) {
  const overrides = await getPolicyOverrides();
  return defaultPolicies.map(p => {
    const ov = overrides[p.id];
    if (!ov) return p;
    return {
      ...p,
      ...ov,
      details: ov.details
        ? (typeof ov.details === 'string' ? ov.details.split('\n').filter(d => d.trim()) : ov.details)
        : p.details
    };
  });
}

/** 특정 공약 오버라이드 저장 */
export async function savePolicyOverride(policyId, fields) {
  // 기존 데이터와 병합하기 위해 먼저 가져옴
  const { data: existing } = await supabase
    .from('policy_overrides')
    .select('data')
    .eq('id', policyId)
    .single();
  
  const newData = { ...(existing?.data || {}), ...fields };

  const { error } = await supabase
    .from('policy_overrides')
    .upsert({ id: policyId, data: newData, updated_at: new Date() });
  
  if (error) console.error('Error saving policy override:', error);
}

/** 특정 공약 오버라이드 초기화 */
export async function resetPolicyOverride(policyId) {
  const { error } = await supabase
    .from('policy_overrides')
    .delete()
    .eq('id', policyId);
  
  if (error) console.error('Error resetting policy override:', error);
}

/** 전체 오버라이드 초기화 */
export async function resetAllPolicyOverrides() {
  const { error } = await supabase
    .from('policy_overrides')
    .delete()
    .neq('id', '_none_'); // 전체 삭제를 위한 트릭
  
  if (error) console.error('Error resetting all policy overrides:', error);
}
