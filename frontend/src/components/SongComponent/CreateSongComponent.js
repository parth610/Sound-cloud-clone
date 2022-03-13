import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSong} from "../../store/song";
import { loadAlbums} from "../../store/album";


function CreateSongComponent({onCloseSong}) {
    const dispatch = useDispatch()
    const sessionUser = useSelector(state => state.session.user);

    const [file, setFile] = useState();
    const [songTitle, setSongTitle] = useState('');
    const [getAlbumId, setGetAlbumId] = useState()

    const allAlbums = useSelector(state => {
        return Object.values(state.albums);
    })


    useEffect(() => {
        dispatch(loadAlbums())
    }, [dispatch])

    const submitFile = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('audioFile', file);
        data.append('songTitle', songTitle);
        data.append('albumId', getAlbumId)
        await dispatch(createSong(data))
        const form = document.getElementById('create-song-form');
        setSongTitle('');
        form.reset()
        onCloseSong()

    }


    return (
        <div className="create-song-form-container">
            <form id='create-song-form' onSubmit={submitFile}>
                <label> Your Album
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
