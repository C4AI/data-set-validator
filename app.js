/////////////////////////////NODEJS-SERVER-SIDE//////////////////////////////////

//////////////////////////////IMPORTS////////////////////////////////////////////

const express = require('express');
const http = require('http');
const path = require("path");
const helmet = require('helmet');
const bodyParser = require('body-parser')
const app = express()
const server = http.createServer(app);
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, './public')));
app.use(helmet());

///////////////////////////////PORTA/////////////////////////////////////////////

const porta = process.env.PORT || "8082";
server.listen(porta, function () {
    console.log("Server listening on port:" + porta);
})

///////////////////////////////DATABASE//////////////////////////////////////////

const connectionString = 'postgresql://postgres:123456@localhost:5432/dataset-a'

const {Pool} = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

////////////////////////////////HOME//////////////////////////////////////////

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, './public/1-login.html'));
});

////////////////////////////////USER/////////////////////////////////////////////
app.get('/user', async (req, res) => {
    const client = await pool.connect();
    try {
        const {email, iduser} = req.query;
        const result = await client
            .query('SELECT * from user1 where email = $1 and iduser = $2',
                [email, iduser]);

        res.send(JSON.stringify(result));

    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    } finally {
        client.release();
    }
})

////////////////////////////////////////QA///////////////////////////////////////////////////////////////
//PÁGINA 1 //
app.get('/question-answer/validate/', async (req, res) => {
    const client = await pool.connect();
    try {
        const {iduser} = req.query;
        const query = `
            SELECT q.idqa,
                   a.title,
                   a.abstract,
                   q.questionen,
                   q.questionpt
            FROM questionanswer q
                     inner join article a on a.idarticle = q.idarticle
            WHERE NOT EXISTS(
                    SELECT idqa
                    FROM validate
                    where iduser = $1
                      AND iscomplete = FALSE
                )
              AND iduser != $1
              AND idqa NOT IN (
                SELECT idqa
                FROM validate
            )
            ORDER BY random()
            LIMIT 1;`;

        const result = await client
            .query(query,[iduser]);

        res.send(JSON.stringify(result));

    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    } finally {
        client.release();
    }})
////////////////////////////////////////VALIDATE///////////////////////////////////////////////////////////////
//PÁGINA 2 E 3//
app.get('/validate', async (req, res) => {
    const client = await pool.connect();
    try {
        const {iduser} = req.query;
        const query = `
            SELECT 
                   v.idvalidate,
                   v.idqa,
                   a.title,
                   a.abstract,

                   v.answeren as answerenv ,
                   v.answerpt as answerptv,
                   v.cannotuseranswer,
                   
                   v.questionen as questionenv,
                   v.questionpt as questionptv,
                   v.cannotuserparaphase,
                   
                   v.actualstep,
                   
                   q.questionen,
                   q.questionpt,
                   q.answeren,
                   q.answerpt
            FROM validate v
                     inner join questionanswer q on q.idqa = v.idqa
                     inner join article a on a.idarticle = q.idarticle
            WHERE v.iduser = $1
              AND v.iscomplete = FALSE
            
            LIMIT 1;`;

        const result = await client
            .query(query, [iduser]);

        res.send(JSON.stringify(result));

    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    } finally {
        client.release();
    }})

app.post('/validate', async (req, res) => {
    const client = await pool.connect();
    try {
        const {answeren, answerpt, cannotuseranswer, iduser, idqa} = req.body;
        const query1 = `
            INSERT INTO validate(date, answeren, answerpt, cannotuseranswer, iduser, idqa, iscomplete, actualstep)
            VALUES ((SELECT CURRENT_DATE), $1, $2, $3, $4, $5, FALSE, 1);`;

        const result = await client
            .query(query1,[answeren, answerpt, cannotuseranswer, iduser, idqa]);

        res.send(JSON.stringify(result));

    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    } finally {
        client.release();
    }})

