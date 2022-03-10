import { csrfFetch } from './csrf';
const axios = require('axios')

const ADD_SONG = 'song/upload';
const LOAD_SONG = 'song/load';
const EDIT_SONG = 'song/edit';
const DELETE_SONG = 'song/delete';

const uploadSong = (song) => {
    return {
        type: ADD_SONG,
        song
    }
}

const getSong = (songs) => {
    return {
        type: LOAD_SONG,
        songs
    }
}

const updateSong = (song) => {
    return {
        type: EDIT_SONG,
        song
    }
}

const  deleteSong = (song) => {
    return {
        type: DELETE_SONG,
        song
    }
}

export const removeSong = (song) => async (dispatch) => {
    const {songId} = song;
    const response = await csrfFetch(`/api/songs/${songId}`, {
        method: 'DELETE'
    });
    if (response.ok) {
        const deletedSong = await response.json();
        dispatch(deleteSong(deletedSong))
    }
}

export const loadSongs = () => async (dispatch) => {
    const response = await csrfFetch('/api/songs');

    if (response.ok) {
        const allSongs = await response.json();

        dispatch(getSong(allSongs))
    }
}

export const createSong = (songData) => async (dispatch) => {

    const response = await axios.post('/api/songs', songData)
   
    if (response.status === 200) {
        const newSong = response.data.insertSong;

        dispatch(uploadSong(newSong));
    }
}

export const editSong = (songData) => async (dispatch) => {
    const {updateTitle, songId} = songData;
    const response = await csrfFetch(`/api/songs/${songId}`, {
        method: 'PUT',
        body: JSON.stringify({updateTitle})
    })
    if (response.ok) {
        const updatedSongDetails = await response.json();
        dispatch(updateSong(updatedSongDetails))
    }
}

const initialState = {};

 const songReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_SONG: {
            let newState = {...state};

            newState[action.song.id] = action.song;
            return newState;
        }
        case LOAD_SONG: {
                state = {}
                const newSongs = {};

                action.songs.forEach(song => {
                    newSongs[song.id] = song
                })
                return {...state, ...newSongs}
        } case EDIT_SONG: {
            let newState = {...state};

            newState[action.song.id] = action.song;
            return newState;
        } case DELETE_SONG: {
            const newState = {...state};
            delete newState[action.song.id];
            return newState;
        }
        default:
            return state;
    }
}

export default songReducer
