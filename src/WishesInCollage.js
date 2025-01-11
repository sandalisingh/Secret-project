import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CSSTransition, TransitionGroup } from 'react-transition-group';  // Import for transitions

const WishesInCollage = ({ wishes }) => {
  return (
    <TransitionGroup> {/* Transition group for the list of items */}
      <div className="collage-container">
        <br />
        {wishes.map((currentWish, index) => (
          <CSSTransition
            key={index}
            timeout={500}   // Duration for the fade transition
            classNames="fade" // Class prefix for the transition
          >
            <div className="collage-item" key={index}>
              <p className="wish-text">{currentWish.wish}</p>
              {currentWish.photo_url && (
                <img
                  src={currentWish.photo_url}
                  alt={"Wish_photo_" + index}
                  className="wish-photo"
                />)}
              <br />
              <div className="wish-name">
                <strong>~ {currentWish.name}</strong><br />
              </div>
            </div>
          </CSSTransition>
        ))}
      </div>
    </TransitionGroup>
  );
};

export default WishesInCollage;
