import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import PrivateRoute from './Components/PrivateRoute'
import Axios from 'axios'

import ChangePassword from './Pages/ChangePassword';
import Home from './Pages/Home';
import Login from './Pages/Login';

import {AuthProvider} from './Context/AuthContext'

import './index.css'

Axios.defaults.withCredentials = true

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Switch>
          <Route exact path='/login' component={Login} />
          <PrivateRoute exact path='/change-password' component={ChangePassword} />
          <PrivateRoute exact path='/' component={Home} />
        </Switch>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App