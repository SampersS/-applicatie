const dotenv = require("dotenv")
const mysql = require("mysql")

let configConnect = (returnCode) => {
    dotenv.config();
    const dbhost = process.env.DB_HOST;
    const dbuser = process.env.DB_USER;
    const dbpass = process.env.DB_PASS;
    const database = process.env.DB_DTBS;

    let connection = mysql.createConnection({
        host: dbhost,
        user: dbuser,
        password: dbpass,
        database: database
    });
    connection.connect(error => {
        if(error){
            console.log("error: Unable to connect to database.",error.message)
        }else{
            console.log("Verbonden met succes.")
            returnCode(connection)
        }
    });
}

const ServerGenerate50Questions = (req, res,group,tabel,mode,callback) => {
  configConnect(function(connection){
        const queryry = "SELECT *, (TIMESTAMPDIFF(HOUR, ??,NOW())*(4+??)) as berekening FROM ?? where groep_id=? order by berekening desc limit 50;"
        console.log(queryry)
        connection.query(queryry, ["l_opvraag_naar_"+mode,"foutwaarde_naar_"+mode, tabel,group], (err, data) => {
        if(err){
            res.set({
                "CacheControl":"no-cache",
                "Pragma":"no-cache",
                "Expires":"-1"
              }).status(404).send({error:'sou da warui no jibun janai'})
            console.log("er was een error")
        }else{
            //console.log('the query answer is: ', data);
            res.set({
                "CacheControl":"no-cache",
                "Pragma":"no-cache",
                "Expires":"-1"
              }).status(200).send("{\"lengte\":"+data.length+"}");
        }
        connection.end()
        callback(data)
    });})
}

const QuestionReturn = (req, res,id,tabel,mode,fwaarde) => {
    configConnect(function(connection){
        const queryry = "update ?? Set ??=now(), ?? = ? where ?? = ?";
        console.log(queryry)
        connection.query(queryry, [tabel,"l_opvraag_naar_"+mode,"foutwaarde_naar_"+mode, fwaarde,"id"+tabel, id], (err, data) => {
            if(err){
                res.status(404).send({error:'sou da warui no jibun janai'})
                console.log("er was een error")
            }else{
                //console.log('the query answer is: ', data);
                res.status(200).send("ok");
            }
        });
        connection.end()
    })
}

