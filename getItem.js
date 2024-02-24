import englishWord from "./englishQuizObject.js"
import {
    renderItemINFO, onClickItem, renderInventoryBox, updateNormalRandomTicket, updateSpecialRandomTicket,
    userNormalRandomTicket, userSpecialRandomTicket, updateInventoryINFO, updateUserMoney, userMoney
} from "./Inventory.js"
import { checkColletion } from "./collection.js"

export let dragged
let inventoryBox = document.getElementById('inventory')
let getItemBox = document.getElementById('getItem')
let sellState = false
let sellItemCount = 0
const quizButton = document.getElementById('quiz')
const drawButton = document.getElementById('draw')
const sellButton = document.getElementById('sell')

function renderQuizBox() {
    getItemBox.replaceChildren()
    const mathQuizButton = document.createElement('button')
    mathQuizButton.type = 'button'
    mathQuizButton.innerHTML = '수학'
    mathQuizButton.className = 'quizButton'
    mathQuizButton.id = 'mathQuizButton'
    mathQuizButton.addEventListener("click", onClickMathButton)
    getItemBox.appendChild(mathQuizButton)

    const englishQuizButton = document.createElement('button')
    englishQuizButton.type = 'button'
    englishQuizButton.innerHTML = '영어'
    englishQuizButton.className = 'quizButton'
    englishQuizButton.id = 'englishQuizButton'
    englishQuizButton.addEventListener("click", onClickEnglishButton)
    getItemBox.appendChild(englishQuizButton)
}

function onClickMathButton() {
    renderMathQuiz()
}

function renderMathQuiz() {
    const mathQuizWrap = document.createElement('div')
    mathQuizWrap.className = 'quizWrap'
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
    answerCheckButton.addEventListener('click', onClickmathAnswerButton(mathAnswerInput, mathAnswer))
    mathQuizWrap.appendChild(mathQuiz)
    mathQuizWrap.appendChild(mathAnswerInput)
    mathQuizWrap.appendChild(answerCheckButton)
    getItemBox.appendChild(mathQuizWrap)
}

function onClickmathAnswerButton(mathAnswerInput, mathAnswer) {
    return function () {
        console.log(mathAnswerInput, mathAnswer)
        if (mathAnswerInput.value == mathAnswer) {
            let url = 'http://localhost:3000/quiz/math'
            fetch(url)
                .then((response) => {
                    return response.json()
                })
                .then((data) => {
                    const mathItem = makeItem(data[0], data[0].inventory_id)
                    inventoryBox.appendChild(mathItem)
                    renderMathQuiz()
                    alert('정답! 아이템을 얻었습니다')
                })

        }
        else
            alert('틀렸습니다')
    }
}



