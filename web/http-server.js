const http = require('http');
const { existsSync, promises : fs }  = require('fs');
const { websockt } = require('./web-socket');
const GoogleDic = require('./google-dictionary');

const hostname = 'localhost';
const port = 3005;

const caches = {};
const paths = {
  english: '/Users/tliu1/workspace/English-Learning/google-meeting/english-learning.html',
  index: '/Users/tliu1/gethired/code/TM-FED/google-translate.html'
}

const getFile = async(key, cache, option) => {
  try {
    const path = paths[key] || `${__dirname}/${key}`;
    const content = await existsSync(path) ? fs.readFile(path, option) : 'path is not config';
    if (cache) {
      caches[key.replace(/[ \/\.]/g, '_')] = content;
    }
    return content;
  } catch (error) {
    throw(error);
  }
}

let ws;
(async() => {
  ws = await websockt();
})();

const wsSend = async (data) => {
  ws.send(data);
  return {};
}

const server = http.createServer((req, res) => {
  console.log('&&&&&&', req.url);
  res.setHeader('Access-Control-Allow-Origin', "*");
  const [path, search = '' ] = req.url.slice(1).split('?');
  if (req.method === 'POST') {
    var post = '';
    req.on('data', function(chunk){    
        post += chunk;
    });

    req.on('end', async() => {
        const data = JSON.parse(post);
        let response = {};
        if (path === 'translate') {
          response = await wsSend(data.content);
        }
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({status: 200, msg: 'ok', ...response}));
    });
    return;
  }
  const params = search.split('&').reduce((param, item) => {
    if (!item) return param;
    const [key, value] = item.split('=');
    param[key] = decodeURIComponent(value);
    return param;
  }, {});
  if (path === 'dictionary') {
    let { word, language = 'en', version = 'google' } = params;
    if (!word) {
      res.end(JSON.stringify({status: 200, msg: 'word is empty'}));
    }
    GoogleDic.dictionary(word.toLowerCase(), language).then((body) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Access-Control-Allow-Origin", "*");

      res.end(JSON.stringify(body));
    }).catch (error =>  {
       // return handleError.call(res, error);
    })
    return; 
  }
  getFile(path).then((data) => {
    const file = paths[path] || path;
    const MIME = req.headers['content-type'] ||
      file.endsWith('.html') ? 'text/html' :
      (file.endsWith('.js') || file.endsWith('.mjs')) ? 'application/javascript' :
      file.endsWith('.json') ? 'application/json' :
      file.endsWith('.jpeg') ? 'image/jpeg' :
      file.endsWith('.png') ? 'image/png' :
      file.endsWith('.mp3') ? 'audio/mpeg' :
      file.endsWith('.mp4') ? 'video/mp4' :
      file.endsWith('.jpg') ? 'image/jpg' :
      file.endsWith('.css') ? 'text/css' : 'text/plain';
    res.setHeader('Content-Type', MIME);
    res.statusCode = 200;
    res.end(data);
  }).catch((error) => {
    console.error('get files error:', error);
    res.writeHead(500);
    res.end(err);
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
