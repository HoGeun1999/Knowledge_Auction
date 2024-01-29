import { renderEnforceBox,renderEditBox, upgradeState } from "./Upgrade.js"
import {makeItem} from "./getItem.js"
import { dragged } from "./getItem.js"
let inventory = document.getElementById('inventory')

let isFull = 0
function renderItemINFO(item,data){
    return function(){
        const itemInfoText = document.createElement('div')
        itemInfoText.innerHTML = '아이템 정보창' + '<br>' + '지식:' + data.name + '<br>' + '희귀도:' + data.rarity
        itemInfoText.id = 'itemInfo'
        let rect = item.getBoundingClientRect();
        itemInfoText.style.left = rect.x + 80;
        itemInfoText.style.top = rect.y + 10;
        item.appendChild(itemInfoText)
    }
    
}

function onClickItem(item){
    // return function(){
    //     const enforceBox = document.getElementById('enforceBox')
    //     const upgradeBox = document.getElementById('upgrade')
    //     const inventory = document.getElementById('inventory')
    //     if(upgradeState == 1 && isFull == 0){
    //         inventory.removeChild(item)
    //         upgradeBox.removeChild(enforceBox)
    //         item.addEventListener('click',onClickEnforceItem(item))
    //         isFull = 1
    //         upgradeBox.appendChild(item)
    //     }
    //     else{
    //         isFull = 0
    //         inventory.appendChild(itme)
    //         renderEnforceBox()
    //     }
    // }

}

function onClickEnforceItem(item){

}

// function onClickItem(item){
//     return () => {
//         const enforceBox = document.getElementById('enforceBox')
//         const upgradeBox = document.getElementById('upgrade')
//         const inventory = document.getElementById('inventory')
//         // const newItem = document.createElement('div')
//         // newItem.className = 'item'
//         // newItem.innerText = data.name
//         // newItem.addEventListener('click',onClickEnforceItem(newItem,data))
//         if(upgradeState == 1 && isFull == 0){

//             inventory.removeChild(item)
//             upgradeBox.removeChild(enforceBox)
//             item.addEventListener('click',onClickEnforceItem(item))
//             upgradeBox.appendChild(item)

//         }
//         isFull = 1
//     }
// }

// function onClickEnforceItem(item,isFull){
//     isFull = 0
//     return () => {
//     const inventory = document.getElementById('inventory')
//     renderEnforceBox()
//     inventory.appendChild(item)
//     item.addEventListener('click',onClickItem(item))
//     }
// }



function renderInventoryBox(){
    inventory.addEventListener("dragover", (e) => {
        e.preventDefault();
    })
    inventory.addEventListener("drop",(e)=>{
        let lastLocation = dragged.parentNode
        e.preventDefault()
        e.target.classList.remove("dragging");
        dragged.parentNode.removeChild(dragged)
        e.target.appendChild(dragged)
        lastLocation.classList.remove('full') 
        console.log('why')
    })
}


export {renderItemINFO,onClickItem,renderInventoryBox}