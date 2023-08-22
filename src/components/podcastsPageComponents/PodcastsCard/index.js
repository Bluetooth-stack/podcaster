import React from 'react';
import './style.css';
import { Link } from 'react-router-dom';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';

function PodcastCard({ id, title, displayPic }) {
    return (
        <Link to={`/podcast/${id}`} className='podcastCardLink'>
            <div className='podcastCard'>
                {
                    (title && displayPic) ?
                        <>
                            <img src={displayPic} alt={title + ' - image'} />
                            <p> <span>{title}</span> <span><PlayArrowOutlinedIcon /></span> </p>
                        </>
                        :
                        <p>No Data Found!</p>
                }
            </div>
        </Link>
    )
}

export default PodcastCard