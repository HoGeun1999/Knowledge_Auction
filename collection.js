import { updateInventoryINFO } from "./Inventory.js"
import { fetchCollectionData, fetchCollectionCheck, fetchCollectionReward } from "./api.js"

let collectionTabObject = {}
const collectionBox = document.getElementById('collection')

async function renderCollectionBox() {
    const collectionData = await fetchCollectionData()
    for (let i = 0; i < collectionData.length; i++) {
        if (!(collectionData[i].collectionName in collectionTabObject)) {
            collectionTabObject[collectionData[i].collectionName] = 'ok'
            const collectionTab = document.createElement('div')
            const collectionClearButton = document.createElement('button')
            collectionClearButton.textContent = '완료 보상'
            collectionClearButton.addEventListener('click', async function(){
                const collectionReward = await fetchCollectionReward(collectionData[i].collectionId)
                updateInventoryINFO()
                alert(collectionReward.result)
                collectionClearButton.disabled = true
            })
            if (collectionData[i].rewardClear === 1) {
                collectionClearButton.disabled = true
            }
            collectionTab.className = 'collectionTab'
            collectionTab.textContent = collectionData[i].collectionName
            collectionBox.appendChild(collectionTab)
            collectionTab.appendChild(collectionClearButton)
        }
        const collectionItemDIv = document.createElement('div')
        collectionItemDIv.dataset.name = collectionData[i].name
        collectionItemDIv.dataset.level = collectionData[i].level
        if (collectionData[i].getHistory === 0) {
            collectionItemDIv.className = 'collectionItem'
        }
        else {
            collectionItemDIv.className = 'collectionClearItem'
        }
        collectionItemDIv.innerHTML = collectionData[i].name + '<br>' + collectionData[i].level
        collectionBox.appendChild(collectionItemDIv)
    }
}

async function collectionCheck(itemData) {
    await fetchCollectionCheck(itemData)
    const collectionItems = document.querySelectorAll(".collectionItem")
    for (let i = 0; i < collectionItems.length; i++) {
        if (collectionItems[i].dataset.name == itemData.name && collectionItems[i].dataset.level == itemData.level) {
            collectionItems[i].className = 'collectionClearItem'
        }
    }
}

export { renderCollectionBox, collectionCheck }