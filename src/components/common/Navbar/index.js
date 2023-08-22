import React, { useEffect, useState } from 'react';
import './style.css';
import { NavLink, useNavigate } from 'react-router-dom';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';
import NightlightIcon from '@mui/icons-material/Nightlight';
import FlareIcon from '@mui/icons-material/Flare';
import Hamburger from './drawer';
import Button from '../Button';
import { toast } from 'react-toastify';
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebase';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../../../Redux/slices/usersSlice';

function Navbar() {
    const [themeState, setThemeState] = useState(() => {
        let lastThemeSelected = localStorage.getItem('pageTheme');
        if (lastThemeSelected === 'dark') {
            return 'dark'
        }
        return 'light'
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loggedUser = useSelector((state)=>(state.user.user));

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

    function onclickSignup(){
        navigate('/signup')
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
        <section className='navbar'>
            <div className='logoContainer'>
                <h1><span>P</span><PlayCircleOutlineRoundedIcon className='logoIcon' /><span>dcasters</span></h1>
            </div>
            <div className='linkContainer'>
                {
                    themeState === 'dark' ?
                        <FlareIcon className='sun' onClick={() => { setLightTheme(); setThemeState('light') }} />
                        :
                        <NightlightIcon className='moon' onClick={() => { setDarkTheme(); setThemeState('dark') }} />
                }
                <NavLink className='link' to={'/'}>Home</NavLink>
                <NavLink className='link' to={'/podcasts'}>Podcasts</NavLink>
                <NavLink className='link' to={'/start-podcast'}>Start-podcast</NavLink>
                <NavLink className='link' to={'/profile'}>Profile</NavLink>
                {
                    loggedUser?
                    <Button text={'Signout'} onclickHandle={handleSignout} />
                    :
                    <Button text={'Signup'} onclickHandle={onclickSignup} />
                }
            </div>
            <div className='burgerMenu'>
                <Hamburger />
            </div>
        </section>
    )
}

export default Navbar