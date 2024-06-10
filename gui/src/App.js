import React, { useState, useEffect } from "react";
// import { Route, Link, Routes, useNavigate, useParams, useLocation } from 'react-router-dom';

import './App.css';
import './styles.css';

import Tickets from "./components/Tickets"


function App() {
  return (
    <div class="main column fill">
      <header className="row shadow fill">
        <h1 class="empty">
          Train Scheduler
          {/* <Link to="/">
          Train Scheduler
          </Link> */}
        </h1>
      </header>
      <section class="center pad-2">
        <Tickets>
          
        </Tickets>
      </section>
    </div>
  );
}

export default App;
