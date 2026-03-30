// js/utils/cart.js

const CART_KEY = 'gunsan1st_cart';
const SUPPORTED_KEY = 'gunsan1st_supported';

export function getCartItems() {
  const json = localStorage.getItem(CART_KEY);
  if (!json) return [];
  try {
    return JSON.parse(json);
  } catch (e) {
    return [];
  }
}

export function getCartCount() {
  return getCartItems().length;
}

export function isInCart(policyId) {
  return getCartItems().includes(policyId);
}

export function toggleCartItem(policyId) {
  let items = getCartItems();
  const index = items.indexOf(policyId);
  
  if (index > -1) {
    items.splice(index, 1);
  } else {
    items.push(policyId);
  }
  
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  
  // Custom event trigger
  window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { count: items.length } }));
  
  return index === -1; // true if added, false if removed
}

export function clearCart() {
  localStorage.setItem(CART_KEY, JSON.stringify([]));
  window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { count: 0 } }));
}

export function markAsSupported() {
  localStorage.setItem(SUPPORTED_KEY, 'true');
}

export function isSupported() {
  return localStorage.getItem(SUPPORTED_KEY) === 'true';
}
