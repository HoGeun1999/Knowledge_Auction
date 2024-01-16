let getItemBox = document.getElementById('getItem')
let upgradeBox = document.getElementById('upgrade')

function renderQuizBox(){
    // const quizType = ['수학','영어']
    // for(let i =0;i<quizType.length;i++){

    // }
    getItemBox.replaceChildren()
    const mathQuizButton = document.createElement('button')
    mathQuizButton.type = 'button'
    mathQuizButton.innerHTML = '수학'
    mathQuizButton.className = 'quizButton'
    mathQuizButton.id = 'mathQuizButton'
    mathQuizButton.addEventListener("click",onClickMathButton)
    getItemBox.appendChild(mathQuizButton)

    const englishQuizButton = document.createElement('button')
    englishQuizButton.type = 'button'
    englishQuizButton.innerHTML = '영어'
    englishQuizButton.className = 'quizButton'
    englishQuizButton.id = 'englishQuizButton'
    englishQuizButton.addEventListener("click",onClickEnglishButton)
    getItemBox.appendChild(englishQuizButton)
}

function onClickMathButton(){
    console.log('math')
}

function onClickEnglishButton(){
    console.log('math')
}

function onClickQuizButton(){
    renderQuizBox()
}

function renderDrawBox(){
    getItemBox.replaceChildren()
    
}

function onClickDrawButton(){
    renderDrawBox()
}

function renderEnforceBox(){
    const enforceBox = document.createElement('div')
    enforceBox.id = 'enforceBox'
    enforceBox.textContent = '강화할 아이템을 선택하세요'
    enforceBox.addEventListener('click',onClickEnforceBox)
    console.log('renderenforce')
    upgradeBox.appendChild(enforceBox)
}

function onClickEnforceBox(){
    console.log('click')
}

function onClickEnforceButton(){
    upgradeBox.replaceChildren()
    renderEnforceBox()
}

function renderEditBox(){

}

function onClickEditButton(){
    renderEditBox()
}

document.getElementById('edit').addEventListener('click',onClickEditButton)
document.getElementById('enforce').addEventListener('click',onClickEnforceButton)
document.getElementById('draw').addEventListener('click',onClickDrawButton)
document.getElementById('quiz').addEventListener('click',onClickQuizButton)
renderQuizBox()
renderEnforceBox()