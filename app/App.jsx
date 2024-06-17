import React, { useState, useEffect } from "react";
import {
  Link,
  Outlet
} from "react-router-dom";

import "./App.css";
import "./styles.css";

import Login from "./components/Login";
import UserProfile from "./closures/UserProfile";


function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [login, setLogin] = useState("");

  useEffect(() => {
    const login = UserProfile.get();
    if (login != "") {
      setLoggedIn(true);
      setLogin(login);
    }
  }, [loggedIn]);

  return (
    <>
      <header>
        <h1>
          <Link to="/">Train Scheduler</Link>
        </h1>
        <Login
          loggedIn={loggedIn}
          login={login}
          setLoggedIn={setLoggedIn}
        ></Login>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default App;
