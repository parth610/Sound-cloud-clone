import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {createAlbum, loadAlbums, removeAlbum, editAlbum} from '../../store/album'
import albumDefaultImg from '../../images/music-album.png'

function AlbumComponent() {
    const dispatch = useDispatch();

    const [imgFile, setImgFile] = useState();
    const [albumTitle, setAlbumTitle] = useState('');
    const [editAlbumTitle, setEditAlbumTitle] = useState('');
    const [editAlbumFile, setEditAlbumFile] = useState();
    const [editAlbumId, setEditAlbumId] = useState()
    const [showEditAlbumForm, setShowEditAlbumForm] = useState(false)

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
                        <button id={album.id} onClick={deleteAlbumHandle}>Delete Album</button>
                        <button id={album.id} onClick={clickonEdit}>Edit</button>
                    </div>
                ))}
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
        </div>
    )
}

export default AlbumComponent
