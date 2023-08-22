import { configureStore } from '@reduxjs/toolkit';
import usersSlice from './slices/usersSlice';
import podcastsSlice from './slices/podcastsSlice';

export default configureStore({
    reducer:{
        user: usersSlice,
        podcasts: podcastsSlice,
    }
})