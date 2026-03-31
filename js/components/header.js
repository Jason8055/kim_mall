// js/components/header.js
// 더불어민주당 블루 헤더 + 검색바
import { getCartCount } from '../utils/cart.js';
import { getConfig } from '../utils/config.js';
import { getMetrics } from '../utils/metrics.js';

export function renderHeader(container) {
  const count = getCartCount();
  const badgeDisplay = count > 0 ? 'flex' : 'none';

  container.innerHTML = `
    <header class="app-header">
      <!-- 0단: 실시간 접속자 통계 (신규) -->
      <div class="header-stats" id="header-stats-bar" style="display:none;">
        <div class="stat-item highlight">
           <span class="pulse-dot"></span>현재 <strong id="stat-concurrent">...</strong>명 고민중
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
           총 접속 <strong id="stat-total">...</strong>명
        </div>
      </div>

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

  // 접속자 통계 데이터 로드 및 표시
  setTimeout(async () => {
    try {
      const config = await getConfig();
      const metrics = await getMetrics();
      
      const statsBar = document.getElementById('header-stats-bar');
      if (statsBar) {
        // 실시간 접속자는 오프셋 + 10~25명 사이의 무작위 변동치 추가
        const randomConcurrent = Math.floor(Math.random() * 16) + 10;
        const concurrentVal = (config.concurrentOffset || 0) + randomConcurrent;
        // 누적 방문자는 실제 측정된 값 + 오프셋
        const totalVal = (metrics.actual_visits || 0) + (config.visitorOffset || 0);

        document.getElementById('stat-concurrent').textContent = concurrentVal.toLocaleString();
        document.getElementById('stat-total').textContent = totalVal.toLocaleString();
        statsBar.style.display = 'flex';
      }
    } catch(e) {
      console.warn('Failed to load stats for header', e);
    }
  }, 100);
}
