const http = require('http');
const fs = require('fs').promises;
const { websockt } = require('./websocket');

const hostname = 'localhost';
const port = 3005;

const caches = {};
const paths = {
  index: '/Users/tliu1/gethired/code/TM-FED/google-translate.html',
  checkr: '/Users/tliu1/dddd.js',
  schedule: '/Users/tliu1/gethired/code/GetHired/src/public/view/build/schedule.js',
  tm_bundle: '/Users/tliu1/gethired/code/TM-FED/resources/tm/js/bundle.js',
  custom: '/Users/tliu1/gethired/code/TM-FED/resources/css/custom_test.css',
  nugget: '/Users/tliu1/gethired/code/TM-FED/resources/tm/summernote/plugin/summernote-ext-nugget.js',
}

const getFile = async(key, cache, option) => {
  try {
    
    const content = await paths[key] ? fs.readFile(paths[key], option) : 'path is not config';
    console.log('=====',key);
    if (cache) {
      caches[key] = content;
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

const server = http.createServer((req, res) => {
  // console.log(req.headers, '======');
  // res.setHeader('Access-Control-Allow-Origin', "http://tyler.mobilebytes.com:4000")
  const path = req.url.split('/').filter((a) => a)[0];
  if (req.method === 'POST') {
    var post = '';     
    // 通过req的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
    req.on('data', function(chunk){    
        post += chunk;
    });
 
    // 在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
    req.on('end', function() {
        const data = JSON.parse(post);
        if (path === 'translate') {
            // console.log('---------', data);
            ws.send(data.content);
        }
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.end(JSON.stringify({status: 200, msg: 'ok'}));
    });
    return;
  }
  getFile(path).then((data) => {
    // res.setHeader('Content-Type', req.headers['content-type'] || 'text/plain');
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
