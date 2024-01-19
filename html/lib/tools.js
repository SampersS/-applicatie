var modulo = 0
var random = 0
const serverAddress = "http://127.0.0.1"
const apiAdditions = ":3000/backend/"
const apiIMGAdditions = ":3000/backendIMG/"
var rsa = new RSAKey();
function decimalToHex(d, padding) {
    var hex = Number(d).toString(16);
    while (hex.length < padding) {
        hex = "0" + hex;
    }
    return hex;
}
function generateCHS(input){
    let chsum = 0;
    input = String(input)
    for(let i = 0; i < input.length; i++){
        chsum += input.charCodeAt(i)
    }
    console.log("calculated chs:", chsum)
    return chsum;
}
function getMeta(){
    GetData(serverAddress+apiAdditions+"KeyRandom",function(data){
        modulo = data["modulo"];
        random = data["rand"]
        rsa.setPublic(modulo,"10001")
    })
}
const GetData = function(url, callback, auth){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callback(JSON.parse(xhttp.responseText))
        }
    };
    xhttp.open("GET", url, true);
    if(auth != undefined){
        xhttp.setRequestHeader("authorization",auth)
    }
    xhttp.send();
}
function cryptograaf(wachtwoord, chsMateriaal, matIsUrl){
    //matIsUrl: als het checksum materiaal in 1 string zit gescheden door '/'
    let cumMonster = ""
    if(matIsUrl){
        let strs = chsMateriaal.split('/')
        for(let i = 0; i < strs.length; i++){
            cumMonster += strs[i]
        }
    }else{
        cumMonster = chsMateriaal
    }
    return hex2b64(rsa.encrypt(decimalToHex(generateCHS(cumMonster),8)+decimalToHex(random++,8)+wachtwoord))
}