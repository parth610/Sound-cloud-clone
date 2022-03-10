import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSong, loadSongs, editSong, removeSong } from "../../store/song";
import ReactAudioPlayer from 'react-audio-player'

function CreateSongComponent() {
    const dispatch = useDispatch()
    const [file, setFile] = useState();
    const [songTitle, setSongTitle] = useState('');
    const [updateSongTitle, setUpdateSongTitle] = useState('')
    const [updateSongId, setUpdateSongId] = useState()
    const [showEditSongForm, setShowEditSongForm] = useState(false)

    const allSongs = useSelector(state => {
        return Object.values(state.songs)
    })
    useEffect(() => {
        dispatch(loadSongs())
      }, [dispatch])

    const submitFile = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('audioFile', file);
        data.append('songTitle', songTitle);

       await dispatch(createSong(data))

       setFile();
       setSongTitle('');
    }

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


    return (
        <div className="create-song-form-container">
            <form onSubmit={submitFile}>
                <label> Title
                    <input
                        type='text'
                        value={songTitle}
                        onChange={e => setSongTitle(e.target.value)}
                    />
                </label>
                <label> Upload Song
                    <input
                        filename={file}
                        onChange={e => setFile(e.target.files[0])}
                        type='file'
                        accept="audio/*"
                    />
                </label>
                <button type="submit">Upload</button>
            </form>
            <div>
                {allSongs.map(song => (
                    <div key={song.id}>
                        {song.name}
                        <ReactAudioPlayer src={song.song_url} controls></ReactAudioPlayer>
                        <button id={song.id} onClick={clickEditSong}>Edit</button>
                        <button id={song.id} onClick={deleteSongSubmit}>Delete</button>
                    </div>
                ))}
            </div>
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
        </div>
    )
}

export default CreateSongComponent;