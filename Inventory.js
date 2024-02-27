import { upgradeState, renderEnforceBox } from "./Upgrade.js"
import { sellState, sellItemCount, updateSellCount, makeItemDiv, changeTabButton } from "./getItem.js"
import { fetchUserInventoryItems, fetchGetUserData } from "./api.js"

const inventory = document.getElementById('inventory')
const enforceButton = document.getElementById('enforceTabButton')
const editButton = document.getElementById('editTabButton')
let isFull = 0
let leftFull = 0
let rightFull = 0

function setIsfull(state) {
    isFull = state
    enforceButton.disabled = false
    editButton.disabled = false
}

function setLeftRightfull(state) {
    leftFull = state
    rightFull = state
    enforceButton.disabled = false
    editButton.disabled = false
}

function renderItemINFO(item, data) {
    return function () {
        const itemINFOText = document.createElement('div')
        itemINFOText.id = 'itemINFO'
        itemINFOText.innerHTML = '아이템 정보창' + '<br>' + '지식:' + data.name + '<br>' + '희귀도:' + data.rarity + '<br>' + '가격:' + data.price
        let rect = item.getBoundingClientRect()
        itemINFOText.style.left = rect.x + 80
        itemINFOText.style.top = rect.y + 10
        item.appendChild(itemINFOText)
    }
}

function moveItemToUpgrade(item, moveLocation) {
    moveLocation.innerHTML = ''
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
            sellBox.innerHTML = ''
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

        if (upgradeState === 'enforce' && isFull === 0) { //isFull은 true false로 쓰는게 적절한데 0,1도 사실 그런 의미로 많이 쓰니까 상관없나?
            inventory.removeChild(item)
            newItem.addEventListener('click', onClickEnforceItem(data))
            moveItemToUpgrade(newItem, enforceBox)
            changeTabButton(true)
            isFull = 1
        }
        else if (upgradeState === 'edit') {
            const editBoxLeft = document.getElementById('editBoxLeft')
            const editBoxRight = document.getElementById('editBoxRight')
            if (leftFull === 0) {
                inventory.removeChild(item)
                newItem.addEventListener('click', onClickEditItem(data, newItem))
                moveItemToUpgrade(newItem, editBoxLeft)
                leftFull = 1
            }
            else if (rightFull === 0) {
                inventory.removeChild(item)
                newItem.addEventListener('click', onClickEditItem(data, newItem))
                moveItemToUpgrade(newItem, editBoxRight)
                rightFull = 1
            }
            changeTabButton(true)
        }
    }
}

function onClickEnforceItem(data) {
    return () => {
        const newItem = makeItemDiv(data, data.inventory_id)
        inventory.appendChild(newItem)
        isFull = 0
        renderEnforceBox()
        changeTabButton(false)
    }
}

function onClickEditItem(data, item) {
    return () => {
        const editBox = item.parentNode
        const newItem = makeItemDiv(data, data.inventory_id)
        editBox.removeChild(item)
        editBox.innerHTML = '합성할 아이템을 선택하세요'
        inventory.appendChild(newItem)
        if (editBox.id === 'editBoxLeft') {
            leftFull = 0
        }
        if (editBox.id === 'editBoxRight') {
            rightFull = 0
        }
        if (leftFull === 0 && rightFull === 0) {
            changeTabButton(false)
        }
    }
}

function onClickSellItem(data, item) {
    return () => {
        const newItem = makeItemDiv(data, data.inventory_id)
        sellBox.removeChild(item)
        inventory.appendChild(newItem)
        updateSellCount(-1)
        if (sellItemCount == 0) {
            sellBox.innerHTML = '판매할 아이템을 선택하세요'
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
    const userData = await fetchGetUserData() // 단수? 복수?
    const userInventoryINFO = document.getElementById('userInventoryINFO')
    userInventoryINFO.textContent = `보유 금액: ${userData[0].holdings}, 일반티켓 : ${userData[0].normalTicket}개, 특별티켓 : ${userData[0].specialTicket}개`
}

export { renderItemINFO, onClickItem, renderInventoryBox, setIsfull, updateInventoryINFO, isFull, leftFull, rightFull, setLeftRightfull }