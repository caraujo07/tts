import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';


import './App.css';
import api from './api';
import audioFile from './output.ogg';


const socket = io.connect('http://localhost:3001');

const audio = new Audio();

function App() {

  const [text, setText] = useState('');
  const [role, setRole] = useState(false);
  const [playing, setPlaying] = useState('');

  useEffect(() => {
    function receiveMessage(m) {
        audio.src = m.path;
        audio.play();
      setPlaying(m.name);
    }

    socket.on('play', receiveMessage);

    return () => {
      socket.off('play', receiveMessage);
    }
  }, [role]); 

  function handlePlaySound() {
    socket.emit('play', { name: 'Test sound1', path: audioFile })
  }

  function handleSubmit(e) {
    e.preventDefault();

   const response = api.post('/audio', {
     text
   });


  };



  return (
    <div className="App">
        <form onSubmit={handleSubmit}>
          <textarea 
            name="" 
            id="" 
            cols="30" 
            rows="10"
            value={text}
            onChange={e => setText(e.target.value)}>
          </textarea>
          <button type="submit">Reproduzir</button>
        </form>

   
          <audio id="teste" controls autoload="true">
            <source src="http://localhost:3333/audio" type="audio/ogg"/>
          </audio>

    <div>
    <h4>Role</h4>
        <button onClick={() => setRole("client")}>Client</button>
        <button onClick={() => setRole("server")}>Server</button>
        <button onClick={handlePlaySound}>Play Sound!</button>
        <h4>Playing</h4>
    </div>
        
    </div>
  );
}

export default App;
