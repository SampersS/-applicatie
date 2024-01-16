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