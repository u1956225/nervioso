// src/GameScores.js
import React, { useState } from "react";
import { db } from "./firebaseConfig";
import { doc, updateDoc, arrayUnion, writeBatch, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const GameScores = ({ players, gameId }) => {
  const [currentRound, setCurrentRound] = useState(1);
  const [scores, setScores] = useState(Array(players.length).fill(0));
  const [accumulatedScores, setAccumulatedScores] = useState(Array(players.length).fill(0));
  const navigate = useNavigate();

  const handleScoreChange = (index, value) => {
    const newScores = [...scores];
    newScores[index] = parseInt(value, 10) || 0;
    setScores(newScores);
  };

  const handleSubmitScores = async () => {
    const newAccumulatedScores = accumulatedScores.map((score, index) => score + scores[index]);
    setAccumulatedScores(newAccumulatedScores);

    try {
      const gameRef = doc(db, "games", gameId);
      await updateDoc(gameRef, {
        rounds: arrayUnion({ round: currentRound, scores }),
        accumulatedScores: newAccumulatedScores,
      });

      if (currentRound < 7) {
        setCurrentRound(currentRound + 1);
        setScores(Array(players.length).fill(0));
      } else {
        handleFinishGame(newAccumulatedScores);
      }
    } catch (error) {
      console.error("Error al guardar los puntajes:", error);
    }
  };

  const handleFinishGame = async (finalScores) => {
    const sortedPlayers = players
      .map((player, index) => ({
        name: player,
        score: finalScores[index],
      }))
      .sort((a, b) => a.score - b.score);

    const updatedRankings = sortedPlayers.map((player, index) => {
      let points = 0;
      if (index === 0) points = 3; // Ganador
      else if (index === 1) points = 2; // Segundo lugar
      else if (index === 2) points = 1; // Tercer lugar

      // Bonificación por puntaje bajo
      if (player.score < 50) points += 2;
      else if (player.score < 75) points += 1;

      return {
        name: player.name,
        totalScore: player.score,
        points,
      };
    });

    try {
      const batch = writeBatch(db);
      for (const player of updatedRankings) {
        const playerRef = doc(db, "ranking", player.name);
        const playerDoc = await getDoc(playerRef);

        if (playerDoc.exists()) {
          const currentTotalPoints = playerDoc.data().totalPoints || 0;
          const currentGamesPlayed = playerDoc.data().gamesPlayed || 0;

          console.log(`Actualizando puntos para ${player.name}: Puntos actuales: ${currentTotalPoints}, Nuevos puntos: ${player.points}`);

          batch.update(playerRef, {
            totalPoints: currentTotalPoints + player.points,
            gamesPlayed: currentGamesPlayed + 1,
          });
        } else {
          console.log(`Creando nuevo registro para ${player.name} con ${player.points} puntos.`);
          batch.set(playerRef, {
            totalPoints: player.points,
            gamesPlayed: 1,
          });
        }
      }
      await batch.commit();

      console.log("Actualización del ranking completada.");
      navigate("/ranking");
    } catch (error) {
      console.error("Error al actualizar el ranking:", error);
    }
  };

  return (
    <div>
      <h3>Ronda {currentRound}</h3>
      <ul>
        {players.map((player, index) => (
          <li key={index}>
            {player}: 
            <input
              type="number"
              placeholder="Puntaje"
              value={scores[index]}
              onChange={(e) => handleScoreChange(index, e.target.value)}
            />
            (Acumulado: {accumulatedScores[index]})
          </li>
        ))}
      </ul>
      <button onClick={handleSubmitScores}>
        {currentRound < 7 ? "Siguiente Ronda" : "Finalizar Partida"}
      </button>
    </div>
  );
};

export default GameScores;
