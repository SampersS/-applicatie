const express = require("express")
const app = express()
const port = 3000
const databasehelper = require("./db")
var Opvragingen
var arrayindex = 0;

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
app.delete("/backend/getEntries/:table",(req,res)=>{
  databasehelper.RemoveKanji(req,res,req.params.table)
})
app.listen(port, () => {
  console.log(`Backend app listening on port ${port}`)
})