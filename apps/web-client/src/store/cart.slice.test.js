import { describe, it, expect } from 'vitest';
import cartReducer, { clearCart, setCartItems } from './cart.slice';
const mockItems = [
    {
        id: '1',
        productId: 'p1',
        quantity: 2,
        product: {
            id: 'p1',
            name: 'Betta Fish',
            slug: 'betta-fish',
            price: 9.99,
            images: [],
            available: 10,
        },
    },
    {
        id: '2',
        productId: 'p2',
        quantity: 3,
        product: {
            id: 'p2',
            name: 'Neon Tetra',
            slug: 'neon-tetra',
            price: 2.99,
            images: [],
            available: 50,
        },
    },
];
describe('cart slice', () => {
    const initialState = { items: [], itemCount: 0, loading: false };
    describe('reducers', () => {
        it('has correct initial state', () => {
            const state = cartReducer(undefined, { type: 'unknown' });
            expect(state).toEqual(initialState);
        });
        it('clearCart resets items and count', () => {
            const populated = { items: mockItems, itemCount: 5, loading: false };
            const state = cartReducer(populated, clearCart());
            expect(state.items).toEqual([]);
            expect(state.itemCount).toBe(0);
        });
        it('setCartItems sets items and recalculates count', () => {
            const state = cartReducer(initialState, setCartItems(mockItems));
            expect(state.items).toEqual(mockItems);
            expect(state.itemCount).toBe(5); // 2 + 3
        });
        it('setCartItems with empty array sets count to 0', () => {
            const populated = { items: mockItems, itemCount: 5, loading: false };
            const state = cartReducer(populated, setCartItems([]));
            expect(state.items).toEqual([]);
            expect(state.itemCount).toBe(0);
        });
    });
    describe('async thunk states', () => {
        it('sets loading=true on fetchCart.pending', () => {
            const state = cartReducer(initialState, { type: 'cart/fetch/pending' });
            expect(state.loading).toBe(true);
        });
        it('sets loading=false on fetchCart.rejected', () => {
            const loadingState = { ...initialState, loading: true };
            const state = cartReducer(loadingState, { type: 'cart/fetch/rejected' });
            expect(state.loading).toBe(false);
        });
        it('sets loading=true on cart/addItem.pending', () => {
            const state = cartReducer(initialState, { type: 'cart/addItem/pending' });
            expect(state.loading).toBe(true);
        });
        it('sets loading=true on cart/updateItem.pending', () => {
            const state = cartReducer(initialState, { type: 'cart/updateItem/pending' });
            expect(state.loading).toBe(true);
        });
        it('sets loading=true on cart/removeItem.pending', () => {
            const state = cartReducer(initialState, { type: 'cart/removeItem/pending' });
            expect(state.loading).toBe(true);
        });
    });
});
