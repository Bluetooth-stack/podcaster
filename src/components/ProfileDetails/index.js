import React, { useEffect, useState } from 'react';
import './style.css'
import { auth, db } from '../../firebase';
import defaultDp from '../../Assets/defaultDp.jpg';
import { useNavigate } from 'react-router-dom';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import { collection, onSnapshot, query } from 'firebase/firestore';
import PodcastCard from '../podcastsPageComponents/PodcastsCard';
import EditIcon from '@mui/icons-material/Edit';
import { toast } from 'react-toastify';

function ProfileDetails({ loggedUser }) {
    const [podcasts, setPodcasts] = useState([]);
    const dp = auth.currentUser.photoURL ? auth.currentUser.photoURL : defaultDp;

    const navigate = useNavigate();
    
    useEffect(() => {
        const unSubscribe = onSnapshot(
            query(collection(db, 'podcasts')),
            (querySnapshot) => {
                const podcastsData = [];
                querySnapshot.forEach((doc) => {
                    if (doc.data().createdBy === auth.currentUser.uid) {
                        podcastsData.push({ id: doc.id, ...doc.data() });
                    }
                })
                setPodcasts(podcastsData);
            },
            (error) => {
                console.log('Error fetching podcasts', error);
                toast.error('Something went wrong!')
            }
        );

        return () => {
            unSubscribe();
        }
    }, [])

    return (
        <div className='profilePageHolder'>
            <div className='userDetailsHolder'>
                <div className='design'></div>
                < div className='view' >
                    <div className='image' style={{ backgroundImage: `url(${dp})` }} ></div>
                    <span onClick={() => { navigate(`/${auth.currentUser.uid}/editProfile`) }}><EditIcon className='editIcon' /></span>
                </div >
                <h1>{loggedUser.name}</h1>
            </div>

            <div className='userPodcasts'>
                <div className='userPodcastHeading'>
                    <h2>Podcasts</h2>
                    <span title='Create an Episode' onClick={() => { navigate(`/start-podcast`) }} >
                        <LibraryAddIcon className="addEpisodeIcon" />
                    </span>
                </div>
                {
                    (podcasts.length > 0) ?
                        <div className='allCards'>
                            {podcasts.map((podcast, indx) => (
                                <PodcastCard key={indx} id={podcast.id} title={podcast.title} displayPic={podcast.displayImage} />
                            ))}
                        </div>
                        :
                        <p className='notAvailable'>Its empty here, Create Your Podcast!</p>
                }
            </div>
        </div>
    )
}

export default ProfileDetails