// js/pages/home.js
/**
 * 군산 1번가 메인 홈 페이지
 * ── 전략 보고서 핵심 내용 반영 ──
 * 1. 히어로: '할래말래' 유튜브 영상 + LIVE 뱃지
 * 2. 핵심 카피: "대통령이 믿었던 보좌관, 이재명이 신뢰하는 파트너"
 * 3. 프로모션: 02 전화 꼭 받아주세요 + 이재명 연결 마케팅
 * 4. 카테고리: 3대 킬러 공약 필터
 */
import { getPolicies, categories } from '../data/policies.js';
import { renderCountdown } from '../components/countdown.js';
import { toggleCartItem, isInCart } from '../utils/cart.js';
import { getConfig } from '../utils/config.js';

export async function renderHome(container) {
  let activeFilter = 'all';

  async function render() {
    try {
      const cfg = await getConfig();
      const currentPolicies = await getPolicies();
    const filtered = activeFilter === 'all'
      ? currentPolicies
      : currentPolicies.filter(p => p.badge === activeFilter);

    container.innerHTML = `
      <div class="pt-header">

        <!-- ================================================================ -->
        <!-- ① 히어로: '할래말래' 쇼핑 라이브 영상 (전략 ①번)                 -->
        <!-- ================================================================ -->
        <div class="hero-video-section">
          <div class="hero-live-label">
            <span class="live-dot"></span>
            LIVE 쇼핑
          </div>
          <div class="hero-video-wrap">
            <iframe
              src="https://www.youtube.com/embed/${cfg.videoUrl}?autoplay=1&mute=1&loop=1&playlist=${cfg.videoUrl}&rel=0&modestbranding=1&playsinline=1"
              title="할래말래 쇼핑 라이브 - 김재준"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
          <div class="hero-info-bar">
            <h2>${cfg.heroTitle}</h2>
            <p style="margin-bottom:2px;">${cfg.heroSubtitle}</p>
            <p style="font-size:12px; color:rgba(255,255,255,0.6);">${cfg.heroCaption}</p>
            <div class="hero-cta-row">
              <button class="hero-cta-btn yellow" onclick="document.querySelector('.product-grid').scrollIntoView({behavior:'smooth'})">
                <span class="material-symbols-rounded" style="font-size:18px;">shopping_cart</span>
                정책 담으러 가기
              </button>
              <button class="hero-cta-btn outline" onclick="window.open('https://youtu.be/${cfg.videoUrl}','_blank')">
                <span class="material-symbols-rounded" style="font-size:18px;">play_circle</span>
                전체 영상 보기
              </button>
            </div>
          </div>
        </div>

        <!-- ================================================================ -->
        <!-- D-Day 카운트다운 (전략 ③번: 경선 마감 긴장감 유지)              -->
        <!-- ================================================================ -->
        <div id="countdown-area"></div>

        <!-- ================================================================ -->
        <!-- 이재명 연결 마케팅 (전략 ②번)                                     -->
        <!-- ================================================================ -->
        <div style="background:#fff; padding:16px;">
          ${cfg.trustImage ? `
          <!-- 신뢰 배너: 이미지 모드 -->
          <div style="border-radius:12px; overflow:hidden; border:1px solid rgba(0,78,162,0.1);">
            <img src="${cfg.trustImage}" alt="캐페인 이미지" style="width:100%; height:auto; display:block; object-fit:cover;">
            <div style="background:var(--color-party-blue-bg); padding:12px 16px;">
              <div style="font-size:14px; font-weight:800; color:var(--color-primary); line-height:1.4; white-space:pre-line;">
                ${cfg.trustTitle}
              </div>
              <div style="font-size:11px; color:var(--color-text-gray); margin-top:4px;">
                ${cfg.trustSubtitle}
              </div>
            </div>
          </div>
          ` : `
          <!-- 신뢰 배너: 텍스트 모드 -->
          <div style="background:var(--color-party-blue-bg); border-radius:12px; padding:16px; display:flex; align-items:center; gap:12px; border:1px solid rgba(0,78,162,0.1);">
            <img src="/images/jaejuni.png" alt="재주니" style="width:64px; height:64px; object-fit:contain; flex-shrink:0;">
            <div>
              <div style="font-size:14px; font-weight:800; color:var(--color-primary); line-height:1.4; white-space:pre-line;">
                ${cfg.trustTitle}
              </div>
              <div style="font-size:11px; color:var(--color-text-gray); margin-top:4px;">
                ${cfg.trustSubtitle}
              </div>
            </div>
          </div>
          `}
        </div>

        <!-- ================================================================ -->
        <!-- 프로모션 띠배너: 여론조사 전화 안내 (전략 ③번)                   -->
        <!-- ================================================================ -->
        ${cfg.promoImage ? `
        <!-- 프로모션: 이미지 모드 -->
        <div style="background:#fff;">
          <img src="${cfg.promoImage}" alt="프로모션" style="width:100%; height:auto; display:block; object-fit:cover;">
        </div>
        ` : `
        <!-- 프로모션: 텍스트 모드 -->
        <div class="promo-strip">
          <span class="material-symbols-rounded">call</span>
          ${cfg.promoText}
          <span class="material-symbols-rounded">chevron_right</span>
        </div>
        `}

        <!-- ================================================================ -->
        <!-- 카테고리 아이콘 (쇼핑몰 친숙한 UX)                              -->
        <!-- ================================================================ -->
        <div class="category-grid">
          <div class="category-item ${activeFilter === 'all' ? 'active' : ''}" data-cat="all">
            <div class="category-icon" style="background:#E8F0FE; color:#004EA2;">
              <span class="material-symbols-rounded">apps</span>
            </div>
            <span>전체보기</span>
          </div>
          <div class="category-item ${activeFilter === 'best' ? 'active' : ''}" data-cat="best">
            <div class="category-icon" style="background:#FFF0ED; color:#E44D2E;">
              <span class="material-symbols-rounded">local_fire_department</span>
            </div>
            <span>특가🔥</span>
          </div>
          <div class="category-item ${activeFilter === 'md-pick' ? 'active' : ''}" data-cat="md-pick">
            <div class="category-icon" style="background:#F0EDFF; color:#7C4DFF;">
              <span class="material-symbols-rounded">workspace_premium</span>
            </div>
            <span>MD추천💎</span>
          </div>
          <div class="category-item ${activeFilter === 'urgent' ? 'active' : ''}" data-cat="urgent">
            <div class="category-icon" style="background:#FFF8E1; color:#FF6B00;">
              <span class="material-symbols-rounded">bolt</span>
            </div>
            <span>한정판⚡</span>
          </div>
        </div>

        <div class="divider"></div>

        <!-- ================================================================ -->
        <!-- 섹션 타이틀                                                      -->
        <!-- ================================================================ -->
        <div class="section-title">
          <h2>
            ${activeFilter === 'all'
              ? cfg.sectionTitle
              : categories.find(c => c.id === activeFilter)?.label || '상품'}
          </h2>
        </div>

        <!-- ================================================================ -->
        <!-- 상품(공약) 그리드                                                -->
        <!-- ================================================================ -->
        <div class="product-grid">
          ${filtered.map(p => {
            const catLabel = p.category === 'economy' ? '경제/산업'
              : p.category === 'communication' ? '소통/행정' : '청년/미래';
            return `
            <div class="product-card anim-fade" onclick="location.hash='#/product/${p.id}'">
              <div class="card-img-wrap">
                <img src="${p.image}" alt="${p.title}" loading="lazy">
                <div class="card-badge-wrap">
                  <span class="badge ${p.badge === 'best' ? 'badge-best' : p.badge === 'md-pick' ? 'badge-md' : 'badge-urgent'}">
                    ${p.badge === 'best' ? '특가' : p.badge === 'md-pick' ? 'MD추천' : '한정판'}
                  </span>
                </div>
              </div>
              <div class="card-info">
                <div class="card-title">${p.title}</div>
                <div style="font-size:11px; color:var(--color-text-gray); margin-top:2px; line-height:1.3;">${p.buyPoint}</div>
                <div class="card-price-row">
                  <span class="card-discount">100%</span>
                  <span class="card-price">지지 무료</span>
                </div>
                <div class="card-rating">
                  <span class="material-symbols-rounded star">star</span>
                  <span style="font-size:12px; font-weight:700; color:var(--color-text-dark)">${p.rating}</span>
                  <span class="count">(${p.supporters.toLocaleString()}명)</span>
                </div>
                <div class="rocket-badge">
                  <span class="material-symbols-rounded">rocket_launch</span>
                  정책로켓배송
                </div>
              </div>
            </div>
          `}).join('')}
        </div>

        <div class="divider"></div>

        <!-- ================================================================ -->
        <!-- 하단 슬로건 (결론)                                              -->
        <!-- ================================================================ -->
        ${cfg.footerImage ? `
        <!-- 하단 슬로건: 이미지 모드 -->
        <div style="position:relative; overflow:hidden;">
          <img src="${cfg.footerImage}" alt="슬로건" style="width:100%; height:auto; display:block; object-fit:cover;">
          <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(0,78,162,0.85), rgba(0,78,162,0.4)); display:flex; flex-direction:column; align-items:center; justify-content:center; padding:24px 16px; text-align:center;">
            <p style="font-size:14px; font-weight:800; color:#fff; line-height:1.6; white-space:pre-line; text-shadow:0 1px 4px rgba(0,0,0,0.3);">
              ${cfg.footerSlogan.split('\n').slice(0,-1).join('<br>')}<br>
              <span style="font-size:20px; color:var(--color-party-yellow);">${cfg.footerSlogan.split('\n').pop()}</span>
            </p>
            <button class="btn" style="margin-top:16px; padding:10px 28px; border-radius:100px; font-size:13px; background:var(--color-party-yellow); color:var(--color-primary); font-weight:800;" onclick="document.querySelector('.hero-video-wrap').scrollIntoView({behavior:'smooth'})">
              <span class="material-symbols-rounded" style="font-size:16px;">play_circle</span>
              할래말래 영상 다시 보기
            </button>
          </div>
        </div>
        ` : `
        <!-- 하단 슬로건: 텍스트 모드 -->
        <div style="background:#fff; padding:24px 16px; text-align:center;">
          <img src="/images/jaejuni.png" alt="재주니" style="width:100px; height:100px; object-fit:contain; margin-bottom:12px; filter:drop-shadow(0 4px 12px rgba(0,78,162,0.2)); animation:float 3s ease-in-out infinite;">
          <p style="font-size:14px; font-weight:800; color:var(--color-primary); line-height:1.6; white-space:pre-line;">
            ${cfg.footerSlogan.split('\n').slice(0,-1).join('<br>')}<br>
            <span style="font-size:18px; color:var(--color-red);">${cfg.footerSlogan.split('\n').pop()}</span>
          </p>
          <button class="btn btn-blue-gradient" style="margin-top:16px; padding:12px 32px; border-radius:100px; font-size:14px;" onclick="document.querySelector('.hero-video-wrap').scrollIntoView({behavior:'smooth'})">
            <span class="material-symbols-rounded" style="font-size:16px;">play_circle</span>
            할래말래 영상 다시 보기
          </button>
        </div>
        `}

        <!-- 하단 여백 -->
        <div style="height: 20px; background:var(--color-bg);"></div>
      </div>
    `;

    // D-Day 카운트다운 초기화 (3월 31일 경선 개시)
    renderCountdown('countdown-area', cfg.ddayDate, cfg.ddayEndDate);

    // 카테고리 클릭 이벤트
    container.querySelectorAll('.category-item').forEach(item => {
      item.addEventListener('click', () => {
        activeFilter = item.dataset.cat;
        render();
      });
    });
    } catch (err) {
      console.error('Home render failed:', err);
      alert('홈 화면 로딩 중 오류가 발생했습니다. (연결 확인 필요)');
    }
  }

  await render();
}
