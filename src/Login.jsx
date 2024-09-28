import React, { useState } from 'react';
import login from './login.json'; // Asegúrate de tener el archivo en la misma carpeta o cambia la ruta

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Buscar si existe un usuario con el email y contraseña ingresados
    const user = login.users.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      onLoginSuccess(); // Llamar a la función de éxito si las credenciales coinciden
    } else {
      alert('Incorrect email or password');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Login</h2>
      <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: '400px' }}>
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-dark w-100">Login</button>
      </form>
    </div>
  );
};

export default Login;
