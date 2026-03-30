// js/utils/policyManager.js
/**
 * 공약 데이터 관리 — localStorage 오버라이드
 * 기본 공약 데이터 위에 관리자가 수정한 내용을 덮어씀
 */
import { resizeImageFile } from './imageHelper.js';

const POLICY_KEY = 'gunsan1st_policies';

/** 저장된 공약 오버라이드 가져오기 { policyId: { field: value } } */
export function getPolicyOverrides() {
  try {
    const saved = localStorage.getItem(POLICY_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch { return {}; }
}

/** 기본 공약 배열에 오버라이드 적용 */
export function applyOverrides(defaultPolicies) {
  const overrides = getPolicyOverrides();
  return defaultPolicies.map(p => {
    const ov = overrides[p.id];
    if (!ov) return p;
    return {
      ...p,
      ...ov,
      // details는 문자열로 저장되었으면 배열로 변환
      details: ov.details
        ? (typeof ov.details === 'string' ? ov.details.split('\n').filter(d => d.trim()) : ov.details)
        : p.details
    };
  });
}

/** 특정 공약 오버라이드 저장 */
export function savePolicyOverride(policyId, fields) {
  const all = getPolicyOverrides();
  all[policyId] = { ...(all[policyId] || {}), ...fields };
  localStorage.setItem(POLICY_KEY, JSON.stringify(all));
}

/** 특정 공약 오버라이드 초기화 */
export function resetPolicyOverride(policyId) {
  const all = getPolicyOverrides();
  delete all[policyId];
  localStorage.setItem(POLICY_KEY, JSON.stringify(all));
}

/** 전체 오버라이드 초기화 */
export function resetAllPolicyOverrides() {
  localStorage.removeItem(POLICY_KEY);
}
