const serverAddress = "https://localhost"
const apiAdditions = "/backend/"
const apiIMGAdditions = "/backendIMG/"

const GetDataPost = function(url, callback, skippw){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(xhttp.responseText)
            callback(JSON.parse(xhttp.responseText))
        }
    };
    if(skippw == undefined || skippw == false){
        xhttp.open("POST", url + "/" + getPassword(), true);  //Get in een xmlhttprequest kan geen body hebben
    }else{
        xhttp.open("POST", url, true);
    }
    xhttp.send();
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
