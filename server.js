/**
 *  Сервер на запрос клиента сам делает запрос к инет-сервису и возращает результат клиенту
 *  для проверки работы сервера:
 *  GET:  curl "http://localhost:3000/?firstName=Mark&lastName=Tomilo"
 *  POST: curl --data "firstName=Mark&lastName=Tomilo" "http://localhost:3000"
 *  POST: node client --firstName=Mark --lastName=Tomilo
 */

const querystring = require('querystring');
const http = require('http');
const { SecretKey } = require('./key');
const PORT = process.env.PORT || 3000;
const document_api = 'http://netology.tomilomark.ru/doc/#api-ND'

function parse(data, req) {
    const method = req.method;
    const type = req.headers['content-type'];

    switch (type) {
        case 'application/json':
            data = JSON.parse(data);
            break;
        case 'application/x-www-form-urlencoded':
            data = querystring.parse(data);    
            break;
        default:
            if (method === 'GET') {     // получили скорее всего из строки запроса браузера
                let param = req.url.replace('/', '').replace('?', '');
                data = querystring.parse(param);
            }
            break;
    }
    return data; 
}

function handler(req, res) {
    let data = '';

    if (req.url === '/favicon.ico') {
        res.writeHead(200, {'Content-Type': 'image/x-icon'} );
        res.end(' icon content here ');
    }
    else {   
        req.on('data', chunk => data += chunk);
        req.on('error', (e) => console.log(e));
        req.on('end', () => {
            data = parse(data, req);

            if (!(data.firstName && data.lastName)) {
                res.writeHead(400, 'ERREQUEST', {'Content-Type': 'text/json'}); 
                res.write(`{"message":"incorrect request, see: ${document_api}"}`);
                res.end();
                console.log(`incorrect request, see: ${document_api}`);
                return;                
            } 

            let key = new SecretKey(firstName=data.firstName, lastName=data.lastName);
            key.on('key.done', () => {
                console.log(key.result);
                res.writeHead(200, 'OK', {'Content-Type': 'text/json'});    // 'text/plain'
                res.write(key.result);
                res.end();
            });
        });
    }
}

const server = http.createServer();
server.on('error', err => console.error(err));
server.on('request', handler);
server.on('listening', () => {
    console.log('Start HTTP on port %d', PORT);
});
server.listen(PORT);
