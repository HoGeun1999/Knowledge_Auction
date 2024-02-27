async function fetchGetUserData() { // 이름이 맞나?
    const url = 'http://localhost:3000/userData/' //명사 써야되는게 맞는데 userData or userInventoryResource 뭐가더 좋아보이는지
    const userData = await fetch(url)  // 아래 함수처럼 어차피 에러처리해주면서 then2번쓰면 굳이 여기서 awit할 필요가 없는듯?
    return userData.json()
}

function fetchUserInventoryItems() {
    const url = 'http://localhost:3000/userInventoryItems/'
    const inventoryItem = fetch(url)
        .then((res) => {
            if (!res.ok) {
                return res.text().then(text => {
                    throw new Error(text)
                })
            }
            return res.json()
        }).then(
            (data) => {
                return data
            },
            (error) => {
                alert(error)
            }
        )

    return inventoryItem
}

async function fetchGetMathItemData() {
    const url = 'http://localhost:3000/mathItemData'
    const mathItmeData = await fetch(url, {
        method: "POST"  // POST와 PUT 차이점? << PUT이 더 맞나 이런 상황은? 아니면 그정도는 상관없나
    }).then((res) => {
        if (!res.ok) {  // 이 fetch 에러를 딱히 컨트롤할게 없음.. 애매
            return res.text().then(text => { //문법이해가 안됨
                throw new Error(text)
            })
        }
        return res.json()
    }).then(
        (data) => {
            return data
        },
        (error) => {
            alert(error)
        }
    )
    return mathItmeData
}

async function fetchGetEnglishItemData() {
    const url = 'http://localhost:3000/englishItemData'
    const englishItem = await fetch(url, {
        method: "POST"
    }).then((res) => {
        if (!res.ok) {
            return res.text().then(text => {
                throw new Error(text)
            })
        }
        return res.json()
    }).then(
        (data) => {
            return data
        },
        (error) => {
            alert(error)
        }
    )

    return englishItem
}

async function fetchGetDrawItemData(rarity) {
    const url = `http://localhost:3000/randomDraw/${rarity}`
    const drawItemData = await fetch(url, {
        method: "POST"
    }).then((res) => {
        if (!res.ok) {
            return res.text().then(text => {
                throw new Error(text)
            })
        }
        return res.json()
    }).then(
        (data) => {
            return data
        },
        (error) => {
            alert(error)
        }
    )

    return drawItemData
}

function fetchSellItems(sellItemsInventoryIdArr) {  /// 이 함수를 받아 쓰는 프론트에서 async await를 쓰면 여기서 안써도 되는대 반대로는 안됨..그럼 여기는 할필요 없는거 아닌가?
    const url = 'http://localhost:3000/sellItems/'
    const sellPrice = fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sellItemsInventoryIdArr),
    }).then((response) => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(text)
            })
        }
        return response.json()
    }).then(
        (data) => {
            return data
        },
        (error) => {
            alert(error)
        }
    )
    return sellPrice
}

function fetchGetCollectionData() {
    const url = 'http://localhost:3000/collectionData/'
    const collectionData = fetch(url)
        .then((response) => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(text)
                })
            }
            return response.json()
        }).then(
            (data) => {
                return data
            },
            (error) => {
                alert(error)
            }
        )
    return collectionData
}

function fetchCollectionCheck(itemData) {
    const url = 'http://localhost:3000/collectionCheck/'
    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: itemData.name, level: itemData.level })
    })
}

function fetchCollectionReward(collectionId){
    const url = 'http://localhost:3000/collectionReward/'
    console.log(collectionId,url)
    const collectionReward = fetch(url, {
        method: "POST" ,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id : collectionId })
    }).then((response) => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(text)
            })
        }
        return response.json()
    }).then(
        (data) => {
            return data
        },
        (error) => {
            alert(error)
        }
    )

    return collectionReward
}

// app.js에서 처리할때 select, insert, update, delete 등등 여러 동작을 같이 수행하면 결국 request method를 뭘로 해야함?
// ex) 판매작업 



export { fetchUserInventoryItems, fetchGetUserData, fetchGetMathItemData, fetchGetEnglishItemData, fetchGetDrawItemData, fetchSellItems, fetchGetCollectionData, fetchCollectionCheck, fetchCollectionReward }