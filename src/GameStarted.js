// src/GameStarted.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import GameScores from "./GameScores";

const GameStarted = () => {
  const { id } = useParams(); // ID del juego tomado de la URL
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        console.log("Intentando cargar la partida con ID:", id);
        const docRef = doc(db, "games", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const gameData = docSnap.data();
          console.log("Datos de la partida obtenidos:", gameData);
          setPlayers(gameData.players || []);
        } else {
          console.log("No se encontró la partida");
        }
      } catch (error) {
        console.error("Error al cargar la partida:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGameData();
  }, [id]);

  if (loading) {
    return <p>Cargando la partida...</p>;
  }

  if (players.length === 0) {
    return <p>No se encontraron jugadores para esta partida.</p>;
  }

  return (
    <div>
      <h2>Jugadores en la partida:</h2>
      <ul>
        {players.map((player, index) => (
          <li key={index}>{player}</li>
        ))}
      </ul>
      <GameScores players={players} gameId={id} /> {/* Componente para manejar los puntajes */}
    </div>
  );
};

export default GameStarted;
