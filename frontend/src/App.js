import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import CreateSongComponent from "./components/SongComponent";

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
      {sessionUser && (
        <CreateSongComponent />
      )}
      {isLoaded && (
        <Switch>
          <Route>
            {/* <h2>Page Not Found</h2> */}
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
