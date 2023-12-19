const express = require("express")
const port = 3000
const databasehelper = require("./db")
const util = require("util")
const fileHelper = require("./fileHelper.js")
const cors = require("cors")
var Opvragingen
var arrayindex = 0;
global.__dirname = process.cwd();

const app = express()
app.use(cors());
app.use(express.urlencoded({ extended: true}));

app.get('/backend/', (req, res) => {
  res.send('Verbinding met de backend is werkend!')
})
app.get("/backend/generate50/:groupid/:kanjidb/:mode", (req, res) => {
  Opvragingen = databasehelper.ServerGenerate50Questions(req, res, req.params["groupid"], req.params["kanjidb"], req.params["mode"], function(data){
    Opvragingen = data
    console.log(Opvragingen)
    arrayindex = 0
  })
})
app.get("/backend/getQuestion", (req, res) => {
  if(Opvragingen == [] || arrayindex == Opvragingen.length){
    res.send("error: geen vragen gegenereerd")
    console.log(Opvragingen)
    return;
  }
  res.send(Opvragingen[arrayindex])
  arrayindex++
})
app.put("/backend/returnResult/:id/:kanjidb/:mode/:fwaarde", (req, res) => {
  databasehelper.QuestionReturn(req, res, req.params.id,req.params.kanjidb,req.params.mode,req.params.fwaarde)
})
app.post("/backend/postWoord/:groepid/:uitspraak/:kanji/:betekenis/:notitie", (req, res) => {
  databasehelper.PostWoord(req, res, req.params.groepid,req.params.uitspraak,req.params.kanji,req.params.betekenis,req.params.notitie)
})
app.post("/backend/postKanji/:groepid/:uitspraak/:betekenis/:kanji/:img/:notitie", (req, res) => {
  databasehelper.PostKanji(req, res, req.params.groepid,req.params.uitspraak,req.params.betekenis,req.params.kanji,req.params.img,req.params.notitie)
})
app.get("/backend/getGroups",(req,res)=>{
  databasehelper.GetGroups(req,res)
})
app.post("/backend/addGroup/:name",(req,res)=>{
  databasehelper.AddGroup(req,res,req.params.name)
})
app.delete("/backend/deleteGroup/:id",(req,res)=>{
  databasehelper.DeleteGroup(req,res,req.params.id)
})
app.delete("/backend/deleteWoord/:id",(req,res)=>{
  databasehelper.RemoveWord(req,res,req.params.id)
})
app.delete("/backend/deleteKanji/:id",(req,res)=>{
  databasehelper.RemoveKanji(req,res,req.params.id)
})
app.get("/backend/getEntries/:table",(req,res)=>{
  databasehelper.GetAllEntries(req,res,req.params.table)
})
app.post("/dackendIMG", async (req, res) => {
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
});
app.get("/dackendIMG/:id", (req, res) => {
  fileHelper.sendFile(req, res)
})
app.delete("/dackendIMG/:id", (req, res) => {
  fileHelper.deleteFile(req,res)
})
app.listen(port, () => {
  console.log(`Backend app listening on port ${port}`)
})