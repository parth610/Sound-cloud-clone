import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import * as sessionActions from "../../store/session";
import './SignupForm.css';
import soundCoreIcon from '../../images/SoundCore_icon_orange.png'

function SignupForm() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors([]);
      return dispatch(sessionActions.signup({ email, username, password }))
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        });
    }
    return setErrors(['Confirm Password field must be the same as the Password field']);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="sound-core-signup-icon">
        <img src={soundCoreIcon}/>
      </div>
      <label className="signup-labels">
        Email
        {errors && errors.includes('Please provide a valid email.') && <p className="signup-error">Please provide a valid email.</p>}
        <input
        className="signup-inputs"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label className="signup-labels">
        Username
        {errors && errors.includes('Please provide a username with at least 4 characters.') && <p className="signup-error">Please provide a username with at least 4 characters.</p>}
        {errors && errors.includes('Username cannot be an email.') && <p className="signup-error">Username cannot be an email.</p>}
        <input
        className="signup-inputs"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </label>
      <label className="signup-labels">
        Password
        {errors && errors.includes('Password must be 6 characters or more.') && <p className="signup-error">Password must be 6 characters or more.</p>}
        <input
        className="signup-inputs"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <label className="signup-labels">
        Confirm Password
        {errors && errors.includes('Confirm Password field must be the same as the Password field') && <p className="signup-error">Confirm Password field must be the same as the Password field</p>}
        <input
        className="signup-inputs"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </label>
      <button className="sign-up-form-button" type="submit">Sign Up</button>
      {/* <div>Already have an account?</div> */}
    </form>
  );
}

export default SignupForm;
