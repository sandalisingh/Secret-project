import React, { useState } from 'react';

const WishesInALoop = ({ wishes }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((currentIndex + 1) % wishes.length);  // This will loop back to the first wish after the last one
  };
  
  const handlePrev = () => {
    setCurrentIndex((currentIndex - 1 + wishes.length) % wishes.length);  // This ensures a backward loop to the last wish
  };  

  const currentWish = wishes[currentIndex];

  return (
    <div className="wish-container">
      {currentWish && (
        <div className="wish-box">
          {/* Display wish content */}
          <div className="wish-content">
            <p className="wish-text">{currentWish.wish}</p>
            {currentWish.photo_url && (
              <img src={currentWish.photo_url} alt={"Wish_photo_" + currentIndex} className="wish-photo" />
            )}
          </div>

          {/* Name at bottom-right */}
          <div className="wish-name">
            <strong>~ {currentWish.name}</strong><br/>
          </div><br/>

          {/* Buttons for next and previous wishes */}
          <div className="navigation-buttons">
            <button onClick={handlePrev} disabled={currentIndex === 0}>
            &#8249;
            </button>
            <button onClick={handleNext} disabled={currentIndex === wishes.length - 1}>
            &#8250;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishesInALoop;
