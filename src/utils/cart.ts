export interface CartItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  material: string;
  shopName: string;
  shopCity: string;
  quantity: number;
  stock: number;
}

const CART_STORAGE_KEY = "limbara_cart_items";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("cart_updated"));
  } catch {
    // localStorage full or restricted
  }
}

export function addToCart(newItem: CartItem): void {
  const current = getCart();
  const existingIndex = current.findIndex((item) => item.id === newItem.id);

  if (existingIndex > -1) {
    const existing = current[existingIndex];
    const updatedQty = Math.min(existing.stock, existing.quantity + newItem.quantity);
    current[existingIndex] = { ...existing, quantity: updatedQty };
  } else {
    current.push(newItem);
  }

  saveCart(current);
}

export function updateQuantity(id: string, quantity: number): void {
  const current = getCart();
  const index = current.findIndex((item) => item.id === id);
  if (index > -1) {
    if (quantity <= 0) {
      current.splice(index, 1);
    } else {
      current[index].quantity = Math.min(current[index].stock, quantity);
    }
    saveCart(current);
  }
}

export function removeFromCart(id: string): void {
  const current = getCart().filter((item) => item.id !== id);
  saveCart(current);
}

export function clearCart(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_STORAGE_KEY);
  window.dispatchEvent(new Event("cart_updated"));
}

export function getCartTotal(): { totalItems: number; subtotal: number } {
  const items = getCart();
  const totalItems = items.reduce((sum, it) => sum + it.quantity, 0);
  const subtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
  return { totalItems, subtotal };
}
