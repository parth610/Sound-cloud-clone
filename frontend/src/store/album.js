import { csrfFetch } from "./csrf";
import { loadSongs } from "./song";
const axios = require('axios');

const ADD_ALBUM = 'album/upload';
const LOAD_ALBUM = 'album/load';
const EDIT_ALBUM = 'album/edit';
const DELETE_ALBUM = 'album/delete';

const uploadAlbum = (album) => {
    return {
        type: ADD_ALBUM,
        album
    }
}

const getAlbum = (album) => {
    return {
        type: LOAD_ALBUM,
        album
    }
}

const updateAlbum = (album) => {
    return {
        type: EDIT_ALBUM,
        album
    }
}

const  deleteAlbum = (album) => {
    return {
        type: DELETE_ALBUM,
        album
    }
}

export const createAlbum = (albumData) => async (dispatch) => {
    const response = await axios.post('/api/albums', albumData)
    console.log(response)
        if (response.status === 200) {
            const newAlbum = response.data.insertAlbum
            dispatch(uploadAlbum(newAlbum))
        }
}

export const loadAlbums = () => async (dispatch) => {
    const response = await csrfFetch('/api/albums');

    if (response.ok) {
        const allAlbums = await response.json();
        dispatch(getAlbum(allAlbums));
    }
}

export const removeAlbum = (album_Id) => async (dispatch) => {
    const {albumId} = album_Id
    const response = await csrfFetch(`/api/albums/${albumId}`, {
        method: 'DELETE'
    })

    if (response.ok) {
        const deletedAlbum = await response.json();

        dispatch(deleteAlbum(deletedAlbum));
    }
}

const initialState = {};

const albumReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_ALBUM: {
            let newState = {...state};

            newState[action.album.id] = action.album;
            return newState;
        }
        case LOAD_ALBUM: {
            state = {}
            const newAlbums = {};
            action.album.forEach(alb => {
                newAlbums[alb.id] = alb
            });
            return {...state, ...newAlbums}
        }
        case DELETE_ALBUM: {
            const newState = {...state};
            console.log('before', newState)
            delete newState[action.album.id];
            console.log('after', newState)
            return newState;
        }
        default:
            return state;
    }
}


export default albumReducer;
