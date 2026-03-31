// js/utils/metrics.js
/**
 * 방문자 및 공약 클릭 트래킹 모듈
 * Supabase를 활용하여 실제 접속자 수 및 클릭 수를 관리합니다.
 */
import { supabase } from './supabase.js';

const METRICS_ID = 'metrics';

// 메모리 캐싱 변수 (DB 호출 최소화)
let cachedMetrics = null;

// 구조체 초기화
function getDefaultMetrics() {
  return {
    actual_visits: 0,
    pledge_clicks: {}
  };
}

/** 메트릭스 불러오기 */
export async function getMetrics() {
  if (cachedMetrics) return cachedMetrics;

  try {
    const { data, error } = await supabase
      .from('app_config')
      .select('data')
      .eq('id', METRICS_ID)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116: Row not found
      console.error('Error fetching metrics:', error);
    }

    if (data && data.data) {
      cachedMetrics = { ...getDefaultMetrics(), ...data.data };
    } else {
      cachedMetrics = getDefaultMetrics();
    }
  } catch (e) {
    console.warn('Metrics fetch failed, using default:', e);
    cachedMetrics = getDefaultMetrics();
  }
  
  return cachedMetrics;
}

/** 메트릭스 저장하기 */
async function saveMetrics(metricsData) {
  try {
    const { error } = await supabase
      .from('app_config')
      .upsert({ id: METRICS_ID, data: metricsData, updated_at: new Date() });
      
    if (error) console.error('Error saving metrics:', error);
  } catch (e) {
    console.error('Failed to save metrics:', e);
  }
}

/** 시스템 공통 방문자 수 증가시키기 (세션 단위) */
export async function incrementVisit() {
  // 세션 스토리지 기반으로 중복 카운팅 방지 (단순 세션 기준)
  if (sessionStorage.getItem('visited_this_session')) return;

  const metrics = await getMetrics();
  metrics.actual_visits = (metrics.actual_visits || 0) + 1;
  cachedMetrics = metrics;
  
  await saveMetrics(metrics);
  sessionStorage.setItem('visited_this_session', 'true');
}

/** 특정 공약 클릭 수 증가시키기 */
export async function incrementPledgeClick(policyId) {
  if (!policyId) return;

  const metrics = await getMetrics();
  if (!metrics.pledge_clicks) metrics.pledge_clicks = {};
  
  metrics.pledge_clicks[policyId] = (metrics.pledge_clicks[policyId] || 0) + 1;
  cachedMetrics = metrics;

  await saveMetrics(metrics);
}
