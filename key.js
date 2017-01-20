/**
 * Запрос ключа у инет-сервиса 
 * used: 
 *  let key = new SecretKey(firstName='Ivan', lastName='Petrov')
 *  key.on('key.done', () => console.log(key.result))
 */
 
const EventEmitter = require('events');
const querystring = require('querystring');
const { options }  = require('./lib');

class SecretKey extends EventEmitter {
    constructor(firstName = '', lastName = '') {
        super();
        this._firstName = firstName;
        this._lastName = lastName;
        this._secretKey = '?';
        this._go();
    }

    // закрыть канал
    close() {
        this.emit('close');
        this.removeAllListeners();
    }

    // секретный ключ
    set _key(key) {
        this._secretKey = key;
    }

    // тело запроса
    get _query() {
        return querystring.stringify({
            lastName: this._lastName
        });        
    }

    // длина (байт) тела запроса
    get _lengthQuery() {
        return Buffer.byteLength(this._query);
    }

    // результат клиенту
    get result() {
        return JSON.stringify({
            firstName: this._firstName, lastName:this._lastName, secretKey: this._secretKey
        });
    }

    // запрос ключа у инет-сервиса
    _go() {
        const http = require('http');
        const req = http.request(options);
        req.setHeader('Content-Length', this._lengthQuery);
        req.setHeader('Firstname', this._firstName);     // по условию задания
        //req.on('response', (q) => console.log(q.headers));
        req.on('response', (res) => this._onResponse(res));
        req.on('error', this._onError);         
        
        req.write(this._query);
        req.end();
    }

    // процесс получение результата
    _onResponse(response) {
        let data = '';
        response.on('data', chunk => data += chunk);
        response.on('end', () => this._done(data)); 
    }

    // процесс завершён. сигнал о том что всё готово 
    _done(data) {
        this._key = JSON.parse(data).hash;
        this.emit('key.done');
    }

    _onError(e) {
        if (e.errno === 'ECONNREFUSED') {
            console.log(`${e.errno}: Не могу соедениться с ${e.address}:${e.port}`);

        } else {
            console.log(e);
        }
    }
}

module.exports = {
   SecretKey
}