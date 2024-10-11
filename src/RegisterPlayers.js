// src/RegisterPlayers.js
import React, { useState } from "react";
import { db } from "./firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebaseConfig";

const RegisterPlayers = () => {
  const [players, setPlayers] = useState([]);
  const [playerName, setPlayerName] = useState("");
  const navigate = useNavigate();

  const handleAddPlayer = () => {
    if (playerName.trim() !== "") {
      setPlayers([...players, playerName.trim()]);
      setPlayerName("");
    }
  };

  const handleRemovePlayer = (index) => {
    const newPlayers = [...players];
    newPlayers.splice(index, 1);
    setPlayers(newPlayers);
  };

  const handleSubmit = async () => {
    if (players.length > 0) {
      try {
        const userId = auth.currentUser.uid;
        await setDoc(doc(db, "users", userId), {
          players,
        });
        alert("Jugadores registrados con éxito");
        navigate("/"); // Redirige a la pantalla principal
      } catch (error) {
        console.error("Error registrando los jugadores: ", error);
      }
    }
  };

  return (
    <div>
      <h2>Registrar Jugadores del Torneo</h2>
      <input
        type="text"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        placeholder="Nombre del jugador"
      />
      <button onClick={handleAddPlayer}>Agregar Jugador</button>
      <ul>
        {players.map((player, index) => (
          <li key={index}>
            {player}
            <button onClick={() => handleRemovePlayer(index)}>Eliminar</button>
          </li>
        ))}
      </ul>
      <button onClick={handleSubmit}>Registrar Jugadores</button>
    </div>
  );
};

export default RegisterPlayers;