app.put('/validate', async (req, res) => {
    const client = await pool.connect();
    try {
        const {
            idvalidate,
            iduser,
            idqa,
            answeren,
            answerpt,
            cannotuseranswer,
            istexttopic,
            makessenseq,
            makessensea,
            translationquality,
            canuseonlytextq,
            typeq,
            questionen,
            questionpt,
            cannotuserparaphase,
            actualstep,
            iscomplete
        } = req.body;
        const query1 = `
            INSERT INTO validate(
                                 date, idvalidate, iduser, idqa, answeren, answerpt, cannotuseranswer, istexttopic, makessenseq,
                                 makessensea, translationquality, canuseonlytextq, typeq,
                                 questionen,
                                 questionpt,
                                 cannotuserparaphase,
                                 actualstep,
                                 iscomplete
                                 )
            VALUES ((SELECT CURRENT_DATE), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
            ON CONFLICT (idvalidate) DO UPDATE SET (date,answeren, answerpt, cannotuseranswer, istexttopic, makessenseq,makessensea, 
                                                                  translationquality, canuseonlytextq, typeq,
                                                    questionen,
                                                    questionpt,
                                                    cannotuserparaphase,
                                                    actualstep,
                                                    iscomplete
                                                   )=
                
                                                 (
                                                  EXCLUDED.date,EXCLUDED.answeren,EXCLUDED.answerpt,EXCLUDED.cannotuseranswer,EXCLUDED.istexttopic,
                                                  EXCLUDED.makessenseq,EXCLUDED.makessensea,EXCLUDED.translationquality,EXCLUDED.canuseonlytextq,
                                                  EXCLUDED.typeq,
                                                  EXCLUDED.questionen,
                                                  EXCLUDED.questionpt,
                                                  EXCLUDED.cannotuserparaphase,
                                                  EXCLUDED.actualstep,
                                                  EXCLUDED.iscomplete
                                                 );`
        const result = await client
            .query(query1,[idvalidate, iduser, idqa, answeren, answerpt, cannotuseranswer, istexttopic, makessenseq,
                makessensea, translationquality, canuseonlytextq, typeq,
                questionen,
                questionpt,
                cannotuserparaphase,
                actualstep,
                iscomplete
            ]);

        res.send(JSON.stringify(result));

    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    } finally {
        client.release();
    }})

app.get('/validate/all', async (req, res) => {
    const client = await pool.connect();
    try {
        const {iduser} = req.query;
        const query = `
            SELECT v.idvalidate,
                   v.iduser,
                   q.questionen
            FROM validate v
                     inner join questionanswer q on q.idqa = v.idqa
            WHERE v.iduser = $1
              AND v.iscomplete = TRUE;`;

        const result = await client
            .query(query, [iduser]);

        res.send(JSON.stringify(result));

    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    } finally {
        client.release();
    }})

app.get('/validate/one', async (req, res) => {
    const client = await pool.connect();
    try {
        const {iduser, idvalidate} = req.query;
        const query = `
            SELECT v.idvalidate,
                   v.idqa,
                   a.title,
                   a.abstract,
                   
                   q.questionen,
                   q.questionpt,
                   q.answeren,
                   q.answerpt,
                   
                   v.answeren,
                   v.answerpt,
                   v.cannotuseranswer,
                   v.istexttopic,
                   v.makessenseq,
                   v.makessensea,
                   v.translationquality,
                   v.canuseonlytextq,
                   v.typeq

            FROM validate v
                     inner join questionanswer q on q.idqa = v.idqa
                     inner join article a on a.idarticle = q.idarticle
            
            WHERE v.iduser = $1
              AND v.idvalidate = $2
           
            LIMIT 1;`;

        const result = await client
            .query(query, [iduser, idvalidate]);

        res.send(JSON.stringify(result));

    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    } finally {
        client.release();
    }})

app.delete('/validate', async (req, res) => {
    const client = await pool.connect();
    try {
        const {iduser, idvalidate} = req.query;
        const query = `
            DELETE
            FROM validate
            WHERE iduser = $1
              and idvalidate = $2`;

        const result = await client
            .query(query,
                [iduser, idvalidate]);

        res.send(JSON.stringify(result));

    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    } finally {
        client.release();
    }})
