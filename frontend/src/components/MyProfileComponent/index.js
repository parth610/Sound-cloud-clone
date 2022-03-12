import React, {useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import userWallpaper from '../../images/AdobeStock_184684415.jpeg'
import CreateSongFormModal from "../SongComponent";
import CreateAlbumFormModal from '../AlbumComponent'
import './MyProfile.css'

function MyProfileComponent() {
    const dispatch = useDispatch();
    const history = useHistory();
    const sessionUser = useSelector(state => state.session.user);
    if(!sessionUser) history.push('/')

    return (
        <div className="user-profile-page">
            <div className="image-container-user-profile">
                <img className="user-wall-image" src={userWallpaper}/>
                <div className="user-profile-wall-text">Welcome to your own Studio!<span>{sessionUser.username}</span></div>
                <div className="create-buttons-container">
                    <CreateSongFormModal />
                    <CreateAlbumFormModal />
                </div>
            </div>
        </div>
    )
}

export default MyProfileComponent;
