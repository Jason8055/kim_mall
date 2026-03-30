// js/utils/config.js
/**
 * 관리자 설정 저장소
 * localStorage를 사용하여 관리자가 수정한 설정을 저장/불러오기
 */

const CONFIG_KEY = 'gunsan1st_config';
const ADMIN_PW = 'gunsan2026'; // 관리자 비밀번호

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
};

/** 설정 불러오기 (localStorage → 기본값 병합) */
export function getConfig() {
  try {
    const saved = localStorage.getItem(CONFIG_KEY);
    if (saved) {
      return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
    }
  } catch (e) { /* 무시 */ }
  return { ...DEFAULT_CONFIG };
}

/** 설정 저장 */
export function saveConfig(config) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

/** 설정 초기화 */
export function resetConfig() {
  localStorage.removeItem(CONFIG_KEY);
}

/** 관리자 비밀번호 확인 */
export function checkAdminPassword(pw) {
  return pw === ADMIN_PW;
}

/** 기본 설정값 반환 */
export function getDefaultConfig() {
  return { ...DEFAULT_CONFIG };
}
