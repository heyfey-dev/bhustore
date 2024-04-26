import React from 'react';
import Category from '../../components/Category/Category';
import { useSelector } from 'react-redux';

import "./HomePage.scss";
import ImgSlider from '../../components/Slider/Slider';
import PromptBanner from '../../components/PromptBanner/PromptBanner';

const HomePage = () => {
  const {data: categories, status: categoryStatus} = useSelector((state) => state.category);

  return (
    <div className = "home-page">
      <ImgSlider />
      <PromptBanner />
      <Category categories = {categories} status = {categoryStatus} />
    </div>
  )
}

export default HomePage;