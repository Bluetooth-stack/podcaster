import React, { useState } from 'react';
import '../../components/startPodcastComponents/style.css'
import Loader from '../../components/common/Loading';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import Input from '../../components/common/Input';
import TextAreaInput from '../../components/common/Input/TextAreaInput';
import FileInput from '../../components/common/Input/FileInput';
import Button from '../../components/common/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, db, storage } from '../../firebase';
import { addDoc, collection } from 'firebase/firestore';
import PageTransition from '../../PageTransition';

function CreateEpisodePage() {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [podcastAudio, setPodcastAudio] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const { id } = useParams();

    const navigate = useNavigate();

    async function handleCreate() {
        if (title && desc && podcastAudio && id) {
            if(desc.length>200){
                toast.warning('Please keep the Description length within 200 characters!')
                return;
            }
            setIsLoading(true);
            try {
                const audioRef = ref(storage, `pocast-episodes/${auth.currentUser.uid}/${Date.now()}`);

                await uploadBytes(audioRef, podcastAudio);

                const audioUrl = await getDownloadURL(audioRef);

                const episodeData = {
                    createdAt: Date.now(),
                    title: title,
                    description: desc,
                    audioFile: audioUrl,
                }

                await addDoc(collection(db, 'podcasts', id, 'episodes'), episodeData);

                toast.success('New episode added!');
                setIsLoading(false);
                setDesc('');
                setTitle('');
                setPodcastAudio(null);
                navigate(`/podcast/${id}`);

            } catch (err) {
                setIsLoading(false);
                toast.error(err?.message)
            }
        }
        else {
            setIsLoading(false);
            toast.warning('Please fill-up all the details!')
        }
    }


    function audioHandleFunc(file) {
        setPodcastAudio(file)
    }

    return (
        <PageTransition>
            {
                isLoading ?
                    <Loader />
                    :
                    <>
                        <div className='create-Heading'>
                            <h1>Create an Episode</h1>
                            <p>Keep it interesting, Keep it in episodes!</p>
                        </div>
                        <div className='createFormHolder'>
                            <Input
                                type={'text'}
                                value={title}
                                setValue={setTitle}
                                placeholder={'Episode Title'}
                                required={true}
                            />
                            <TextAreaInput
                                rows={4}
                                cols={10}
                                value={desc}
                                setValue={setDesc}
                                placeholder={'Description'}
                                required={true}
                            />
                            <FileInput
                                accept={'audio/*'}
                                id={'podcast-audio'}
                                Label={AudioFileIcon}
                                fileFor={'Podcast Audio'}
                                fileHandleFunc={audioHandleFunc}
                            />

                            <Button text={'Create'} onclickHandle={handleCreate} stretched={true} />
                        </div>
                    </>
            }
        </PageTransition>
    )
}

export default CreateEpisodePage