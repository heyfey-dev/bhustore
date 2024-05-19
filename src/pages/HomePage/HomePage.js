import React from 'react';
import Category from '../../components/Category/Category';
import { useSelector } from 'react-redux';
import "./HomePage.scss";
import ImgSlider from '../../components/Slider/Slider';


const HomePage = () => {
  const {data: categories, status: categoryStatus} = useSelector((state) => state.category);

  return (
    <div className = "home-page">
      <ImgSlider />
      <Category categories = {categories} status = {categoryStatus} />
    </div>
  )
}

export default HomePage;