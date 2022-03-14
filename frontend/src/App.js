import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import HomeComponent from "./components/SplashComponent";
import MyProfileComponent from "./components/MyProfileComponent";

function App() {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      <Switch>
        <Route exact path='/'>
      <HomeComponent />
        </Route>
      {sessionUser && (
        <Route path='/:userId'>
          <MyProfileComponent />
        </Route>
          )}
      </Switch>
    </>
  );
}

export default App;
