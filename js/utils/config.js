// js/utils/config.js
/**
 * 관리자 설정 저장소
 * Supabase 실시간 DB를 사용하여 관리자가 수정한 설정을 저장/불러오기
 */
import { supabase } from './supabase.js';

const CONFIG_KEY = 'gunsan1st_config';
const ADMIN_PW = 'gunsan2026'; // 관리자 비밀번호
const CONFIG_ID = 'default';

// 기본 설정값
const DEFAULT_CONFIG = {
  videoUrl: '3ZtMsl8rRJc',         // 유튜브 영상 ID
  ddayDate: '2026-03-31T00:00:00',    // 경선 시작일
  ddayEndDate: '2026-04-01T18:00:00', // 경선 종료일
  promoText: '📞 여론조사 02 전화 꼭 받아주세요!', // 프로모션 띠배너 텍스트
  heroTitle: '🔥 투표 할래말래?',
  heroSubtitle: '고민은 김재준을 보는 순간 끝나버려~!',
  heroCaption: "그 시절 '1번가'의 감동을 잇는 군산 1번가",
  sectionTitle: '🛒 이재명이 보증하는 3대 킬러 공약',
  footerSlogan: '8명의 후보 중\n군산의 미래를 완판시킬 적임자는\n오직 김재준뿐입니다.',
  trustTitle: '대통령이 믿었던 보좌관,\n이재명이 신뢰하는 파트너',
  trustSubtitle: '청와대 춘추관장 출신 · 민주당 정통 지지층 결집',
  trustImage: '',        // 신뢰 배너 이미지 (base64 또는 URL)
  promoImage: '',        // 프로모션 이미지
  footerImage: '',       // 하단 슬로건 배경 이미지
  visitorOffset: 15430,  // 누적 접속자 오프셋 (기본값 설정)
  concurrentOffset: 120, // 실시간 접속자 오프셋 (기본값 설정)
};

/** 설정 불러오기 (Supabase → 기본값 병합) */
export async function getConfig() {
  try {
    const { data, error } = await supabase
      .from('app_config')
      .select('data')
      .eq('id', CONFIG_ID)
      .single();

    if (error) {
      console.error('Error fetching config:', error);
      alert('설정 불러오기 실패 (Supabase):\n' + error.message);
      return { ...DEFAULT_CONFIG };
    }

    if (data && data.data) {
      return { ...DEFAULT_CONFIG, ...data.data };
    }
  } catch (e) {
    console.error('Config fetch failed:', e);
    alert('설정 불러오기 실패 (네트워크):\n' + e.message);
  }
  return { ...DEFAULT_CONFIG };
}

/** 설정 저장 */
export async function saveConfig(config) {
  const { error } = await supabase
    .from('app_config')
    .upsert({ id: CONFIG_ID, data: config, updated_at: new Date() });
  
  if (error) {
    console.error('Error saving config:', error);
    alert('설정 저장 실패 (Supabase):\n' + error.message);
  }
}

/** 설정 초기화 */
export async function resetConfig() {
  const { error } = await supabase
    .from('app_config')
    .upsert({ id: CONFIG_ID, data: {}, updated_at: new Date() });
  
  if (error) console.error('Error resetting config:', error);
}

/** 관리자 비밀번호 확인 */
export function checkAdminPassword(pw) {
  return pw === ADMIN_PW;
}

/** 기본 설정값 반환 */
export function getDefaultConfig() {
  return { ...DEFAULT_CONFIG };
}
