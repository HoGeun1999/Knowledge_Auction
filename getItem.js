import englishWord from "./englishQuizObject.js"
import { renderItemINFO, onClickItem, updateInventoryINFO } from "./Inventory.js"
import { collectionCheck } from "./collection.js"
import { fetchMathItemData, fetchEnglishItemData, fetchDrawItemData, fetchSellItems } from "./api.js"

const inventoryBox = document.getElementById('inventory')
const getItemBox = document.getElementById('getItem')
const enforceButton = document.getElementById('enforceTabButton')
const editButton = document.getElementById('editTabButton')
const quizButton = document.getElementById('quizTabButton')
const drawButton = document.getElementById('drawTabButton')
const sellButton = document.getElementById('sellTabButton')
let sellState = false
let sellItemCount = 0

function renderQuizBox() {
    getItemBox.replaceChildren()
    const mathQuizButton = document.createElement('button')
    mathQuizButton.textContent = '수학'
    mathQuizButton.className = 'quizButton'
    mathQuizButton.addEventListener("click", onClickMathQuizButton) // 이렇게 할필요가 있나? 30줄 함수 단 한줄
    getItemBox.appendChild(mathQuizButton)
    //요런곳에 한줄 띄워주는건 취향차이인가?
    const englishQuizButton = document.createElement('button')
    englishQuizButton.textContent = '영어'
    englishQuizButton.className = 'quizButton'
    englishQuizButton.addEventListener("click", onClickEnglishQuizButton)
    getItemBox.appendChild(englishQuizButton)
}

function onClickMathQuizButton() {
    renderMathQuiz()
}
// 퀴즈를 다양하게 + 안정성을 높이려면 결국 퀴즈도 db에 저장하거나 서버에서 만들어야하나?
// ex) 토익 - 매일 토익 풀기
async function renderMathQuiz() {
    getItemBox.replaceChildren()
    const mathQuizWrap = document.createElement('div')
    mathQuizWrap.id = 'mathQuizWrap'
    const mathQuiz = document.createElement('div')
    const randomNum1 = Math.floor(Math.random() * 10 + 1)
    const randomNum2 = Math.floor(Math.random() * 10 + 1)
    const mathAnswer = randomNum1 * randomNum2
    mathQuiz.textContent = randomNum1 + ' x ' + randomNum2 + ' = '
    const mathAnswerInput = document.createElement('input')
    mathAnswerInput.id = 'mathAnswerInput'
    const answerCheckButton = document.createElement('button')
    answerCheckButton.textContent = '입력'
    answerCheckButton.addEventListener('click', async function onClickmathAnswerButton() {
        if (mathAnswerInput.value == mathAnswer) { // mathAnswerInput.value가 int형이 아닌듯해서 근대 int형으로 바꾸고 ===쓸려해도 사용자가 str을 입력하면 int로 바꾸는데 문제고 또 if문써야하니까 그냥 ==이 좋지 않나?
            const mathItemData = await fetchMathItemData()
            const mathItem = makeItemDiv(mathItemData[0], mathItemData[0].inventory_id)
            inventoryBox.appendChild(mathItem)
            renderMathQuiz()
            collectionCheck(mathItemData[0])
            alert('정답! 아이템을 얻었습니다')
        }
        else {
            alert('틀렸습니다.')
        }
    })
    mathQuizWrap.appendChild(mathQuiz)
    mathQuizWrap.appendChild(mathAnswerInput)
    mathQuizWrap.appendChild(answerCheckButton)
    getItemBox.appendChild(mathQuizWrap)
}

function shuffleArray(array) {
    for (let index = array.length - 1; index > 0; index--) {
        const randomPosition = Math.floor(Math.random() * (index + 1))
        const temporary = array[index]
        array[index] = array[randomPosition]
        array[randomPosition] = temporary
    }
}

