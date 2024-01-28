var modulo = 0
var random = 0
const serverAddress = "http://178.117.121.6"
const apiAdditions = ":3000/backend/"
const apiIMGAdditions = ":3000/backendIMG/"
function decimalToHex(d, padding) {
    var hex = Number(d).toString(16);
    while (hex.length < padding) {
        hex = "0" + hex;
    }
    return hex;
}
function generateCHS(input){
    var chsum = 0;
    input = String(input)
    for(var i = 0; i < input.length; i++){
        chsum += input.charCodeAt(i)
    }
    console.log("calculated chs:", chsum)
    return chsum;
}
function getMeta(cb){
    GetData(serverAddress+apiAdditions+"KeyRandom",function(data){
        modulo = data["modulo"];
        random = data["rand"]
        if(cb!=undefined){
            cb()
        }
    })
}
const GetData = function(url, callback, auth){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(xhttp.responseText)
            callback(JSON.parse(xhttp.responseText))
        }
    };
    if(auth != undefined){
        url += "/"+auth
    }
    xhttp.open("GET", url, true);

    xhttp.send();
}
function cryptograaf(chsMateriaal, matIsUrl){
    //matIsUrl: als het checksum materiaal in 1 string zit gescheden door '/'
    var cumMonster = ""
    if(matIsUrl){
        var strs = chsMateriaal.split('/')
        for(var i = 0; i < strs.length; i++){
            cumMonster += strs[i]
        }
    }else{
        cumMonster = chsMateriaal
    }
    var rsa_obj = new RSAKey();
    console.log("handige stuff:", modulo,decimalToHex(generateCHS(cumMonster),8)+decimalToHex(random,8)+getPassword())
    rsa_obj.setPublic(modulo,"10001")
    return hex2b64(rsa_obj.encrypt(decimalToHex(generateCHS(cumMonster),8)+decimalToHex(random++,8)+getPassword()))
}
function PreparePassword(){
    if(!window.sessionStorage){
        var pwobject = document.getElementById("pwobj")
        if(pwobject != null){
            pwobject.display = pwobject.hidden = false
        }
    }
    else if(sessionStorage.getItem("pw")==null){
        window.location.href = "login.html"
    }
}
function getPassword(){
    if(!window.sessionStorage){
        return document.getElementById("txtPassword").value
    }else
    {
        return sessionStorage.getItem("pw")
    }
}
