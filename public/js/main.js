const deleteBtn = document.querySelectorAll('.fa-trash') //declare delete button variable for fa-trash class
const item = document.querySelectorAll('.item span') //declare item variable for item class and span 
const itemCompleted = document.querySelectorAll('.item span.completed') //declare completed item variable for all queries related to .item span.completed

Array.from(deleteBtn).forEach((element)=>{ //create array of all delete buttons and add event listener to delete button
    element.addEventListener('click', deleteItem) //add event listener to eat delete button
})

Array.from(item).forEach((element)=>{ //create array of all items and add event listener to item
    element.addEventListener('click', markComplete) //add click event listener to mark each item completed
})

Array.from(itemCompleted).forEach((element)=>{ //create array of all items and add event listener to itemCompleted
    element.addEventListener('click', markUnComplete) //add click event listener to mark each incomplete item
})

//async function tells method that this won't be a function and it'll be a loop. 
//async function is used to make a request that won't stop all other features/interactions on the webpage
async function deleteItem(){ //delete item from list
    const itemText = this.parentNode.childNodes[1].innerText //get item text from list item
    try{ //try to delete item
        //await until fetch request is complete. Function is to delete item from database then await a response 
        const response = await fetch('deleteItem', { //send text to server
            method: 'delete', //send delete request to server
            headers: {'Content-Type': 'application/json'}, //set content type to json
            body: JSON.stringify({ //send text to server
              'itemFromJS': itemText //send text to server
            })
          })
        const data = await response.json() //get response from server
        console.log(data) //console log data
        location.reload() //reload page

    }catch(err){ //log error if any
        console.log(err) //console log error
    }
}

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}