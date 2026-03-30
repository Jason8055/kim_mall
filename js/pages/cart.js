// js/pages/cart.js
/**
 * 군산 1번가 — 장바구니(지지 결제) 페이지
 * 전략 보고서의 핵심 메시지를 SNS 공유 텍스트에 반영
 */
import { getCartItems, toggleCartItem, clearCart, markAsSupported } from '../utils/cart.js';
import { getPolicies } from '../data/policies.js';

export function renderCart(container) {

  function render() {
    const cartIds = getCartItems();
    const currentPolicies = getPolicies();
    const cartPolicies = cartIds.map(id => currentPolicies.find(p => p.id === id)).filter(Boolean);
    const hasItems = cartPolicies.length > 0;

    if (!hasItems) {
      container.innerHTML = `
        <div style="padding-top:96px; display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:70vh; background:#fff; text-align:center;">
          <img src="/images/jaejuni.png" alt="재주니" style="width:120px; height:120px; object-fit:contain; filter:drop-shadow(0 4px 12px rgba(0,78,162,0.2)); animation:float 3s ease-in-out infinite;">
          <p style="font-size:15px; color:var(--color-text-gray); margin-top:16px;">장바구니에 담긴 정책이 없습니다</p>
          <p style="font-size:12px; color:var(--color-text-light); margin-top:4px;">군산의 미래를 장바구니에 담아주세요!</p>
          <button onclick="location.hash='#/'" class="btn btn-primary" style="margin-top:24px; padding:12px 32px; border-radius:100px;">
            정책 구경하기
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div style="padding-top:96px; padding-bottom:80px; background:var(--color-bg);">
        <!-- 헤더 -->
        <div style="background:#fff; padding:16px; border-bottom:1px solid var(--color-divider);">
          <h1 style="font-size:18px; font-weight:700; color:var(--color-text-black);">
            장바구니 <span style="color:var(--color-primary);">${cartPolicies.length}</span>
          </h1>
        </div>

        <!-- 전체 선택 -->
        <div style="background:#fff; padding:12px 16px; border-bottom:1px solid var(--color-divider); display:flex; align-items:center; gap:8px;">
          <span class="material-symbols-rounded" style="color:var(--color-primary); font-size:22px;">check_circle</span>
          <span style="font-size:14px; color:var(--color-text-dark);">전체 선택 (${cartPolicies.length}/${cartPolicies.length})</span>
        </div>

        <!-- 아이템 리스트 -->
        ${cartPolicies.map(p => `
          <div style="background:#fff; padding:16px; border-bottom:1px solid var(--color-divider); display:flex; gap:12px;">
            <span class="material-symbols-rounded" style="color:var(--color-primary); font-size:22px; flex-shrink:0; margin-top:2px;">check_circle</span>
            <img src="${p.image}" alt="${p.title}" style="width:80px; height:80px; border-radius:6px; object-fit:cover; flex-shrink:0; border:1px solid var(--color-border-light);">
            <div style="flex:1; min-width:0;">
              <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div style="font-size:13px; color:var(--color-text-dark); line-height:1.4; flex:1; font-weight:500;">${p.title}</div>
                <button onclick="event.stopPropagation(); window._cartRemove('${p.id}')" style="flex-shrink:0; margin-left:8px;">
                  <span class="material-symbols-rounded" style="font-size:18px; color:var(--color-text-light);">close</span>
                </button>
              </div>
              <div style="font-size:11px; color:var(--color-text-gray); margin-top:4px; line-height:1.3;">${p.buyPoint}</div>
              <div style="margin-top:6px; display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:15px; font-weight:800; color:var(--color-text-black);">지지 무료</span>
                <div class="rocket-badge">
                  <span class="material-symbols-rounded">rocket_launch</span>
                  로켓배송
                </div>
              </div>
            </div>
          </div>
        `).join('')}

        <div class="divider"></div>

        <!-- 결제 정보 -->
        <div style="background:#fff; padding:20px 16px;">
          <div style="font-size:15px; font-weight:700; color:var(--color-text-black); margin-bottom:14px;">결제 예상 금액</div>

          <div style="display:flex; justify-content:space-between; padding:8px 0; font-size:14px;">
            <span style="color:var(--color-text-gray);">총 정책 수</span>
            <span style="color:var(--color-text-dark); font-weight:600;">${cartPolicies.length}개</span>
          </div>
          <div style="display:flex; justify-content:space-between; padding:8px 0; font-size:14px;">
            <span style="color:var(--color-text-gray);">정책 가격</span>
            <span style="color:var(--color-text-dark); font-weight:600;">무료 (시민의 지지)</span>
          </div>

          <div style="border-top:1px solid var(--color-divider); margin-top:14px; padding-top:14px; display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:14px; font-weight:700;">총 결제금액</span>
            <span style="font-size:20px; font-weight:800; color:var(--color-primary);">💙 지지 확정</span>
          </div>
        </div>

        <div class="divider"></div>

        <!-- 여론조사 안내 (배송 안내 형태) -->
        <div style="background:#fff; padding:16px;">
          <div style="background:var(--color-party-blue-bg); border-radius:10px; padding:14px; display:flex; align-items:flex-start; gap:10px;">
            <span class="material-symbols-rounded" style="color:var(--color-primary); font-size:20px; margin-top:1px;">local_shipping</span>
            <div>
              <div style="font-size:13px; font-weight:700; color:var(--color-primary);">📦 배송(투표) 안내</div>
              <p style="font-size:12px; color:var(--color-text-gray); margin-top:4px; line-height:1.5;">
                여론조사 전화(02번호)가 오면 꼭 받아주세요!<br>
                김재준 후보에게 지지를 표해주시면 결제(배송)가 완료됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 고정 하단 결제 버튼 -->
      <div class="fixed-bottom-cta" style="position:fixed; bottom:0; left:0; right:0; background:#fff; border-top:1px solid var(--color-border); padding:10px 16px; z-index:90; padding-bottom:calc(10px + env(safe-area-inset-bottom));">
        <button onclick="window._checkout()" class="btn btn-red btn-block" style="height:52px; border-radius:6px; font-size:16px;">
          ${cartPolicies.length}개 정책 결제하기 (SNS 공유)
        </button>
      </div>
    `;

    window._cartRemove = (id) => {
      toggleCartItem(id);
      render();
    };

    window._checkout = () => {
      markAsSupported();
      const policyNames = cartPolicies.map(p => p.title).join("', '");
      const text = `[군산1번가] 나는 군산의 미래를 위해 '${policyNames}'을(를) 장바구니에 담았습니다!

대통령이 믿었던 보좌관, 이재명이 신뢰하는 파트너
8인 예비경선 김재준 후보를 응원합니다! 🗳️

📞 여론조사 02 전화 꼭 받아주세요!`;

      if (navigator.share) {
        navigator.share({
          title: '군산1번가 - 내가 담은 정책',
          text: text,
          url: window.location.origin
        }).then(() => {
          afterCheckout();
        }).catch(() => {
          fallbackShare(text);
        });
      } else {
        fallbackShare(text);
      }
    };

    function fallbackShare(text) {
      navigator.clipboard.writeText(text + '\n' + window.location.origin);
      alert('🎉 결제(지지) 완료!\n\n아래 내용이 클립보드에 복사되었습니다.\nSNS에 붙여넣기 하여 공유해주세요!\n\n' + text);
      afterCheckout();
    }

    function afterCheckout() {
      clearCart();
      location.hash = '#/';
    }
  }

  render();
}
