import { changeTabButton, makeItemDiv } from "./getItem.js"
import { setIsFull, updateInventoryINFO, leftFull, rightFull, setLeftRightFull } from "./Inventory.js"
import { collectionCheck } from "./collection.js"
import { fetchEnforceItem, fetchEditItem } from "./api.js"

const inventory = document.getElementById('inventory')
const upgradeBox = document.getElementById('upgrade')
let upgradeState = 'enfroce'

function renderEnforceBox() {
    upgradeBox.replaceChildren()
    upgradeState = 'enforce'
    const enforceWrap = document.createElement('div')
    enforceWrap.id = 'enforceWrap'
    const enforceBox = document.createElement('div')
    enforceBox.id = 'enforceBox'
    enforceBox.textContent = '강화할 아이템을 선택하세요'
    const enforceButton = document.createElement('button')
    enforceButton.id = 'enforceButton'
    enforceButton.textContent = '강화하기'
    enforceButton.addEventListener('click', onClickEnforceButton)

    enforceWrap.appendChild(enforceBox)
    enforceWrap.appendChild(enforceButton)
    upgradeBox.appendChild(enforceWrap)
}

function onClickEnforceTabButton() {
    renderEnforceBox()
}

async function onClickEnforceButton() {
    const enforceBox = document.getElementById('enforceBox')
    const enforceItem = enforceBox.childNodes[0]
    const enforceData = await fetchEnforceItem(enforceItem.dataset.inventoryId)
    updateInventoryINFO()
    if (enforceData.result === '강화 실패') {
        alert('강화 실패')
        return
    }
    else if (enforceData.result === '파괴') {
        alert('아이템 파괴')
        renderEnforceBox()
        changeTabButton(false)
        setIsFull(false)
        return
    }
    else {
        const newItem = makeItemDiv(enforceData.result[0][0], enforceData.result[1])
        inventory.appendChild(newItem)
        renderEnforceBox()
        changeTabButton(false)
        setIsFull(false)
        collectionCheck(enforceData.result[0][0])
    }
}

function renderEditBox() {
    upgradeBox.replaceChildren()
    upgradeState = 'edit'
    const editWrap = document.createElement('div')
    editWrap.id = 'editWrap'
    const editBoxLeft = document.createElement('div')
    editBoxLeft.id = 'editBoxLeft'
    const editBoxRight = document.createElement('div')
    editBoxRight.id = 'editBoxRight'
    editBoxLeft.className = 'editBox'
    editBoxRight.className = 'editBox'
    editBoxLeft.textContent = '합성할 아이템을 선택하세요'
    editBoxRight.textContent = '합성할 아이템을 선택하세요'
    const plusDiv = document.createElement('div')
    plusDiv.id = 'plusDiv'
    plusDiv.textContent = '+'
    const editButton = document.createElement('button')
    editButton.id = 'editButton'
    editButton.textContent = '합성하기'
    editButton.addEventListener('click', onClickEditButton)
    editWrap.appendChild(editBoxLeft)
    editWrap.appendChild(plusDiv)
    editWrap.appendChild(editBoxRight)
    editWrap.appendChild(editButton)
    upgradeBox.appendChild(editWrap)
}

async function onClickEditButton() {
    if (leftFull === true && rightFull === true) {
        const editLeftBox = document.getElementById('editBoxLeft')
        const editRightBox = document.getElementById('editBoxRight')
        const leftItem = editLeftBox.children[0]
        const rightItem = editRightBox.children[0]
        const editItemData = await fetchEditItem(leftItem.dataset.inventoryId, rightItem.dataset.inventoryId) // 위의 enforce방식과 이 방식이 조금 다른데 어느게 더 맞는건지
        const editItem = makeItemDiv(editItemData[0],editItemData[0].inventory_id)
        inventory.appendChild(editItem)
        renderEditBox()
        changeTabButton(false)
        collectionCheck(editItemData[0])
        setLeftRightFull(false)
    }
    else {
        alert('아이템부족')
    }
}

function onClickEditTabButton() {

    renderEditBox()
}


document.getElementById('editTabButton').addEventListener('click', onClickEditTabButton)
document.getElementById('enforceTabButton').addEventListener('click', onClickEnforceTabButton)


export { renderEnforceBox, onClickEnforceTabButton, renderEditBox, onClickEditTabButton, upgradeState }