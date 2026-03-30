// js/components/header.js
// 더불어민주당 블루 헤더 + 검색바
import { getCartCount } from '../utils/cart.js';

export function renderHeader(container) {
  const count = getCartCount();
  const badgeDisplay = count > 0 ? 'flex' : 'none';

  container.innerHTML = `
    <header class="app-header">
      <!-- 1단: 민주당 블루 배경 로고 + 아이콘 -->
      <div class="header-top">
        <a href="#/" class="header-logo">
          <img src="/images/jaejuni.png" alt="재주니" style="width:32px; height:32px; object-fit:contain;">
          군산<em>1번가</em>
        </a>
        <div class="header-icons">
          <a href="#/" class="header-icon-btn">
            <span class="material-symbols-rounded">notifications</span>
          </a>
          <a href="#/cart" class="header-icon-btn">
            <span class="material-symbols-rounded">shopping_cart</span>
            <span class="cart-count-badge" style="display:${badgeDisplay}">${count}</span>
          </a>
        </div>
      </div>

      <!-- 2단: 흰색 둥근 검색바 -->
      <div class="header-search">
        <div class="search-input-wrap">
          <span class="material-symbols-rounded">search</span>
          <input type="text" placeholder="군산의 미래를 검색하세요" readonly />
        </div>
      </div>
    </header>
  `;
}