function renderEnglishQuiz() {
    getItemBox.replaceChildren()
    const englishQuizWrap = document.createElement('div')
    englishQuizWrap.id = 'englishQuizWrap'
    const allDivWrap = document.createElement('div')
    allDivWrap.id = 'allDivWrap'
    const englishQuiz = document.createElement('div')
    const randomProblemAnswerIndex = Math.floor(Math.random() * englishWord.length) 
    const randomProblemAnswer = englishWord[randomProblemAnswerIndex]
    const randomOptionIndexArray = [randomProblemAnswerIndex]
    englishQuiz.innerHTML = '다음 영단어를 보고 올바른 뜻을 고르시오' + '<br>' + randomProblemAnswer[0] + '<br>'
    while (true) {
        const randomOptionIndex = Math.floor(Math.random() * englishWord.length)
        if (!randomOptionIndexArray.includes(randomOptionIndex)) {
            randomOptionIndexArray.push(randomOptionIndex)
        }
        if (randomOptionIndexArray.length === 3) {
            break
        }
    }
    shuffleArray(randomOptionIndexArray)

    const allOptionWarp = document.createElement('div')
    allOptionWarp.id = 'allOptionWarp'
    const englishQuizOptionWrap1 = document.createElement('div')
    englishQuizOptionWrap1.className = 'englishQuizOptionWrap'
    const englishQuizOption1 = document.createElement('input')
    englishQuizOption1.type = 'radio'
    englishQuizOption1.value = `${englishWord[randomOptionIndexArray[0]][1]}`
    englishQuizOption1.name = 'Option'
    const englishQuizOptionLabel1 = document.createElement('label')
    englishQuizOptionLabel1.textContent = `${englishWord[randomOptionIndexArray[0]][1]}`
    englishQuizOptionWrap1.appendChild(englishQuizOption1)
    englishQuizOptionWrap1.appendChild(englishQuizOptionLabel1)

    const englishQuizOptionWrap2 = document.createElement('div')
    englishQuizOptionWrap2.className = 'englishQuizOptionWrap'
    const englishQuizOption2 = document.createElement('input')
    englishQuizOption2.type = 'radio'
    englishQuizOption2.value = `${englishWord[randomOptionIndexArray[1]][1]}`
    englishQuizOption2.name = 'Option'
    const englishQuizOptionLabel2 = document.createElement('label')
    englishQuizOptionLabel2.textContent = `${englishWord[randomOptionIndexArray[1]][1]}`
    englishQuizOptionWrap2.appendChild(englishQuizOption2)
    englishQuizOptionWrap2.appendChild(englishQuizOptionLabel2)

    const englishQuizOptionWrap3 = document.createElement('div')
    englishQuizOptionWrap3.className = 'englishQuizOptionWrap'
    const englishQuizOption3 = document.createElement('input')
    englishQuizOption3.type = 'radio'
    englishQuizOption3.value = `${englishWord[randomOptionIndexArray[2]][1]}`
    englishQuizOption3.name = 'Option'
    const englishQuizOptionlabel3 = document.createElement('label')
    englishQuizOptionlabel3.textContent = `${englishWord[randomOptionIndexArray[2]][1]}`
    englishQuizOptionWrap3.appendChild(englishQuizOption3)
    englishQuizOptionWrap3.appendChild(englishQuizOptionlabel3)

    const answerCheckButton = document.createElement('button')
    answerCheckButton.textContent = '정답확인'
    answerCheckButton.addEventListener('click', async function () {
        const optionButton = document.getElementsByName("Option")
        for (let i = 0; i < optionButton.length; i++) {
            let isSelected = optionButton[i].matches(":checked")
            if (isSelected) {
                if (optionButton[i].value == englishWord[randomProblemAnswerIndex][1]) {
                    const englishItemData = await fetchEnglishItemData()
                    const englishItem = makeItemDiv(englishItemData[0], englishItemData[0].inventory_id)
                    inventoryBox.appendChild(englishItem)
                    renderEnglishQuiz()
                    collectionCheck(englishItemData[0])
                    alert('정답! 아이템을 얻었습니다')
                }
                else {
                    alert('오답')
                }
            }
        }
    })

    allOptionWarp.appendChild(englishQuizOptionWrap1)
    allOptionWarp.appendChild(englishQuizOptionWrap2)
    allOptionWarp.appendChild(englishQuizOptionWrap3)
    allDivWrap.appendChild(englishQuiz)
    allDivWrap.appendChild(allOptionWarp)
    allDivWrap.appendChild(answerCheckButton)
    englishQuizWrap.appendChild(allDivWrap)
    getItemBox.appendChild(englishQuizWrap)
}

function onClickEnglishQuizButton() {
    renderEnglishQuiz()
}

function onClickQuizTabButton() {
    changeSellState(false)
    renderQuizBox()
}

