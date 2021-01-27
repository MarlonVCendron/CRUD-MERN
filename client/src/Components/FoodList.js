import React from 'react'
import FoodItem from './FoodItem'

const FoodList = ({ foods, setFoodList, loading }) => {
  const foodComponents = foods.map(item => <FoodItem key={item._id} {...item} foods={foods} setFoodList={setFoodList} />)

  if (loading) return <h4>Loading...</h4>

  return (
    <ul>
      {foodComponents}
    </ul>
  )
}

export default FoodList