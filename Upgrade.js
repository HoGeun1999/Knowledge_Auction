let upgradeBox = document.getElementById('upgrade')
import { dragged } from "./getItem.js"
export let upgradeState = 1

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
    upgradeBox.appendChild(enforceBox)
    upgradeBox.appendChild(enforceButton)
}

function onClickEnforceButton(){

    renderEnforceBox()
}


function renderEditBox(){
    upgradeState = 2
    upgradeBox.replaceChildren()
    upgradeBox.className = 'editState'
    const editWrap = document.createElement('div')
    editWrap.id = 'editWrap'
    const editItem1 = document.createElement('div')
    const editItem2 = document.createElement('div')
    editItem1.id = 'editBox1'
    editItem2.id = 'editBox2'
    editItem1.className = 'editBox'
    editItem2.className = 'editBox'
    editItem1.innerHTML = '합성할 아이템'
    editItem2.innerHTML = '합성할 아이템'
    editItem1.addEventListener("dragover", (e) => {
        e.preventDefault();
    })
    editItem1.addEventListener("drop",(e)=>{
        if(editItem1.classList.contains('full')){
            return
        }
        else{
            e.preventDefault()
            e.target.classList.remove("dragging")
            dragged.parentNode.removeChild(dragged)
            e.target.appendChild(dragged)
            console.log(dragged)
            editItem1.classList.add('full') 
        }

    })
    editItem2.addEventListener("dragover", (e) => {
        e.preventDefault();
    })
    editItem2.addEventListener("drop",(e)=>{
        if(editItem2.classList.contains('full')){
            return
        }
        else{
            e.preventDefault()
            e.target.classList.remove("dragging")
            dragged.parentNode.removeChild(dragged)
            e.target.appendChild(dragged)
            console.log(dragged)
            editItem2.classList.add('full') 
        }

    })
    const plusDiv = document.createElement('div')
    plusDiv.id = 'plusDiv'
    plusDiv.innerHTML = '+'
    const editButton = document.createElement('button')
    editButton.innerHTML = '합성하기'
    upgradeBox.appendChild(editItem1)
    upgradeBox.appendChild(plusDiv)
    upgradeBox.appendChild(editItem2)
    upgradeBox.appendChild(editButton)
}

function onClickEditButton(){
    upgradeBox.replaceChildren()
    renderEditBox()
}



document.getElementById('editTabButton').addEventListener('click',onClickEditButton)
document.getElementById('enforceTabButton').addEventListener('click',onClickEnforceButton)


export {renderEnforceBox,onClickEnforceButton,renderEditBox,onClickEditButton}