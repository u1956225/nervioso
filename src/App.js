// src/App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import NewGame from "./NewGame";
import GameStarted from "./GameStarted";
import Ranking from "./Ranking";
import Auth from "./Auth";
import { auth } from "./firebaseConfig";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar el estado de autenticación
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  if (!isAuthenticated) {
    return <Auth />;
  }

  return (
    <Router>
      <div>
        <h1>Recuento de Puntos</h1>
        <Routes>
          <Route path="/" element={<Navigate to="/new-game" />} />
          <Route path="/new-game" element={<NewGame />} />
          <Route path="/game-started/:id" element={<GameStarted />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="*" element={<p>404: Página no encontrada</p>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