const PostWoord = (req, res,groepid,uitspraak,kanji,betekenis,notitie) => {
    configConnect(function(connection){
        const queryry = "insert into woordenschat_tabel values(null, ?,?,?,?,DATE_SUB(now(), INTERVAL 24 HOUR),255,DATE_SUB(now(),INTERVAL 24 HOUR),255,?)"
        console.log(queryry)
        connection.query(queryry,[groepid, uitspraak, kanji, betekenis, notitie], (err, data) => {
            if(err){
                res.status(404).send({error:'sou da warui no jibun janai'})
                console.log("er was een error")
            }else{
                //console.log('the query answer is: ', data);
                res.status(200).send("ok");
            }
        });
        connection.end()
    })
}
const PostKanji = (req, res,groep_id,uitspraakvb, betekenis,chara,img,notitie) => {
    configConnect(function(connection){
        const queryry = "insert into charakter_tabel values(null, ?,?,?,?,?,DATE_SUB(now(), INTERVAL 24 HOUR),255,DATE_SUB(now(),INTERVAL 24 HOUR),255,?)"
        console.log(queryry)
        connection.query(queryry,[groep_id, uitspraakvb, betekenis, chara, img, notitie], (err, data) => {
            if(err){
                res.status(404).send({error:'sou da warui no jibun janai'})
                console.log("er was een error")
            }else{
                //console.log('the query answer is: ', data);
                res.status(200).send("ok");
            }
        });
        connection.end()
    })
}
const RemoveWord = (req, res, id) => {
    configConnect(function(connection){
        const queryry = "delete from `woordenschat_tabel` where idwoordenschat_tabel=? limit 1"
        console.log(queryry)
        connection.query(queryry, [id],(err, data) => {
            if(err){
                res.status(404).send({error:'sou da warui no jibun janai'})
                console.log("er was een error")
            }else{
                //console.log('the query answer is: ', data);
                res.status(200).send("ok");
            }
        });
        connection.end()
    })
}
const RemoveKanji = (req, res, id) => {
    configConnect(function(connection){
        const queryry = "delete from charakter_tabel where idcharakter_tabel=? limit 1"
        console.log(queryry)
        connection.query(queryry,[id], (err, data) => {
            if(err){
                res.status(404).send({error:'sou da warui no jibun janai'})
                console.log("er was een error")
            }else{
                //console.log('the query answer is: ', data);
                res.status(200).send("ok");
            }
        });
        connection.end()
    })
}
const GetGroups = (req, res) => {
    configConnect(function(connection){
        const queryry = "select * from groep_namen"
        console.log(queryry)
        connection.query(queryry, (err, data) => {
            if(err){
                res.set({
                    "CacheControl":"no-cache",
                    "Pragma":"no-cache",
                    "Expires":"-1"
                  }).status(404).send({error:'sou da warui no jibun janai'})
                console.log("er was een error", err)
            }else{
                //console.log('the query answer is: ', data);
                res.set({
                    "CacheControl":"no-cache",
                    "Pragma":"no-cache",
                    "Expires":"-1"
                  }).status(200).send(data);
            }
        });
        connection.end()
    })
}
const AddGroup = (req, res,naam) => {
    configConnect(function(connection){
        const queryry = "insert into groep_namen values(null,?)"
        connection.query(queryry,[naam], (err, data) => {
            if(err){
                res.status(404).send({error:'sou da warui no jibun janai'})
                console.log("er was een error")
            }else{
                //console.log('the query answer is: ', data);
                res.status(200).send("ok");
            }
        });
        connection.end()
    })
}
const DeleteGroup = (req, res,id) => {
    configConnect(function(connection){
        const queryry = "delete from groep_namen where idgroep_namen=?"
        connection.query(queryry,[id], (err, data) => {
            if(err){
                res.status(404).send({error:'sou da warui no jibun janai'})
                console.log("er was een error")
            }else{
                //console.log('the query answer is: ', data);
                res.status(200).send("ok");
            }
        });
        connection.end()
    })
}
const GetAllEntries = (req, res,tableName) => {
    configConnect(function(connection){
        const queryry = "select * from ??"
        connection.query(queryry,[tableName], (err, data) => {
            if(err){
                res.set({
                    "CacheControl":"no-cache",
                    "Pragma":"no-cache",
                    "Expires":"-1"
                  }).status(404).send({error:'sou da warui no jibun janai'})
                console.log("er was een error")
            }else{
                //console.log('the query answer is: ', data);
                res.set({
                    "CacheControl":"no-cache",
                    "Pragma":"no-cache",
                    "Expires":"-1"
                  }).status(200).send(data);
            }
        });
        connection.end()
    })
}
const GetSameVocab = (req, res, uitspraak) => {
    configConnect(function(connection){
        const queryry = "select * from woordenschat_tabel where romaji_uitspraak=?"
        connection.query(queryry,[uitspraak], (err, data) => {
            if(err){
                res.set({
                    "CacheControl":"no-cache",
                    "Pragma":"no-cache",
                    "Expires":"-1"
                  }).status(404).send({error:'sou da warui no jibun janai'})
                console.log(err.message)
            }else{
                //console.log('the query answer is: ', data);
                res.set({
                    "CacheControl":"no-cache",
                    "Pragma":"no-cache",
                    "Expires":"-1"
                  }).status(200).send(data);
            }
        });
        connection.end()
    })
}
module.exports = {ServerGenerate50Questions, QuestionReturn,PostWoord, PostKanji, GetGroups, AddGroup, DeleteGroup, RemoveKanji, RemoveWord, GetAllEntries, GetSameVocab}