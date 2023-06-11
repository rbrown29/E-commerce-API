const crypto = require('crypto');


const hashString = (string) => {
    const hash = crypto.createHash('md5');
    hash.update(string);
    return hash.digest('hex');
}

module.exports = hashString;