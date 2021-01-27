import React, { useState } from 'react'
import Axios from 'axios'

const FoodItem = ({ _id, name, calories, foods, setFoodList }) => {
  const [newName, setNewName] = useState('');

  const updateFood = async () => {
    await Axios.put('http://localhost:3001/update', { _id, newName }, {headers:{token: localStorage.token}})

    setFoodList(foods.map((item) => {
      return item._id === _id ? {_id, name: newName, calories} : item
    }))
  }

  const deleteFood = async () => {
    await Axios.delete(`http://localhost:3001/delete/${_id}`, {headers:{token: localStorage.token}})

    setFoodList(foods.filter((item) => {
      return item._id !== _id
    }))
  }

  return (
    <li key={_id}>
      <p>
        <b>{name}</b>: {calories} kcal
      </p>
      <input
        type="text"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
      />
      <button onClick={updateFood}>Update</button>
      <button onClick={deleteFood}>Delete</button>
    </li >
  )
}

export default FoodItem