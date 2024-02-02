import {  upgradeState, renderEnforceBox, renderEditBox} from "./Upgrade.js"
import { makeRandomItem } from "./getItem.js"
import { dragged } from "./getItem.js"
let inventory = document.getElementById('inventory')
const enforceButton = document.getElementById('enforceTabButton')
const editButton = document.getElementById('editTabButton')

let isFull = 0
let leftFull = 0
let rightFull = 0

function renderItemINFO(item, data) {
    return function () {
        const itemInfoText = document.createElement('div')
        itemInfoText.innerHTML = '아이템 정보창' + '<br>' + '지식:' + data.name + '<br>' + '희귀도:' + data.rarity
        itemInfoText.id = 'itemInfo'
        let rect = item.getBoundingClientRect();
        itemInfoText.style.left = rect.x + 80;
        itemInfoText.style.top = rect.y + 10;
        item.appendChild(itemInfoText)
    }

}

function makeItem(data){
    const newItem = document.createElement('div')
    newItem.className = 'item'
    newItem.innerHTML = data[0].name + '<br>' + data[0].level
    newItem.dataset.inventoryId = data[1]

    return newItem
}

function moveItemToUpgrade(item,moveLocation){
    moveLocation.innerHTML = ''
    moveLocation.appendChild(item)
    enforceButton.disabled = true;
    editButton.disabled = true;  
}

function onClickItem(item,data) {
    return () => {
        const enforceBox = document.getElementById('enforceBox')
        const newItem = makeItem(data)
        if(upgradeState == 1 && isFull === 0){
            inventory.removeChild(item)
            newItem.addEventListener('click',onClickEnforceItem(data))
            moveItemToUpgrade(newItem,enforceBox)
            isFull = 1
        }
        else if (upgradeState == 2){
            const editBoxLeft = document.getElementById('editBoxLeft')
            const editBoxRight = document.getElementById('editBoxRight')
            if(leftFull === 0){
                inventory.removeChild(item)
                newItem.addEventListener('click',onClickEditItem(data,newItem))
                moveItemToUpgrade(newItem,editBoxLeft)
                leftFull = 1
            }
            else if(rightFull === 0){
                inventory.removeChild(item)
                newItem.addEventListener('click',onClickEditItem(data,newItem))
                moveItemToUpgrade(newItem,editBoxRight)
                rightFull = 1
            }
        }
    }
}

function onClickEnforceItem(data) {
    return () => {
        const inventory = document.getElementById('inventory')
        const newItem = makeItem(data)
        newItem.addEventListener('click',onClickItem(newItem,data))
        renderEnforceBox()
        inventory.appendChild(newItem)
        enforceButton.disabled = false;
        editButton.disabled = false;
        isFull = 0
    }
}

function onClickEditItem(data,item) {
    return () => {
        const inventory = document.getElementById('inventory')
        const editBox = item.parentNode;
        const newItem = makeItem(data)
        newItem.addEventListener('click',onClickItem(newItem,data))
        editBox.removeChild(item)
        inventory.appendChild(newItem)
        console.log(editBox)
        if(editBox.id == 'editBoxLeft')
            leftFull = 0
        if(editBox.id == 'editBoxRight')
            rightFull = 0
        // else if(rightFull === 1){
        //     const newItem = makeItem(data)
        //     newItem.addEventListener('click',onClickItem(newItem,data))
        //     editBox.removeChild(item)
        //     inventory.appendChild(newItem)
        //     rightFull = 0
        // }

        if(leftFull === 0 && rightFull === 0){
            enforceButton.disabled = false;
            editButton.disabled = false;
        }
    }
}

function renderInventoryBox() {


}


export { renderItemINFO, onClickItem, renderInventoryBox }