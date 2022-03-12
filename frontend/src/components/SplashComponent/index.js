import React, {useState, useEffect} from "react";
import { SignupModal } from "../../context/Modal";
import SignupForm from "../SignupFormModal/SignupForm";
import './SplashComponent.css'
import splashImage1 from '../../images/AdobeStock_254937916.jpeg'
import musicPoster from '../../images/music-poster.jpg'
import {useDispatch, useSelector} from 'react-redux'
import { loadSongs } from "../../store/song";
import { loadAlbums } from "../../store/album";
import ReactAudioPlayer from 'react-audio-player';


function HomeComponent() {
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);
    const allSongs = useSelector(state => {
        return Object.values(state.songs)
    })

    const allAlbums = useSelector(state => {
        return Object.values(state.albums);
    })

    const [showSignupModal, setShowSignupModal] = useState(false);
    const [audioPlayerSrc, setAudioPlayerSrc] = useState('');

    useEffect(() => {
        dispatch(loadAlbums())
    }, [dispatch])

    useEffect(() => {
        dispatch(loadSongs())
      }, [dispatch])

    const findAlbumPoster = (albumId) => {
        const selectedAlbum = allAlbums.find(album => (
            albumId === album.id
        ))
        if (selectedAlbum.image_url === 'no-image' || selectedAlbum.image_url === 'empty') {
            return musicPoster;
        } else {
            return selectedAlbum.image_url
        }
    }

    return (
        <div className="home-page">
            <div className={sessionUser ? "images-container-login" : "images-container"}>
                <img className="splash-img-1" src={splashImage1}></img>
                <div className="splash-text"><div>FREE MUSIC</div>Listen your favorite music from our amazing library</div>
                {sessionUser ?
                <div className="splash-welcome-user">
                    <p>Welcome!</p>
                    <span>{sessionUser.username}</span>
                </div>
                    :
                <div className="splash-button-startup">
                    <p>Are you an Artist?</p>
                    <button onClick={e => setShowSignupModal(true)} className="get-started-button"><span className="started-button-text">Upload your own music</span></button>
                </div>
                    }
            </div>
            <div className="all-songs-home">
                {allSongs.map(song => (
                    <div onClick={e => setAudioPlayerSrc(song.song_url)} className="song-card" key={song.id}>
                        <div></div>
                        <img src={findAlbumPoster(song.album_id)}/>
                        <div>{song.name}</div>
                    </div>
                ))}
            </div>
            <div className="audio-payer-container">
                    <ReactAudioPlayer id='audio-player' src={audioPlayerSrc} autoPlay controls></ReactAudioPlayer>
            </div>
            {showSignupModal && (
                <SignupModal onCloseSignup={() => setShowSignupModal(false)}>
                  <SignupForm />
                </SignupModal>
            )}
        </div>
    )
}

export default HomeComponent
