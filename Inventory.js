import { upgradeState, renderEnforceBox } from "./Upgrade.js"
import { sellState, sellItemCount, updateSellCount, makeItemDiv, changeTabButton } from "./getItem.js"
import { fetchUserInventoryItems, fetchUserData } from "./api.js"

const inventory = document.getElementById('inventory')
const enforceButton = document.getElementById('enforceTabButton')
const editButton = document.getElementById('editTabButton')
let isFull = false
let leftFull = false
let rightFull = false

function setIsFull(state) {
    isFull = state
    enforceButton.disabled = false
    editButton.disabled = false
}

function setLeftRightFull(state) {
    leftFull = state
    rightFull = state
    enforceButton.disabled = false
    editButton.disabled = false
}

function renderItemINFO(item, itemData) {
    return function () {
        const itemINFOText = document.createElement('div')
        itemINFOText.id = 'itemINFO'
        itemINFOText.innerHTML = '아이템 정보창' + '<br>' + '지식:' + itemData.name + '<br>' + '희귀도:' + itemData.rarity + '<br>' + '가격:' + itemData.price
        let rect = item.getBoundingClientRect()
        itemINFOText.style.left = rect.x + 80
        itemINFOText.style.top = rect.y + 10
        item.appendChild(itemINFOText)
    }
}

function moveItemToUpgrade(item, moveLocation) {
    moveLocation.textContent = ''
    moveLocation.appendChild(item)
}

function onClickItem(item, data) {
    return () => {
        const sellBox = document.getElementById('sellBox')
        const enforceBox = document.getElementById('enforceBox')
        const newItem = makeItemDiv(data, item.dataset.inventoryId)
        if (sellState === true && sellItemCount === 0) {
            inventory.removeChild(item)
            newItem.addEventListener('click', onClickSellItem(data, newItem))
            sellBox.textContent = ''
            sellBox.appendChild(newItem)
            changeTabButton(true)
            updateSellCount(1)
            return
        }
        else if (sellState === true && sellItemCount != 0) {
            inventory.removeChild(item)
            newItem.addEventListener('click', onClickSellItem(data, newItem))
            sellBox.appendChild(newItem)
            updateSellCount(1)
            return
        }

        if (upgradeState === 'enforce' && data.level === 5) {
            alert('최고레벨입니다.')
            return
        }

        if (upgradeState === 'enforce' && isFull === false) { 
            inventory.removeChild(item)
            newItem.addEventListener('click', onClickEnforceItem(data, newItem))
            moveItemToUpgrade(newItem, enforceBox)
            changeTabButton(true)
            isFull = true
        }
        else if (upgradeState === 'edit') {
            const editBoxLeft = document.getElementById('editBoxLeft')
            const editBoxRight = document.getElementById('editBoxRight')
            if (leftFull === false) {
                inventory.removeChild(item)
                newItem.addEventListener('click', onClickEditItem(data, newItem))
                moveItemToUpgrade(newItem, editBoxLeft)
                leftFull = true
            }
            else if (rightFull === false) {
                inventory.removeChild(item)
                newItem.addEventListener('click', onClickEditItem(data, newItem))
                moveItemToUpgrade(newItem, editBoxRight)
                rightFull = true
            }
            changeTabButton(true)
        }
    }
}

function onClickEnforceItem(data, item) {
    return () => {
        const newItem = makeItemDiv(data, item.dataset.inventoryId)
        inventory.appendChild(newItem)
        isFull = false
        renderEnforceBox()
        changeTabButton(false)
    }
}

function onClickEditItem(data, item) {
    return () => {
        console.log(data,item)
        const editBox = item.parentNode
        const newItem = makeItemDiv(data, item.dataset.inventoryId)
        editBox.removeChild(item)
        editBox.textContent = '합성할 아이템을 선택하세요'
        inventory.appendChild(newItem)
        if (editBox.id === 'editBoxLeft') {
            leftFull = false
        }
        if (editBox.id === 'editBoxRight') {
            rightFull = false
        }
        if (leftFull === false && rightFull === false) {
            changeTabButton(false)
        }
    }
}

function onClickSellItem(data, item) {
    return () => {
        const newItem = makeItemDiv(data, item.dataset.inventoryId)
        sellBox.removeChild(item)
        inventory.appendChild(newItem)
        updateSellCount(-1)
        if (sellItemCount == 0) {
            sellBox.textContent = '판매할 아이템을 선택하세요'
            changeTabButton(false)
        }
    }
}

async function renderInventoryBox() {
    const userInventoryINFOwrap = document.createElement('div')
    userInventoryINFOwrap.id = 'userInventoryINFOwrap'
    const userInventoryINFO = document.createElement('div')
    userInventoryINFO.id = 'userInventoryINFO'
    updateInventoryINFO()
    userInventoryINFOwrap.appendChild(userInventoryINFO)
    inventory.appendChild(userInventoryINFOwrap)
    const inventoryItemsData = await fetchUserInventoryItems()
    for (let i = 0; i < inventoryItemsData.length; i++) {
        const inventoryItem = makeItemDiv(inventoryItemsData[i], inventoryItemsData[i].inventory_id)
        inventory.appendChild(inventoryItem)
    }
}

async function updateInventoryINFO() {
    const userData = await fetchUserData() 
    const userInventoryINFO = document.getElementById('userInventoryINFO')
    userInventoryINFO.textContent = `보유 금액: ${userData[0].holdings}, 일반티켓 : ${userData[0].normalTicket}개, 특별티켓 : ${userData[0].specialTicket}개`
}

export { renderItemINFO, onClickItem, renderInventoryBox, setIsFull, updateInventoryINFO, isFull, leftFull, rightFull, setLeftRightFull }