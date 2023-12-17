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
            console.log("error: Unable to connect to database.")
        }else{
            console.log("Verbonden met succes.")
            returnCode(connection)
        }
    });
}

const ServerGenerate50Questions = (req, res,group,kanjidb,mode,callback) => {
    let tabel = ""
    if(kanjidb == "true"){
        tabel = "charakter_tabel"
    }else{
        tabel = "woordenschat_tabel"
    }
    
    configConnect(function(connection){
        const queryry = "SELECT *, (TIMESTAMPDIFF(HOUR, l_opvraag_naar_"+mode+",NOW())*(4+foutwaarde_naar_"+mode+")) as berekening FROM "+tabel+" where groep_id="+group+" order by berekening desc limit 50;"
        console.log(queryry)
        connection.query(queryry, (err, data) => {
        if(err){
            res.status(404).send({error:'sou da warui no jibun janai'})
            console.log("er was een error")
        }else{
            //console.log('the query answer is: ', data);
            res.status(200).send("lengte:"+data.length);
        }
        connection.end()
        return callback(data)
    });})
}

const QuestionReturn = (req, res,id,kanjidb,mode,fwaarde) => {
    let tabel = ""
    if(kanjidb == "true"){
        tabel = "charakter_tabel"
    }else{
        tabel = "woordenschat_tabel"
    }
    configConnect(function(connection){
        const queryry = "update "+tabel+" Set l_opvraag_naar_"+mode+" =now(), foutwaarde_naar_"+mode+" = "+ fwaarde +" where id"+tabel + " = "+id;
        console.log(queryry)
        connection.query(queryry, (err, data) => {
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
        const queryry = "insert into woordenschat_tabel values(null, "+groepid+",\""+uitspraak+"\", \""+kanji+"\", \""+betekenis+"\",DATE_SUB(now(), INTERVAL 24 HOUR),255,DATE_SUB(now(),INTERVAL 24 HOUR),255,\""+notitie+"\")"
        console.log(queryry)
        connection.query(queryry, (err, data) => {
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
        const queryry = "insert into charakter_tabel values(null, "+groep_id+",\""+uitspraakvb+"\", \""+betekenis+"\", \""+chara+"\",\""+img+"\",DATE_SUB(now(), INTERVAL 24 HOUR),255,DATE_SUB(now(),INTERVAL 24 HOUR),255,\""+notitie+"\")"
        console.log(queryry)
        connection.query(queryry, (err, data) => {
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
    const RemoveWord = (req, res, id) => {
        configConnect(function(connection){
            const queryry = "insert into charakter_tabel values(null, "+groep_id+",\""+uitspraakvb+"\", \""+betekenis+"\", \""+chara+"\",\""+img+"\",DATE_SUB(now(), INTERVAL 24 HOUR),255,DATE_SUB(now(),INTERVAL 24 HOUR),255,\""+notitie+"\")"
            console.log(queryry)
            connection.query(queryry, (err, data) => {
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
}
const RemoveKanji = (req, res, id) => {
    configConnect(function(connection){
        const queryry = "delete from charakter_tabel where idcharakter_tabel="+id+ " limit 1"
        console.log(queryry)
        connection.query(queryry, (err, data) => {
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
        const queryry = "delete from `woordenschat_tabel` where idwoordenschat_tabel="+id+ " limit 1"
        console.log(queryry)
        connection.query(queryry, (err, data) => {
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
const AddGroup = (req, res,naam) => {
    configConnect(function(connection){
        const queryry = "insert into groep_namen values(null,\""+naam+"\")"
        connection.query(queryry, (err, data) => {
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
        const queryry = "delete from groep_namen where idgroep_namen="+id
        connection.query(queryry, (err, data) => {
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
        const queryry = "select * from " + tableName
        connection.query(queryry, (err, data) => {
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
module.exports = {ServerGenerate50Questions, QuestionReturn,PostWoord, PostKanji, GetGroups, AddGroup, DeleteGroup, RemoveKanji, RemoveWord, GetAllEntries}