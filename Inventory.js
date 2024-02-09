import { upgradeState, renderEnforceBox, renderEditBox } from "./Upgrade.js"
import { sellState, sellItemCount, updateSellCount,makeItem } from "./getItem.js"
let inventory = document.getElementById('inventory')
const enforceButton = document.getElementById('enforceTabButton')
const editButton = document.getElementById('editTabButton')
const quizButton = document.getElementById('quiz')
const drawButton = document.getElementById('draw')
const sellButton = document.getElementById('sell')
let userMoney = 10
let userNormalRandomTicket = 10
let userSpecialRandomTicket = 10
let isFull = 0
let leftFull = 0
let rightFull = 0

function setIsfull(state) {
    isFull = state
    enforceButton.disabled = false;
    editButton.disabled = false;
}



function renderItemINFO(item, data) {
    return function () {
        const itemInfoText = document.createElement('div')
        itemInfoText.innerHTML = '아이템 정보창' + '<br>' + '지식:' + data.name + '<br>' + '희귀도:' + data.rarity + '<br>' + '가격:' + data.price
        itemInfoText.id = 'itemInfo'
        let rect = item.getBoundingClientRect();
        itemInfoText.style.left = rect.x + 80;
        itemInfoText.style.top = rect.y + 10;
        item.appendChild(itemInfoText)
    }

}

function moveItemToUpgrade(item, moveLocation) {
    moveLocation.innerHTML = ''
    moveLocation.appendChild(item)
    enforceButton.disabled = true;
    editButton.disabled = true;
}

function onClickItem(item, data) {
    return () => {
        const sellBox = document.getElementById('sellBox')
        const enforceBox = document.getElementById('enforceBox')
        const newItem = makeItem(data)
        if (sellState == true && sellItemCount == 0) {
            quizButton.disabled = true
            drawButton.disabled = true
            sellButton.disabled = true
            inventory.removeChild(item)
            newItem.addEventListener('click', onClickSellItem(data, newItem))
            sellBox.innerHTML = ''
            sellBox.appendChild(newItem)
            updateSellCount(1)
            return
        }
        else if (sellState == true && sellItemCount != 0) {
            inventory.removeChild(item)
            newItem.addEventListener('click', onClickSellItem(data, newItem))
            sellBox.appendChild(newItem)
            updateSellCount(1)
            return
        }

        if (data[0].level === 5) {
            console.log('최고레벨')
            return true
        }
        if (upgradeState == 1 && isFull === 0) {
            inventory.removeChild(item)
            newItem.addEventListener('click', onClickEnforceItem(data))
            moveItemToUpgrade(newItem, enforceBox)
            isFull = 1
            quizButton.disabled = true
            drawButton.disabled = true
            sellButton.disabled = true
        }
        else if (upgradeState == 2) {
            quizButton.disabled = true
            drawButton.disabled = true
            sellButton.disabled = true
            const editBoxLeft = document.getElementById('editBoxLeft')
            const editBoxRight = document.getElementById('editBoxRight')
            if (leftFull === 0) {
                inventory.removeChild(item)
                newItem.addEventListener('click', onClickEditItem(data, newItem))
                moveItemToUpgrade(newItem, editBoxLeft)
                leftFull = 1
            }
            else if (rightFull === 0) {
                inventory.removeChild(item) // TODO: child가 있는지 없는지 확인하고 삭제하기
                newItem.addEventListener('click', onClickEditItem(data, newItem))
                moveItemToUpgrade(newItem, editBoxRight)
                rightFull = 1
            }
        }
    }
}

function onClickEnforceItem(data) {
    return () => {
        const inventory = document.getElementById('inventory')
        const newItem = makeItem(data)

        renderEnforceBox()
        inventory.appendChild(newItem)
        enforceButton.disabled = false;
        editButton.disabled = false;
        isFull = 0
        quizButton.disabled = false
        drawButton.disabled = false
        sellButton.disabled = false
    }
}

