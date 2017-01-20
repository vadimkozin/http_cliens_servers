// клиент для проверки POST-запросов к серверу: localhost:3000
// use: node client --firstName=Mark --lastName=Tomilo

const querystring = require('querystring');
const http = require('http');
const PORT = process.env.PORT || 3000;
const { basename } = require('path');
const { checkParam } = require('./lib');

const [ , prog, ...param ] = [ ...process.argv ];
const bname = basename(prog);

const help = `used:
    node ${bname} --firstName=... --lastName=...
example:
    node ${bname} --firstName=Ivan --lastName=Petrov
`;

const paramWait = {
    firstName: null,
    lastName: null
};

if (!checkParam(param, paramWait)) {
    console.log(help);
    process.exit(1);
}

const options = {
    hostname: '127.0.0.1',
    port: PORT,
    path: '/', 
    method: 'POST', 
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    } 
};

function onError(e) {
    console.log(e);
}

function done(data) {
    let user = JSON.parse(data);
    console.log(user);
}

function onResponse(response) {
    let data = '';
    response.on('data', (chunk) => data += chunk);
    response.on('end', () => done(data));
} 

const data = querystring.stringify(paramWait);

let request = http.request(options);
request.on('error', onError);
request.on('response', onResponse);
request.setHeader('Content-Length', Buffer.byteLength(data)); 
request.write(data);
request.end();
