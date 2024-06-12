import React, { useState, useEffect } from "react";
import {
    Route,
    Link,
    Routes,
    BrowserRouter,
    useNavigate,
    useParams,
    useLocation,
} from "react-router-dom";

import "./App.css";
import "./styles.css";

import Tickets from "./components/Tickets";
import TrainLocation from "./components/TrainLocation";
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
        <BrowserRouter>
            <div class="main column fill">
                <header className="row shadow fill">
                    <h1 class="empty">
                        <Link to="/">Train Scheduler</Link>
                    </h1>
                    <div class="empty"></div>
                    <Login
                        loggedIn={loggedIn}
                        login={login}
                        setLoggedIn={setLoggedIn}
                    ></Login>
                </header>
                <section class="center pad-2">
                    <Routes>
                        <Route
                            path="/"
                            element={<Tickets loggedIn={loggedIn} />}
                        />
                        <Route path="/train/:id" element={<TrainLocation />} />
                    </Routes>
                </section>
            </div>
        </BrowserRouter>
    );
}

export default App;
