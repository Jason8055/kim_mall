// js/pages/detail.js
/**
 * 군산 1번가 — 상품(공약) 상세 페이지
 * 전략 보고서의 '구매 포인트(기대효과)' 및 핵심 메시지 반영
 */
import { getPolicies } from '../data/policies.js';
import { isInCart, toggleCartItem } from '../utils/cart.js';
import { getReviews } from '../utils/reviews.js';
import { incrementPledgeClick } from '../utils/metrics.js';

export async function renderDetail(container, id) {
  const currentPolicies = await getPolicies();
  const policy = currentPolicies.find(p => p.id === id);
  if (!policy) { location.hash = '#/'; return; }

  // 상품 상세 진입 시 클릭수 트래킹
  incrementPledgeClick(id);

  async function render() {
    const added = isInCart(policy.id);
    const catLabel = policy.category === 'economy' ? '경제/산업'
      : policy.category === 'communication' ? '소통/행정' : '청년/미래';
    const relatedPolicies = currentPolicies.filter(p => policy.relatedIds?.includes(p.id));
    const reviews = await getReviews(policy.id, policy.reviews);

    container.innerHTML = `
      <div style="padding-bottom: 72px; background: var(--color-bg);">

        <!-- ============ 상품 이미지 ============ -->
        <div style="position:relative; background:#f4f4f4;">
          <img src="${policy.image}" alt="${policy.title}" style="width:100%; aspect-ratio:1/1; object-fit:cover;">
          <button onclick="history.back()" style="position:absolute; top:12px; left:12px; width:36px; height:36px; border-radius:50%; background:rgba(255,255,255,0.9); display:flex; align-items:center; justify-content:center; box-shadow:0 1px 4px rgba(0,0,0,0.15);">
            <span class="material-symbols-rounded" style="font-size:20px; color:#333;">arrow_back</span>
          </button>
          <!-- 뱃지 -->
          <div style="position:absolute; top:12px; right:12px;">
            <span class="badge ${policy.badge === 'best' ? 'badge-best' : policy.badge === 'md-pick' ? 'badge-md' : 'badge-urgent'}" style="font-size:12px; padding:4px 10px;">
              ${policy.badge === 'best' ? '특가' : policy.badge === 'md-pick' ? 'MD추천' : '한정판'}
            </span>
          </div>
        </div>

        <!-- ============ 상품 기본 정보 ============ -->
        <div style="background:#fff; padding:16px;">
          <div style="font-size:12px; color:var(--color-text-light); margin-bottom:6px;">${catLabel}</div>
          <h1 style="font-size:17px; font-weight:700; color:var(--color-text-black); line-height:1.4; margin-bottom:8px;">
            ${policy.title}
          </h1>
          <p style="font-size:13px; color:var(--color-text-gray); line-height:1.4; margin-bottom:12px;">
            ${policy.subtitle}
          </p>

          <!-- 가격 -->
          <div style="display:flex; align-items:baseline; gap:6px; margin-bottom:10px;">
            <span style="font-size:26px; font-weight:800; color:var(--color-red);">100%</span>
            <span style="font-size:26px; font-weight:800; color:var(--color-text-black);">지지 무료</span>
          </div>

          <!-- 로켓배송 뱃지 -->
          <div class="rocket-badge" style="margin-bottom:10px;">
            <span class="material-symbols-rounded">rocket_launch</span>
            정책로켓배송
          </div>

          <!-- 별점 -->
          <div style="display:flex; align-items:center; gap:4px;">
            <span class="material-symbols-rounded" style="font-size:16px; color:var(--color-gold);">star</span>
            <span style="font-size:14px; font-weight:700;">${policy.rating}</span>
            <span style="font-size:13px; color:var(--color-text-light);">(${policy.supporters.toLocaleString()}명 지지)</span>
          </div>
        </div>

        <div class="divider"></div>

        <!-- ============ 구매 포인트 (기대효과) — 전략 보고서 핵심 ============ -->
        <div style="background:#fff; padding:16px;">
          <div style="background:var(--color-party-blue-bg); border-radius:12px; padding:16px; border: 1px solid rgba(0,78,162,0.08);">
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
              <span class="material-symbols-rounded" style="font-size:20px; color:var(--color-primary);">thumb_up</span>
              <span style="font-size:13px; font-weight:800; color:var(--color-primary);">구매 포인트 (기대효과)</span>
            </div>
            <p style="font-size:15px; font-weight:700; color:var(--color-text-black); line-height:1.6;">
              "${policy.buyPoint}"
            </p>
          </div>
        </div>

        <div class="divider"></div>

        <!-- ============ 공약 상세 설명 ============ -->
        <div style="background:#fff; padding:20px 16px;">
          <h3 style="font-size:15px; font-weight:700; color:var(--color-text-black); margin-bottom:12px;">
            📋 상품 상세 설명
          </h3>
          <p style="font-size:14px; color:var(--color-text-dark); line-height:1.8; margin-bottom:16px;">
            ${policy.description}
          </p>

          <div style="background:var(--color-bg); border-radius:10px; padding:16px;">
            <div style="font-size:13px; font-weight:800; color:var(--color-text-black); margin-bottom:10px;">
              핵심 공약 ${policy.details.length}가지
            </div>
            ${policy.details.map((d, i) => `
              <div style="display:flex; gap:10px; align-items:flex-start; padding:8px 0; ${i > 0 ? 'border-top:1px solid var(--color-divider);' : ''}">
                <span style="background:var(--color-primary); color:#fff; font-weight:800; font-size:11px; min-width:22px; height:22px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0;">${i+1}</span>
                <span style="font-size:13px; color:var(--color-text-dark); line-height:1.5;">${d}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="divider"></div>

        <!-- ============ 시민 리뷰 (상품평) ============ -->
        <div style="background:#fff;">
          <div style="padding:20px 16px 12px; display:flex; align-items:center; justify-content:space-between;">
            <h3 style="font-size:15px; font-weight:700;">
              상품평 <span style="color:var(--color-primary);">${reviews.length}</span>
            </h3>
          </div>

          ${reviews.map(r => `
            <div class="review-card">
              <div class="review-header">
                <div class="review-avatar">${r.author.charAt(0)}</div>
                <div>
                  <div class="review-author">${r.author}</div>
                  <div class="review-stars">
                    ${[...Array(r.rating)].map(() => '<span class="material-symbols-rounded" style="font-size:14px;">star</span>').join('')}
                  </div>
                </div>
              </div>
              <p class="review-text">${r.text}</p>

              ${r.reply ? `
              <div class="seller-reply">
                <div class="seller-reply-label">판매자 답변 · 김재준 후보</div>
                <p>${r.reply}</p>
              </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
        
        <script>
          // 스크립트를 통해 초기 렌더링 후 이벤트 핸들러 등 추가 작업 가능 (필요 시)
        </script>

        ${relatedPolicies.length > 0 ? `
        <div class="divider"></div>

        <!-- ============ 함께 담으면 좋은 정책 ============ -->
        <div style="background:#fff; padding:20px 16px;">
          <h3 style="font-size:15px; font-weight:700; margin-bottom:12px;">함께 담으면 좋은 정책</h3>
          <div style="display:flex; gap:12px; overflow-x:auto;" class="hide-scrollbar">
            ${relatedPolicies.map(rp => `
              <div onclick="location.hash='#/product/${rp.id}'" style="flex-shrink:0; width:130px; cursor:pointer;">
                <img src="${rp.image}" style="width:130px; height:130px; object-fit:cover; border-radius:8px; border:1px solid var(--color-border-light);">
                <div style="font-size:12px; color:var(--color-text-dark); margin-top:6px; line-height:1.3; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${rp.title}</div>
                <div style="font-size:11px; color:var(--color-red); font-weight:700; margin-top:2px;">지지 무료</div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}
      </div>

      <!-- ============ 고정 하단 CTA 바 ============ -->
      <div class="fixed-bottom-cta" style="position:fixed; bottom:0; left:0; right:0; background:#fff; border-top:1px solid var(--color-border); padding:10px 16px; z-index:90; display:flex; gap:10px; padding-bottom: calc(10px + env(safe-area-inset-bottom));">
        <button onclick="window._sharePolicy()" style="width:48px; height:48px; border:1px solid var(--color-border); border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
          <span class="material-symbols-rounded" style="color:var(--color-text-gray);">share</span>
        </button>
        <button onclick="window._toggleDetailCart()" class="btn ${added ? 'btn-outline' : 'btn-primary'} btn-block" style="height:48px; border-radius:8px;">
          ${added ? '✓ 담기 완료 (빼기)' : '🛒 장바구니 담기'}
        </button>
      </div>
    `;

    window._toggleDetailCart = () => {
      toggleCartItem(policy.id);
      render();
    };

    window._sharePolicy = () => {
      const text = `[군산1번가] ${policy.title}\n${policy.buyPoint}\n\n대통령이 믿었던 보좌관, 이재명이 신뢰하는 파트너 — 김재준`;
      if (navigator.share) {
        navigator.share({ title: text, url: window.location.href }).catch(() => {});
      } else {
        navigator.clipboard.writeText(text + '\n' + window.location.href);
        alert('링크가 복사되었습니다! SNS에 공유해주세요 🎉');
      }
    };
  }

  await render();
}
