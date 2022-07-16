const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()


let db,
    // you'll need to update the database string in the .env file with your username/password
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'thoughts'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.get('/',(request, response)=>{
    db.collection('main').aggregate([{ $sample: { size: 1 } }])
    .toArray()
    .then(data => {
        response.render('index.ejs', { info: data })
    })
    .catch(error => console.error(error))

})

app.post('/addThought', (request, response) => {
    db.collection('thoughts.main').insertOne({thought: request.body.yourThought})
    .then(result => {
        console.log('Thought Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})