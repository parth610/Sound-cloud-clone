import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {createAlbum, loadAlbums} from '../../store/album'
import albumDefaultImg from '../../images/music-album.png'

function AlbumComponent() {
    const dispatch = useDispatch();

    const [imgFile, setImgFile] = useState();
    const [albumTitle, setAlbumTitle] = useState('');

    const allAlbums = useSelector(state => {
        return Object.values(state.albums);
    })

    useEffect(() => {
        dispatch(loadAlbums())
    }, [dispatch])

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
            <div>
                {allAlbums.map(album => (
                    <div key={album.id}>
                        <img src={album.image_url === 'no-image' || album.image_url === 'empty' ? `${albumDefaultImg}` : `${album.image_url}`} />
                        <p>{album.name}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AlbumComponent
