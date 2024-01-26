import { onClickItem } from "./KnowledgeAuctionGetItem.js"

let upgradeBox = document.getElementById('upgrade')

function renderEnforceBox(){
    const enforceBox = document.createElement('div')
    enforceBox.id = 'enforceBox'
    enforceBox.textContent = '강화할 아이템을 선택하세요'
    enforceBox.addEventListener('click',onClickEnforceBox)
    console.log('renderenforce')
    upgradeBox.appendChild(enforceBox)
}


function onClickEnforceBox(){
    
}

function onClickEnforceButton(){
    upgradeBox.replaceChildren()
    renderEnforceBox()
}

function renderEditBox(){
    upgradeBox.replaceChildren()
}

function onClickEditButton(){
    renderEditBox()
}


document.getElementById('editButton').addEventListener('click',onClickEditButton)
document.getElementById('enforceButton').addEventListener('click',onClickEnforceButton)


export {renderEnforceBox,onClickEnforceBox,onClickEnforceButton,renderEditBox,onClickEditButton}