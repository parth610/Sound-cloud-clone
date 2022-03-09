import { csrfFetch } from './csrf';
const axios = require('axios')

const ADD_SONG = 'song/upload';
const LOAD_SONG = 'song/load';

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

export const loadSongs = () => async (dispatch) => {
    const response = await csrfFetch('/api/songs');

    if (response.ok) {
        const allSongs = await response.json();
        dispatch(getSong(allSongs))
    }
}

export const createSong = (songData) => async (dispatch) => {

    const response = await axios.post('/api/songs', songData)
    console.log(response)
    if (response.ok) {
        const newSong = await response.json();
        dispatch(uploadSong(newSong));
    }
    // if(response.status === 200){
    //     const newSong =response.data.song;
    //     newSong.User = {};
    //     newSong.User.username = username;
    //     await dispatch(addSongType(newSong));
    //     console.log("hit oka?")
    //     return newSong;
    // }
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

                const newSongs = {};

                action.songs.forEach(song => {
                    newSongs[song.id] = song
                })
                return {...state, ...newSongs}
        }
        default:
            return state;
    }
}

export default songReducer
