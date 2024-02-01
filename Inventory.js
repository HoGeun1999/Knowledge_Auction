import { renderEnforceBox, renderEditBox, upgradeState,enforceBoxList,editBoxList } from "./Upgrade.js"
import { makeItem } from "./getItem.js"
import { dragged } from "./getItem.js"
let inventory = document.getElementById('inventory')
let isFull = 0
export const inventoryItemList = []


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

function onClickItem(item,data) {
    return () => {
        const enforceBox = document.getElementById('enforceBox')
        const upgradeBox = document.getElementById('upgrade')
        const inventory = document.getElementById('inventory')
        console.log(isFull)
        if(upgradeState == 1 && isFull == 0){
            const newItem = document.createElement('div')
            inventory.removeChild(item)
            upgradeBox.removeChild(enforceBox)
            newItem.className = 'item'
            newItem.innerHTML = data[0].name + '<br>' + data[0].level
            newItem.dataset.inventoryId = data[1]
            newItem.addEventListener('click',onClickEnforceItem(data))
            upgradeBox.appendChild(newItem)
            isFull = 1
        }
        if(upgradeState == 2 && isFull == 0){
            console.log(1000)
        }
    }
}


function onClickEnforceItem(data) {
    return () => {
        const inventory = document.getElementById('inventory')
        const newItem = document.createElement('div')
        newItem.className = 'item'
        newItem.innerHTML = data[0].name + '<br>' + data[0].level
        newItem.dataset.inventoryId = data[1]
        newItem.addEventListener('click',onClickItem(newItem,data))
        renderEnforceBox()
        inventory.appendChild(newItem)
        isFull = 0
    }
}

function onClickEditItem(item) {
    return () => {
        const inventory = document.getElementById('inventory')
        renderEnforceBox()
        console.log(item.id)
        const newItem = makeItem(item.id)
        inventory.appendChild(newItem)
        console.log(isFull)
        isFull = 0
    }
}

function renderInventoryBox() {


}


export { renderItemINFO, onClickItem, renderInventoryBox }