import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSong, loadSongs } from "../../store/song";
import ReactAudioPlayer from 'react-audio-player'

function CreateSongComponent() {
    const dispatch = useDispatch()
    const [file, setFile] = useState();
    const [songTitle, setSongTitle] = useState('');

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
                        <ReactAudioPlayer src={song.song_url} controls>{song.name}</ReactAudioPlayer>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CreateSongComponent;
