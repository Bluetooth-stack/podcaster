import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../common/Button';
import './style.css'
import TextAreaInput from '../common/Input/TextAreaInput';
import FileInput from '../common/Input/FileInput';
import LandscapeSharpIcon from '@mui/icons-material/LandscapeSharp';
import AddPhotoAlternateSharpIcon from '@mui/icons-material/AddPhotoAlternateSharp';
import { toast } from 'react-toastify';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, db, storage } from '../../firebase';
import { addDoc, collection } from 'firebase/firestore';
import Loader from '../common/Loading'


function PodcastCreator() {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [displayPic, setDisplayPic] = useState(null);
    const [bannerPic, setBannerPic] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    async function handleCreate() {
        if (title && desc && bannerPic && displayPic) {
            setIsLoading(true);
            try {
                const bannerImgRef = ref(
                    storage,
                    `podcasts/${auth.currentUser.uid}/${Date.now()}`
                );

                await uploadBytes(bannerImgRef, bannerPic);

                const bannerImgUrl = await getDownloadURL(bannerImgRef);

                const displayImgRef = ref(
                    storage,
                    `podcasts/${auth.currentUser.uid}/${Date.now()}`
                );

                await uploadBytes(displayImgRef, displayPic);

                const displayImgUrl = await getDownloadURL(displayImgRef);

                const podcastDetails = {
                    title: title,
                    description: desc,
                    bannerImage: bannerImgUrl,
                    displayImage: displayImgUrl,
                    createdBy: auth.currentUser.uid,
                }

                const docRef = await addDoc(collection(db, 'podcasts'), podcastDetails);

                navigate(`/podcast/${docRef.id}`);
                setTitle('');
                setDesc('');
                setBannerPic(null);
                setDisplayPic(null);
                setIsLoading(false);
                toast.success('Great! Podcast Created..');
            }
            catch (err) {
                setIsLoading(false);
                toast.error(err?.message.split('/')[1].split(')')[0]);
            }
        }
        else {
            setIsLoading(false);
            toast.warning('Please fill-up all the details!')
        }
    }

    function bannerHandleFunc(file) {
        setBannerPic(file)
    }

    function displaypicHanfleFun(file) {
        setDisplayPic(file)
    }

    return (
        <>
            {
                isLoading ?
                    <Loader />
                    :
                    <>
                        <div className='create-Heading'>
                            <h1>Create Your Podcast</h1>
                            <p>Broadcast your thoughts, experience & knowledge to the world!</p>
                        </div>
                        <div className='createFormHolder'>
                            <Input
                                type={'text'}
                                value={title}
                                setValue={setTitle}
                                placeholder={'Podcast Title'}
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
                                accept={'image/*'}
                                id={'banner-image'}
                                Label={LandscapeSharpIcon}
                                fileFor={'Banner image'}
                                fileHandleFunc={bannerHandleFunc}
                            />

                            <FileInput
                                accept={'image/*'}
                                id={'podcast-image'}
                                Label={AddPhotoAlternateSharpIcon}
                                fileFor={'Podcast image'}
                                fileHandleFunc={displaypicHanfleFun}
                            />

                            <Button text={'Create'} onclickHandle={handleCreate} stretched={true} />
                        </div>
                    </>
            }
        </>
    )
}

export default PodcastCreator