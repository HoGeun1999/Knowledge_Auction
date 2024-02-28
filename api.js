async function fetchUserData() { 
    const url = 'http://localhost:3000/userData/' 
    const userData = await fetch(url)  
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

async function fetchMathItemData() {
    const url = 'http://localhost:3000/mathItemData'
    const mathItmeData = await fetch(url, {
        method: "POST" 
    }).then((res) => {
        if (!res.ok) {
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

async function fetchEnglishItemData() {
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

async function fetchDrawItemData(rarity) {
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

function fetchSellItems(sellItemsInventoryIdArr) {
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

function fetchCollectionData() {
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

function fetchCollectionReward(collectionId) {
    const url = 'http://localhost:3000/collectionReward/'
    console.log(collectionId, url)
    const collectionReward = fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: collectionId })
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

function fetchEnforceItem(inventoryId) {
    let url = 'http://localhost:3000/items/enforce/'
    const enforceData = fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: inventoryId })
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

    return enforceData
}

function fetchEditItem(leftItemData, rightItemData) {
    const url = 'http://localhost:3000/items/edit'
    const editItemData = fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
            {
                leftItemId: leftItemData,
                rightItemId: rightItemData
            })
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

    return editItemData
}

export { fetchUserInventoryItems, fetchUserData, fetchMathItemData, fetchEnglishItemData, fetchDrawItemData, fetchSellItems, fetchCollectionData, fetchCollectionCheck, fetchCollectionReward, fetchEnforceItem, fetchEditItem }