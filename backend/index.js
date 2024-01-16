const express = require("express")
const port = 3000
const databasehelper = require("./db")
const util = require("util")
const fileHelper = require("./fileHelper.js")
const cors = require("cors")
const auth = require("./autenticatie.js")

var Opvragingen
var VraagendIP
var arrayindex = 0;
global.__dirname = process.cwd();

const app = express()
app.use(cors());
app.use(express.urlencoded({ extended: true}));
app.use(express.text())

app.get('/backend/', (req, res) => {
  res.set({
    "CacheControl":"no-cache",
    "Pragma":"no-cache",
    "Expires":"-1"
  }).send('Verbinding met de backend is werkend!')
  console.log("gotten")
})
app.get("/backend/generate50/:groupid/:kanjidb/:mode", (req, res) => { //#
  if(auth.Validate(req,res,req.body,req.params.groepid + req.params.kanjidb + req.params.mode)){
    databasehelper.ServerGenerate50Questions(req, res, req.params["groupid"], req.params["kanjidb"], req.params["mode"], function(data){
      Opvragingen = data
      VraagendIP = req.socket.remoteAddress;
      console.log(Opvragingen)
      arrayindex = 0
    })
  }
  
})
app.get("/backend/getQuestion", (req, res) => { //werk met een soort van allowed ip, het laatste ip die 50 had opgevraagd, anders krijgt een client berich om opnieuw 50 te genereren
  if(Opvragingen == [] || arrayindex == Opvragingen.length){
    res.set({
      "CacheControl":"no-cache",
      "Pragma":"no-cache",
      "Expires":"-1"
    }).send("error: geen vragen gegenereerd")
    console.log(Opvragingen)
    return;
  }
  if(VraagendIP != req.socket.remoteAddress){
    res.send("Genereer opnieuw")
    return;
  }
  res.set({
    "CacheControl":"no-cache",
    "Pragma":"no-cache",
    "Expires":"-1"
  }).send(Opvragingen[arrayindex])
  arrayindex++
})
app.put("/backend/returnResult/:id/:db/:mode/:fwaarde", (req, res) => { //#
  if(auth.Validate(req,res,req.body,req.params.id + req.params.uitspraak + req.params.mode + req.params.fwaarde)){
    databasehelper.QuestionReturn(req, res, req.params.id,req.params.db,req.params.mode,req.params.fwaarde)
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
app.get("/backend/getGroups",(req,res)=>{
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
app.get("/backend/getEntries/:table",(req,res)=>{ //#
  if(auth.Validate(req,res,req.body,req.params.table)){
    databasehelper.GetAllEntries(req,res,req.params.table)
  }
})
app.get("/backend/zelfdeUitspraak/:uitspraak",(req,res)=>{
  databasehelper.GetSameVocab(req,res,req.params.uitspraak)
})
app.get("/backend/KeyRandom",(req, res)=>{
  auth.GetRandomModulus(req,res)
})
app.post("/backendIMG/:size", async (req, res) => { //#
  console.log(req.body.authenticatie)
  if(auth.Validate(req,res,req.body.authenticatie,req.params.size)){
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
app.get("/backendIMG/:id", (req, res) => { //#
  if(auth.Validate(req,res,req.body,req.params.id)){
    fileHelper.sendFile(req, res)
  }
})
app.delete("/backendIMG/:id", (req, res) => { //#
  if(auth.Validate(req,res,req.body,req.params.id)){
    fileHelper.deleteFile(req,res)
  }
})
app.listen(port, () => {
  console.log(`Backend app listening on port ${port}`)
})