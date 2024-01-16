const fs = require('fs');
const crypto = require("crypto");
const dotenv = require("dotenv")

IpRandomPaaren = []
dotenv.config();
//openssl rsa -in key1024.pem -noout -modulus
var publicModulus = "ACDE30E5246E52539D5D7F2E55267C9EBC547C8D63C13382BA926572D2BC8A41FF924209057C2249D5FFAE95B7ED35F720CB9B167AC1284AE93374F36BDAB87A6F4D160168A533727799903A2065287B87A859F44A3BB271DDD9819A39AE9FABEF79D25C21BAA3E184048093FDA449F1B2D27653653F39822492254BD0D8D94708606E0004AB508AE0E150E3AFEA89E6C9AA11E7F2D1F7E64F7BB0C42B5383312536DC7EAAC9EAB406AB4C573E14E3EECC566816BD5F74DD4DE0B89FE3A7A80F921C384550EE4B88D3C9ACADA5614341C063EA844B8A22879BAD8A667C1AC5E311179E2374891A72DDF93EDCEA14BC0599498C0F79B4A6C5DE936B4354DDFE8F"
var publicModulus1024 = "D02971620E951B73CC605E5755EC513FECFC4775155310A8638FE8A0A0BD08D229D1914FE555AFAFC7B7D55B7E25BBF52C994E28211CDC5948062702B43C8B68E9BA17FA0BA5DDF869AD6C3F2D71D4CC98BD3DD6CBDB3B1D29A40445B4BA8C96E7E045500A98F7A1BF988A5DC9A44933FE304E0FEA2C9C2534F23F602D001BC1"
var privateKey = crypto.createPrivateKey({
    'key': fs.readFileSync("./key.pem"),
    'format': 'pem',
});
var privateKey1024 = crypto.createPrivateKey({
    'key': fs.readFileSync("./key1024.pem"),
    'format': 'pem',
});
const GetRandomModulus = function(req, res){
    IpRandomPaaren[req.socket.remoteAddress] = Math.floor(Math.random() * 4294967296); //random integer van 0 tot 0xffffffff
    res.json({"rand":IpRandomPaaren[req.socket.remoteAddress],"modulo":publicModulus})
}
const Validate = function(req, res, encryptedData, chstring){   //deencrypted: rand(8) checksum(8) password in decimaal uitgedrukte ()=hoeveel hexadecimale plaats innemen msb links
    let chsum = 0;
    for(let i = 0; i < chstring.length; i++){
      chsum += chstring.charCodeAt(i)
    }
    const decryptedData = crypto.privateDecrypt(
    {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
    }, Buffer.from(encryptedData, 'base64')).toString('utf8');
    let checksum = Number("0x"+decryptedData.substring(0,8))
    let rand = Number("0x"+decryptedData.substring(8,16))
    let swordpas = decryptedData.substring(16)
    console.log(checksum, rand, swordpas)
    if(checksum == chsum && rand == IpRandomPaaren[req.socket.remoteAddress] && swordpas == process.env.API_WACHTWOORD){
        IpRandomPaaren[req.socket.remoteAddress]++;
        if(IpRandomPaaren[req.socket.remoteAddress] > 4294967296){
            IpRandomPaaren[req.socket.remoteAddress] = 0
        }
        return true;
    }else{
        res.status(401).send("niet toegestaan")
        return false;
    }
}
module.exports = {GetRandomModulus, Validate}