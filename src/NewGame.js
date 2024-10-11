// src/NewGame.js
import React, { useState, useEffect } from "react";
import { db, auth } from "./firebaseConfig";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const NewGame = () => {
  const [allPlayers, setAllPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        if (!auth.currentUser) {
          console.error("Usuario no autenticado");
          return; // Si no hay un usuario autenticado, salir de la función
        }

        const userId = auth.currentUser.uid;
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAllPlayers(docSnap.data().players);
        } else {
          console.log("No se encontró el documento del usuario");
        }
      } catch (error) {
        console.error("Error al cargar los jugadores:", error);
      }
    };

    fetchPlayers();
  }, []);

  const handleTogglePlayer = (player) => {
    if (selectedPlayers.includes(player)) {
      setSelectedPlayers(selectedPlayers.filter((p) => p !== player));
    } else {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  const handleCreateGame = async () => {
    if (selectedPlayers.length > 0) {
      try {
        const newGameRef = await addDoc(collection(db, "games"), {
          players: selectedPlayers,
          scores: Array(selectedPlayers.length).fill(0), // Inicializar puntajes en 0
          rounds: [],
          createdAt: new Date(),
        });
        // Redirigir a la página "GameStarted" con el ID del documento
        navigate(`/game-started/${newGameRef.id}`);
      } catch (error) {
        console.error("Error creando la partida:", error);
      }
    } else {
      alert("Debes seleccionar al menos un jugador");
    }
  };

  return (
    <div>
      <h2>Nueva Partida</h2>
      <p>Selecciona los jugadores que participarán en la partida:</p>
      <ul>
        {allPlayers.map((player, index) => (
          <li key={index}>
            <input
              type="checkbox"
              onChange={() => handleTogglePlayer(player)}
              checked={selectedPlayers.includes(player)}
            />
            {player}
          </li>
        ))}
      </ul>
      <button onClick={handleCreateGame}>Crear Partida</button>
    </div>
  );
};

export default NewGame;
