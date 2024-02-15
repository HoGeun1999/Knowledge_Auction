import { dragged, changeGetItemButtonState, makeItem } from "./getItem.js"
import { enforceTable, enforceCostTable } from "./KnowledgeObject.js"
import { setIsfull, userMoney, isFull, updateInventoryINFO, updateUserMoney, leftFull, rightFull } from "./Inventory.js"
import {checkColletion} from "./collection.js"

export let upgradeState = 1
const inventory = document.getElementById('inventory')
const upgradeBox = document.getElementById('upgrade')

function renderEnforceBox() {
    upgradeState = 1
    upgradeBox.replaceChildren()
    const enforceBox = document.createElement('div')
    upgradeBox.className = 'enforceState'
    enforceBox.id = 'enforceBox'
    enforceBox.textContent = '강화할 아이템을 선택하세요'
    enforceBox.addEventListener("dragover", (e) => {
        e.preventDefault();
    })
    enforceBox.addEventListener("drop", (e) => {
        if (enforceBox.classList.contains('full')) {
            return
        }
        else {
            e.preventDefault()
            console.log(dragged.parentNode)
            dragged.parentNode.removeChild(dragged)
            e.target.appendChild(dragged)
            enforceBox.classList.add('full')
        }

    })
    const enforceButton = document.createElement('button')
    enforceButton.id = 'enforceButton'
    enforceButton.innerText = '강화하기'
    enforceButton.addEventListener('click', onClickEnforceButton)
    upgradeBox.appendChild(enforceBox)
    upgradeBox.appendChild(enforceButton)
}

function onClickEnforceTabButton() {
    renderEnforceBox()
}

function onClickEnforceButton() {
    const enforceBox = document.getElementById('enforceBox')
    const enforceItem = enforceBox.childNodes[0]
    console.log(enforceItem)
    let url = 'http://localhost:3000/items/enforce/' + enforceItem.dataset.inventoryId
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
                updateInventoryINFO()
                if(data.result === '강화 실패'){
                    alert('강화 실패')
                    return
                }
                else if(data.result === '파괴'){
                    alert('아이템 파괴')
                    renderEnforceBox()
                    changeGetItemButtonState(false)
                    setIsfull(0)  
                    return
                }
                else{
                    const newItem = makeItem(data.result[0][0],data.result[1])   
                    inventory.appendChild(newItem)
                    renderEnforceBox()
                    changeGetItemButtonState(false)
                    setIsfull(0)  
                    checkColletion(data.result[0][0])
                }
            },
            (error) => {
                alert(error)
            }
        )

}

function delInventoryItem(inventoryId) {
    console.log(inventoryId)
    let url = 'http://localhost:3000/delItem/' + inventoryId
    fetch(url)
}


function renderEditBox() {
    upgradeState = 2
    upgradeBox.replaceChildren()
    upgradeBox.className = 'editState'
    const editWrap = document.createElement('div')
    editWrap.id = 'editWrap'
    const editBoxLeft = document.createElement('div')
    const editBoxRight = document.createElement('div')
    editBoxLeft.id = 'editBoxLeft'
    editBoxRight.id = 'editBoxRight'
    editBoxLeft.className = 'editBox'
    editBoxRight.className = 'editBox'
    editBoxLeft.innerHTML = '합성할 아이템을 선택하세요'
    editBoxRight.innerHTML = '합성할 아이템을 선택하세요'
    editBoxLeft.addEventListener("dragover", (e) => {
        e.preventDefault();
    })
    editBoxLeft.addEventListener("drop", (e) => {
        if (editBoxLeft.classList.contains('full')) {
            return
        }
        else {
            e.preventDefault()
            e.target.classList.remove("dragging")
            dragged.parentNode.removeChild(dragged)
            e.target.appendChild(dragged)
            console.log(dragged)
            editBoxLeft.classList.add('full')
        }

    })
    editBoxRight.addEventListener("dragover", (e) => {
        e.preventDefault();
    })
    editBoxRight.addEventListener("drop", (e) => {
        if (editBoxRight.classList.contains('full')) {
            return
        }
        else {
            e.preventDefault()
            e.target.classList.remove("dragging")
            dragged.parentNode.removeChild(dragged)
            e.target.appendChild(dragged)
            console.log(dragged)
            editBoxRight.classList.add('full')
        }

    })
    const plusDiv = document.createElement('div')
    plusDiv.id = 'plusDiv'
    plusDiv.innerHTML = '+'
    const editButton = document.createElement('button')
    editButton.innerHTML = '합성하기'
    editButton.id = 'editButton'
    editButton.addEventListener('onclick', onClickEditButton)
    upgradeBox.appendChild(editBoxLeft)
    upgradeBox.appendChild(plusDiv)
    upgradeBox.appendChild(editBoxRight)
    upgradeBox.appendChild(editButton)
}

function onClickEditButton() {
    if (leftFull == 1 && rightFull == 1) {
        const editItem1 = document.getElementById('editBoxLeft')
        const editItem2 = document.getElementById('editBoxRight')
        const text = enforceItem.textContent
        const itemLevel = text[text.length - 1]
        const itemName = text.slice(0, -1)
    }
    else {
        console.log('아이템부족')
    }
}

function onClickEditTabButton() {

    renderEditBox()
}


document.getElementById('editTabButton').addEventListener('click', onClickEditTabButton)
document.getElementById('enforceTabButton').addEventListener('click', onClickEnforceTabButton)


export { renderEnforceBox, onClickEnforceTabButton, renderEditBox, onClickEditTabButton }