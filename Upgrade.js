import { dragged, makeRandomItem,changeGetItemButtonState } from "./getItem.js"
import { enforceTable, enforceCostTable} from "./KnowledgeObject.js"
import { setIsfull, userMoney, isFull, updateInventoryINFO, updateUserMoney, leftFull, rightFull} from "./Inventory.js"
export let upgradeState = 1

const upgradeBox = document.getElementById('upgrade')

function renderEnforceBox(){
    upgradeState = 1
    upgradeBox.replaceChildren()
    const enforceBox = document.createElement('div')
    upgradeBox.className = 'enforceState'
    enforceBox.id = 'enforceBox'
    enforceBox.textContent = '강화할 아이템을 선택하세요'
    enforceBox.addEventListener("dragover", (e) => {
        e.preventDefault();
    })
    enforceBox.addEventListener("drop",(e)=>{
        if(enforceBox.classList.contains('full')){
            return
        }
        else{
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
    enforceButton.addEventListener('click',onClickEnforceButton)
    upgradeBox.appendChild(enforceBox)
    upgradeBox.appendChild(enforceButton)
}

function onClickEnforceTabButton(){
    renderEnforceBox()
}

function onClickEnforceButton(){
    const enforceBox = document.getElementById('enforceBox')
    const enforceItem = enforceBox.childNodes[0]
    let url = 'http://localhost:3000/item/' + enforceItem.dataset.inventoryId
    fetch(url)
    .then(function(response){
        return response.json()
    })
    .then(function(data){
        if(userMoney < enforceCostTable[data[0].rarity][data[0].level-1]){
            console.log('돈부족')
            return 
        }
        else{
            updateUserMoney(-enforceCostTable[data[0].rarity][data[0].level-1])
        }
        const itemRarity = data[0].rarity
        const enforceProbability = enforceTable[itemRarity]
        const randomNum = Math.floor(Math.random() * 10 + 1);
        const enforceCheck = enforceProbability[data[0].level-1]
        updateInventoryINFO()
        if (randomNum === 10){
            console.log('파괴')
            setIsfull(0) 
            renderEnforceBox()
            delInventoryItem(enforceItem.dataset.inventoryId)
            changeGetItemButtonState(false)
        }
        else if(randomNum<=enforceCheck){
            const newItem = makeRandomItem(data[0].name,data[0].level + 1)
            const inventory = document.getElementById('inventory')
            inventory.appendChild(newItem)
            setIsfull(0)
            delInventoryItem(enforceItem.dataset.inventoryId)
            changeGetItemButtonState(false)
            renderEnforceBox()
        }
        else{   
            console.log('실패 / 하락 or 그대로')
        }
    })
    
}

function delInventoryItem(inventoryId){
    console.log(inventoryId)
    let url = 'http://localhost:3000/delItem/' + inventoryId
    fetch(url)
}


function renderEditBox(){
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
    editBoxLeft.addEventListener("drop",(e)=>{
        if(editBoxLeft.classList.contains('full')){
            return
        }
        else{
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
    editBoxRight.addEventListener("drop",(e)=>{
        if(editBoxRight.classList.contains('full')){
            return
        }
        else{
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
    editButton.addEventListener('onclick',onClickEditButton)
    upgradeBox.appendChild(editBoxLeft)
    upgradeBox.appendChild(plusDiv)
    upgradeBox.appendChild(editBoxRight)
    upgradeBox.appendChild(editButton)
}

function onClickEditButton(){
    if(leftFull == 1 && rightFull == 1){
        const editItem1 = document.getElementById('editBoxLeft')
        const editItem2 = document.getElementById('editBoxRight')
        const text = enforceItem.textContent
        const itemLevel = text[text.length-1]
        const itemName = text.slice(0, -1)
    }
    else{
        console.log('아이템부족')
    }
}

function onClickEditTabButton(){

    renderEditBox()
}


document.getElementById('editTabButton').addEventListener('click',onClickEditTabButton)
document.getElementById('enforceTabButton').addEventListener('click',onClickEnforceTabButton)


export {renderEnforceBox,onClickEnforceTabButton,renderEditBox,onClickEditTabButton}