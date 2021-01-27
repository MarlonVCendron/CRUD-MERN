import React, { useState } from 'react'
import Axios from 'axios'
import { Redirect } from 'react-router-dom';

Axios.defaults.withCredentials = true

const ChangePassword = () => {
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);

  const changePassword = async (e) => {
    e.preventDefault()

    try {
      const res = await Axios.post('http://localhost:3001/change-password', {
        password: password,
        token: localStorage.getItem('token'),
      })

      if (res.data.status === 'error') {
        alert(res.data.error)
      } else {
        setRedirect(true)
      }
    } catch (error) {
      throw error
    }
  }
  return (
    <>
      {redirect && <Redirect to='/login' />}

      <form onSubmit={changePassword}>
        <h1>Change Password</h1>

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input type="submit" name="change" id="change" value="Change Password" />
      </form>
    </>
  )
}

export default ChangePassword