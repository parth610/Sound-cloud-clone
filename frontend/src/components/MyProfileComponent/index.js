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
    const [updateSongId, setUpdateSongId] = useState();
    const [editSongFile, setEditSongFile] = useState()
    const [showEditSongForm, setShowEditSongForm] = useState(false)
    const [editSongErrors, setEditSongErrors] = useState([])

    const [editAlbumTitle, setEditAlbumTitle] = useState('');
    const [editAlbumFile, setEditAlbumFile] = useState();
    const [editAlbumId, setEditAlbumId] = useState()
    const [showEditAlbumForm, setShowEditAlbumForm] = useState(false)
    const [editAlbumErrors, setEditAlbumErrors] = useState([]);


    const allSongs = useSelector(state => {
                return Object.values(state.songs)
            })

    const allAlbums = useSelector(state => {
            return Object.values(state.albums);
    })

    let userSongs = [];
    allSongs.filter(song => {
        return song.user_id === sessionUser.id
    }).forEach(song => userSongs.push(song.name))

    let userAlbums = [];
    allAlbums.filter(album => {
        return album.user_id === sessionUser.id
    }).forEach(album => userAlbums.push(album.name))

    useEffect(() => {
         dispatch(loadSongs())
       }, [dispatch])

    useEffect(() => {
        dispatch(loadAlbums())
    }, [dispatch])

    useEffect(() => {
        let songerrors = [];
        if (updateSongTitle.length < 1) songerrors.push('Song title can not be empty');
        // if (userSongs.includes(songTitle)) songerrors.push('Song title can not be repeated in same user library, choose a different name')

        setEditSongErrors(songerrors)
    }, [updateSongTitle])

    useEffect(() => {
        let errors = [];
        // const oldTitle = editAlbumTitle;
        // const index = userAlbums.indexOf(oldTitle);
        // userAlbums.splice(index, 1)
        // console.log(userAlbums)
        if (!editAlbumTitle.length) errors.push('Album title can not be empty');
        // if (userAlbums.includes(editAlbumTitle)) errors.push(('Album title can not be repeated in same user library, choose a different name'))
        setEditAlbumErrors(errors);
    }, [editAlbumTitle])

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
                // const data = {
                //     songId: updateSongId,
                //     updateTitle: updateSongTitle
                // }
                if (editSongErrors.length < 1 ) {
                    const data = new FormData();
                    data.append('updateSongTitle', updateSongTitle);
                    data.append('updateSongId', updateSongId);
                    if (editSongFile) {
                        data.append('updateSongFile', editSongFile);
                    }

                    await dispatch(editSong(data))
                    setUpdateSongTitle('');
                    setUpdateSongId()
                    setShowEditSongForm(false);
                } else {
                    return;
                }
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
            const thisAlbumSongs = allSongs.filter(song => song.album_id === +albumId);
            for (let i = 0; i < thisAlbumSongs.length; i++) {
                const songId = thisAlbumSongs[i].id;
                dispatch(removeSong({songId}))
            }
            dispatch(removeAlbum({albumId}))
        }

        const submitEditAlbumForm = async (e) => {
            e.preventDefault();
            if(editAlbumErrors.length < 1) {
                const data = new FormData();
                data.append('albumTitleNew', editAlbumTitle);
                data.append('albumId', editAlbumId)
                if (editAlbumFile) {
                    data.append('albumPosterNew', editAlbumFile);
                }
                await dispatch(editAlbum(data))
                setShowEditAlbumForm(false)
            } else {
                return;
            }
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
                <img className="user-wall-image" alt='user-cover-keyboard' src={userWallpaper}/>
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
                    <img alt={`album-poster${song.album_id}`} src={findAlbumPoster(song.album_id)}/>
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
                        <img alt={`album-poster-${album.id}`} src={album.image_url === 'no-image' || album.image_url === 'empty' ? `${albumdefaultimg}` : album.image_url}></img>
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
                                <img alt={`music-default-poster`} src={musicPoster}/>
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
                    <div className="song-edit-form-container">
                        <div onClick={e => setShowEditSongForm(false)} className="song-edit-form-background"/>
                        <div className="song-edit-form">
                        <form className="edit-album-form-elements" onSubmit={editSongSubmit}>
                        <label className="edit-album-label"> Title
                        <input
                            type='text'
                            value={updateSongTitle}
                            onChange={e => setUpdateSongTitle(e.target.value)}
                        />
                        </label>
                        <label className="edit-album-label"> Update Song (optional)
                            <input
                                 filename={editSongFile}
                                 onChange={e => setEditSongFile(e.target.files[0])}
                                 type='file'
                                 accept="audio/*"
                            />
                        </label>
                        <button type="submit">Save Changes</button>
                        </form>
                        </div>
                    </div>
                    }
                    </div>

                    {showEditAlbumForm &&
                    <div className='album-edit-form-container'>
                    <div onClick={e => setShowEditAlbumForm(false)} className='album-edit-form-background'/>
                    <div className="album-edit-form">
                        {editAlbumErrors.length > 0 && editAlbumErrors.map(error => (
                            <div key={error}>{error}</div>
                        ))}
                        <form className="edit-album-form-elements" onSubmit={submitEditAlbumForm}>
                            <label className="edit-album-label">Album Title
                                <input
                                    type='text'
                                    value={editAlbumTitle}
                                    onChange={e => setEditAlbumTitle(e.target.value)}
                                />
                            </label>
                            <label className="edit-album-label"> Album Poster (optional)
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
