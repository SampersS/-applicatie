const mysql = require("mysql")
let aantalKanji;
let aantalWoorden;

let configConnect = (returnCode) => {
    let connection = mysql.createConnection({
        host: global.__dbhost,
        user: global.__dbuser,
        password: global.__dbpass,
        database: global.__database,
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

const ServerGenerate100Questions = (req, res,group,tabel,mode) => {
    configConnect(function(connection){
        var queryry;
        if(tabel == "charakter_tabel"){
            queryry = "SELECT idcharakter_tabel as id, `uitspraak voorbeeld` as ui, betekenis as be , ckarakter as ck , img as im, notitie as no FROM ?? where ?? = -1 and groep_id=?"
        }else{
            queryry = "SELECT idwoordenschat_tabel as id, romaji_uitspraak as ro, kanji as ka, betekenis as be, notitie as no FROM ?? where ?? = -1 and groep_id=?"
        }
        console.log("generator...")
        connection.query(queryry, [tabel,"opvraag_index_naar_"+mode,group], (err, data) => {
        if(err){
            res.set({
                "CacheControl":"no-cache",
                "Pragma":"no-cache",
                "Expires":"-1"
              }).status(404).send({error:'error deatta'})
            console.log("er was een error")
            return;
        }else{
            //max 100 vragen zitten in data
            //array shuffelen
            let shuffeledArray = []
            while(data.length != 0){
                let random = Math.floor(Math.random() * data.length)
                shuffeledArray = shuffeledArray.concat(data[random])
                data.splice(random,1)
            }
            if(tabel=="woordenschat_tabel" && mode=="betekenis"){//als meerdere betekenissen per woord mogelijk zijn
                let teller = 0;
                shuffeledArray.forEach(function(value){
                    connection.query("Select betekenis from woordenschat_tabel where romaji_uitspraak=?",[value.ro],(err, data) => {
                        if(err){
                            console.log(err)
                            res.set({
                                "CacheControl":"no-cache",
                                "Pragma":"no-cache",
                                "Expires":"-1"
                            }).status(404).send({error:'error deatta'})
                            return;
                        }
                        if(data.length > 1){
                            value.sa = data
                        }
                        teller++;
                        if(teller == shuffeledArray.length){//code als alles klaar is
                            res.set({
                                "CacheControl":"no-cache",
                                "Pragma":"no-cache",
                                "Expires":"-1"
                            }).status(200).send(shuffeledArray);
                            connection.end()
                        }
                    })
                })
            }else{
                res.set({
                    "CacheControl":"no-cache",
                    "Pragma":"no-cache",
                    "Expires":"-1"
                }).status(200).send(shuffeledArray);
                connection.end()
            }
        }
    });})
}

const QuestionReturn = (req, res,tabel,mode) => {
    configConnect(async function(connection){
        var hoeveelheid = 0;
        const ca = "opvraag_index_naar_"+mode
        const cb = "aantal_fout_naar_"+mode
        const cc = "juist_streak_naar_"+mode
        var returndata = JSON.parse(req.body);
        for(let ind in returndata){
            console.log(returndata[ind])
            //doSomething().then((data)=>{console.log(data)})
            const data = await new Promise((resolve, reject) => {
                const select = "select *, groep_id as gid,(select MAX(??) from ?? where groep_id=gid) AS max_index,(select MIN(??) from ?? where ?? >0 and groep_id=gid) as min_index,(select MIN(??) from ?? where ?? !=-1 and groep_id=gid) as yokuTobasu from ?? where ??=?"
                let query = connection.query(select, [ca,tabel,ca,tabel,ca,ca,tabel,ca,tabel,"id"+tabel, ind], (err,data) => {
                    if(err) return reject(err);
                    resolve(data);
                });
            });
            let selected;
            let extraSQL = ""
            let extraParameters = []
            selected = data[0]
            if(selected[ca] != -1){continue}
            if(returndata[ind]=="fout"){
                selected[cb]++;
                selected[cc] = 0;
            }else{
                if(selected[cb]==0 || selected[cc]>0){
                    //complex vanaf hier
                    //nieuwe index selecteren
                    if(selected.min_index == null){selected.min_index = 0}
                    selected[ca] = Math.floor(Math.exp(-selected[cb]*0.5) * (selected.max_index-selected.min_index)+selected.min_index)+1
                    selected[cc] = 0
                    selected[cb] = 0
                    extraSQL = "update ?? set ??=-1 where ?? = ? and groep_id = ? limit 1"
                    if(selected.yokuTobasu == null){selected.yokuTobasu=0}
                    extraParameters = [tabel,ca,ca, selected.yokuTobasu, selected.groep_id]
                }else{
                    selected[cc]++
                }
            }
            console.log(data)
            const queryry = "update ?? Set ??=?, ??=?,??=? where ?? = ?;"+extraSQL;
            console.log(queryry)
            await new Promise((resolve, reject) => {
                let query = connection.query(queryry, [tabel,ca,selected[ca],cb,selected[cb],cc,selected[cc],"id"+tabel, ind].concat(extraParameters), (err,data) => {
                    if(err) return reject(err);
                    resolve(data);
                });
            });
            hoeveelheid++;
        }
        res.status(200).json({"ontvangen":hoeveelheid});
        connection.end()
    })
}

const PostWoord = (req, res,groepid,uitspraak,kanji,betekenis,notitie) => {
    configConnect(function(connection){
        let sql_cunt_2 = "Select (select count(*) from woordenschat_tabel where groep_id=? and opvraag_index_naar_uitspraak=-1) as nr1,(select count(*) from woordenschat_tabel where groep_id=? and opvraag_index_naar_betekenis=-1) as nr2"
        connection.query(sql_cunt_2,[groepid,groepid], (err, data) => {
            if(err){
                console.log(err)
                res.send("server crasht door jou!")
                connection.end()
                return
            }else{
                console.log(data)
                queryry = "insert into woordenschat_tabel values(null, ?,?,?,?,?,?,?,0,0,0,0)"
                connection.query(queryry,[groepid, uitspraak, kanji, betekenis, notitie, data[0].nr1<100?-1:0,data[0].nr2<100?-1:0], (err, data) => {
                    if(err){
                        res.status(500).send({error:'jou schuld'})
                        console.log(err)
                    }else{
                        //console.log('the query answer is: ', data);
                        res.status(200).send("ok");
                    }
                });
                connection.end()
            }
        });
    })
}
const PostKanji = (req, res,groep_id,uitspraakvb, betekenis,chara,img,notitie) => {
    configConnect(function(connection){
        let sql_cunt_2 = "Select (select count(*) from charakter_tabel where groep_id=? and opvraag_index_naar_teken=-1) as nr1,(select count(*) from charakter_tabel where groep_id=? and opvraag_index_naar_betekenis=-1) as nr2"
        connection.query(sql_cunt_2,[groep_id,groep_id], (err, data) => {
            console.log(data)
            if(err){
                console.log(err)
                res.send("server crasht door jou!")
                connection.end()
                return
            }else{
                let queryry = "insert into charakter_tabel values(null, ?,?,?,?,?,?,?,?,0,0,0,0)"
                connection.query(queryry,[groep_id, uitspraakvb, betekenis, chara, img,notitie, data[0].nr1>=100?0:-1,data[0].nr2>=100?0:-1], (err, data) => {
                    if(err){
                        res.status(500).send({error:'jou schuld'})
                        console.log(err)
                    }else{
                        //console.log('the query answer is: ', data);
                        res.status(200).send("ok");
                    }
                });
                connection.end()
            }
        });
        
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
