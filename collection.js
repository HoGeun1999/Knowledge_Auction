import { collectionObject } from "./KnowledgeObject.js"

const collectionBox = document.getElementById('collection')

function renderCollectionBox(){
    for(let i=0; i<collectionObject.length;i++){
        const collectionTab = document.createElement('div')
        collectionTab.className = 'collectionTab'
        collectionTab.innerHTML = collectionObject[i].collectionName
        collectionBox.appendChild(collectionTab)
        for(let j=0; j<collectionObject[i].collectionList.length;j++){
            const item = document.createElement('div')
            const itemName = collectionObject[i].collectionList[j]
            const itemLevel = collectionObject[i].collectionLevel[j]
            let url = 'http://localhost:3000/collection/'
            fetch(url, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ name: itemName, level: itemLevel }),
            })
            .then(function(response){
                return response.json()
            })
            .then(function(data){
                item.className = 'item'
                item.classList.add('colletionItem')
                item.innerHTML = data[0].name + '<br>' + data[0].level
                item.dataset.itemId = data[0].id

            })
            collectionBox.appendChild(item)
        }
    } 
}


export {renderCollectionBox}