function onClickEditItem(data, item) {
    return () => {
        const inventory = document.getElementById('inventory')
        const editBox = item.parentNode;
        const newItem = makeItem(data)
        editBox.removeChild(item)
        editBox.innerHTML = '합성할 아이템을 선택하세요'
        inventory.appendChild(newItem)
        if (editBox.id == 'editBoxLeft')
            leftFull = 0
        if (editBox.id == 'editBoxRight')
            rightFull = 0

        if (leftFull === 0 && rightFull === 0) {
            enforceButton.disabled = false;
            editButton.disabled = false;
            quizButton.disabled = false
            drawButton.disabled = false
            sellButton.disabled = false
        }
    }
}

function onClickSellItem(data, item) {
    return () => {
        const inventory = document.getElementById('inventory')
        const newItem = makeItem(data)
        sellBox.removeChild(item)
        inventory.appendChild(newItem)
        updateSellCount(-1)
        if (sellItemCount == 0) {
            sellBox.innerHTML = '판매할 아이템을 선택하세요'
            quizButton.disabled = false
            drawButton.disabled = false
            sellButton.disabled = false
        }
    }
}

// function makeItem(data) {
//     const newItem = document.createElement('div')
//     newItem.className = 'item'
//     newItem.innerHTML = data[0].name + '<br>' + data[0].level
//     newItem.dataset.inventoryId = data[1]
//     newItem.addEventListener('click', onClickItem(newItem, data))
//     newItem.addEventListener('mouseenter', renderItemINFO(newItem, data))
//     newItem.addEventListener('mouseout', () => {
//         const itemTextDiv = document.getElementById('itemInfo')
//         newItem.removeChild(itemTextDiv)
//     })

//     return newItem
// }


function renderInventoryBox() {
    const userItemINFOwrap = document.createElement('div')
    userItemINFOwrap.id = 'userItemINFOwrap'
    const userItemINFO = document.createElement('div')
    const inventory = document.getElementById('inventory')
    userItemINFO.id = 'userItemINFO'
    userItemINFO.innerHTML = `보유 금액: ${userMoney}, 일반티켓 : ${userNormalRandomTicket
        }개, 특별티켓 : ${userSpecialRandomTicket}개`
    userItemINFOwrap.appendChild(userItemINFO)
    inventory.appendChild(userItemINFOwrap)

    function getInventoryItems() {
        const url = 'http://localhost:3000/getInventory/'
        const response = fetch(url);
        return response.then(res => res.json());
    }


    async function exec() {
        try {
            const items = await getInventoryItems();
            for (let i = 0; i < items.length; i++) {
                const inventoryItem = makeItem(items[i],items[i].inventory_id)
                inventory.appendChild(inventoryItem)
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    exec();

    // fetch(url)
    // .then(function(response){
    //     return response.json()
    // })
    // // .then(function(data){
    // //     console.log(data)
    // // })
    // const inventoryItem = []
    // inventoryItem.push(p)
    // console.log(inventoryItem)
    // // Promise.all(p).then((values) => {
    // //     for(let i = 0; i < values.length; i++){
    // //         console.log(p)
    // //     }     
    // // });

}

function updateNormalRandomTicket(state) {
    userNormalRandomTicket = userNormalRandomTicket + state
}

function updateSpecialRandomTicket(state) {
    userSpecialRandomTicket = userSpecialRandomTicket + state
}

function updateUserMoney(cost) {
    userMoney = userMoney + cost

}

function updateInventoryINFO() {
    const url = 'http://localhost:3000/getUserData/'
    fetch(url)
    .then(function(response){
        return response.json()
    })
    .then(function(data){
        console.log(data[0])
        const userItemINFO = document.getElementById('userItemINFO')
        userItemINFO.innerHTML = `보유 금액: ${data[0].holdings}, 일반티켓 : ${data[0].userNormalRandomTicket}개, 
        특별티켓 : ${data[0].specialTicket}개`
    })

}

export {
    renderItemINFO, onClickItem, renderInventoryBox, setIsfull, isFull, userMoney, updateSpecialRandomTicket,
    updateNormalRandomTicket, userNormalRandomTicket, userSpecialRandomTicket, updateInventoryINFO, updateUserMoney,
    leftFull, rightFull
}