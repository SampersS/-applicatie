const express = require("express")
const port = 3000
const databasehelper = require("./db")
const util = require("util")
const fileHelper = require("./fileHelper.js")
const cors = require("cors")
const auth = require("./autenticatie.js")
const routines = require("./routines.js")

var Opvragingen
var VraagendIP
global.__dirname = process.cwd();

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
    databasehelper.ServerGenerate100Questions(req, res, req.params["groupid"], req.params["kanjidb"], req.params["mode"], function(data){
      Opvragingen = data
      VraagendIP = auth.getIP(req);
    })
  }
})
app.post("/backend/getQuestion", (req, res) => {
  if(Opvragingen == []){
    res.set({
      "CacheControl":"no-cache",
      "Pragma":"no-cache",
      "Expires":"-1"
    }).json({error: "geen vragen gegenereerd"})
    console.log(Opvragingen)
    return;
  }
  if(VraagendIP != auth.getIP(req)){
    res.set({
      "CacheControl":"no-cache",
      "Pragma":"no-cache",
      "Expires":"-1"
    }).json({error: "ander apparaat opvraging"})
    return;
  }
  let random = Math.floor(Math.random() * Opvragingen.length)
  res.set({
    "CacheControl":"no-cache",
    "Pragma":"no-cache",
    "Expires":"-1"
  }).send(Opvragingen[random])
  Opvragingen.splice(random,1)
})
app.put("/backend/returnResult/:id/:db/:mode/:fout", (req, res) => { //#
  if(auth.Validate(req,res,req.body,req.params.id + req.params.db + req.params.mode + req.params.fout)){
    databasehelper.QuestionReturn(req, res, req.params.id,req.params.db,req.params.mode,req.params.fout)
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
app.post("/backend/zelfdeUitspraak/:uitspraak",(req,res)=>{
  if(VraagendIP != auth.getIP(req)){
    res.sendStatus(401)
    return;
  }
  databasehelper.GetSameVocab(req,res,req.params.uitspraak)
})
app.post("/backend/KeyRandom",(req, res)=>{
  auth.GetRandomModulus(req,res)
})
app.post("/backendIMG/:size/*", async (req, res) => { //alleen hier rsa string in de url omdat body = image
  if(auth.Validate(req,res,routines.extracUrlPart(req.originalUrl,3),req.params.size)){
    try{
      global.__size = req.params.size;
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
app.listen(port, () => {
  console.log(`Backend app listening on port ${port}`)
})