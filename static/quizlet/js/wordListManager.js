class WordListManager {
    constructor(title, url){
        this.mode = "all"
        this.url = url
        this.wordLeftCounter = 0
        this.totalWordNumber = 0
        this.lastID = 0
        this.wordAreaHtmlObject = this.createWordAreaHtmlObject()
        this.wordListData = this.getWordListFromDatabase(title)
        this.wordList = new WordList()
    }

    createWordAreaHtmlObject(){
        let wordArea = new WordArea(this)
        return wordArea
    }

    filterByID(){
        // to filter the wordListData according to the ID
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

    ajaxSendJson(data){
        var xhr = new XMLHttpRequest();
        xhr.open("POST", this.url, true);
        xhr.setRequestHeader("X-CSRFToken", csrf_token);
        xhr.send(JSON.stringify(data));
        console.log("successfully updated")
    }
}

class WordArea {
    constructor(manager){
        this.manager = manager
        this.totalWordNumber = 0
        this.viewedWordNumber = 0
        this.wordGenerator = null

        // word Card Area
        this.titleHtmlObject = document.querySelector(".wordListTitle")
        this.wordHtmlObject = document.querySelector(".word")
        this.wordIdHtmlObject = document.querySelector(".wordId")
        this.wordViewNumberHtmlObject = document.querySelector(".wordViewNumber")
        this.wordLeftHtmlObject = document.querySelector(".wordLeft")
        this.wordMeaning = document.querySelector(".wordMeaning")


        // current word controller
        this.addToVocabListButton = null
        this.nextWordButton = null
        this.showAnswerButton = null
        this.deleteButton = null

        // new word controller
        this.newWord = document.querySelector(".newWord")
        ths.newWordMeaning = document.querySelector(".newWordMeaning")
        this.newWordExampleSentence = document.querySelector(".newWordExampleSentence")
        this.addButton = document.querySelector(".addNewWord")
    }

    createWordGenerator(wordListArray){

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

        this.wordGenerator =  wordGenerator(wordListArray)
        this.totalWordNumber = wordListArray.length
    }

    createWordCard(_w){
            this.wordLeftCounter-=1
            this.wordHtmlObject.innerText = _w["word"]

            this.wordIdHtmlObject.innerText = _w["id"]

            this.wordViewNumberHtmlObject.innerText = _w["wordViewNumber"]

            this.wordLeftHtmlObject.innerText = this.wordLeftCounter

            ocument.querySelector(".wordMeaning").innerHTML = _w["meaning"]
    }

    createWordController(){
        this.addToVocabListButton =  document.querySelector(".addToVocabListButton")
        this.nextWordButton =  document.querySelector(".next")
        this.showAnswerButton = document.querySelector(".showAnswer")
        this.deleteButton = document.querySelector(".delete")
    }

    createNewWordController(){
        this.newWord = document.querySelector(".newWord")
        ths.newWordMeaning = document.querySelector(".newWordMeaning"),
        this.newWordExampleSentence = document.querySelector(".newWordExampleSentence"),
        this.addButton = document.querySelector(".addNewWord"),
    }

    calculateNextArrivalTime(word){
        let dateMapping = {
            "0": 1,
            "1": 2,
            "2": 4,
            "3": 7,
            "8": 15
        }

        let stage = word.stage.toString()
        let today = = new Date();
        let nextDate = today.setDate(today.getDate() + dateMapping[stage]);
        word.nextDate = nextDate
    }

    getLastId(){
        let last = this.mainWordList.length-1
        console.log(this.mainWordList)
        return this.mainWordList[last]["id"]+1
    }

    getWordListFromDatabase(title){
        let jsonRequest = this.createRequestJson("retrive", title)
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


}
