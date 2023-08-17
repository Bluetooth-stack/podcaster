import React from 'react';
import './style.css';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

function Button({ text, onclickHandle, outlined, stretched }) {
    return (
        <>
        {
            text==='Signout'?
            <button className='btn logout' onClick={onclickHandle}>{text}<LogoutOutlinedIcon className='logoutIcon' /></button>
            :
            <button className={`btn ${outlined ? 'outlineBtn' : stretched ? 'stretchedBtn' : ''}`} onClick={onclickHandle}>{text}</button>
        }
        </>
    )
}

export default Button