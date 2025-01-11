import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

for (let i = 0; i < 100; i++) {
    let star = document.createElement('div');
    star.classList.add('star');
    
    // Random size for each star (between 1px and 4px)
    let size = Math.random() * 3 + 1;  // This will generate a size between 1px and 4px
    
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    
    let duration = (Math.random() * 5) + 5;
    let delay = (Math.random() * 5) + 5;
    
    star.style.animation = `twinkle ${duration}s linear ${delay}s infinite`;
    star.style.top = Math.random() * window.innerHeight + 'px';
    star.style.left = Math.random() * window.innerWidth + 'px';
    
    document.body.appendChild(star);
}
