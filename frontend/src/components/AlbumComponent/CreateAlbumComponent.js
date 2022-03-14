import React, { useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import {createAlbum, loadAlbums} from '../../store/album'



function CreateAlbumComponent({onCloseAlbum}) {
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);

    const [imgFile, setImgFile] = useState();
    const [albumTitle, setAlbumTitle] = useState('');
    const [albumErrors, setAlbumErrors] = useState([]);

    const allAlbums = useSelector(state => {
        return Object.values(state.albums);
    })

    let userAlbums = [];
    allAlbums.filter(album => {
        return album.user_id === sessionUser.id
    }).forEach(album => userAlbums.push(album.name))

    useEffect(() => {
        dispatch(loadAlbums())
    }, [dispatch])

    useEffect(() => {
        let errors = [];
        if (!albumTitle.length) errors.push('Album title can not be empty');
        if (userAlbums.includes(albumTitle)) errors.push(('Album title can not be repeated in same user library, choose a different name'))
        setAlbumErrors(errors);
    }, [albumTitle])

    const submitAlbumForm = async (e) => {
        e.preventDefault();
        if (!albumErrors.length) {
            const data = new FormData();
            data.append('albumTitle', albumTitle);
            if (imgFile) {
                data.append('albumPoster', imgFile);
            }
            await dispatch(createAlbum(data))
            const form = document.getElementById('create-album-form');
            setAlbumTitle('')
            form.reset()
            onCloseAlbum()
        } else {
            return;
        }
    }

    return (
        <div>
            {albumErrors.length > 0 && albumErrors.map(error => (
                <div key={error}>{error}</div>
            ))}
            <form className="create-album-form" onSubmit={submitAlbumForm}>
                <label>Album Title
                    <input
                        type='text'
                        value={albumTitle}
                        onChange={e => setAlbumTitle(e.target.value)}
                    />
                </label>
                <label> Album Poster (optional)
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
