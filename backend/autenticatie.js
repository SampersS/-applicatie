const fs = require('fs');
const crypto = require("crypto");
const dotenv = require("dotenv")

var IpRandomPaaren = []
dotenv.config();
//openssl rsa -in key1024.pem -noout -modulus
var publicModulus = "A8A6949E7550D98C0C810BDC47BEE27603B5D7F087EAE317B9455AE06788E552330810046459163E90C206B84E56C38657FC154A072863B82BB4CE41EE33D47B02E1B89F100B48FA3E80D7DD41DFC430D75D3727F96DE138CC437A495F7ADEC60C3B2E8B47BBF050070D3F90C4BF9C32D675C9AC040FE5EFF2047BD9BA118A782AE9F39DA720FD69627AEF6A58248C5CF65F7C3B9609B8866B452120884FB9589ACFF0E59F81CA1B1D811B02F42024B0A6AED2A11EDAD64E49A9AF5A5D2FC4D2131757BE6BDB64BCF612EF25FBBEC1E121DCF55D34A4985B4E3D0A487D54B0CE63E81B0BAAD03F6E630EBA567DC4CCCEEC877AF4EDB7C8A0DDE890EFC9AF5E65"
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
    IpRandomPaaren[req.socket.remoteAddress] = Math.floor(Math.random() * 4294960296);
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
    if(checksum == chsum && rand == IpRandomPaaren[req.socket.remoteAddress] && swordpas == process.env.API_WACHTWOORD){
        IpRandomPaaren[req.socket.remoteAddress]++;
        if(IpRandomPaaren[req.socket.remoteAddress] > 4294967296){
            IpRandomPaaren[req.socket.remoteAddress] = 0
        }
        return true;
    }else{
        res.status(401).send("niet toegestaan")
        console.log(checksum,chsum, rand, IpRandomPaaren[req.socket.remoteAddress], swordpas ,process.env.API_WACHTWOORD)
        return false;
    }
}
module.exports = {GetRandomModulus, Validate}