async function renderDrawBox() {
    getItemBox.replaceChildren()
    // 노말등급 일반 뽑기 
    const nomalDrawButtonWrap = document.createElement('div')
    nomalDrawButtonWrap.className = 'ticketWrap'
    const normalDrawText = document.createElement('div')
    normalDrawText.className = 'ticketText'
    normalDrawText.textContent = '1티켓 or 3원'
    const nomalDrawButton = document.createElement('button')
    nomalDrawButton.textContent = '일반뽑기'
    nomalDrawButton.className = 'drawButton'
    nomalDrawButton.addEventListener('click', async function () {
        const drawItemData = await fetchDrawItemData('normal')
        const darwItem = makeItemDiv(drawItemData[0][0], drawItemData[1])
        inventoryBox.appendChild(darwItem)
        updateInventoryINFO()
        collectionCheck(drawItemData[0][0])
    })
    // 레어~에픽등급 스페셜 뽑기
    const specialDrawButtonWrap = document.createElement('div')
    specialDrawButtonWrap.className = 'ticketWrap'
    const specialDrawText = document.createElement('div')
    specialDrawText.className = 'ticketText'
    specialDrawText.textContent = '1티켓 or 15원'
    const specialDrawButton = document.createElement('button')
    specialDrawButton.textContent = '고급뽑기'
    specialDrawButton.className = 'drawButton'
    specialDrawButton.addEventListener('click', async function () {
        const drawItemData = await fetchDrawItemData('special')
        const darwItem = makeItemDiv(drawItemData[0][0], drawItemData[1])
        inventoryBox.appendChild(darwItem)
        updateInventoryINFO()
        collectionCheck(drawItemData[0][0])
    })

    nomalDrawButtonWrap.appendChild(nomalDrawButton)
    nomalDrawButtonWrap.appendChild(normalDrawText)
    specialDrawButtonWrap.appendChild(specialDrawButton)
    specialDrawButtonWrap.appendChild(specialDrawText)
    getItemBox.appendChild(nomalDrawButtonWrap)
    getItemBox.appendChild(specialDrawButtonWrap)
}

function onClickDrawTabButton() {
    changeSellState(false)
    renderDrawBox()
}

function makeItemDiv(itemObject, inventoryId) {
    const item = document.createElement('div')
    item.className = 'item'
    item.innerHTML = itemObject.name + '<br>' + itemObject.level
    item.dataset.inventoryId = inventoryId
    item.addEventListener('click', onClickItem(item, itemObject))
    item.addEventListener('mouseenter', renderItemINFO(item, itemObject))
    item.addEventListener('mouseout', () => {
        const itemTextDiv = document.getElementById('itemINFO')
        item.removeChild(itemTextDiv)
    })
    return item
}

function renderSellItemBox() {
    getItemBox.replaceChildren()
    sellState = true
    const sellBox = document.createElement('div')
    sellBox.id = 'sellBox'
    sellBox.textContent = '판매할 아이템을 선택하세요'
    const sellButton = document.createElement('button')
    sellButton.addEventListener('click', onClickSellTabButton)
    sellButton.textContent = '판매'
    getItemBox.appendChild(sellBox)
    getItemBox.appendChild(sellButton)
}

async function onClickSellTabButton() {
    let sellItemsInventoryIdArr = []
    const sellItemList = sellBox.childNodes
    for (let i = 0; i < sellItemList.length; i++) {
        sellItemsInventoryIdArr.push(sellItemList[i].dataset.inventoryId)
    }
    const sellPrice = await fetchSellItems(sellItemsInventoryIdArr)
    console.log(sellPrice)
    alert("판매 금액 : " + sellPrice.result)
    updateSellCount(-sellItemList.length)
    renderSellItemBox()
    updateInventoryINFO()
    changeTabButton(false)
}

function changeSellState(state) {
    sellState = state
}

function updateSellCount(changeCount) {
    sellItemCount = sellItemCount + changeCount
}

function changeTabButton(state) {
    quizButton.disabled = state
    drawButton.disabled = state
    sellButton.disabled = state
    enforceButton.disabled = state
    editButton.disabled = state
}


document.getElementById('quizTabButton').addEventListener('click', onClickQuizTabButton)
document.getElementById('drawTabButton').addEventListener('click', onClickDrawTabButton)
document.getElementById('sellTabButton').addEventListener('click', renderSellItemBox)

export {
    renderQuizBox, onClickItem, onClickQuizTabButton, renderDrawBox, onClickDrawTabButton, makeItemDiv, changeSellState, sellState, sellItemCount, updateSellCount, changeTabButton
}