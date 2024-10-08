import React from 'react';
import './StarRating.css'; // We'll style the stars in this file

const StarRating = ({ rating }) => { //getting the rating from the foodItem.jsx
  //function to create the stars
  const renderStars = () => {
    const stars = []; //takinng an empty array with variable name stars
    const fullStars = Math.floor(rating); // Full stars to render
    const hasHalfStar = rating % 1 !== 0; // Check if there's a half star

    // Add full stars
    for (let i = 1; i <= fullStars; i++) {
      stars.push( //pushing the full stars
        <span key={i} className="star full">
          ★
        </span>
      );
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <span key="half" className="star half">
          ★
        </span>
      );
    }

    // Add empty stars to fill up to 5 stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 1; i <= emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="star empty">
          ★
        </span>
      );
    }

    return stars; //returning the star values
  };

  return <div className="star-rating">{renderStars()}</div>;
};

export default StarRating;
