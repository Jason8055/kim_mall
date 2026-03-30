// js/components/countdown.js
/**
 * 경선 카운트다운 — 3단계 표시
 * 1. 경선 전: "경선 시작까지 D-X일 HH:MM:SS"
 * 2. 경선 중: "경선 마감까지 HH:MM:SS" (긴급 빨간 배경)
 * 3. 경선 후: "경선이 종료되었습니다"
 */

export function renderCountdown(containerId, startDateStr, endDateStr) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const startDate = new Date(startDateStr).getTime();
  const endDate = new Date(endDateStr).getTime();
  let interval;

  function update() {
    const now = new Date().getTime();
    const toStart = startDate - now;
    const toEnd = endDate - now;

    // ── 3단계: 경선 종료 ──
    if (toEnd < 0) {
      container.innerHTML = `
        <div class="countdown-bar" style="background:var(--color-primary);">
          <span class="material-symbols-rounded" style="color:var(--color-party-yellow);">check_circle</span>
          🎉 경선이 종료되었습니다! 감사합니다!
        </div>
      `;
      clearInterval(interval);
      return;
    }

    // ── 2단계: 경선 진행 중 (마감까지 카운트다운) ──
    if (toStart <= 0) {
      const hours = Math.floor(toEnd / (1000 * 60 * 60));
      const minutes = Math.floor((toEnd % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((toEnd % (1000 * 60)) / 1000);

      container.innerHTML = `
        <div class="countdown-bar" style="background:var(--color-red);">
          <span class="material-symbols-rounded" style="color:var(--color-party-yellow);">campaign</span>
          🗳️ 경선 마감까지
          <span class="countdown-num" style="background:#fff; color:var(--color-red);">${hours.toString().padStart(2,'0')}</span>
          <span class="blink" style="color:#fff; font-weight:800;">:</span>
          <span class="countdown-num" style="background:#fff; color:var(--color-red);">${minutes.toString().padStart(2,'0')}</span>
          <span class="blink" style="color:#fff; font-weight:800;">:</span>
          <span class="countdown-num" style="background:#fff; color:var(--color-red);">${seconds.toString().padStart(2,'0')}</span>
        </div>
        <div style="background:#fff3f3; padding:8px; text-align:center; font-size:12px; color:var(--color-red); font-weight:700;">
          📞 02 여론조사 전화 꼭 받아주세요! 김재준 1번!
        </div>
      `;
      return;
    }

    // ── 1단계: 경선 시작 전 (D-Day 카운트다운) ──
    const days = Math.floor(toStart / (1000 * 60 * 60 * 24));
    const hours = Math.floor((toStart % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((toStart % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((toStart % (1000 * 60)) / 1000);

    container.innerHTML = `
      <div class="countdown-bar">
        <span class="material-symbols-rounded">alarm</span>
        경선 시작까지
        ${days > 0 ? `<span class="countdown-num">${days}일</span>` : ''}
        <span class="countdown-num">${hours.toString().padStart(2,'0')}</span>
        <span class="blink" style="color:#fff; font-weight:800;">:</span>
        <span class="countdown-num">${minutes.toString().padStart(2,'0')}</span>
        <span class="blink" style="color:#fff; font-weight:800;">:</span>
        <span class="countdown-num">${seconds.toString().padStart(2,'0')}</span>
      </div>
    `;
  }

  update();
  interval = setInterval(update, 1000);

  // 페이지 이동 시 타이머 정리
  window.addEventListener('hashchange', () => clearInterval(interval), { once: true });
}
