
// generator
function ajaxSendJson(data, url=link){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("X-CSRFToken", csrf_token);
    xhr.send(JSON.stringify(data));
    console.log("successfully updated")
}

let totalWordNumber;
let viewedWordNumber = 0;



function * wordGenerator(array){
    newArray = array.filter(p=>p["skip"]!="true")
    totalWordNumber = newArray.length
    updateWordNumber(totalWordNumber)
    console.log(newArray.length)
    for (var i = newArray.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = newArray[i];
        newArray[i] = newArray[j];
        newArray[j] = temp;
    }
    yield * newArray
}

let wordList_generator = wordGenerator(wordListArray)
wordList_generator["vocabLeft"] = wordListArray.length
console.log(wordList_generator);
let vocabListDate_generator;

// mode = all or focus
let mode = "all"
let wordLeftCounter = 0;

function createWordCard(word, vocabLeft){
    viewedWordNumber+=1
    wordArea.innerHTML = word["word"]
    wordIdArea.innerHTML = `${word["wordId"]}`
    wordMeaningArea.innerHTML = word["meaning"] + "<p>" +  word["example"]+ "</p>"
    wordMeaningArea.style.display = "none"
    wordLeft.innerHTML = vocabLeft


    if (word["viewNumber"]){
        wordviewNumber.innerHTML = word["viewNumber"]
    } else {
        wordviewNumber.innerHTML = 0
    }
    currentWord = word


    // console.log(currentWord)
}

function updateWordNumber(number){
    wordNumber.innerText = number
}

// nav
let all = document.querySelector(".modeAll")

// area

let wordNumber = document.querySelector(".wordNumber")
updateWordNumber(totalWordNumber)
let wordArea = document.querySelector(".word")
let wordIdArea = document.querySelector(".wordId")
let wordMeaningArea = document.querySelector(".wordMeaning")
let wordviewNumber = document.querySelector(".wordViewNumber")
let wordLeft = document.querySelector(".wordLeft")
let vocabListPanel = document.querySelector(".vocabListPanel")


// buttons

let nextButton = document.querySelector(".next")
let showAnswerButton = document.querySelector(".showAnswer")
let deleteButton = document.querySelector(".delete")
let markButton = document.querySelector(".markButton")
let addMnemonicsButton = document.querySelector(".mnemonics")
let addExampleButton = document.querySelector(".example")
let addToVocabListButton = document.querySelector(".addToVocabListButton")

let addNewWordButton = document.querySelector(".addNewWord")




// nav function
all.addEventListener("click", function(){
    mode = "all"


})

// buttonFunction
nextButton.addEventListener("click", function(){
    let wordId = document.querySelector(".wordId").innerText
    wordListArray.forEach((p, i)=>{
        // search each word in the list, if find the list, then view number + 1

        if (p["wordId"] == wordId){
            if (p["viewNumber"]){
                p["viewNumber"] += 1
            } else {
                p["viewNumber"] = 1
            }

        }
    })
    wordList["termArray"] = wordListArray
    // wordList["termArray"][wordId]["skip"] = "true"
    // console.log(wordList["termArray"], currentWord["wordId"])
    ajaxSendJson(wordList)
    updateWordNumber(totalWordNumber)

    if (mode == "all"){
        wordList_generator["vocabLeft"] = totalWordNumber - viewedWordNumber
        console.log(totalWordNumber - viewedWordNumber)
        createWordCard( wordList_generator.next().value, wordList_generator["vocabLeft"])
    } else {
        vocabListDate_generator["vocabLeft"] = totalWordNumber - viewedWordNumber
        createWordCard( vocabListDate_generator.next().value, vocabListDate_generator["vocabLeft"])
    }
})

showAnswerButton.addEventListener("click", function(){
    wordMeaningArea.style.display = "block"
})

deleteButton.addEventListener("click", function(){
    let wordId = document.querySelector(".wordId").innerText

    console.log(wordListArray)
    wordListArray.forEach((p, i)=>{

        if (p["wordId"] == wordId){
            console.log(p, wordId)
            p["skip"] = "true"
        }
    })
    wordList["termArray"] = wordListArray
    // wordList["termArray"][wordId]["skip"] = "true"
    // console.log(wordList["termArray"], currentWord["wordId"])
    ajaxSendJson(wordList)
    updateWordNumber(totalWordNumber)
    nextButton.click()
})

addMnemonicsButton.addEventListener("click", function(){

})

addNewWordButton.addEventListener("click", function(){
    let newWord = document.querySelector(".newWord")
    let newWordMeaning = document.querySelector(".newWordMeaning")
    let newWordExampleSentence = document.querySelector(".newWordExampleSentence")
    let newWordMnemonic = document.querySelector(".newWordMnemonic")


    let lastID = wordList["termArray"].length
    let wordObject = {
        "word": newWord.value,
        "meaning": newWordMeaning.value,
        "example": newWordExampleSentence.value,
        "mnemonics": newWordMnemonic.innerHTML,
        "wordId": lastID
    }

    newWord.value = ""
    newWordMeaning.value = ""
    newWordExampleSentence.value = ""
    newWordMnemonic.innerHTML = ""

    wordList["termArray"].push(wordObject)
    ajaxSendJson(wordList)
    updateWordNumber(totalWordNumber)
})

addToVocabListButton.addEventListener("click", function(){
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    if (!wordList["vocabList"]){
        wordList["vocabList"] = {}
    }

    if (!wordList["vocabList"][today]){
        wordList["vocabList"][today] = []
    }

    wordList["vocabList"][today].push(currentWord.wordId)
    ajaxSendJson(wordList)

    nextButton.click()
})


// initial data

let currentWord = wordList_generator.next().value
createWordCard(currentWord)

let vocabListPanelData = wordList["vocabList"]
Object.entries(vocabListPanelData).reverse().forEach(obj=>{
    let key = obj[0]
    let vocabList = obj[1]
    let vocabListLabel = document.createElement("div")
    vocabListLabel.innerText = key
    vocabListLabel.__data__ = filterByID(vocabList)
    vocabListLabel.addEventListener("click", function(){
        vocabListDate_generator = wordGenerator(vocabListLabel.__data__)
        vocabListDate_generator["vocabLeft"] = vocabListLabel.__data__.length
        mode = "focus"

    })

    vocabListPanel.append(vocabListLabel)


})

function filterByID(array){
    let filteredArray = []
    array.forEach(id=>{
        wordListArray.forEach(word=>{
            if (word.wordId == id) {
                filteredArray.push(word)
            }
        })
    })
    return filteredArray
}



// shortCut
document.addEventListener("keydown", function(){
    if (event.keyCode==49){ // 49=="1", go to next word
        addToVocabListButton.click()
    }// go to next word
    if (event.keyCode==50){ // 50=="2", go to next word
        nextButton.click()

    }// go to next word
    if (event.keyCode==51){ // 49=="3", go to next word
        showAnswerButton.click()


    }// go to next word
    if (event.keyCode==52){ // 49=="4", go to next word
        deleteButton.click()

    }// go to next word
})
