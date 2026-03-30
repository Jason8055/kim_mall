// js/main.js
import { initRouter } from './router.js';
import { renderHeader } from './components/header.js';
import { renderBottomNav } from './components/bottomNav.js';
import { initToastSystem } from './components/toast.js';

document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('app');
    
    // Global Components
    const headerContainer = document.createElement('div');
    const mainContent = document.createElement('main');
    const navContainer = document.createElement('div');
    const toastContainer = document.createElement('div');
    
    // Setup Toast System (Viral element)
    toastContainer.className = 'toast-container';
    toastContainer.id = 'toastArea';
    
    // Append in correct order
    appContainer.appendChild(headerContainer);
    appContainer.appendChild(mainContent);
    appContainer.appendChild(navContainer);
    appContainer.appendChild(toastContainer);
    
    // Render Static Shell
    renderHeader(headerContainer);
    renderBottomNav(navContainer);
    initToastSystem(toastContainer);
    
    // Initialize Router on the main container
    initRouter(mainContent);
    
    // Listen for cart updates
    window.addEventListener('cartUpdated', (e) => {
        const badges = document.querySelectorAll('.cart-badge');
        badges.forEach(badge => {
            badge.textContent = e.detail.count;
            badge.style.display = e.detail.count > 0 ? 'flex' : 'none';
        });
    });
});
