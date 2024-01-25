const dotenv = require("dotenv")
const mysql = require("mysql")
let aantalKanji;
let aantalWoorden;

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
        database: database,
        multipleStatements: true
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

const ServerGenerate100Questions = (req, res,group,tabel,mode,callback) => {
  configConnect(function(connection){
        const queryry = "SELECT * FROM ?? where ?? = -1 and groep_id=?"
        console.log(queryry)
        connection.query(queryry, [tabel,"opvraag_index_naar_"+mode,group], (err, data) => {
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

const QuestionReturn = (req, res,id,tabel,mode,fout) => {
    configConnect(function(connection){
        const ca = "opvraag_index_naar_"+mode
        const cb = "aantal_fout_naar_"+mode
        const cc = "juist_streak_naar_"+mode
        const select = "select *, MAX(??) AS max_index ,(select MIN(??) from ?? where ?? >0) as min_index,(select MIN(??) from ?? where ?? !=-1) as yokuTobasu from ?? where ??=?"
        connection.query(select, [ca,ca,tabel,ca,ca,tabel,ca,tabel,"id"+tabel, id], (err, data) => {
            let selected;
            let extraSQL = ""
            let extraParameters = []
            if(err){
                res.status(500)
                console.log(err.message)
            }else{
                selected = data[0]
                if(fout=="fout"){
                    selected[cb]++;
                    selected[cc] = 0;
                }else{
                    if(selected[cb]==0 || selected[cc]>0){
                        //complex vanaf hier
                        //nieuwe index selecteren
                        selected[ca] = Math.floor(Math.exp(-selected[cb]*0.5) * (selected.max_index-selected.min_index)+selected.min_index)+1
                        selected[cc] = 0
                        selected[cb] = 0
                        extraSQL = "update ?? set ??=-1 where ?? = ? limit 1"
                        if(selected.yokuTobasu == null){selected.yokuTobasu=0}
                        extraParameters = [tabel,ca,ca, selected.yokuTobasu]
                    }else{
                        selected[cc]++
                    }
                }
            }
            const queryry = "update ?? Set ??=?, ??=?,??=? where ?? = ?;"+extraSQL;
            console.log(queryry)
            connection.query(queryry, [tabel,ca,selected[ca],cb,selected[cb],cc,selected[cc],"id"+tabel, id].concat(extraParameters), (err, data) => {
                if(err){
                    res.status(404).send({error:'sou da warui no jibun janai'})
                    console.log(err)
                }else{
                    //console.log('the query answer is: ', data);
                    res.status(200).send("ok");
                }
            });
            connection.end()
        }); 
    })
}

const PostWoord = (req, res,groepid,uitspraak,kanji,betekenis,notitie) => {
    configConnect(function(connection){
        let queryry = ""
        if(aantalWoorden < 100){
            queryry = "insert into woordenschat_tabel values(null, ?,?,?,?,0,0,0,0,0,0,?)"
        }else{
            queryry = "insert into woordenschat_tabel values(null, ?,?,?,?,-1,-1,0,0,0,0,?)"
        }
        connection.query(queryry,[groepid, uitspraak, kanji, betekenis, notitie], (err, data) => {
            if(err){
                res.status(404).send({error:'sou da warui no jibun janai'})
                console.log("er was een error")
            }else{
                //console.log('the query answer is: ', data);
                res.status(200).send("ok");
                aantalWoorden++;
            }
        });
        connection.end()
    })
}
const PostKanji = (req, res,groep_id,uitspraakvb, betekenis,chara,img,notitie) => {
    configConnect(function(connection){
        let queryry = ""
        if(aantalWoorden < 100){
            queryry = "insert into charakter_tabel values(null, ?,?,?,?,?,0,0,0,0,0,0,?)"
        }else{
            queryry = "insert into charakter_tabel values(null, ?,?,?,?,?,-1,-1,0,0,0,0,?)"
        }
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
module.exports = {ServerGenerate100Questions, QuestionReturn,PostWoord, PostKanji, GetGroups, AddGroup, DeleteGroup, RemoveKanji, RemoveWord, GetAllEntries, GetSameVocab}

//huidig aantal woorden/kanji achterhalen
configConnect(function(connection){
    const queryry = "SELECT count(idwoordenschat_tabel) as cunt1 FROM woordenschat_tabel; Select count(idcharakter_tabel) as cunt2 from charakter_tabel"
    connection.query(queryry, (err, data) => {
    if(err){
        console.log(err)
    }else{
        aantalWoorden = data[0].cunt1
        aantalKanji = data[1].cunt2
    }
    connection.end()
});})