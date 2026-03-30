// js/utils/reviews.js
/**
 * 리뷰(댓글) 관리 저장소
 * Supabase 실시간 DB 기반 — 기본 리뷰 + DB 추가 리뷰 병합
 */
import { supabase } from './supabase.js';

/**
 * 특정 공약의 리뷰 목록 가져오기 (기본 + 추가분 병합)
 * @param {string} policyId - 공약 ID
 * @param {Array} defaultReviews - policies.js의 기본 리뷰
 * @returns {Promise<Array>} 병합된 리뷰 목록
 */
export async function getReviews(policyId, defaultReviews = []) {
  const custom = await getCustomReviews(policyId);
  return [...defaultReviews, ...custom];
}

/** 특정 공약의 커스텀 리뷰 가져오기 */
async function getCustomReviews(policyId) {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('policy_id', policyId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching reviews:', error);
      alert('리뷰 불러오기 실패 (Supabase):\n' + error.message);
      return [];
    }
    return data || [];
  } catch (e) {
    console.error('Reviews fetch failed:', e);
    return [];
  }
}

/** 전체 커스텀 리뷰 가져오기 (관리자용) */
export async function getAllCustomReviews() {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return {};

    // policy_id별로 그루핑
    const grouped = {};
    data.forEach(r => {
      if (!grouped[r.policy_id]) grouped[r.policy_id] = [];
      grouped[r.policy_id].push(r);
    });
    return grouped;
  } catch (e) { return {}; }
}

/** 리뷰 추가 */
export async function addReview(policyId, review) {
  const { error } = await supabase
    .from('reviews')
    .insert({
      id: 'custom-' + Date.now(),
      policy_id: policyId,
      author: review.author,
      text: review.text,
      rating: review.rating,
      reply: review.reply || null,
      created_at: new Date()
    });
  
  if (error) console.error('Error adding review:', error);
}

/** 리뷰 삭제 (커스텀 리뷰만) */
export async function deleteReview(policyId, reviewId) {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId);
  
  if (error) console.error('Error deleting review:', error);
}

/** 리뷰에 판매자 답변 추가/수정 */
export async function setReply(policyId, reviewId, replyText) {
  const { error } = await supabase
    .from('reviews')
    .update({ reply: replyText || null })
    .eq('id', reviewId);
  
  if (error) console.error('Error setting reply:', error);
}

/** 전체 커스텀 리뷰 초기화 (주의!) */
export async function clearAllReviews() {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .neq('id', '_none_');
  
  if (error) console.error('Error clearing reviews:', error);
}

/** 전체 커스텀 리뷰 총 개수 */
export async function getTotalCustomReviewCount() {
  const { count, error } = await supabase
    .from('reviews')
    .select('*', { count: 'exact', head: true });
  
  return error ? 0 : (count || 0);
}
