import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import uiReducer from './ui.slice';
import authReducer from './auth.slice';
const rootReducer = combineReducers({
    ui: uiReducer,
    auth: authReducer,
});
export const store = configureStore({
    reducer: rootReducer,
});
export const useAppDispatch = useDispatch;
export const useAppSelector = useSelector;
