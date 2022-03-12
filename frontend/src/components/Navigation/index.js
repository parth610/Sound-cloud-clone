import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from './ProfileButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { login } from '../../store/session';
import './Navigation.css';
import soundCoreLogo from '../../images/SoundCore_logo.png'

function Navigation({ isLoaded }){
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);

  const handleDemoLogin = () => {
    const data = {
      credential: 'Demo-lition',
      password: 'password'
    }
    return dispatch(login({...data}))
  }

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <ProfileButton user={sessionUser} />
    );
  } else {
    sessionLinks = (
      <div className='auth-buttons'>
        <LoginFormModal />
        <SignupFormModal />
        <button className='demo-button' onClick={handleDemoLogin}>Demo User</button>
      </div>
    );
  }

  return (
    <div className='nav-bar'>
        <NavLink className='soundcore-logo-link' exact to="/"><img className='soundcore-home-logo' src={soundCoreLogo}></img></NavLink>
        {isLoaded && sessionLinks}
    </div>
  );
}

export default Navigation;
