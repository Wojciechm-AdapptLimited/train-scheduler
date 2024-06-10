import React, { useState, useEffect } from "react";
import { Route, Link, Routes, BrowserRouter, useNavigate, useParams, useLocation } from 'react-router-dom';

import './App.css';
import './styles.css';

import Tickets from "./components/Tickets"


function App() {
  return (
    <BrowserRouter>
      <div class="main column fill">
        <header className="row shadow fill">
          <h1 class="empty">
            <Link to="/">
              Train Scheduler
            </Link>
          </h1>
        </header>
        <section class="center pad-2">
          
            <Routes>
              <Route path="/" element={<Tickets/>}/>
            </Routes>
          
        </section>
      </div>
    </BrowserRouter>
  );
}

export default App;
