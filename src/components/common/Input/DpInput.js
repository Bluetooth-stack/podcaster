import React from 'react';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

function DpInput({ previewDp, handleChange }) {
    return (

        < div className='profilePicHolder' >
            <div className='image' style={{ backgroundImage: `url(${previewDp})` }} ></div>
            <label htmlFor='profilePic'><PhotoCameraIcon style={{ transform: 'scale(0.7' }} /></label>
            <input type='file' accept='image/*' id='profilePic' style={{ display: 'none' }}
                onChange={(e) => { handleChange(e.target.files[0]) }}
            />
        </div >
    )
}

export default DpInput