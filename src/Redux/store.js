import { configureStore } from '@reduxjs/toolkit';
import usersSlice from './slices/usersSlice';

export default configureStore({
    reducer:{
        user: usersSlice,
    }
})