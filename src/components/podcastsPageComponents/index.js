import React, { useEffect, useState } from 'react';
import './style.css';
import { useDispatch, useSelector } from 'react-redux';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../firebase';
import { setPodcasts } from '../../Redux/slices/podcastsSlice'
import PodcastCard from './PodcastsCard';
import {toast} from 'react-toastify'

function PodcastMain() {
    const [search, setSearch] = useState('');

    const dispatch = useDispatch();
    const podcasts = useSelector((state) => (state.podcasts.podcasts));

    useEffect(() => {
        const unSubscribe = onSnapshot(
            query(collection(db, 'podcasts')),
            (querySnapshot) => {
                const podcastsData = [];
                querySnapshot.forEach((doc) => {
                    podcastsData.push({ id: doc.id, ...doc.data() });
                })
                dispatch(setPodcasts(podcastsData));
            },
            (error) => {
                console.log('Error fetching podcasts', error);
                toast.error('Something went wrong!')
            }
        );

        return () => {
            unSubscribe();
        }
    }, [dispatch])


    let filteredPodcastsData = podcasts.filter((podcast)=>(
        podcast.title.trim().toLowerCase().includes(search.trim().toLowerCase())
    ));

    return (
        <>
            <div className='podcastHeading'>
                <h1>Discover</h1>
                <p>Have Curiocity! Have a Podcast.</p>
            </div>
            <div className='SearchPodcast'>
                <input type='text' value={search} onChange={(e)=>{setSearch(e.target.value)}} placeholder='Search' className='searchInput'/>
            </div>

            <>
                {
                    (filteredPodcastsData.length > 0) ?
                        <div className='allCards'>
                            {filteredPodcastsData.map((podcast, indx) => (
                                <PodcastCard key={indx} id={podcast.id} title={podcast.title} displayPic={podcast.displayImage}/>
                            ))}
                        </div>
                        :
                        <p className='notAvailable'>No Podcasts available right now!</p>
                }
            </>
        </>
    )
}

export default PodcastMain