/*
--------코스트 설계--------
5렙까지 존재
실패시 하락 파괴확률 항상 10%
노말 1렙 = 1코스트 강화비용 = 1코
노말 2렙 = 2코스트 강화성공확률 80
노말 3렙 = 3코스트 강화성공확률 70
노말 4렙 = 5코스트 강화성공확률 60
노말 5렙 = 8코스트 강화성공확률 50

레어 1 = 3코  강화비용 2코
레어 2 = 6코 70
레어 3 = 10코 60
레어 4 = 15코 50
레어 5 = 20코 40    

에픽 1 = 10코  강화비용 4코
에픽 2 = 15코 60
에픽 3 = 20코 50
에픽 4 = 30코 40
에픽 5 = 45코 30

(레전은 무조건 합성 획득)
레전 1 = 10코  강화비용 7코 
레전 2 = 20코 50
레전 3 = 35코 40
레전 4 = 55코 30
레전 5 = 80코 30
*/
export const enforceTable = {
    Normal : [8,7,6,5]

}

export const enforceCostTable = {
    Normal : [1,1,1,1]
}

const Knowledge = [
{
    name : '영어',
    rarity : 'nomal',
    level : 1,
    price : 1,
    recipe : []
}
]


export const knowledgeObject = ['국어','수학','영어','과학','사회','미적분학',
'열역학','화학','생물학','지구과학','물리학','정보','']
// 노말
const nomalList = ['국어','수학','영어','과학','사회','정보기술','체육','미술','음악','역사']

const rareList = ['화학','생물학','지구과학','물리학','철학','종교학','경제학','지리학','전산학','통계학','기하학','대수학','간호학','동물학','무용학','국악학','행정학','심리학']

const epicList = ['의학','법학','고고학','언어학','인간학','천문학','약학','수의학','신학','기계공학','핵물리학','현대미술','해석학']

const legendList = ['우주학','인류학','연금술','양자물리학','종합예술']

// 레어 + 에픽 (레전드 제외)
const specialDrawList = ['','','화학','생물학','지구과학','물리학'] 

/* 조합법
-----레어-----
없는건 다 온리 뽑기
전산학 = ['정보기술','수학']
국악학 = ['음악','국어']
행정학 = ['사회','국어']
경제학 = ['수학','사회']
대수학 = ['수학','수학']
무용학 = ['음악','체육']
----에픽------
의학 = ['생물학','과학']
법학 = ['사회','행정학']
고고학 = ['역사','지리학']
언어학 = ['영어','역사']
인간학 = ['심리학','역사']
천문학 = ['지구과학','과학']
약학 = ['생명과학','화학']
수의학 = ['동물학','과학']
신학 = ['종교학','철학']
기계공학 = ['수학','물리학']
핵물리학 = 뽑기
해석학 = ['수학','통계학']
현대미술 = 뽑기
------레전-------
우주학 = ['천문학','지구과학']
인류학 = ['인간학','고고학']
연금술 = ['화학','해석학']
양자물리학 = ['핵물리학','해석학']
종합예술 = ['현대미술','무용학']



*/

/*도감



*/


export const collectionObject = [
    {
        collectionName : '기초를 탄탄하게',
        collectionList : ['수학','영어','과학','사회','과학'],
        collectionLevel : [5,5,5,5,5],
        collectionBonus : 1,
        collectionClear : false
    },
    {
        collectionName : '예체능',
        collectionList : ['체육','미술','음악'],
        collectionLevel : [1,1,1],
        collectionBonus : 1,
        collectionClear : false
    },
    {
        collectionName : '과학박사',
        collectionList : ['물리학','화학','생물학','지구과학'],
        collectionLevel : [5,5,5,5],
        collectionBonus : 1,
        collectionClear : false
    },
    // {
    //     collectionName : '고등수학',
    //     collectionList : ['통계학','기하학','대수학','해석학'],
    //     collectionLevel : [1,1,1],
    //     collectionBonus : 1,
    //     collectionClear : false
    // },
    // {
    //     collectionName : '고고학자',
    //     collectionList : ['역사','지리학','고고학'],
    //     collectionLevel : [1,1,1],
    //     collectionBonus : 1,
    //     collectionClear : false
    // }
]

