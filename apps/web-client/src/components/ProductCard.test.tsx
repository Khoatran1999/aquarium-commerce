import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ProductCard from './ProductCard';
import cartReducer from '../store/cart.slice';
import uiReducer from '../store/ui.slice';
import authReducer from '../store/auth.slice';
import wishlistReducer from '../store/wishlist.slice';
import type { Product } from '@repo/types';

const mockProduct: Product = {
  id: 'test-id-1',
  speciesId: 'species-1',
  name: 'Oscar Lemon',
  slug: 'oscar-lemon',
  description: 'Beautiful lemon oscar fish',
  price: 25.99,
  comparePrice: 35.99,
  size: 'M',
  age: '3-4 months',
  gender: 'Unknown',
  isActive: true,
  available: 10,
  reserved: 0,
  sold: 5,
  avgRating: 4.5,
  reviewCount: 12,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-15'),
  species: {
    id: 'species-1',
    name: 'Oscar',
    scientificName: 'Astronotus ocellatus',
    careLevel: 'MODERATE',
    waterType: 'FRESHWATER',
    temperament: 'SEMI_AGGRESSIVE',
  },
  images: [
    {
      id: 'img-1',
      url: 'https://example.com/oscar.jpg',
      alt: 'Oscar Lemon',
      isPrimary: true,
      sortOrder: 0,
    },
  ],
};

describe('ProductCard', () => {
  const renderProductCard = (product: Product, showAddToCart = false) => {
    const store = configureStore({
      reducer: {
        cart: cartReducer,
        ui: uiReducer,
        auth: authReducer,
        wishlist: wishlistReducer,
      },
    });

    return render(
      <Provider store={store}>
        <BrowserRouter>
          <ProductCard product={product} showAddToCart={showAddToCart} />
        </BrowserRouter>
      </Provider>,
    );
  };

  it('renders product name and price', () => {
    renderProductCard(mockProduct);

    expect(screen.getByText('Oscar Lemon')).toBeInTheDocument();
    expect(screen.getByText('$25.99')).toBeInTheDocument();
  });

  it('displays compare price when available', () => {
    renderProductCard(mockProduct);

    expect(screen.getByText('$35.99')).toBeInTheDocument();
  });

  it('shows rating and review count', () => {
    renderProductCard(mockProduct);

    expect(screen.getByText(/4\.5 \(12\)/)).toBeInTheDocument();
  });

  it('displays primary image', () => {
    renderProductCard(mockProduct);

    const img = screen.getByRole('img', { name: 'Oscar Lemon' });
    expect(img).toHaveAttribute('src', 'https://example.com/oscar.jpg');
  });

  it('links to product detail page', () => {
    renderProductCard(mockProduct);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/products/oscar-lemon');
  });

  it('shows out of stock badge when not available', () => {
    const outOfStockProduct = { ...mockProduct, available: 0 };
    renderProductCard(outOfStockProduct, true);

    expect(screen.getByText('Out of stock')).toBeInTheDocument();
  });

  it('displays species name', () => {
    renderProductCard(mockProduct);

    expect(screen.getByText('Oscar')).toBeInTheDocument();
  });

  it('renders without compare price', () => {
    const productWithoutCompare = { ...mockProduct, comparePrice: undefined };
    renderProductCard(productWithoutCompare);

    expect(screen.queryByText('$35.99')).not.toBeInTheDocument();
    expect(screen.getByText('$25.99')).toBeInTheDocument();
  });
});
