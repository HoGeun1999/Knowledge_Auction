import collectionObject from "./collectionObject.js"

const collectionBox = document.getElementById('collection')

function renderCollectionBox(){
    // for(let i=0; i<collectionObject.length;i++){
    //     const collectionTab = document.createElement('div')
    //     collectionTab.className = 'collectionTab'
    //     collectionTab.innerHTML = collectionObject[i].collectionName
    //     collectionBox.appendChild(collectionTab)
    //     for(let j=0; j<collectionObject[i].collectionList.length;j++){
    //         const item = document.createElement('div')
    //         let url = 'http://localhost:3000/item/' + collectionObject[i].collectionListId[j]
    //         console.log(url)
    //         fetch(url)
    //         .then(function(response){
    //             return response.json() 
    //         })
    //         .then(function(data){
    //             item.className = 'item'
    //             item.innerHTML = data[0].name + '<br>' + data[0].level
    //         })
    //         collectionBox.appendChild(item)
    //     }
    // } 
}



export {renderCollectionBox}