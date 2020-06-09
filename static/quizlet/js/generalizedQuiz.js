function generalizedQuizController(){
    this.learningMode = "not_focuse"
    this.processLink = link
    this.TOC = tocContent
    this.wordListManager = new WordList()
    console.log(this.wordListManager)

    this.searchJson = function (field, value, jsonArray){
        // to create an array such that if value is not exist in the jsonArray, then the mapped array will be all false
        let result = jsonArray.map(p=>p[field]==value)
        let valueNotExist = result.every(p=>p==false)
        return valueNotExist
    }

    this.changeLearningMode = function(mode){
        mode = mode=="focus"?"not_focus":"focus"
        console.log(mode)
        this.learningMode = mode
    }


    // wordObject functions
    this.renderWordList = function(title){
        this.wordListManager.getWordListFromDatabase(title)
    }

    // TOC functions
    this.createTOCList = function(){
        this.sideBarBody = document.querySelector(".sideBar_body")
        this.TOC.forEach(p=>{
            this.createTocItem(p["title"])
        })
    }

    this.createTocItem = function(title){
        let _object = this
        let item = document.createElement("div")
        item.classList.add("TocItem")
        item.innerText = title
        item.addEventListener("click", function(){
            _object.renderWordList(title)
        })
        this.sideBarBody.append(item)
    }

    this.addItemToTOC = function(title){
        let valueNotExist = this.searchJson("title", title, this.TOC)
        if (valueNotExist){
            let newItem = {
                "title":title
            }
            this.TOC.push(newItem)
            let requestJson = createRequestJson("create", title, this.TOC)
            console.log(requestJson)

            ajaxSendJson(requestJson, function(){
                console.log("success_hard_coded")
            })
            this.createTocItem(title)

        } else {
            console.log("already have it")
        }
    }


}
