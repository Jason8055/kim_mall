// js/utils/reviews.js
/**
 * 리뷰(댓글) 관리 저장소
 * localStorage 기반 — 기본 리뷰 + 관리자 추가 리뷰 병합
 */

const REVIEWS_KEY = 'gunsan1st_reviews';

/**
 * 특정 공약의 리뷰 목록 가져오기 (기본 + 추가분 병합)
 * @param {string} policyId - 공약 ID
 * @param {Array} defaultReviews - policies.js의 기본 리뷰
 * @returns {Array} 병합된 리뷰 목록
 */
export function getReviews(policyId, defaultReviews = []) {
  const allCustom = getAllCustomReviews();
  const custom = allCustom[policyId] || [];
  return [...defaultReviews, ...custom];
}

/** 전체 커스텀 리뷰 가져오기 { policyId: [reviews] } */
export function getAllCustomReviews() {
  try {
    const saved = localStorage.getItem(REVIEWS_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch { return {}; }
}

/** 리뷰 추가 */
export function addReview(policyId, review) {
  const all = getAllCustomReviews();
  if (!all[policyId]) all[policyId] = [];
  all[policyId].push({
    ...review,
    id: 'custom-' + Date.now(),
    createdAt: new Date().toISOString()
  });
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(all));
}

/** 리뷰 삭제 (커스텀 리뷰만) */
export function deleteReview(policyId, reviewId) {
  const all = getAllCustomReviews();
  if (all[policyId]) {
    all[policyId] = all[policyId].filter(r => r.id !== reviewId);
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(all));
  }
}

/** 리뷰에 판매자 답변 추가/수정 */
export function setReply(policyId, reviewId, replyText) {
  const all = getAllCustomReviews();
  if (all[policyId]) {
    const review = all[policyId].find(r => r.id === reviewId);
    if (review) {
      review.reply = replyText || null;
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(all));
    }
  }
}

/** 전체 커스텀 리뷰 초기화 */
export function clearAllReviews() {
  localStorage.removeItem(REVIEWS_KEY);
}

/** 특정 공약의 커스텀 리뷰 개수 */
export function getCustomReviewCount(policyId) {
  const all = getAllCustomReviews();
  return (all[policyId] || []).length;
}

/** 전체 커스텀 리뷰 총 개수 */
export function getTotalCustomReviewCount() {
  const all = getAllCustomReviews();
  return Object.values(all).reduce((sum, arr) => sum + arr.length, 0);
}
