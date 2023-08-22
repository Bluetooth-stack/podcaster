import { collection, doc, getDoc, onSnapshot, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { auth, db } from '../../firebase';
import { toast } from 'react-toastify';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import EpisodeDetails from '../../components/EpisodeComponent';
import AudioPlayer from '../../components/AudioPlayer';

function PodcastDetailsPage() {
    const [podcastDetails, setPodcastDetails] = useState(null);
    const [createdBy, setCreatedBy] = useState('');
    const [episodes, setEpisodes] = useState([]);
    const [file, setFile] = useState('');
    const [playingEpTitle, setPlayingEpTitle] = useState('');
    const { id } = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            getPodcastData()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    useEffect(() => {
        const unSubscribe = onSnapshot(
            query(collection(db, 'podcasts', id, 'episodes')),
            (querySnapshot) => {
                const episodesData = [];
                querySnapshot.forEach((doc) => {
                    episodesData.push({ id: doc.id, ...doc.data() })
                })
                setEpisodes(episodesData);
            },
            (err) => {
                console.error('Error fetching episodes data', err);
            }
        );

        return () => {
            unSubscribe();
        }
    }, [id])

    async function getPodcastData() {
        try {
            const docRef = doc(db, 'podcasts', id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setPodcastDetails({ id: id, ...docSnap.data() })
                // toast.success('Enjoy the Podcast...')
                const uID = docSnap.data().createdBy;

                const userDocRef = doc(db, 'users', uID);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    setCreatedBy(userDocSnap.data().name);
                }
                else {
                    setCreatedBy('--NA--')
                }
            }
            else {
                toast.error('No Podcast Found!');
                navigate('/podcasts')
            }
        }
        catch (err) {
            toast.error(err?.message)
        }
    }

    return (
        <div className='podcastDetailsContainer'>
            {
                podcastDetails &&
                <>
                    <div className='detailsContainer' >
                        <div className='thumbnail'
                            style={{ backgroundImage: `url(${podcastDetails.bannerImage})` }}>
                        </div>

                        <img src={podcastDetails.displayImage} alt='DisplayImage' />

                        <div className='descWrapper'>
                            <h1 className='podcastDetailsTitle'>{podcastDetails.title}</h1>
                            <p style={{ fontFamily: 'Roboto Slab', fontSize: '1rem', letterSpacing: '0.12rem', opacity: '0.8', fontWeight: '400', margin: '0.2rem 0 0.5rem 0' }}>
                                By - {createdBy}</p>
                            <p className='detailsDescription'>{podcastDetails.description}</p>
                        </div>
                    </div>

                    <div className='episodeHeadingContainer'>
                        <h1>Episodes</h1>
                        {
                            (podcastDetails.createdBy === auth.currentUser.uid)
                            &&
                            <span title='Create an Episode' onClick={() => { navigate(`/podcast/${id}/create-episode`) }} >
                                <LibraryAddIcon className="addEpisodeIcon" />
                            </span>
                        }
                    </div>

                    {episodes.length ?
                        <div className='allEpisodes'>
                            {episodes.map((episode, indx) => (
                                <EpisodeDetails
                                    key={indx}
                                    image={podcastDetails.displayImage} title={episode.title}
                                    desc={episode.description} audioFile={episode.audioFile}
                                    onClickHandle={(file, title) => { setFile(file); setPlayingEpTitle(title) }}
                                />
                            ))}
                        </div>
                        :
                        <p style={{ fontFamily: 'Roboto Slab', alignSelf: 'center' }}>No Episodes Available!</p>}
                </>
            }
            {
                file &&
                <AudioPlayer audioFile={file} picture={podcastDetails?.displayImage} playingTitle={playingEpTitle} />
            }
        </div>
    )
}

export default PodcastDetailsPage