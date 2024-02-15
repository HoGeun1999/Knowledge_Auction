import { collectionObject } from "./KnowledgeObject.js"
import { updateInventoryINFO } from "./Inventory.js"
let collectionTabObject = {}
const collectionBox = document.getElementById('collection')


function renderCollectionBox(){
    let url = 'http://localhost:3000/collectionList/'
    fetch(url)
    .then(function(response){
        return response.json()
    })
    .then(function(data){
        console.log(data)
        for(let i = 0; i < data.length; i++){
            const check = data[i].collectionName in collectionTabObject
            if(check === false){
                collectionTabObject[data[i].collectionName] = 1
                const collectionTab = document.createElement('div')
                const collectionClearButton = document.createElement('button')
                collectionClearButton.innerHTML = '완료 보상'
                collectionClearButton.className = 'rewardButton'
                collectionClearButton.addEventListener('click',onclickRewardButton(data[i].collectionId,collectionClearButton))
                if(data[i].rewardClear === 1){
                    collectionClearButton.disabled = true
                }
                // collectionClearButton.addEventListener('click',eval('onclickCollectionReward' + data[i].clearRewardId + '()'))
                collectionTab.className = 'collectionTab'
                collectionTab.innerHTML = data[i].collectionName
                collectionBox.appendChild(collectionTab)
                collectionTab.appendChild(collectionClearButton)
            }
            const item = document.createElement('div')
            item.dataset.name = data[i].name
            item.dataset.level = data[i].level
            if(data[i].getHistory === 0){
                item.className = 'collectionItem'
            }
            else{
                item.className = 'collectionClearItem'
            }
            item.innerHTML = data[i].name + '<br>' + data[i].level

            collectionBox.appendChild(item)
        }
    })
}

function checkColletion(data){
    let url = 'http://localhost:3000/collectionCheck/'
    fetch(url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ name: data.name, level: data.level }),
    })
    // .then(function(response){
    //     return response.json()
    // })

    const items = document.querySelectorAll(".collectionItem")
    for(let i = 0; i< items.length ; i++){
        if(items[i].dataset.name == data.name && items[i].dataset.level == data.level){
            items[i].className = 'collectionClearItem'
        }
    }
}


function onclickRewardButton(id,collectionClearButton){
    return() =>{
        eval('onclickCollectionReward' + id + '(collectionClearButton)')
    }
}


function onclickCollectionReward1(button){
    let url =  'http://localhost:3000/collectionReward/1'
    fetch(url)
    .then((response) => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(text)
            })

        }
        return response.json()
    })
    .then(
        (data) => {
            alert(data.result)
            button.disabled = true 
            updateInventoryINFO()

        },
        (error) => {
            alert(error)
        }
    )
   
}

function onclickCollectionReward2(){
    console.log(1002)
}

function onclickCollectionReward3(){
    console.log(1003)
}

export {renderCollectionBox, checkColletion}