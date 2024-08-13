const express = require("express")
const port = 443
const databasehelper = require("./db")
const util = require("util")
const fileHelper = require("./fileHelper.js")
const cors = require("cors")
const auth = require("./autenticatie.js")
const https = require("https")
const routines = require("./routines.js")
const dotenv = require("dotenv")
const fs = require('fs')

dotenv.config();
global.__dbhost = process.env.DB_HOST;
global.__dbuser = process.env.DB_USER;
global.__dbpass = process.env.DB_PASS;
global.__database = process.env.DB_DTBS;
global.__dirname = process.env.FILE_PATH;
global.__apipw = process.env.API_WACHTWOORD;

var VraagendIP

const app = express()
app.use(cors());
app.use(express.urlencoded({ extended: true,limit: "5mb"}));
app.use(express.text({ limit: "5mb" }))

app.post('/backend/', (req, res) => {
  res.set({
    "CacheControl":"no-cache",
    "Pragma":"no-cache",
    "Expires":"-1"
  }).send('Verbinding met de backend is werkend!')
  console.log("gotten")
})
app.post("/backend/generate100/:groupid/:kanjidb/:mode/:pw", (req, res) => { //#
  if(auth.Validate(req,res,req.params.pw)){
    VraagendIP = auth.getIP(req);
    databasehelper.ServerGenerate100Questions(req, res, req.params["groupid"], req.params["kanjidb"], req.params["mode"])
  }
})
app.post("/backend/returnResult/:db/:mode/:pw", (req, res) => { //#
  if(auth.Validate(req,res,req.params.pw)){
    databasehelper.QuestionReturn(req, res, req.params.db,req.params.mode)
  }
})
app.post("/backend/postWoord/:groepid/:uitspraak/:kanji/:betekenis/:notitie/:pw", (req, res) => { //#
    if(auth.Validate(req,res,req.params.pw)){
      databasehelper.PostWoord(req, res, req.params.groepid,req.params.uitspraak,req.params.kanji,req.params.betekenis,req.params.notitie)
    }
})
app.post("/backend/postKanji/:groepid/:uitspraak/:betekenis/:kanji/:img/:notitie/:pw", (req, res) => { //#
  if(auth.Validate(req,res,req.params.pw)){
    databasehelper.PostKanji(req, res, req.params.groepid,req.params.uitspraak,req.params.betekenis,req.params.kanji,req.params.img,req.params.notitie)
  }
})
app.post("/backend/getGroups",(req,res)=>{
  databasehelper.GetGroups(req,res)
})
app.post("/backend/addGroup/:name/:pw",(req,res)=>{ //#
  if(auth.Validate(req,res,req.params.pw)){
    databasehelper.AddGroup(req,res,req.params.name)
  }
})
app.delete("/backend/deleteGroup/:id/:pw",(req,res)=>{ //#
  if(auth.Validate(req,res,req.params.pw)){
    databasehelper.DeleteGroup(req,res,req.params.id)
  }
})
app.delete("/backend/deleteWoord/:id/:pw",(req,res)=>{ //#
  if(auth.Validate(req,res,req.params.pw)){
    databasehelper.RemoveWord(req,res,req.params.id)
  }
})
app.delete("/backend/deleteKanji/:id/:pw",(req,res)=>{ //#
  if(auth.Validate(req,res,req.params.pw)){
    databasehelper.RemoveKanji(req,res,req.params.id)
  }
})
app.post("/backend/getEntries/:table/:pw",(req,res)=>{ //#
  if(auth.Validate(req,res,req.params.pw)){
    databasehelper.GetAllEntries(req,res,req.params.table)
  }
})
app.post("/backend/getActivity/:beginDatum/:eindDatum/:sprong/:pw",(req, res)=>{
  if(auth.Validate(req,res,req.params.pw)){
    databasehelper.GetActivity(req,res,req.params.beginDatum,req.params.eindDatum,req.params.sprong)
  }
})
app.post("/backendIMG/:pw", async (req, res) => { //alleen hier rsa string in de url omdat body = image
  if(auth.Validate(req,res,req.params.pw)){
    try{
      await util.promisify(fileHelper.upload.single("file"))(req , res);
      if(req.file == undefined){
        return res.status(400).send({ message: "Please upload a file!"});
      }
      res.json({ message: "File uploaded successfully" });
    }catch(error){
      console.error(error)
      res.status(400).send("error met je bestand.")
    }
  }
});
app.get("/backendIMG/:id", (req, res) => {
  if(VraagendIP != auth.getIP(req)){
    res.send(401)
    return;
  }
  fileHelper.sendFile(req, res)
})
app.delete("/backendIMG/:id/:pw", (req, res) => { //#
  if(auth.Validate(req,res,req.params.pw)){
    fileHelper.deleteFile(req,res)
  }
})
app.get("/html/*", (req, res) => {
   let pad = global.__dirname+"/html/"+routines.extracUrlPart(req.originalUrl,2).split('?')[0]
   console.log(pad)
   if(!pad.includes("..")){
      res.sendFile(global.__dirname+"/html/"+routines.extracUrlPart(req.originalUrl,2).split('?')[0])
   }
})

var privateKey = fs.readFileSync( 'ssl/selfsigned.key' );
var certificate = fs.readFileSync( 'ssl/selfsigned.crt');
//sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ssl/selfsigned.key -out ssl/selfsigned.crt
https.createServer({
    key: privateKey,
    cert: certificate
}, app).listen(port);
console.log(`Backend app listening on port ${port}`)
