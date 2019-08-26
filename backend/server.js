const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const axios = require('axios');
const util = require('util');
const fs = require('fs');
const cors = require('cors');



server.listen(3001, () => {
  console.log('Listening on *:3001');
});

app.use(cors());
app.use(express.json());



io.on('connection', (socket) => {
  console.log('connected');

 socket.on('play', playMsg => {
  io.emit('play', playMsg);
 });
});



app.post('/audio', (req, res) => {

  const text = req.body.text;

  axios({
    method: 'post',
    url: 'https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=AIzaSyDJy1dYOWP_PPf-peQMnNC3pHhVEg9JvUI',
    data: {
        "audioConfig": {
          "audioEncoding": "LINEAR16",
          "pitch": 0,
          "speakingRate": 1
        },
        "input": {
          "text": `${text}`
        },
        "voice": {
          "languageCode": "pt-BR",
          "name": "pt-BR-Standard-A"
        }
      }
  }).then((res) => {
    const writeFile = util.promisify(fs.writeFile);
    // console.log((res.data.audioContent).toString('base64'));
    writeFile('../src/output.ogg', res.data.audioContent, 'base64');
    console.log("siu");
    return false;
  })
    .catch(err => {
    console.log(err);
  });
});



