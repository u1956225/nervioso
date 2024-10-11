// src/Ranking.js
import React, { useEffect, useState } from "react";
import { db } from "./firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const Ranking = () => {
  const [players, setPlayers] = useState([]);

  // Función para cargar el ranking desde Firestore
  const loadRanking = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "ranking"));
      const playerData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Ordenar los jugadores por puntos
      playerData.sort((a, b) => b.totalPoints - a.totalPoints);
      setPlayers(playerData);
    } catch (error) {
      console.error("Error al cargar el ranking:", error);
    }
  };

  useEffect(() => {
    loadRanking();
  }, []);

  return (
    <div>
      <h2>Ranking del Torneo</h2>
      <table>
        <thead>
          <tr>
            <th>Jugador</th>
            <th>Puntos</th>
            <th>Partidas Jugadas</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player.id}>
              <td>{player.id}</td>
              <td>{player.totalPoints || 0}</td>
              <td>{player.gamesPlayed || 0}</td>
              <td>
                <button onClick={() => console.log(`Eliminar ${player.id}`)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Ranking;
