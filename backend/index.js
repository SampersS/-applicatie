const express = require("express")
const app = express()
const port = 3000

app.get('/backend/', (req, res) => {
  res.send('Verbinding met de backend is werkend!')
})

app.listen(port, () => {
  console.log(`Backend app listening on port ${port}`)
})