import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import './App.css';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pxbhnbgbovyzhrxlyvng.supabase.co'; // Add your Supabase URL here
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4YmhuYmdib3Z5emhyeGx5dm5nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNjYwNDYwMSwiZXhwIjoyMDUyMTgwNjAxfQ.kPQ4f8lfjoIplUq3OKQSrPclbzR4CSBcgrDbTdc2RNM'; // Add your Supabase API Key here
const supabase = createClient(supabaseUrl, supabaseKey);

const App = () => {
  const [wishes, setWishes] = useState([]);
  const [newWish, setNewWish] = useState('');
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState(null); // To store photo
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

          // Pad each value to ensure two digits
          const paddedDays = String(days).padStart(2, '0');
          const paddedHours = String(hours).padStart(2, '0');
          const paddedMinutes = String(minutes).padStart(2, '0');
          const paddedSeconds = String(seconds).padStart(2, '0');

          // Update the timer state with two-digit format
          setTimer(`${paddedDays} : ${paddedHours} : ${paddedMinutes} : ${paddedSeconds}`);
        }
    }, 1000); // Update every second
    
    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  // Fetch all wishes on page load
  useEffect(() => {
    const fetchWishes = async () => {
      const { data, error } = await supabase
        .from('Secret-Project')
        .select('*');
      if (error) {
        console.error('Error fetching wishes:', error);
      } else {
        setWishes(data || []); // Ensure it's always an array
      }
    };
    fetchWishes();
  }, []);


  // Function to handle wish submission
  const handleWishSubmit = async () => {
    if (name && newWish) {
      let photoUrl = '';
      if (photo) {
        // Upload the photo and get the URL
        photoUrl = await uploadPhoto(photo);
      }

      // Store the wish in the Supabase database
      const { data, error } = await supabase
        .from('Secret-Project')
        .insert([
          { name: name, wish: newWish, photo_url: photoUrl },
        ]);
      if (error) {
        console.error('Error submitting wish:', error);
      } else {
        // Refresh the wish list
        setWishes([...wishes, ...data]);
      }
      
      // Reset form
      setNewWish('');
      setName('');
      setPhoto(null);
    }
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  // Upload photo to Supabase Storage and get the public URL
  const uploadPhoto = async (file) => {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('photos') // 'photos' is the name of the Supabase storage bucket
      .upload(fileName, file);
    
    if (error) {
      console.error('Error uploading photo:', error);
      return '';
    }

    // Get the public URL of the uploaded photo
    const { publicURL, error: urlError } = supabase
      .storage
      .from('photos')
      .getPublicUrl(data.path);
    
    if (urlError) {
      console.error('Error getting public URL:', urlError);
      return '';
    }

    return publicURL;
  };

  return (
    <div className="App">
      <h1>Birthday wishes</h1>
      <h2>{timer}</h2>
      {isPortalOpen ? (
        <div>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          /> <br/>
          <input
            type="text"
            placeholder="Write your wish here"
            value={newWish}
            onChange={(e) => setNewWish(e.target.value)}
            required
          /><br/>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
          /><br/>
          <button onClick={handleWishSubmit}>Submit Wish</button>
        </div>
      ) : (
        <div>
          <ul>
            {wishes.map((wish, index) => (
              <li key={index}>
                <strong>{wish.name}:</strong> {wish.wish} 
                {wish.photoUrl && <img src={wish.photoUrl} alt="Wish photo" style={{ width: '100px', height: '100px' }} />}
              </li>            
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;