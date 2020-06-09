let mainController = new generalizedQuizController()

// generator
let newItem = document.querySelector(".newItem")
let newItemButton = document.querySelector(".newItemButton")
newItemButton.addEventListener("click", function(){
    mainController.addItemToTOC(newItem.value)
})
mainController.createTOCList()

console.log(mainController.sideBarBody)

function startProgram(wordListArray){
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

}


// shortCut
document.addEventListener("keydown", function(){
    if (mainController.learningMode=="focus"){
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
    }
})
