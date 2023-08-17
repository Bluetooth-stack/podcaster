import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import {Outlet, Navigate} from 'react-router-dom';
import {auth} from '../../../firebase';
import Loader from '../Loading';

function PrivateRoute() {
    const [user, loading, error] = useAuthState(auth);
    return (
        loading?
        <Loader/>
        :
        (!user || error)?
        <Navigate to={'/'} replace />
        :
        <Outlet />
    )
}

export default PrivateRoute