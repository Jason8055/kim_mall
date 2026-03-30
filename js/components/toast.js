// js/components/toast.js
// 쿠팡 "방금 OO님이 구매했습니다!" 스타일 구매 알림
import { neighborhoods, policies } from '../data/policies.js';

let toastTimer = null;

export function initToastSystem(container) {
  // 첫 번째 토스트는 5초 후
  toastTimer = setTimeout(() => showRandomToast(container), 5000);
}

function showRandomToast(container) {
  // 랜덤 동네 + 상품(정책) 선택
  const dong = neighborhoods[Math.floor(Math.random() * neighborhoods.length)];
  const policy = policies[Math.floor(Math.random() * policies.length)];

  const toast = document.createElement('div');
  toast.className = 'toast toast-anim';
  toast.innerHTML = `
    <div class="toast-icon">
      <span class="material-symbols-rounded">shopping_bag</span>
    </div>
    <div class="toast-body">
      <div class="toast-title">${dong} 시민님이 방금 구매!</div>
      <div class="toast-desc">'${policy.title}' 정책을 장바구니에 담았습니다</div>
    </div>
  `;

  container.appendChild(toast);

  // 4초 후 제거 (애니메이션 4s와 맞춤)
  setTimeout(() => {
    if (toast.parentNode) toast.parentNode.removeChild(toast);
  }, 4200);

  // 다음 토스트: 12~25초 후
  const nextDelay = 12000 + Math.floor(Math.random() * 13000);
  toastTimer = setTimeout(() => showRandomToast(container), nextDelay);
}
