import { dragged } from "./getItem.js"
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
    const editBoxLeft = document.createElement('div')
    const editBoxRight = document.createElement('div')
    editBoxLeft.id = 'editBoxLeft'
    editBoxRight.id = 'editBoxRight'
    editBoxLeft.className = 'editBox'
    editBoxRight.className = 'editBox'
    editBoxLeft.innerHTML = '합성할 아이템'
    editBoxRight.innerHTML = '합성할 아이템'
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
    upgradeBox.appendChild(editBoxLeft)
    upgradeBox.appendChild(plusDiv)
    upgradeBox.appendChild(editBoxRight)
    upgradeBox.appendChild(editButton)
}

function onClickEditButton(){
    upgradeBox.replaceChildren()
    renderEditBox()
}


document.getElementById('editTabButton').addEventListener('click',onClickEditButton)
document.getElementById('enforceTabButton').addEventListener('click',onClickEnforceButton)


export {renderEnforceBox,onClickEnforceButton,renderEditBox,onClickEditButton}