import React from 'react';
import './style.css';

function EpisodeDetails({ image, title, desc, audioFile, onClickHandle }) {
    return (
        <div className='episodeDetailsContainer'  onClick={()=>{onClickHandle(audioFile, title)}}>
            <img src={image} alt='episodeImage' />
            <div className='epTitleWrapper'>
                <h2>{title}</h2>
                <p>{desc}</p>
            </div>
        </div>
    )
}

export default EpisodeDetails