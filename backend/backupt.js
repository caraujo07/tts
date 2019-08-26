const express = require('express');
const axios = require('axios');
const util = require('util');
const fs = require('fs');
const cors = require('cors');
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);


io.on('connection', () => {
  console.log('connected');
})

server.listen(3001);



const getStat = require('util').promisify(fs.stat);


app.use(cors());
app.use(express.json());


app.use(express.static('public'));

app.listen(3333, () => console.log('App na porta 3333'));


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
    writeFile('output.ogg', res.data.audioContent, 'base64');
  })
    .catch(err => {
    console.log(err);
  });
});




app.get('/audio', async (req, res) => {

  const filePath = './output.ogg';
  const stat = await getStat(filePath);
  console.log(stat);    
  
  // informações sobre o tipo do conteúdo e o tamanho do arquivo
  res.writeHead(200, {
      'Content-Type': 'audio/ogg',
      'Content-Length': stat.size
  });

  const stream = fs.createReadStream(filePath);

  // só exibe quando terminar de enviar tudo
  stream.on('end', () => console.log('acabou'));

  // faz streaming do audio 
  stream.pipe(res);
});




