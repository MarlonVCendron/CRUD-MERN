import React, { useState, useEffect, useContext } from 'react'
import Axios from 'axios'
import { Link } from 'react-router-dom'
import FoodList from '../Components/FoodList'
import { Redirect } from 'react-router-dom';

import { Context } from '../Context/AuthContext'

Axios.defaults.withCredentials = true

const Home = () => {
  const { authenticated, handleLogout } = useContext(Context)

  const [foodData, setFoodData] = useState({
    name: '',
    calories: 0,
  })
  const [foodList, setFoodList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const getFoodData = async () => {
      setLoading(true)

      const data = await Axios.get('http://localhost:3001/read', { headers: { token: localStorage.token } })
      const foods = data.data

      setLoading(false)
      setFoodList(foods)
    }

    getFoodData()
  }, []);

  const changeFoodData = (e) => {
    const { name, value } = e.target

    setFoodData({
      ...foodData,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    Axios.post('http://localhost:3001/insert', foodData, { headers: { token: localStorage.token } }).then(response => {
      const newFood = { ...foodData, _id: response.data }
      setFoodList([...foodList, newFood])
    })
  }

  const logout = () => {
    handleLogout() // Context
    localStorage.removeItem('token')
    setRedirect(true)
  }

  return (
    <div className="App">
      {(redirect || !authenticated) && <Redirect to='/login' />}

      <Link to="/change-password">ChangePassword</Link>
      <button onClick={logout}>Logout</button>

      <h1>CRUD</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Food name: </label>
        <input
          id="name"
          name="name"
          type="text"
          value={foodData.name}
          onChange={changeFoodData}
        />

        <label htmlFor="foodCalories">Calories: </label>
        <input
          id="calories"
          name="calories"
          type="number"
          value={foodData.calories}
          onChange={changeFoodData}
        />

        <input type="submit" name="submit" id="submit" value="Add" />
      </form>

      <FoodList foods={foodList} setFoodList={setFoodList} loading={loading} />
    </div>
  );
}

export default Home;
