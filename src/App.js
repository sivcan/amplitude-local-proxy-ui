import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';


function App() {
  const [ events, setEvents ] = useState([]);
  const [ listening, setListening ] = useState(false);

  useEffect( () => {
    if (!listening) {
      const events = new EventSource('http://localhost:3001/events');

      events.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);

        console.log({ parsedData });
        let bodyData = Array.isArray(parsedData) ? parsedData[0] : parsedData;
        const config = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        };

        if (!bodyData) {
          return;
        }

        const params = new URLSearchParams()

        for (const key in bodyData) {
          params.append(key, bodyData[key]);
        }

        axios.post('https://api.amplitude.com/', params, config)
          .then(function (response) {
            console.log(JSON.stringify(response.data));
          })
          .catch(function (error) {
            console.log(error);
          });

        setEvents((events) => events.concat(parsedData));
      };

      setListening(true);
    }
  }, [listening, events]);

  return (
    <div>
      Welcome to Amplitude Events Explorer Proxy!
    </div>
  );
}

export default App;