function renderEnglishQuiz() {
    getItemBox.replaceChildren()
    const englishQuizWrap =document.createElement('div')
    englishQuizWrap.id = 'enQuizWrap'
    const randomNumAnswer = Math.floor(Math.random() * englishWord.length);
    const randomNumArr = [randomNumAnswer]
    const englishQuiz = document.createElement('div')
    englishQuiz.innerHTML = '다음 단어의 뜻을보고 답을 고르시오' + '<br>' + englishWord[randomNumAnswer][0]
    while (true) {
        const randomNum = Math.floor(Math.random() * englishWord.length);
        if (randomNumArr.includes(randomNum) == false) {
            randomNumArr.push(randomNum)
        }
        if (randomNumArr.length == 3) {
            break
        }
    }
    console.log(randomNumArr)

    const englishAnswerWrap1 = document.createElement('div')
    englishAnswerWrap1.id = 'quizWrap'
    const englishAnswer1 = document.createElement('input')
    englishAnswer1.type = 'radio'
    englishAnswer1.className = 'enQuizRadio'
    englishAnswer1.value = `${englishWord[randomNumArr[0]][1]}`
    englishAnswer1.name = 'answer'
    const label1 = document.createElement('label')
    label1.innerHTML = `${englishWord[randomNumArr[0]][1]}`
    englishAnswerWrap1.appendChild(englishAnswer1)
    englishAnswerWrap1.appendChild(label1)

    const englishAnswerWrap2 = document.createElement('div')
    const englishAnswer2 = document.createElement('input')
    englishAnswer2.type = 'radio'
    englishAnswer2.className = 'enQuizRadio'
    englishAnswer2.value = `${englishWord[randomNumArr[1]][1]}`
    englishAnswer2.name = 'answer'
    const label2 = document.createElement('label')
    label2.htmlFor = 'englishAnswer2'
    label2.innerHTML = `${englishWord[randomNumArr[1]][1]}`
    englishAnswerWrap2.appendChild(englishAnswer2)
    englishAnswerWrap2.appendChild(label2)

    const englishAnswerWrap3 = document.createElement('div')
    const englishAnswer3 = document.createElement('input')
    englishAnswer3.type = 'radio'
    englishAnswer3.className = 'enQuizRadio'
    englishAnswer3.value = 'englishAnswer3'
    englishAnswer3.name = 'answer'
    const label3 = document.createElement('label')
    label3.htmlFor = `${englishWord[randomNumArr[2]][1]}`
    label3.innerHTML = `${englishWord[randomNumArr[2]][1]}`
    englishAnswerWrap3.appendChild(englishAnswer3)
    englishAnswerWrap3.appendChild(label3)

    const answerCheckButton = document.createElement('button')
    answerCheckButton.innerHTML = '정답확인'
    answerCheckButton.addEventListener('click', function () {
        const radioButton = document.getElementsByName("answer");

        for (let i = 0; i < radioButton.length; i++) {
            let isSelected = radioButton[i].matches(":checked")

            if (isSelected) {
                if (radioButton[i].value == englishWord[randomNumAnswer][1]) {
                    let url = 'http://localhost:3000/quiz/english'
                    fetch(url)
                        .then((response) => {
                            return response.json()
                        })
                        .then((data) => {
                            const mathItem = makeItem(data[0], data[0].inventory_id)
                            inventoryBox.appendChild(mathItem)
                            renderEnglishQuiz()
                            alert('정답! 아이템을 얻었습니다')
                        })
                }
                else {
                    alert('오답')
                }
            }
        }
    })
    englishQuizWrap.appendChild(englishQuiz)
    englishQuizWrap.appendChild(englishAnswerWrap1)
    englishQuizWrap.appendChild(englishAnswerWrap2)
    englishQuizWrap.appendChild(englishAnswerWrap3)
    englishQuizWrap.appendChild(answerCheckButton)
    getItemBox.appendChild(englishQuizWrap)
}

function onClickEnAnswerButton(englishAnswerInput, answer) {
    return function () {
        console.log(englishAnswerInput.value, answer)
        if (englishAnswerInput.value == answer) {
            const englishItem = document.createElement('div')
            englishItem.innerHTML = '영어'
            englishItem.className = 'item'
            englishItem.id = 2
            englishItem.addEventListener("click", onClickItem(englishItem))
            inventoryBox.appendChild(englishItem)
        }
        else
            console.log('worng')
    }
}

function onClickEnglishButton() {
    renderEnglishQuiz()
}

function onClickQuizButton() {
    changeSellState(false)
    renderQuizBox()
}

