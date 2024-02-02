import englishWord from "./englishQuizObject.js"
import { renderItemINFO,onClickItem, renderInventoryBox } from "./Inventory.js"
import { knowledgeObject } from "./KnowledgeObject.js"
export let dragged
let inventoryBox =document.getElementById('inventory')
let getItemBox = document.getElementById('getItem')

const nomalDrawList = ['수학','영어','과학']
const specialDrawList = ['미적분학']

function renderQuizBox(){
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
    renderMathQuiz()
}

function renderMathQuiz(){
    getItemBox.replaceChildren()
    const mathQuiz = document.createElement('div')
    const randomNum1 = Math.floor(Math.random() * 10 + 1);
    const randomNum2 = Math.floor(Math.random() * 10 + 1);
    const mathAnswer = randomNum1 * randomNum2
    mathQuiz.innerHTML = randomNum1 + '*' + randomNum2 + '='
    const mathAnswerInput = document.createElement('input')
    mathAnswerInput.type = 'text'
    const answerCheckButton = document.createElement('button')
    answerCheckButton.innerHTML = '입력'
    answerCheckButton.addEventListener('click',onClickmathAnswerButton(mathAnswerInput,mathAnswer))
    getItemBox.appendChild(mathQuiz)
    getItemBox.appendChild(mathAnswerInput)
    getItemBox.appendChild(answerCheckButton)
}

function onClickmathAnswerButton(mathAnswerInput,mathAnswer){
    return function(){
        if (mathAnswerInput.value == mathAnswer){
            const mathItem = document.createElement('div')
            mathItem.innerHTML = '수학'
            mathItem.className = 'item'
            mathItem.id = 1
            mathItem.addEventListener("click",onClickItem(mathItem))
        }
        else
            console.log('wrong') 
    }
}

function renderEnglishQuiz(){
    getItemBox.replaceChildren()
    const randomNum = Math.floor(Math.random() * 3);
    const englishQuiz = document.createElement('div')
    englishQuiz.innerHTML = '다음 단어의 뜻을보고 영어로 쓰시오' + '<br>' + englishWord[randomNum][1]
    const englishAnswerInput = document.createElement('input')
    englishAnswerInput.type = 'text'
    const answerCheckButton = document.createElement('button')
    answerCheckButton.innerHTML = '입력'
    answerCheckButton.addEventListener('click',onClickEnAnswerButton(englishAnswerInput,englishWord[randomNum][0]))
    getItemBox.appendChild(englishQuiz)
    getItemBox.appendChild(englishAnswerInput)
    getItemBox.appendChild(answerCheckButton)
}

function onClickEnAnswerButton(englishAnswerInput,answer){
    return function(){
        console.log(englishAnswerInput.value, answer)
        if (englishAnswerInput.value == answer){
            const englishItem = document.createElement('div')
            englishItem.innerHTML = '영어'
            englishItem.className = 'item'
            englishItem.id = 2
            englishItem.addEventListener("click",onClickItem(englishItem))
            inventoryBox.appendChild(englishItem)
        }
        else
            console.log('worng')
    }   
}

function onClickEnglishButton(){
    renderEnglishQuiz()
}

function onClickQuizButton(){
    renderQuizBox()  
}

function renderDrawBox(){
    getItemBox.replaceChildren()
    const nomalDrawButton = document.createElement('button')
    const specialDrawButton = document.createElement('button')
    nomalDrawButton.innerHTML = '일반뽑기'
    specialDrawButton.innerHTML = '고급뽑기'
    nomalDrawButton.className = 'drawButton'
    specialDrawButton.className = 'drawButton'
    nomalDrawButton.addEventListener('click',function(){
        const randomNum = Math.floor(Math.random() * nomalDrawList.length)
        const item = makeRandomItem(nomalDrawList[randomNum],1)
        // inventoryItemList.push([nomalDrawList[randomNum]])
        inventoryBox.appendChild(item)
        // renderInventoryBox()
    })
    specialDrawButton.addEventListener('click',function(){
        const randomNum = Math.floor(Math.random() * specialDrawList.length)
        const item = makeRandomItem(specialDrawList[randomNum],1)
        inventoryBox.appendChild(item)
    })
    getItemBox.appendChild(nomalDrawButton)
    getItemBox.appendChild(specialDrawButton)
}

function onClickDrawButton(){
    renderDrawBox()
}

function makeRandomItem(itemName,itemLevel){
    const item = document.createElement('div')
    let url = 'http://localhost:3000/item/'
    console.log(url)
    fetch(url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ name: itemName, level: itemLevel }),
    })
    .then(function(response){
        return response.json()
    })
    .then(function(data){
        console.log(data)
        item.className = 'item'
        item.innerHTML = data[0].name + '<br>' + data[0].level
        item.dataset.inventoryId = data[1]
        item.addEventListener('click',onClickItem(item,data))
        // item.draggable = 'true'
        // item.addEventListener('dragstart',(e) =>{
        //     dragged = e.target       
        //     e.target.classList.add("dragging");
        // })
        item.addEventListener('mouseenter',renderItemINFO(item,data))
        item.addEventListener('mouseout',() => {
            const itemTextDiv = document.getElementById('itemInfo')
            item.removeChild(itemTextDiv)
        })
    })
    
    return item
}



document.getElementById('quiz').addEventListener('click',onClickQuizButton)
document.getElementById('draw').addEventListener('click',onClickDrawButton)


export {renderQuizBox, onClickMathButton,onClickItem,onClickEnglishButton,
        onClickQuizButton,renderDrawBox,onClickDrawButton,makeRandomItem}