import React from "react";
import './SplashComponent.css'
import splashImage1 from '../../images/AdobeStock_254937916.jpeg'
import {useDispatch, useSelector} from 'react-redux'

function HomeComponent() {
    return (
        <div className="home-page">
            <div className="images-container">
                <img className="splash-img-1" src={splashImage1}></img>
                <div className="splash-button-startup">
                    <p>Are you an Artist?</p>
                    <button className="get-started-button"><span className="started-button-text">Start Uploading</span></button>
                </div>
            </div>
        </div>
    )
}

export default HomeComponent