function renderDrawBox() {
    getItemBox.replaceChildren()
    const nomalDrawButtonWrap = document.createElement('div')
    nomalDrawButtonWrap.className = 'ticketWrap'
    const normalDrawText = document.createElement('div')
    normalDrawText.className = 'ticketText'
    normalDrawText.textContent = '1티켓 or 3원'
    const nomalDrawButton = document.createElement('button')
    nomalDrawButton.innerHTML = '일반뽑기'
    nomalDrawButton.className = 'drawButton'
    nomalDrawButton.addEventListener('click', function () {
        console.log('normalButton click')
        const url = 'http://localhost:3000/user/randomDraw/' + 'normal'
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
                    const item = makeItem(data[0][0], data[1])
                    inventoryBox.appendChild(item)
                    updateInventoryINFO()
                    checkColletion(data[0][0])
                },
                (error) => {
                    alert(error)
                }
            )
    })

    const specialDrawButtonWrap = document.createElement('div')
    const specialDrawText = document.createElement('div')
    specialDrawText.className = 'ticketText'
    specialDrawText.textContent = '1티켓 or 15원'
    specialDrawButtonWrap.className = 'ticketWrap'
    const specialDrawButton = document.createElement('button')
    specialDrawButton.innerHTML = '고급뽑기'
    specialDrawButton.className = 'drawButton'
    specialDrawButton.addEventListener('click', function () {
        const url = 'http://localhost:3000/user/randomDraw/' + 'special'
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
                    const item = makeItem(data[0][0], data[1])
                    inventoryBox.appendChild(item)
                    updateInventoryINFO()
                },
                (error) => {
                    alert(error)
                }
            )
    })
    nomalDrawButtonWrap.appendChild(nomalDrawButton)
    nomalDrawButtonWrap.appendChild(normalDrawText)
    specialDrawButtonWrap.appendChild(specialDrawButton)
    specialDrawButtonWrap.appendChild(specialDrawText)
    getItemBox.appendChild(nomalDrawButtonWrap)
    getItemBox.appendChild(specialDrawButtonWrap)
}

function onClickDrawButton() {
    changeSellState(false)
    renderDrawBox()
}

function makeItem(itemObject, inventoryId) {
    const item = document.createElement('div')
    item.className = 'item'
    item.innerHTML = itemObject.name + '<br>' + itemObject.level
    item.dataset.inventoryId = inventoryId
    item.addEventListener('click', onClickItem(item, itemObject))
    item.addEventListener('mouseenter', renderItemINFO(item, itemObject))
    item.addEventListener('mouseout', () => {
        const itemTextDiv = document.getElementById('itemInfo')
        item.removeChild(itemTextDiv)
    })
    return item
}

function renderSellItemBox() {
    getItemBox.replaceChildren()
    sellState = true
    const sellBox = document.createElement('div')
    sellBox.id = 'sellBox'
    sellBox.innerHTML = '판매할 아이템을 선택하세요'
    const sellButton = document.createElement('button')
    sellButton.addEventListener('click', onClickSellButton)
    sellButton.id = 'sellButton'
    sellButton.innerHTML = '판매'
    getItemBox.appendChild(sellBox)
    getItemBox.appendChild(sellButton)
}

function onClickSellButton() {
    let sumSellItemCost = 0
    let sellItems = []
    const sellItemList = sellBox.childNodes

    for (let i = 0; i < sellItemList.length; i++) {
        sellItems.push(sellItemList[i].dataset.inventoryId)
    }

    let url = 'http://localhost:3000/sellItem/'
    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sellItems),
    })
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
                console.log(data)
                alert("판매 금액 : " + data.result)
                updateSellCount(-sellItemList.length)
                renderSellItemBox()
                updateInventoryINFO()
                changeGetItemButtonState(false)

            },
            (error) => {
                alert(error)
            }
        )

}

function changeSellState(state) {
    sellState = state
}

function updateSellCount(change) {
    sellItemCount = sellItemCount + change
}

function changeGetItemButtonState(state) {
    quizButton.disabled = state
    drawButton.disabled = state
    sellButton.disabled = state
}


document.getElementById('quiz').addEventListener('click', onClickQuizButton)
document.getElementById('draw').addEventListener('click', onClickDrawButton)
document.getElementById('sell').addEventListener('click', renderSellItemBox)

export {
    renderQuizBox, onClickMathButton, onClickItem, onClickEnglishButton,
    onClickQuizButton, renderDrawBox, onClickDrawButton, makeItem,
    changeSellState, sellState, sellItemCount, updateSellCount, changeGetItemButtonState
}