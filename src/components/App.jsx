import  { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Ducks from "./Ducks";
import Login from "./Login";
import MyProfile from "./MyProfile";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import "./styles/App.css";
import * as auth from "../utils/auth";
import * as token from "../utils/token";

function App() {

  const [userData, setUserData] = useState({ username: "", email: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  const handleRegistration = ({
    username,
    email,
    password,
    confirmPassword,
  }) => {
    if (password === confirmPassword) {
      auth
      .register(username, password, email)
      .then(() => {
        // Leve o usuário para a página de login.
          navigate("/login");
      })
      .catch(console.error);
    }
  };


  // handleLogin aceita um parâmetro: um objeto com duas propriedades.
const handleLogin = ({ username, password }) => {
  // Se o nome de usuário ou a senha estiverem vazios, retorne sem enviar uma solicitação.
  if (!username || !password) {
    return;
  }    
   
 // Passamos o nome de usuário e a senha como argumentos posicionais. A
// função authorize é configurada para renomear `username` para `identifier`
// antes de enviar uma solicitação ao servidor, pois é isso que a
// API espera.
 auth
   .authorize(username, password)
     .then((data) => {
       if (data.jwt) {
          setToken(data.jwt);
          setUserData(data.user);  // Salve os dados do usuário no estado
          setIsLoggedIn(true);     // Permita o login do usuário
          navigate("/ducks");      // Mande o usuário para /ducks
        }  
     })
     .catch(console.error);
};

useEffect(() => {
  const jwt = getToken();
    
  if (!jwt) {
    return;
  }

  // TODO - manipular JWT
}, []);

  return (
    <Routes>
      <Route 
        path="/ducks" 
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <Ducks />
          </ProtectedRoute>
        } />
      <Route 
        path="/my-profile" 
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <MyProfile userData={userData}/>
          </ProtectedRoute>
        } />
      <Route
        path="/login"
        element={
          <div className="loginContainer">
            <Login handleLogin={handleLogin}/>
          </div>
        }
      />
      <Route
        path="/register"
        element={
          <div className="registerContainer">
            <Register handleRegistration={handleRegistration}/>
          </div>
        }
      />
      <Route path="*" element={isLoggedIn ? <Navigate to="/ducks" replace /> : <Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
