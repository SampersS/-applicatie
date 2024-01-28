const extracUrlPart = function(url, sss){
    let start = 0;
    for(let i = 0; i < sss; i++){
        start = url.indexOf("/",start)+1
    }
    return url.substring(start)
}

module.exports = {extracUrlPart}