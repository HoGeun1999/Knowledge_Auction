import englishWord from "./englishQuizObject.js"
import { renderItemINFO,onClickItem } from "./Inventory.js"
export let dragged
let inventoryBox =document.getElementById('inventory')
let getItemBox = document.getElementById('getItem')
const nomalDrawList = [1,2,3,4,5,6]
const specialDrawList = [7]

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
        const item = makeItem(nomalDrawList[randomNum])
        inventoryBox.appendChild(item)
    })
    specialDrawButton.addEventListener('click',makeItem(specialDrawList))
    getItemBox.appendChild(nomalDrawButton)
    getItemBox.appendChild(specialDrawButton)
}

function onClickDrawButton(){
    renderDrawBox()
}


// function makeItem(numList,location){
//     return function(){
//         const randomNum = Math.floor(Math.random() * numList.length)
//         const item = document.createElement('div')
//         let url = 'http://localhost:3000/item/' + numList[randomNum]
//         fetch(url)
//         .then(function(response){
//             return response.json() 
//         })
//         .then(function(data){
//             item.className = 'item'
//             item.innerHTML = data[0].name + '<br>' + data[0].level
//             item.addEventListener('click',onClickItem(item))
//             item.addEventListener('mouseenter',renderItemINFO(item,data[0]))
//             item.addEventListener('mouseout',() => {
//                 const itemTextDiv = document.getElementById('itemInfo')
//                 item.removeChild(itemTextDiv)
//             });
//             location.appendChild(item)
//         })
//     }
// }

function makeItem(itemId){
    const item = document.createElement('div')
    let url = 'http://localhost:3000/item/' + itemId
    fetch(url)
    .then(function(response){
        return response.json() 
    })
    .then(function(data){
        item.className = 'item'
        item.innerHTML = data[0].name + '<br>' + data[0].level
        // item.addEventListener('click',onClickItem(item))
        item.draggable = 'true'
        item.addEventListener('dragstart',(e) =>{
            dragged = e.target       
            e.target.classList.add("dragging");
        })
        item.addEventListener('mouseenter',renderItemINFO(item,data[0]))
        item.addEventListener('mouseout',() => {
            const itemTextDiv = document.getElementById('itemInfo')
            item.removeChild(itemTextDiv)
        });
    })
    return item

}

document.getElementById('quiz').addEventListener('click',onClickQuizButton)
document.getElementById('draw').addEventListener('click',onClickDrawButton)


export {renderQuizBox, onClickMathButton,onClickItem,onClickEnglishButton,
        onClickQuizButton,renderDrawBox,onClickDrawButton,makeItem}