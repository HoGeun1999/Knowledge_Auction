
function renderItemINFO(item,data){
    return function(){
        console.log(data.id)
        const itemInfoText = document.createElement('div')
        itemInfoText.innerHTML = '아이템 정보창' + '<br>' + '지식:' + data.name + '<br>' + '희귀도:' + data.rarity
        itemInfoText.id = 'itemInfo'

        let rect = item.getBoundingClientRect();
        itemInfoText.style.left = rect.x + 80;
        itemInfoText.style.top = rect.y + 10;
        console.log(rect.x,rect.y)
        item.appendChild(itemInfoText)
    }
    
}


function renderInventoryBox(){

}



export {renderItemINFO}