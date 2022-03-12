import React, { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import './LoginForm.css';
import soundCoreIcon from '../../images/SoundCore_icon_orange.png'

function LoginForm() {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);


  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      });
  }

  return (
    <form onSubmit={handleSubmit}>
        <div className="sound-core-login-icon">
        <img src={soundCoreIcon}/>
      </div>
        {errors.map((error, idx) => <span className='login-errors' key={idx}>{error}</span>)}

      <label className='login-labels'>
        Username or Email
        <input className={errors.length > 0 ? 'login-inputs-errors' : 'login-inputs'}

          type="text"
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          required
        />
      </label>
      <label className='login-labels'>
        Password
        <input className={errors.length > 0 ? 'login-inputs-errors' : 'login-inputs'}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <button className='login-form-button' type="submit">Log In</button>
    </form>
  );
}

export default LoginForm;
