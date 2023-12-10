const dotenv = require("dotenv")
const mysql = require("mysql")

const ServerGenerate50Questions = (req, res,group,kanjidb,mode,callback) => {
    //db credentials import
    dotenv.config();
    const dbhost = process.env.DB_HOST;
    const dbuser = process.env.DB_USER;
    const dbpass = process.env.DB_PASS;
    const database = process.env.DB_DTBS;
    //create connection, with the database
    let tabel = ""
    if(kanjidb == "true"){
        tabel = "charakter_tabel"
    }else{
        tabel = "woordenschat_tabel"
    }
    const queryry = "SELECT *, (TIMESTAMPDIFF(HOUR, l_opvraag_naar_"+mode+",NOW())*(4+foutwaarde_naar_"+mode+")) as berekening FROM "+tabel+" where groep_id="+group+" order by berekening desc limit 50;"
    const connection = mysql.createConnection({
        host: dbhost,
        user: dbuser,
        password: dbpass,
        database: database
    });
    //verbinding open leggen
    connection.connect(error => {
        if(error){
            res.status(503).send({error: 'Unable to connect to database.'})
            return;
        }else{
            console.log("Verbonden met succes.")
        }
    });
    //sql querry uitvoeren
    console.log(queryry)
    connection.query(queryry, (err, data) => {
        if(err){
            res.status(404).send({error:'sou da warui no jibun janai'})
            console.log("er was een error")
        }else{
            //console.log('the query answer is: ', data);
            res.status(200).send("lengte:"+data.length);
        }
        return callback(data)
    });
    //verbinding beeindigen
    connection.end();
}

const QuestionReturn = (req, res,id,kanjidb,mode,fwaarde) => {
    //db credentials import
    dotenv.config();
    const dbhost = process.env.DB_HOST;
    const dbuser = process.env.DB_USER;
    const dbpass = process.env.DB_PASS;
    const database = process.env.DB_DTBS;
    //create connection, with the database
    let tabel = ""
    if(kanjidb == "true"){
        tabel = "charakter_tabel"
    }else{
        tabel = "woordenschat_tabel"
    }
    const queryry = "update "+tabel+" Set l_opvraag_naar_"+mode+" =now(), foutwaarde_naar_"+mode+" = "+ fwaarde +" where id"+tabel + " = "+id;
    const connection = mysql.createConnection({
        host: dbhost,
        user: dbuser,
        password: dbpass,
        database: database
    });
    //verbinding open leggen
    connection.connect(error => {
        if(error){
            res.status(503).send({error: 'Unable to connect to database.'})
            return;
        }else{
            console.log("Verbonden met succes.")
        }
    });
    //sql querry uitvoeren
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
    //verbinding beeindigen
    connection.end();
}

const PostWoord = (req, res,groepid,uitspraak,kanji,betekenis,notitie) => {
    //db credentials import
    dotenv.config();
    const dbhost = process.env.DB_HOST;
    const dbuser = process.env.DB_USER;
    const dbpass = process.env.DB_PASS;
    const database = process.env.DB_DTBS;
    //create connection, with the database
    const queryry = "insert into woordenschat_tabel values(null, "+groepid+",\""+uitspraak+"\", \""+kanji+"\", \""+betekenis+"\",DATE_SUB(now(), INTERVAL 24 HOUR),255,DATE_SUB(now(),INTERVAL 24 HOUR),255,\""+notitie+"\")"
    const connection = mysql.createConnection({
        host: dbhost,
        user: dbuser,
        password: dbpass,
        database: database
    });
    //verbinding open leggen
    connection.connect(error => {
        if(error){
            res.status(503).send({error: 'Unable to connect to database.'})
            return;
        }else{
            console.log("Verbonden met succes.")
        }
    });
    //sql querry uitvoeren
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
    //verbinding beeindigen
    connection.end();
}

const PostKanji = (req, res,groep_id,uitspraakvb, betekenis,chara,img,notitie) => {
    //db credentials import
    dotenv.config();
    const dbhost = process.env.DB_HOST;
    const dbuser = process.env.DB_USER;
    const dbpass = process.env.DB_PASS;
    const database = process.env.DB_DTBS;
    //create connection, with the database
    const queryry = "insert into charakter_tabel values(null, "+groep_id+",\""+uitspraakvb+"\", \""+betekenis+"\", \""+chara+"\",\""+img+"\",DATE_SUB(now(), INTERVAL 24 HOUR),255,DATE_SUB(now(),INTERVAL 24 HOUR),255,\""+notitie+"\")"
    const connection = mysql.createConnection({
        host: dbhost,
        user: dbuser,
        password: dbpass,
        database: database
    });
    //verbinding open leggen
    connection.connect(error => {
        if(error){
            res.status(503).send({error: 'Unable to connect to database.'})
            return;
        }else{
            console.log("Verbonden met succes.")
        }
    });
    //sql querry uitvoeren
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
    //verbinding beeindigen
    connection.end();
}
module.exports = {ServerGenerate50Questions, QuestionReturn,PostWoord, PostKanji}