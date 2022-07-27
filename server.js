const express = require('express') //import express; load express into node.js
const app = express() //create express app
const MongoClient = require('mongodb').MongoClient //import mongodb library
const PORT = 2121 //set PORT to 2121
require('dotenv').config()  //import dotenv


let db, //create db variable
    dbConnectionStr = process.env.DB_STRING, //set database connection string
    dbName = 'todo' //set database name to todo

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }) //connect to database
    .then(client => {  //if connected 
        console.log(`Connected to ${dbName} Database`) //console log database connection
        db = client.db(dbName) //set database to client database
    })
    
app.set('view engine', 'ejs') //tell app to set view engine to render ejs (embedded javascript)
app.use(express.static('public')) //tell app to set static public folder

//built-in middleare function in express to parse incoming requests with urlencoded payloads and is based on body parser
app.use(express.urlencoded({ extended: true })) //set body parser to parse from data
app.use(express.json()) //set body parser to parse json data


app.get('/',async (request, response)=>{  //get request to display using asynchronous function
    const todoItems = await db.collection('todos').find().toArray() //get all todo items from database
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //get number of incomplete items from database
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //render index.ejs with todo items and number of incomplete items
    // db.collection('todos').find().toArray() //create database with a list of todos and turn them into an array of objects
    // .then(data => {  //look at each todo collection and checks if they're completed or not.
    //     db.collection('todos').countDocuments({completed: false}) //counts number of documents that matches the incomplete todo list
    //     .then(itemsLeft => { //tell server to make a response
    //         response.render('index.ejs', { items: data, left: itemsLeft }) //render response to index.ejs and loop stuff through it
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => { //add item to database through addToDo
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //server goes into todos collection to insert one todoItem with completed status set to false.
    .then(result => { //result
        console.log('Todo Added') //console log todo added
        response.redirect('/') //refresh index.ejs to show new update to database
    })
    .catch(error => console.error(error)) //console log error when broken
})

app.put('/markComplete', (request, response) => { //when we click on something completed
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //go into todos collection by looking in body section of itemFromJS
        $set: {
            completed: true //add status of completed to true to item in todo collection
          }
    },{
        sort: {_id: -1}, //one thing has been marked uncompleted, this sorts array by descending order by id

        upsert: false //doesn't create document for todo if item isn't located
    })
    .then(result => { //
        console.log('Marked Complete') //console log marked complete
        response.json('Marked Complete') //return response of marked complete to fetch in main.js
    })
    .catch(error => console.error(error)) //console log error when broken

})

app.put('/markUnComplete', (request, response) => { //activate upon clicking something that was marked as completed
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //goes into collection and look for item from itemFromJS
        $set: { 
            completed: false, //undo markComplete. Completed status to false 
          }
    },{
        sort: {_id: -1}, // once something has been marked incomplete, this sorts the array by descending order by id
        upsert: false //doesn't create document for todo collection if item isn't located
    })
    .then(result => { //result
        console.log('Marked Complete') //console log marked complete
        response.json('Marked Complete') //return response of marked complete to fetch in main.js
    })
    .catch(error => console.error(error)) //console log error if broken

})

//database collects todos; request class itemfromJS from the body; get result then console log "todo deleted" then run json response
app.delete('/deleteItem', (request, response) => { //delete item
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //go into collection and use deleteOne method to find a thing that matches the name of clicked event listener
    .then(result => { // result
        console.log('Todo Deleted') //console log todo deleted
        response.json('Todo Deleted') //returns response to fetch in main.js
    })
    .catch(error => console.error(error)) //console log error if broken

})

app.listen(process.env.PORT || PORT, ()=>{ //tells server to listen for connections on PORT. PORT will tell server to listen on that port of the app. 
    console.log(`Server running on port ${PORT}`) //console log the server is running on port ${PORT}
})