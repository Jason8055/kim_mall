// js/components/bottomNav.js
// 쿠팡 스타일 하단 네비게이션: 홈, 카테고리, 검색, 내 쇼핑, 장바구니
import { getCartCount } from '../utils/cart.js';

export function renderBottomNav(container) {
  const count = getCartCount();
  const badgeDisplay = count > 0 ? 'flex' : 'none';

  container.innerHTML = `
    <nav class="bottom-nav">
      <a href="#/" class="nav-item active" data-nav="home">
        <span class="material-symbols-rounded">home</span>
        <span>홈</span>
      </a>
      <a href="#/" class="nav-item" data-nav="category">
        <span class="material-symbols-rounded">grid_view</span>
        <span>카테고리</span>
      </a>
      <a href="#/" class="nav-item" data-nav="search">
        <span class="material-symbols-rounded">search</span>
        <span>검색</span>
      </a>
      <a href="#/" class="nav-item" data-nav="mypage">
        <span class="material-symbols-rounded">person</span>
        <span>마이쇼핑</span>
      </a>
      <a href="#/cart" class="nav-item" data-nav="cart">
        <div class="icon-wrap">
          <span class="material-symbols-rounded">shopping_cart</span>
          <span class="cart-count-badge" style="display:${badgeDisplay}">${count}</span>
        </div>
        <span>장바구니</span>
      </a>
    </nav>
  `;

  // 탭 활성화 처리
  function updateActiveTab() {
    const hash = window.location.hash || '#/';
    container.querySelectorAll('.nav-item').forEach(el => {
      el.classList.remove('active');
    });
    if (hash === '#/' || hash.startsWith('#/product/')) {
      container.querySelector('[data-nav="home"]')?.classList.add('active');
    } else if (hash === '#/cart') {
      container.querySelector('[data-nav="cart"]')?.classList.add('active');
    }
  }

  window.addEventListener('hashchange', updateActiveTab);
  updateActiveTab();
}
