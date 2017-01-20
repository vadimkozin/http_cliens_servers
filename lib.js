// Параметры для запроса данных с сервера http://netology.tomilomark.ru/api/v1/hash
options = {
    hostname: 'netology.tomilomark.ru',
    port: 80,
    path: '/api/v1/hash', 
    method: 'POST', 
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded' 
    } 
}

/** 
 * Простая проверка введённых параметров в командной строке 
 * параметры ожидаются в длинной форме: --param1=value2 --param2=value2
 * @param {Array} param - массив параметров из ком.строки
 * @param {Object} abc  - объект с ожидаемыми параметрами (abc.param1=null, abc.param2=null, ..)
 * @return true|false - есть ли в param ожидаемые параметры и заполненный abc 
*/
 
function checkParam(param, abc) {
    for (let p of param) {
        let [key, val] = p.replace('--', '').split('=');
        if (key in abc) {
            abc[key] = val;
        }
    }

    for (let k in abc) {
        if (!abc[k]) {
            return false;
        }
    }
    return true;
}
module.exports = {
   options,
   checkParam
}
