const http = require('http');
const https =  require('https');

const request = (options) => {
    const controller = new AbortController();
    const signal = controller.signal;
    if (typeof options === 'string') {
        const [url, hostname, colon, port, path] = options.match(/(https?:\/\/.*)(:)(\d{3,6})(\/.*$)/);
        options = {hostname, path, port, method: 'GET'}
    }
    const promise = new Promise((resolve, reject) => {
        const {hostname, headers = {}, ...rest} = options;
        const requestAPI = hostname.includes('https') ? https.request : http.request;
        const req = requestAPI(
            {
                ...rest,
                signal,
                hostname: hostname.replace(/https?:\/\//, ''),
                // headers: {
                //     "Accept-Encoding": "gzip, deflate, br",
                //     "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                //     "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
                //     ...headers
                // }
            }, 
            (res) => {
            res.setEncoding('utf-8');
            let rawData = '';
            res.on('data', (chunk) => {
                rawData += chunk;
            });
            res.on('end', () => {
                try {
                    if (res.headers['content-type'].includes('application/json')){
                        resolve(JSON.parse(rawData));
                    }
                    resolve(rawData); 
                  } catch (e) {
                    console.error(e.message);
                    reject(e.message);
                  }
            });
        });
        req.on('error', (e) => {
            console.error(e);
            reject(e.message);
        });
        req.end();
    });
    promise.abortControlle = controller;
    return promise;
}

exports.request = request;

// httpsRequest('https://api.dictionaryapi.dev/api/v2/entries/en/apple');
// httpsRequest('https://www.bing.com/dict/search?q=apple');
