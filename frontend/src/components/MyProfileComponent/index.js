import React, {useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import userWallpaper from '../../images/AdobeStock_184684415.jpeg'
import { loadSongs, editSong, removeSong } from "../../store/song";
import { loadAlbums, removeAlbum, editAlbum } from "../../store/album";
import CreateSongFormModal from "../SongComponent";
import CreateAlbumFormModal from '../AlbumComponent'
import musicPoster from '../../images/music-poster.jpg'
import albumdefaultimg from '../../images/folder-icon.jpg'
import ReactAudioPlayer from 'react-audio-player'
import './MyProfile.css'

function MyProfileComponent() {
    const dispatch = useDispatch();
    const history = useHistory();
    const sessionUser = useSelector(state => state.session.user);
    if(!sessionUser) history.push('/')

    const [audioPlayerSrc, setAudioPlayerSrc] = useState('');
    const [showAllMySongs, setShowAllMySongs] = useState(true);
    const [showAllMyAlbums, setShowAllMyAlbums] = useState(false);
    const [selectedAlbumSongs, setSelectedAlbumSongs] = useState();
    const [showSelectedAlbumSongs, setShowSelectedAlbumSongs] = useState(false)

    const [updateSongTitle, setUpdateSongTitle] = useState('')
    const [updateSongId, setUpdateSongId] = useState()
    const [showEditSongForm, setShowEditSongForm] = useState(false)

    const [editAlbumTitle, setEditAlbumTitle] = useState('');
    const [editAlbumFile, setEditAlbumFile] = useState();
    const [editAlbumId, setEditAlbumId] = useState()
    const [showEditAlbumForm, setShowEditAlbumForm] = useState(false)

    const allSongs = useSelector(state => {
                return Object.values(state.songs)
            })

    const allAlbums = useSelector(state => {
            return Object.values(state.albums);
    })

    useEffect(() => {
         dispatch(loadSongs())
       }, [dispatch])

    useEffect(() => {
        dispatch(loadAlbums())
    }, [dispatch])

    const showAlbums = (e) => {
        e.preventDefault();
        setShowAllMyAlbums(true);
        setShowAllMySongs(false);
    }

    const showSongs = (e) => {
        e.preventDefault()
        setShowAllMySongs(true);
        setShowAllMyAlbums(false);
    }

    const findAlbumPoster = (albumId) => {
        const selectedAlbum = allAlbums.find(album => (
            albumId === album.id
        ))
        if (selectedAlbum?.image_url === 'no-image' || selectedAlbum?.image_url === 'empty') {
            return musicPoster;
        } else {
            return selectedAlbum?.image_url
        }
    }

    const selectedAlbum = (e) => {
        e.preventDefault();

        const onlyAlbum = allAlbums.find(album => (
            +e.currentTarget.id === album.id
        ))
        setSelectedAlbumSongs(onlyAlbum.id);
        setShowSelectedAlbumSongs(true);
    }

    //song edit and delete functions
    const clickEditSong = (e) => {
                e.preventDefault();
                const songId = e.target.id;
                const songtobeEdited = allSongs.find(song => (
                    song.id === +songId
                ));
                setUpdateSongTitle(songtobeEdited.name);
                setUpdateSongId(songId)
                setShowEditSongForm(true);
            }

            const editSongSubmit = async (e) => {
                e.preventDefault();
                const data = {
                    songId: updateSongId,
                    updateTitle: updateSongTitle
                }
                dispatch(editSong(data))
                setUpdateSongTitle('');
                setUpdateSongId()
                setShowEditSongForm(false);
            }

            const deleteSongSubmit = async (e) => {
                e.preventDefault();
                const songId = e.target.id;
                dispatch(removeSong({songId}))
            }
// album edit and delete functions
const deleteAlbumHandle = async (e) => {
            e.preventDefault();
            const albumId = e.target.id;
            dispatch(removeAlbum({albumId}))
        }

        const submitEditAlbumForm = async (e) => {
            e.preventDefault();
            const data = new FormData();
            data.append('albumTitleNew', editAlbumTitle);
            data.append('albumId', editAlbumId)
            if (editAlbumFile) {
                data.append('albumPosterNew', editAlbumFile);
            }
            await dispatch(editAlbum(data))
        }

        const clickonEdit = (e) => {
            e.preventDefault();
            setEditAlbumId(e.target.id);
            const selectedAlbum = allAlbums.find(album => (
                album.id === +e.target.id
            ));
            setEditAlbumTitle(selectedAlbum.name)
            setShowEditAlbumForm(true)
        }

    return (
        <div className="user-profile-page">
            <div className="image-container-user-profile">
                <img className="user-wall-image" src={userWallpaper}/>
                <div className="user-profile-wall-text">Welcome to your own Studio!<span>{sessionUser.username}</span></div>
                <div className="create-buttons-container">
                    <CreateSongFormModal />
                    <CreateAlbumFormModal />
                </div>
            </div>
            <div className="albums-songs-toggle-container">
                <div onClick={showAlbums}>My Albums</div>
                <div onClick={showSongs}>My Songs</div>
            </div>
            {
                showAllMySongs &&
            <div className="all-user-songs-upload">
            {allSongs.filter(song => (
                song.user_id === sessionUser.id
            ))
            .map(song => (
                <div key={song.id}>
                <div onClick={e => setAudioPlayerSrc(song.song_url)} className="song-card" >
                    <div></div>
                    <img src={findAlbumPoster(song.album_id)}/>
                    <div>{song.name}</div>
                    </div>
                    <button id={song.id} onClick={clickEditSong}>Edit</button>
                    <button id={song.id} onClick={deleteSongSubmit}>Delete</button>
            </div>
                ))}
            </div>
            }
            {
                showAllMyAlbums &&
                <>
            <div className="all-user-albums">
                {allAlbums.filter(album => (
                    album.user_id === sessionUser.id
                ))
                .map(album => (
                    <div key={album.id}>
                    <div className="song-card" id={album.id} onClick={selectedAlbum}>
                        <img src={album.image_url === 'no-image' || album.image_url === 'empty' ? `${albumdefaultimg}` : album.image_url}></img>
                        <div>{album.name}</div>
                    </div>
                    <button id={album.id} onClick={deleteAlbumHandle}>Delete Album</button>
                    <button id={album.id} onClick={clickonEdit}>Edit</button>
                    </div>
                ))
                }
            </div>
            <div>
                {
                    showSelectedAlbumSongs &&
                    allSongs.filter(song => song.album_id === selectedAlbumSongs).map(song => (
                        <div key={song.id}>
                            <div onClick={e => setAudioPlayerSrc(song.song_url)} className="song-card" >
                                <div></div>
                                <img src={musicPoster}/>
                                <div>{song.name}</div>
                                </div>
                                <button id={song.id} onClick={clickEditSong}>Edit</button>
                                <button id={song.id} onClick={deleteSongSubmit}>Delete</button>
                        </div>
                    ))
                }
            </div>
                </>

            }

                    <div>
                    {showEditSongForm &&
                    <div>
                        <form onSubmit={editSongSubmit}>
                        <label> Title
                        <input
                            type='text'
                            value={updateSongTitle}
                            onChange={e => setUpdateSongTitle(e.target.value)}
                        />
                        </label>
                        <button type="submit">Save Changes</button>
                        </form>
                    </div>
                    }
                    </div>

                    {showEditAlbumForm &&
                <div className="album-edit-form">
                    <form onSubmit={submitEditAlbumForm}>
                        <label>Album Title
                            <input
                                type='text'
                                value={editAlbumTitle}
                                onChange={e => setEditAlbumTitle(e.target.value)}
                            />
                        </label>
                        <label> Album Poster
                            <input
                                 filename={editAlbumFile}
                                 onChange={e => setEditAlbumFile(e.target.files[0])}
                                 type='file'
                                 accept="image/*"
                            />
                        </label>
                            <button type="submit">Save Changes</button>
                    </form>
                </div>
                    }

            <div className="footer">

            </div>

            <div className="audio-payer-container">
                    <ReactAudioPlayer id='audio-player' src={audioPlayerSrc} autoPlay controls></ReactAudioPlayer>
            </div>
        </div>
    )
}

export default MyProfileComponent;
