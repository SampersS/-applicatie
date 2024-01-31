const express = require("express")
const port = 80
const databasehelper = require("./db")
const util = require("util")
const fileHelper = require("./fileHelper.js")
const cors = require("cors")
const auth = require("./autenticatie.js")
const routines = require("./routines.js")
const dotenv = require("dotenv")

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
app.post("/backend/generate100/:groupid/:kanjidb/:mode", (req, res) => { //#
  if(auth.Validate(req,res,req.body,req.params.groupid + req.params.kanjidb + req.params.mode)){
    VraagendIP = auth.getIP(req);
    databasehelper.ServerGenerate100Questions(req, res, req.params["groupid"], req.params["kanjidb"], req.params["mode"])
  }
})
app.post("/backend/returnResult/:db/:mode/*", (req, res) => { //#
  if(auth.Validate(req,res,routines.extracUrlPart(req.originalUrl,5),req.params.db + req.params.mode)){
    databasehelper.QuestionReturn(req, res, req.params.db,req.params.mode)
  }
})
app.post("/backend/postWoord/:groepid/:uitspraak/:kanji/:betekenis/:notitie", (req, res) => { //#
    if(auth.Validate(req,res,req.body,req.params.groepid + req.params.uitspraak + req.params.kanji + req.params.betekenis + req.params.notitie)){
      databasehelper.PostWoord(req, res, req.params.groepid,req.params.uitspraak,req.params.kanji,req.params.betekenis,req.params.notitie)
    }
})
app.post("/backend/postKanji/:groepid/:uitspraak/:betekenis/:kanji/:img/:notitie", (req, res) => { //#
  if(auth.Validate(req,res,req.body,req.params.groepid + req.params.uitspraak + req.params.betekenis + req.params.kanji + req.params.img + req.params.notitie)){
    databasehelper.PostKanji(req, res, req.params.groepid,req.params.uitspraak,req.params.betekenis,req.params.kanji,req.params.img,req.params.notitie)
  }
})
app.post("/backend/getGroups",(req,res)=>{
  databasehelper.GetGroups(req,res)
})
app.post("/backend/addGroup/:name",(req,res)=>{ //#
  if(auth.Validate(req,res,req.body,req.params.name)){
    databasehelper.AddGroup(req,res,req.params.name)
  }
})
app.delete("/backend/deleteGroup/:id",(req,res)=>{ //#
  if(auth.Validate(req,res,req.body,req.params.id)){
    databasehelper.DeleteGroup(req,res,req.params.id)
  }
})
app.delete("/backend/deleteWoord/:id",(req,res)=>{ //#
  if(auth.Validate(req,res,req.body,req.params.id)){
    databasehelper.RemoveWord(req,res,req.params.id)
  }
})
app.delete("/backend/deleteKanji/:id",(req,res)=>{ //#
  if(auth.Validate(req,res,req.body,req.params.id)){
    databasehelper.RemoveKanji(req,res,req.params.id)
  }
})
app.post("/backend/getEntries/:table",(req,res)=>{ //#
  if(auth.Validate(req,res,req.body,req.params.table)){
    databasehelper.GetAllEntries(req,res,req.params.table)
  }
})
/* app.post("/backend/zelfdeUitspraak/:uitspraak",(req,res)=>{
  if(VraagendIP != auth.getIP(req)){
    res.sendStatus(401)
    return;
  }
  databasehelper.GetSameVocab(req,res,req.params.uitspraak)
}) */
app.post("/backend/KeyRandom",(req, res)=>{
  auth.GetRandomModulus(req,res)
})
app.post("/backendIMG/:size/*", async (req, res) => { //alleen hier rsa string in de url omdat body = image
  if(auth.Validate(req,res,routines.extracUrlPart(req.originalUrl,3),req.params.size)){
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
app.delete("/backendIMG/:id", (req, res) => { //#
  if(auth.Validate(req,res,req.body,req.params.id)){
    fileHelper.deleteFile(req,res)
  }
})
app.get("/html/*", (req, res) => {
   console.log(global.__dirname+"/html/"+routines.extracUrlPart(req.originalUrl,2).split('?')[0])
   res.sendFile(global.__dirname+"/html/"+routines.extracUrlPart(req.originalUrl,2).split('?')[0])
})
app.listen(port, () => {
  console.log(`Backend app listening on port ${port}`)
})
