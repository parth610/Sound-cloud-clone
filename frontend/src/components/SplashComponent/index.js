import React, {useState} from "react";
import { SignupModal } from "../../context/Modal";
import SignupForm from "../SignupFormModal/SignupForm";
import './SplashComponent.css'
import splashImage1 from '../../images/AdobeStock_254937916.jpeg'
import {useDispatch, useSelector} from 'react-redux'

function HomeComponent() {
    const sessionUser = useSelector(state => state.session.user);
    const [showSignupModal, setShowSignupModal] = useState(false);
    return (
        <div className="home-page">
            <div className={sessionUser ? "images-container-login" : "images-container"}>
                <img className="splash-img-1" src={splashImage1}></img>
                <div className="splash-text"><div>FREE MUSIC</div>Listen your favorite music from our amazing library</div>
                {sessionUser ?
                <div className="splash-welcome-user">
                    <p>Welcome!</p>
                    <span>{sessionUser.username}</span>
                </div>
                    :
                <div className="splash-button-startup">
                    <p>Are you an Artist?</p>
                    <button onClick={e => setShowSignupModal(true)} className="get-started-button"><span className="started-button-text">Upload your own music</span></button>
                </div>
                    }
            </div>
            {showSignupModal && (
        <SignupModal onCloseSignup={() => setShowSignupModal(false)}>
          <SignupForm />
        </SignupModal>
      )}
        </div>
    )
}

export default HomeComponent
