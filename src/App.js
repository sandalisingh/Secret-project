import React, { useState, useEffect } from 'react';
import './App.css';
import { createClient } from '@supabase/supabase-js';
import WishesInCollage from './WishesInCollage';
import papaPhoto from "./assets/papa.jpeg";

const supabaseUrl = 'https://pxbhnbgbovyzhrxlyvng.supabase.co'; // Add your Supabase URL here
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4YmhuYmdib3Z5emhyeGx5dm5nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNjYwNDYwMSwiZXhwIjoyMDUyMTgwNjAxfQ.kPQ4f8lfjoIplUq3OKQSrPclbzR4CSBcgrDbTdc2RNM'; // Add your Supabase API Key here
const supabase = createClient(supabaseUrl, supabaseKey);

const App = () => {
  const [password, setPassword] = useState('');
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);

  const correctPassword = '*v*p*s*1*2*3*'; // Replace with the desired password

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();
    if (password === correctPassword) {
      setIsPasswordCorrect(true);
    } else {
      alert('Incorrect password');
    }
  };

  const [wishes, setWishes] = useState([]);
  const [newWish, setNewWish] = useState('');
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState(null); // To store photo
  const [isPortalOpen, setIsPortalOpen] = useState(true);
  const [timer, setTimer] = useState('');

  // Countdown logic
  useEffect(() => {
    const birthday = new Date('2025-01-28T20:00:00'); // Set the birthday date
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

      let sendData = { name: name, wish: newWish, photo_url: photoUrl };

      // Store the wish in the Supabase database
      const { data, error } = await supabase
        .from('Secret-Project')
        .insert(sendData);

      console.log('Supabase insert data:', sendData);
      console.log('Supabase insert response:', data);

      if (error) {
        console.error('Error submitting wish:', error);
      } else {
        // Refresh the wish list
        setWishes([...wishes, sendData]);
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
    // Create a unique file name using the current timestamp
    const fileName = `${Date.now()}-${file.name}`;

    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('photos') // 'photos' is the name of your Supabase storage bucket
      .upload(fileName, file);

    // Log the response and error
    console.log("Supabase upload response:", data);
    console.log("Supabase upload error:", error);

    if (error) {
      console.error('Error uploading photo:', error);
      return ''; // Return an empty string if there is an error
    }

    return ("https://pxbhnbgbovyzhrxlyvng.supabase.co/storage/v1/object/public/photos/" + data.path)
  };


  return (
    <div className="App">
      <h2>{timer}<br />
        <small style={{ fontSize: "0.7rem" }}>until the big day!</small>
      </h2><br />

      {isPortalOpen ? <h1>Collecting birthday wishes !</h1> :
        <h1>Happy birthday vijayyyy!</h1>
      }
      <img
            src={papaPhoto}
            alt="Vijay"
            className='Photo'
          />
      <br />
      {isPortalOpen ? <div><h3>Let’s make Vijay’s birthday on 28th January unforgettable!<br /> Share your heartfelt wishes, fun photos, and special messages to celebrate. 💌</h3>
      <br/><br/>
      <h5>{wishes.length} wishes and counting! <br /><br /></h5></div> :
        <h5>You have {wishes.length} wishes !<br /><br /></h5>
      }

      {isPortalOpen ? (
        <div className="form-container">
          <div className="wish-box">
            <label>Let us know who you are</label><br />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            /> <br /><br />
            <label>Share your warmest wishes and any special message</label><br />
            <textarea
              type="text"
              value={newWish}
              onChange={(e) => setNewWish(e.target.value)}
              required
              style={{ height: "200px" }}
            /><br /><br />
            <label>Upload a favorite photo of you with Vijay!</label><br />
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
            /><br /><br />
            <button onClick={handleWishSubmit}>Submit Wish</button>
          </div>
        </div>
      ) : (
        <div>
          {!isPasswordCorrect ? (
            <form onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter password"
                style={{ width: "300px" }}
              /><br /><br />
              <button type="submit">Submit</button>
            </form>
          ) : (
            <WishesInCollage wishes={wishes} />
          )}
        </div>
      )}
    </div>
  );
};

export default App;