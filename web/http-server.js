const http = require('http');
const { promises : fsAsync, ...fs }  = require('fs');
// const { websockt } = require('./web-socket');
const GoogleDic = require('./google-dictionary');

const hostname = 'localhost';
const port = 3005;

const caches = {};
const paths = {
  english: `${__dirname}/english-learning.html`,
  index: `${__dirname}/google-translate.html`,
}

const getFileStat = async(path) => {
  try {
    return fsAsync.stat(path);
  } catch (error) {
    throw(error);
  }
}

const getPath = (path = '') => {
  if (fs.existsSync(path)) {
    return path;
  }
  throw new Error(`path is not config, path: ${path}`);
}

const parseUrl = (url = '') => {
  const [route, search = '' ] = url.slice(1).split('?');
  const path = fs.existsSync(url) ? url : (paths[route] || `${__dirname}${url}`);
  return {
    url,
    route,
    path,
    params: search.split('&').reduce((param, item) => {
      if (!item) return param;
      const [key, value] = item.split('=');
      param[key] = decodeURIComponent(value);
      return param;
    }, {}),
  }
}

const getFile = async(path, option, cache) => {
  try {
    path = getPath(path);
    const key = path.replace(/[ \/\.]/g, '_');
    if (cache && caches[key]) {
      return caches[key];
    }
    const content = await fsAsync.readFile(path, option);
    if (cache) {
      caches[key] = content;
    }
    return content;
  } catch (error) {
    throw(error);
  }
}

// let ws;
// (async() => {
//   ws = await websockt();
// })();

const wsSend = async (data) => {
  ws.send(data);
  return {};
}

const handleMedia = async (req, res) => {
  try {
    const path = getPath(parseUrl(req.url).path);
    const stat = await getFileStat(path);
    const MIME =  req.headers['content-type'] || path.endsWith('.mp4') ? 'video/mp4' : 'audio/mpeg';

    // Parse the range header
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
      const chunksize = (end - start) + 1;

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': MIME,
      });
      const readStream = fs.createReadStream(path, { start, end });
      readStream.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': stat.size,
        'Content-Type': MIME
      });
      const readStream = fs.createReadStream(path);
      readStream.pipe(res);
    }
  } catch (error) {
    res.writeHead(500);
    res.end(error.message);
  }
}

const server = http.createServer((req, res) => {
  // if (req.url.includes('favicon.ico')) return;
  res.setHeader('Access-Control-Allow-Origin', "*");
  const {path, params, route} = parseUrl(req.url);
  console.log('&&&&&&', req.url, path, route, params);
  if (req.method === 'POST') {
    var post = '';
    req.on('data', function(chunk){    
        post += chunk;
    });

    req.on('end', async() => {
        const data = JSON.parse(post);
        let response = {};
        if (route === 'translate') {
          response = await wsSend(data.content);
        }
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({status: 200, msg: 'ok', ...response}));
    });
    return;
  }
  
  if (route === 'dictionary') {
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
  // handle stream media
  if (path.endsWith('.mp4') || path.endsWith('.mp3')) {
    handleMedia(req, res);
    return;
  }
  getFile(path).then((data) => {
    const file = path;
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
    res.end(error.message);
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
