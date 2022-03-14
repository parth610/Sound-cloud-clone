import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSong, loadSongs} from "../../store/song";
import { loadAlbums} from "../../store/album";


function CreateSongComponent({onCloseSong}) {
    const dispatch = useDispatch()
    const sessionUser = useSelector(state => state.session.user);

    const [file, setFile] = useState();
    const [songTitle, setSongTitle] = useState('');
    const [getAlbumId, setGetAlbumId] = useState();
    const [songErrors, setSongErrors] = useState([]);

    const allAlbums = useSelector(state => {
        return Object.values(state.albums);
    })

    const allSongs = useSelector(state => {
        return Object.values(state.songs)
    })

    let userSongs = [];
    allSongs.filter(song => {
        return song.user_id === sessionUser.id
    }).forEach(song => userSongs.push(song.name))

    useEffect(() => {
        let errors = [];
        if (songTitle.length < 1) errors.push('Song title can not be empty');
        if (userSongs.includes(songTitle)) errors.push('Song title can not be repeated in same user library, choose a different name')
        if (!file) errors.push('You must select an audio file from your local drive');
        if (!getAlbumId) errors.push('Please select an Album or create new')

        setSongErrors(errors)
    }, [songTitle, file, getAlbumId])

    useEffect(() => {
        dispatch(loadSongs())
    }, [dispatch])

    useEffect(() => {
        dispatch(loadAlbums())
    }, [dispatch])

    const submitFile = async (e) => {
        e.preventDefault();
        if (!songErrors.length) {
            const data = new FormData();
            data.append('audioFile', file);
            data.append('songTitle', songTitle);
            data.append('albumId', getAlbumId)
            await dispatch(createSong(data))
            const form = document.getElementById('create-song-form');
            setSongTitle('');
            form.reset()
            onCloseSong()
        } else {
            return;
        }
    }


    return (
        <div className="create-song-form-container">
            {songErrors.length > 0 && songErrors.map(error => (
                <div key={error}>{error}</div>
            ))}
            <form id='create-song-form' onSubmit={submitFile}>
                <label className="edit-album-label"> Your Album
                    {allAlbums.length < 1 &&
                        <div>You need to create an Album in your library to add a song.</div>
                    }
                    <select disabled={allAlbums.length > 0 ? false : true}
                            onChange={(e) => setGetAlbumId(e.target.value)}
                    >
                        <option value=''>Seletct Album</option>
                        {allAlbums?.filter(album => album?.user_id === sessionUser.id)
                        .map(album => (

                            <option key={album.id} value={album.id}>{album?.name}</option>

                        ))
                        }
                    </select>
                </label>
                <label className="edit-album-label"> Title
                    <input
                        type='text'
                        value={songTitle}
                        onChange={e => setSongTitle(e.target.value)}
                    />
                </label>
                <label className="edit-album-label"> Upload Song
                    <input
                        filename={file}
                        onChange={e => setFile(e.target.files[0])}
                        type='file'
                        accept="audio/*"
                    />
                </label>
                <button type="submit">Upload</button>
            </form>
        </div>
    )
}

export default CreateSongComponent;
