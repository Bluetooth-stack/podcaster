import React, { useEffect, useRef, useState } from 'react'
import './style.css';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import Forward5Icon from '@mui/icons-material/Forward5';
import Replay5Icon from '@mui/icons-material/Replay5';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

function AudioPlayerComponent({ audioFile, picture, playingTitle }) {
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0)
    const [volume, setVolume] = useState(0.5);
    const [mute, setMute] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const player = useRef();

    useEffect(() => {
        if (isPlaying) {
            player.current.play();
        }
        else {
            player.current.pause();
        }
    }, [isPlaying])

    useEffect(() => {
        if (mute) {
            player.current.volume = 0;
            setVolume(0)
        }
        else {
            player.current.volume = 0.5;
            setVolume(0.5)
        }
    }, [mute])

    useEffect(() => {
        const audioPlaying = player.current;
        audioPlaying.addEventListener('timeupdate', handeTimeUpdate);
        audioPlaying.addEventListener('ended', handleEnded);
        audioPlaying.addEventListener('loadedmetadata', handleLoadedMetaData);

        return () => {
            audioPlaying.removeEventListener('timeupdate', handeTimeUpdate);
            audioPlaying.removeEventListener('ended', handleEnded);
            audioPlaying.removeEventListener('loadedmetadata', handleLoadedMetaData);
        }
    }, [])

    function handeTimeUpdate() {
        setCurrentTime(player.current.currentTime);
    }

    function handleLoadedMetaData() {
        setDuration(player.current.duration);
    }

    function handleEnded() {
        setCurrentTime(0);
        setIsPlaying(false);
    }

    function handleDuration(e) {
        setCurrentTime(e.target.value);
        player.current.currentTime = e.target.value;
    }

    function togglePlay() {
        setIsPlaying(!isPlaying);
    }

    function toggleVolume() {
        setMute(!mute);
    }

    function handleVolume(e) {
        setVolume(e.target.value);
        player.current.volume = e.target.value
    }

    function timeFormatter(time) {
        const minutes = Math.floor(time / 60);
        const sec = Math.floor(time % 60);
        return `${minutes} : ${sec < 10 ? '0' : ''}${sec}`
    }

    function handleBackward() {
        player.current.currentTime -= 5;
    }

    function handleForward() {
        player.current.currentTime += 5;
    }

    return (
        <div className='audioPlayerContainer'>
            <div className='nameContainer'>
                <img src={picture} alt='podcastPlaying' />
                <p>{playingTitle}</p>
            </div>

            <audio ref={player} src={audioFile} />


            <div className='durationContainer'>
                <p style={{ width: '2.6rem' }} >-{timeFormatter(duration - currentTime)}</p>

                <span style={{ cursor: 'pointer' }} onClick={handleBackward}>
                    <Replay5Icon />
                </span>
                
                <span onClick={togglePlay} style={{ cursor: 'pointer' }}>
                    {
                        isPlaying ?
                            <PauseIcon />
                            :
                            <PlayArrowIcon />
                    }
                </span>

                <span style={{ cursor: 'pointer' }} onClick={handleForward} >
                    <Forward5Icon />
                </span>
            </div>



            <input type='range' className='durationRange' onChange={handleDuration} max={duration} value={currentTime} step={0.01} />

            <span onClick={toggleVolume} style={{ cursor: 'pointer' }} className='volIcon'>
                {
                    mute ?
                        <VolumeOffIcon />
                        :
                        <VolumeUpIcon />
                }
            </span>
            <input type='range' className='volumeRange' onChange={handleVolume} value={volume} min={0} max={1} step={0.01} />

        </div>
    )
}

export default AudioPlayerComponent