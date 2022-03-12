import React, { useState} from "react";
import { useDispatch} from "react-redux";
import {createAlbum} from '../../store/album'


function CreateAlbumComponent() {
    const dispatch = useDispatch();

    const [imgFile, setImgFile] = useState();
    const [albumTitle, setAlbumTitle] = useState('');


    const submitAlbumForm = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('albumTitle', albumTitle);
        if (imgFile) {
            data.append('albumPoster', imgFile);
        }
        await dispatch(createAlbum(data))
    }

    return (
        <div>
            <form onSubmit={submitAlbumForm}>
                <label>Album Title
                    <input
                        type='text'
                        value={albumTitle}
                        onChange={e => setAlbumTitle(e.target.value)}
                    />
                </label>
                <label> Album Poster
                    <input
                         filename={imgFile}
                         onChange={e => setImgFile(e.target.files[0])}
                         type='file'
                         accept="image/*"
                    />
                </label>
                <button type="submit">Create New Album</button>
            </form>
        </div>
    )
}

export default CreateAlbumComponent
