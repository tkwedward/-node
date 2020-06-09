function WordList(){
    this.mode = "all"
    this.wordLeftCounter = 0
    this.totalWordNumber = 0
    this.lastID = 0

    this.wordArea = {
        "title": document.querySelector(".wordListTitle"),
        "word": document.querySelector(".word"),
        "wordId": document.querySelector(".wordId"),
        "wordViewNumber": document.querySelector(".wordViewNumber"),
        "wordLeft": document.querySelector(".wordLeft"),
        "wordMeaning": document.querySelector(".wordMeaning")
    } // wordArea

    this.wordAreaController = {
        "addToVocabListButton": document.querySelector(".addToVocabListButton"),
        "next": document.querySelector(".next"),
        "showAnswer": document.querySelector(".showAnswer"),
        "delete": document.querySelector(".delete")
    } // wordAreaController

    this.addNewWordController = {
        "newWord": document.querySelector(".newWord"),
        "newWordMeaning": document.querySelector(".newWordMeaning"),
        "newWordExampleSentence": document.querySelector(".newWordExampleSentence"),
        "addButton": document.querySelector(".addNewWord"),
    }// addNewWordController

    this.getLastId = function(){
        let last = this.mainWordList.length-1
        console.log(this.mainWordList)
        return this.mainWordList[last]["id"]+1
    }

    // initialize the wordList
    this.getWordListFromDatabase = function(title){
        let jsonRequest = createRequestJson("retrive", title)
        this.title = title

        var promiseObj = new Promise((resolve, reject)=>{
            ajaxSendJson(jsonRequest, resolve)
        })
        .then(wordListResult=>{
            this.mainWordList = wordListResult["wordList"]
            this.totalWordNumber = this.mainWordList.length
            this.wordLeftCounter = this.mainWordList.length
        }).then(()=>{
            this.wordArea.title.innerText = title
            this.wordGenerator = this.createWordGenerator(this.mainWordList)
            this.createWordCard(this.wordGenerator.next().value)
        }).then(()=>{// to link the button to the functions
            _object = this
            this.wordAreaController.next.addEventListener("click", function (){ // nextButton
                if (_object.wordLeftCounter==0){
                    _object.wordAreaController.next.disabled = true
                } else {
                    let _w = _object.wordGenerator.next().value
                    _object.createWordCard(_w)
                    console.log(_object.wordLeftCounter)
                }
            })
            this.wordAreaController.showAnswer.addEventListener("click", function (){ // showAnswer
                let _w = _object.wordGenerator.next().value
                _object.createWordCard(_w)
            })
            this.wordAreaController.delete.addEventListener("click", function (){
                let _w = _object.wordGenerator.next().value
                _object.createWordCard(_w)
            })
        }).then(()=>{// to add the function of new word
            _object = this
            _controller = this.addNewWordController
            _controller.addButton.addEventListener("click", function(){
                let _nw = {
                    "word": _controller.newWord.value,
                    "meaning": _controller.newWordMeaning.value,
                    "example": _controller.newWordExampleSentence.value,
                    "id": _object.getLastId(),
                    "wordViewNumber": 0
                }

                _object.mainWordList.push(_nw)

                let _request = createRequestJson("save", _object.title, _object.mainWordList)
                ajaxSendJson(_request)

                _controller.newWord.value = ""
                _controller.newWordMeaning.value = ""
                _controller.newWordExampleSentence.value = ""
                console.log(_nw)
            })
        })
    }// getWordListFromDatabase

    // wordGenerator
    this.createWordGenerator = function * (array){
        newArray = array.filter(p=>p["skip"]!="true")
        this.totalWordNumber = newArray.length

        console.log(newArray.length)
        for (var i = newArray.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = newArray[i];
            newArray[i] = newArray[j];
            newArray[j] = temp;
        }
        yield * newArray
    } // createWordGenerator

    this.createWordCard = function(_w){
        this.wordLeftCounter-=1
        this.wordArea.word.innerText = _w["word"]
        this.wordArea.wordId.innerText = _w["id"]
        this.wordArea.wordViewNumber.innerText = _w["wordViewNumber"]
        this.wordArea.wordLeft.innerText = this.wordLeftCounter
        this.wordArea.wordMeaning.innerHTML = _w["meaning"]
    } // createWordCard



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


}
