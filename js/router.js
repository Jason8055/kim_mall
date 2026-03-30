// js/router.js
// SPA 라우터 — 관리자 페이지 포함
import { renderHome } from './pages/home.js';
import { renderDetail } from './pages/detail.js';
import { renderCart } from './pages/cart.js';
import { renderAdmin } from './pages/admin.js';

export function initRouter(appElement) {
  window.addEventListener('hashchange', () => navigate(appElement));
  navigate(appElement);
}

function navigate(appElement) {
  const hash = window.location.hash || '#/';
  appElement.innerHTML = '';
  window.scrollTo(0, 0);

  // 관리자 페이지에서는 헤더/네비/토스트 숨기기
  const header = document.querySelector('.app-header');
  const nav = document.querySelector('.bottom-nav');
  const toast = document.getElementById('toastArea');
  const isAdmin = hash.startsWith('#/admin');

  if (header) header.style.display = isAdmin ? 'none' : '';
  if (nav)    nav.style.display    = isAdmin ? 'none' : '';
  if (toast)  toast.style.display  = isAdmin ? 'none' : '';

  // 라우트 분기
  if (hash === '#/' || hash === '#/home') {
    renderHome(appElement);
  } else if (hash.startsWith('#/product/')) {
    const id = hash.split('/')[2];
    renderDetail(appElement, id);
  } else if (hash === '#/cart') {
    renderCart(appElement);
  } else if (isAdmin) {
    renderAdmin(appElement);
  } else {
    renderHome(appElement);
  }
}
