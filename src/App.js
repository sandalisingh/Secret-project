import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import './App.css';

const App = () => {
  const [wishes, setWishes] = useState([]);
  const [newWish, setNewWish] = useState('');
  const [name, setName] = useState('');
  const [isPortalOpen, setIsPortalOpen] = useState(true);
  const [timer, setTimer] = useState('');

  // Countdown logic
  useEffect(() => {
      const birthday = new Date('2025-01-18T00:00:00'); // Set the birthday date
      const interval = setInterval(() => {
        const now = new Date();
        const timeLeft = birthday - now; // Calculate the time left in milliseconds

        if (timeLeft <= 0) {
          clearInterval(interval);
          setIsPortalOpen(false); // Close portal when the birthday is reached
        } else {
          const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24)); // Calculate the days
          const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // Calculate the hours
          const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)); // Calculate the minutes
          const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000); // Calculate the seconds

          // Update the timer state
          setTimer(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        }
    }, 1000); // Update every second
    
    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  const handleWishSubmit = () => {
    if (name && newWish) {
      setWishes([...wishes, { name, wish: newWish }]);
      setNewWish('');
      setName('');
    }
  };

  return (
    <div className="App">
      <h1>Birthday wishes</h1>
      {isPortalOpen ? (
        <div>
          <h4>Tick-tick tick-tick</h4>
          <h2>{timer}</h2>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          /> <br/>
          <input
            type="text"
            placeholder="Write your wish here"
            value={newWish}
            onChange={(e) => setNewWish(e.target.value)}
          /><br/>
          <button onClick={handleWishSubmit}>Submit Wish</button>
        </div>
      ) : (
        <div>
          <h2>Happy Birthday!</h2>
          <ul>
            {wishes.map((wish, index) => (
              <li key={index}><strong>{wish.name}:</strong> {wish.wish}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;