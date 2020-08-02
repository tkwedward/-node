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
