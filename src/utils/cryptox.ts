import CryptoJS from 'crypto-js';

import config from '../config';

const { iv, secret } = config.server.aes;


export function aesEncrypt(content: string) {
    const parsedkey = CryptoJS.enc.Utf8.parse(secret!);
    const parsedIv = CryptoJS.enc.Utf8.parse(iv!);
    const encrypted = CryptoJS.AES.encrypt(content, parsedkey, { iv: parsedIv, mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });

    return encrypted.toString();
}

export function aesDecrypt(encrypted: string) {
    const keys = CryptoJS.enc.Utf8.parse(secret!);
    const base64 = CryptoJS.enc.Base64.parse(encrypted);
    const src = CryptoJS.enc.Base64.stringify(base64);
    const decrypt = CryptoJS.AES.decrypt(src, keys, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });

    return decrypt.toString(CryptoJS.enc.Utf8);
}