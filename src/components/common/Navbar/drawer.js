import React, { useEffect, useState } from 'react'
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import { NavLink, useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import NightlightIcon from '@mui/icons-material/Nightlight';
import FlareIcon from '@mui/icons-material/Flare';
import SignButton from '../Button';
import { toast } from 'react-toastify';
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebase';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../../../Redux/slices/usersSlice';

export default function Hamburger() {
    const [state, setState] = useState(false);
    const [themeState, setThemeState] = useState(() => {
        let lastThemeSelected = localStorage.getItem('pageTheme');
        if (lastThemeSelected === 'dark') {
            return 'dark'
        }
        return 'light'
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loggedUser = useSelector((state) => (state.user.user));
    const lastThemeSelected = localStorage.getItem('pageTheme');

    useEffect(() => {

        if (lastThemeSelected === 'dark') {
            setDarkTheme();
        }
        else {
            setLightTheme();
        }
    }, [lastThemeSelected])

    function setDarkTheme() {
        document.querySelector('body').setAttribute('data-theme', 'dark');
        localStorage.setItem('pageTheme', 'dark');
    }
    function setLightTheme() {
        document.querySelector('body').setAttribute('data-theme', 'light');
        localStorage.setItem('pageTheme', 'light');
    }

    function onclickSignup() {
        navigate('/signup')
    }

    function onclickSignin() {
        navigate('/signin')
    }

    async function handleSignout() {
        try {
            await signOut(auth);
            dispatch(clearUser());
            toast.success('Signed-out!')
            navigate('/')
        }
        catch (err) {
            toast.error('Something Went Wrong!')
            console.log(err);
        }
    }


    return (
        <div className='burgerSlideList'>

            <Button size='small' onClick={() => { setState(true) }}> <MenuIcon className='menuIcon' /> </Button>
            <Drawer className='menuContainer' anchor={"right"} open={state}
                onClose={() => { setState(false) }}>

                <CloseIcon className='closeMenu' onClick={() => { setState(false) }} />
                <div className='menuList'>
                    <div className='themeSwitch'>
                        {
                            themeState === 'dark' ?
                                <FlareIcon className='sun' onClick={() => { setLightTheme(); setThemeState('light') }} />
                                :
                                <NightlightIcon className='moon' onClick={() => { setDarkTheme(); setThemeState('dark') }} />
                        }
                    </div>
                    <NavLink className='drawerlink' to={'/'}>Home</NavLink>
                    <NavLink className='drawerlink' to={'/podcasts'}>Podcasts</NavLink>
                    <NavLink className='drawerlink' to={'/start-podcast'}>Start-podcast</NavLink>
                    <NavLink className='drawerlink' to={'/profile'}>Profile</NavLink>
                    {
                        loggedUser ?
                            <SignButton text={'Signout'} onclickHandle={handleSignout} />
                            :
                            <>
                                <SignButton text={'Signup'} onclickHandle={onclickSignup} />
                                <SignButton text={'Signin'} outlined={true} onclickHandle={onclickSignin} />
                            </>
                    }
                </div>

            </Drawer>
        </div>
    );
}
