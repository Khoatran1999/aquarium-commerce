import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import uiReducer from './ui.slice';
import authReducer from './auth.slice';
import cartReducer from './cart.slice';

/* ── Persist config (cart survives refresh) ── */
const cartPersistConfig = {
  key: 'cart',
  storage,
  whitelist: ['items', 'itemCount'],
};

const rootReducer = combineReducers({
  ui: uiReducer,
  auth: authReducer,
  cart: persistReducer(cartPersistConfig, cartReducer),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
