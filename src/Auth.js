// src/Auth.js
import React, { useState } from "react";
import { auth } from "./firebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleAuth = async () => {
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Usuario registrado exitosamente");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Inicio de sesión exitoso");
      }
    } catch (error) {
      console.error("Error en la autenticación:", error);
      alert("Error en la autenticación: " + error.message);
    }
  };

  return (
    <div>
      <h2>{isRegistering ? "Registrarse" : "Iniciar Sesión"}</h2>
      <input
        type="email"
        placeholder="Correo Electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleAuth}>
        {isRegistering ? "Registrarse" : "Iniciar Sesión"}
      </button>
      <p onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering
          ? "¿Ya tienes una cuenta? Inicia sesión"
          : "¿No tienes una cuenta? Regístrate"}
      </p>
    </div>
  );
};

export default Auth;
