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
    const birthday = new Date('2025-01-18T00:00:00'); // Replace with actual birthday
    const interval = setInterval(() => {
      const now = new Date();
      const timeLeft = birthday - now;
      if (timeLeft <= 0) {
        clearInterval(interval);
        setIsPortalOpen(false);
      } else {
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        setTimer(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
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
      <h1>Birthday Wishes Portal</h1>
      {isPortalOpen ? (
        <div>
          <p>Time left to submit wishes: {timer}</p>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Write your wish here"
            value={newWish}
            onChange={(e) => setNewWish(e.target.value)}
          />
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