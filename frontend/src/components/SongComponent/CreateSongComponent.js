import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createSong} from "../../store/song";


function CreateSongComponent() {
    const dispatch = useDispatch()
    const [file, setFile] = useState();
    const [songTitle, setSongTitle] = useState('');


    const submitFile = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('audioFile', file);
        data.append('songTitle', songTitle);

       await dispatch(createSong(data))

       const form = document.getElementById('create-song-form');
       setSongTitle('');
       form.reset()
    }


    return (
        <div className="create-song-form-container">
            <form id='create-song-form' onSubmit={submitFile}>
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
        </div>
    )
}

export default CreateSongComponent;
