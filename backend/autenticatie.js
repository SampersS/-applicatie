const UPLOAD_MODE = false;
var requestsPerSecond = []
var seconde = 80085;

const Validate = function(req, res, swordpas){
    if(!UPLOAD_MODE){//brute force en ddos aanval verhelpen
        if(seconde != Date.now()){
            seconde = Date.now()
            requestsPerSecond = []
        }
        if(requestsPerSecond[getIP(req)]==undefined){
            requestsPerSecond[getIP(req)]=0
        }
        requestsPerSecond[getIP(req)]+= 1
        if(requestsPerSecond[getIP(req)] > 5){
            res.sendStatus(401)
            fs.appendFile("warnings.log","iemand met ip: "+getIP(req)+" probeert je server te hacken!!\n" , function(err){
                console.log(err)
            });
            return false;
        }
    }
    if(swordpas == global.__apipw){
        return true;
    }else{
        return false;
    }
}
const getIP = function(req){
    return req.headers['x-forwarded-for'] || req.socket.remoteAddress
}
module.exports = {Validate, getIP}
