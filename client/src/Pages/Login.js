import React, { useState, useContext } from 'react'
import Axios from 'axios'
import { Redirect } from 'react-router-dom';
import { Context } from '../Context/AuthContext';

Axios.defaults.withCredentials = true

const Login = () => {
  const {authenticated, handleLogin} = useContext(Context)

  const [usernameReg, setUsernameReg] = useState('');
  const [passwordReg, setPasswordReg] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // const [redirect, setRedirect] = useState(false);

  const register = async (e) => {
    e.preventDefault()

    try {
      const res = await Axios.post('http://localhost:3001/register', {
        username: usernameReg,
        password: passwordReg
      })

      if (res.data.status === 'error') {
        alert(res.data.error)
      } else {
        setUsernameReg('')
        setPasswordReg('')
      }
    } catch (error) {
      throw error
    }
  }

  const login = async (e) => {
    e.preventDefault()

    try {
      const res = await Axios.post('http://localhost:3001/login', {
        username: username,
        password: password
      })

      if (res.data.status === 'error') {
        alert(res.data.error)
      } else {
        handleLogin() // Context
        localStorage.setItem('token', res.data.token)
        // setRedirect(true)
      }
    } catch (error) {
      throw error
    }
  }

  return (
    <>
      {/* {(redirect || authenticated) && <Redirect to='/' />} */}
      {authenticated && <Redirect to='/' />}

      <form onSubmit={register}>
        <h1>Register</h1>
        <label htmlFor="username">Username</label>
        <input
          id="usernameReg"
          name="usernameReg"
          type="text"
          value={usernameReg}
          onChange={(e) => setUsernameReg(e.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          id="passwordReg"
          name="passwordReg"
          type="password"
          value={passwordReg}
          onChange={(e) => setPasswordReg(e.target.value)}
        />

        <input type="submit" name="register" id="register" value="Register" />
      </form>

      <form onSubmit={login}>
        <h1>Login</h1>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input type="submit" name="login" id="login" value="Login" />
      </form>
    </>
  )
}

export default Login