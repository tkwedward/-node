class WindowManager {
    constructor(){
        this.pageWrapper = document.querySelector("#pageWrapper")

        this.tabBar = {
            "left": this.createTabBar("left"),
            "right":this.createTabBar("right")
        }
        this.masterWindowHtmlObject = {
            "left": this.createHalfWindow("left"),
            "right": this.createHalfWindow("right")
        }
        this.tabArray = {
            "left": [],
            "right": []
        }
        this.popUpBoxHtmlObject = null
        this.copiedData = null

        this.tabIDList = []
        this.tabID = 0

        // loadData and create initial tabs
        let promise = new Promise((response, errorj)=>{
            let loadData = this.loadDataRequest(docTitle, docChapter, response)
        })
        promise.then(loadData =>{
            this.loadData = loadData
            let loadDataExist = true ? loadData : false
            let starterTab1 = this.createNewTab("left", "Note", loadDataExist, "mainTab", NoteTabCell)
            this.mainTab = starterTab1
            let starterTab2 = this.createNewTab("right", "Note", loadDataExist, "mirrorTab", NoteTabCell)
            this.mirrorTab = starterTab2

            starterTab1.twins = starterTab2
            starterTab2.twins = starterTab1

            this.mainTab.fromLoadCreatePage(loadData)
            this.mirrorTab.fromLoadCreatePage(loadData)


            // create section tab
            let sectionTab = this.createNewTab("right", "Section", loadDataExist, "sectionTab", NoteTabCell, this.mainTab)
            this.sectionTab = sectionTab

            let mirrorSectionTab = this.createNewTab("left", "Section", loadDataExist, "sectionTab", NoteTabCell, this.mirrorTab)
            this.mirrorSectionTab = mirrorSectionTab


            let referenceTab = this.createNewTab("right", "Reference", loadDataExist, "referenceTab", ReferenceTabCell)
            this.referenceTab = referenceTab

            let referenceTabSectionTab = this.createNewTab("left", "Section", loadDataExist, "referenceSectionTab", NoteTabCell, this.referenceTab)
            this.referenceTabSectionTab = referenceTabSectionTab

            if (loadData["referenceTab"]){
                referenceTab.fromLoadCreatePage(loadData["referenceTab"])
            } else {
                referenceTab.createNewCell()
            }


        }).then(()=>{// processSection Tab
            this.createSectionTabContent(this.mainTab, this.sectionTab)
            this.createSectionTabContent(this.mirrorTab, this.mirrorSectionTab)
            this.createSectionTabContent(this.referenceTab, this.referenceTabSectionTab)
        }).then(()=>{ // process Tab Bar
            this.fillTabBarWithTabButton()
        }).then(()=>{ // process Popup Bos

            this.createPopUpBox()
            this.tabArray["left"].forEach(t=>t.createToolBox())
            this.tabArray["right"].forEach(t=>t.createToolBox())
        }).then(()=>{
            this.showTab("left", 0)
            this.showTab("right", 1)
        }).then(()=>{ // load the position
            let tabScrollTopData = this.loadData["scrollTopData"]
            if (tabScrollTopData){
                this.loadTabPositions(tabScrollTopData)
            } else {
                console.log("no position data yet");
            }
      }).then(()=>{ // add bookmarks
            let bookmarkDictData = this.loadData["bookmarkSaveObject"]
            if (bookmarkDictData){
                bookmarkDictData.forEach(p=>{
                  let tabID = p["tabID"]
                  let tab = this.getTabFromID("left", p.tabID) || this.getTabFromID("right", p.tabID);
                  tab.bookmarkInterface.loadBookmark(p);
                  // console.log(tab.bookmarkInterface);
                })
            } else {
                console.log("no position data yet");
            }
        })
    }

    loadTabPositions(data){
        let leftData = data["leftTabData"]
        let rightData = data["rightTabData"]

        leftData.forEach(p=>{
            let tab = this.getTabFromID("left", p.tabID)
            tab.tabWindowHtmlObject.scrollTop = p.scrollTop
        })
    }

    getTabFromID(position, id){
        return this.tabArray[position].filter(p=> p.tabID==id)[0]
    }

    // create baseWindow for left or right
    createHalfWindow(position){
        let halfWindow = document.createElement("div")
        halfWindow.classList.add(position, "halfWindow")
        this.pageWrapper.append(halfWindow)

        return halfWindow
    }

    createSectionTabContent(source, sectionTab){
        let cellChain = source.getCellChain()

        sectionTab.fromCellsDataCreatePage(cellChain)
        sectionTab.createSectionTree()
        sectionTab.tree.printAllChild(sectionTab.wrapperHtmlObject)
    }

    /*
        tabBar start
    */
    createTabBar(position){
        let tabBar = document.createElement("div")
        tabBar.classList.add("tabBar", `tabBar_${position}`)
        this.pageWrapper.parentNode.insertBefore(tabBar, this.pageWrapper)
        return tabBar
    }


        createTabButton(tab, position, selected = true){
            let self = this
            let tabButton = document.createElement("span")
            tabButton.classList.add("tabButton", `tabButton_${tab.tabID}`)
            tabButton.setAttribute("tabid", tab.tabID)
            tabButton.setAttribute("tabposition", position)
            tabButton.innerHTML = tab.name
            tabButton.position = position
            tabButton.relatedWindow = this.tabBar[position]
            tab.tabButton = tabButton

            if (selected){
                tabButton.classList.add("selectedTabButton")
            }

            tabButton.addEventListener("click", function(){
                let targetTabID = tabButton.getAttribute("tabid");
                let targetTabPosition = tabButton.getAttribute("tabposition");

                let bookmarks = document.querySelectorAll(`.${tab.position}_bookmark`)

                bookmarks.forEach(p=>{
                  console.log(p);
                  p.style.display = "none"
                })

                tab.bookmarkInterface.bookmarkHtmlObject.style.display = "block"

                self.tabArray[targetTabPosition].forEach(p=>{

                    console.log(p.tabID, targetTabID);
                    p.tabButton.classList.remove("selectedTabButton")
                    if (p.tabID == parseInt(targetTabID)){
                        p.tabButton.classList.add("selectedTabButton")
                        p.tabWindowHtmlObject.style.display = "block"
                    } else {
                        p.tabWindowHtmlObject.style.display = "none"
                    }
                })
            })
            this.tabBar[position].append(tabButton)
        }


        fillTabBarWithTabButton(){
            this.tabArray["left"].forEach((p, i)=>{
                let selected = false
                if (i==0) {
                    selected = true
                }
                this.createTabButton(p, "left", selected)
            })

            this.tabArray["right"].forEach((p, i)=>{
                let selected = false
                if (i==0) {
                    selected = true
                }
                this.createTabButton(p, "right", selected)
            })
        }

        showTab(position, tabID){
            this.tabArray[position].forEach(tab=>{
                if (tab.tabID == tabID){
                    tab.tabWindowHtmlObject.style.display = "block"
                    tab.bookmarkInterface.bookmarkHtmlObject.style.display = "block"
                } else {
                    tab.tabWindowHtmlObject.style.display = "none"
                    tab.bookmarkInterface.bookmarkHtmlObject.style.display = "none"
                }
            })
        }

        createNewTab(position = "left", tabType = "Note", data = false, name, cellType, relatedTab){
            // newTab = new tab object
            // slaveWindow = the window related to the tab object
            let newTab

            if (tabType == "Note"){
                newTab = new NoteTab(this.tabID, position, name, cellType)

                // initialize the cell with an annotation, or fill in it with data
                if (data==false){
                    newTab.createNewCell()
                }
            } // if tabType == "Note"
            else if  (tabType == "Section")
            {
                newTab = new SectionTab(this.tabID, position, name, cellType, relatedTab)
            }
            else if  (tabType == "Reference")
            {
                newTab = new ReferenceTab(this.tabID, "right", name, cellType)
            }

            // console.log(this.tabArray["left"].push)
            this.tabArray[position].push(newTab)
            // add the tabs into the masterWIndow left or right array
            console.log();
            this.masterWindowHtmlObject[position].append(newTab.tabWindowHtmlObject)
            this.renderTab(this.tabID, position)

            // update the overall tabID number
            this.tabID += 1
            return newTab
        }

        renderTab(tabID, position){
            this.tabArray[position].forEach(p=>{
                if (p.tabID == tabID){
                    p.tabWindowHtmlObject.style.display = "block"
                    // p.tabWindow.style.background = "gold"
                } else {
                    p.tabWindowHtmlObject.style.display = "none"
                }
            })

        }

        removeTab(id){

        }
    /*
        tabBar end
    */

    createPopUpBox(){
        let _width = 20
        let _height = _width + 1.5
        let _top = (100 - _height) / 2
        let _left = (100 - _width) / 2
        let popUpBoxDiv = document.createElement("div")
        popUpBoxDiv.className = "popUpBox"

        popUpBoxDiv.style.width = _width + "vw"
        popUpBoxDiv.style.height = _width + "vh"

        popUpBoxDiv.style.position = "absolute"
        popUpBoxDiv.style.left = _left + "vw"
        popUpBoxDiv.style.top = _top + "vh"

        popUpBoxDiv.style.display = "none"
        popUpBoxDiv.style.alignItems = "center"
        popUpBoxDiv.style.justifyItems = "center"
        popUpBoxDiv.style.flexDirection = "column"
        popUpBoxDiv.style.flexWrap = "nowrap"
        // popUpBoxDiv.style.background = "blue"


        let questionTextDiv = document.createElement("div")
        questionTextDiv.className = "popUpBoxQuestionText"
        questionTextDiv.innerHTML = "questionText"
        // question.innerHTML = questionText

        let answerPartDiv = document.createElement("div")
        answerPartDiv.className = "popUpBoxAnswerPart"

        popUpBoxDiv.append(questionTextDiv, answerPartDiv)
        this.pageWrapper.append(popUpBoxDiv)

        popUpBoxDiv.questionTextHtmlObject = questionTextDiv
        popUpBoxDiv.answerPartHtmlObject = answerPartDiv
        this.popUpBoxHtmlObject = popUpBoxDiv
    }

    fillInPopUpBox(questionText, choices, target, _f, res){
        // questionTex: the question shown in the text box
        // choices [array] : an array contains all the possible choice
        // target [htmlObject]: an object that is put into the function
        // _f(target, resultText) [function]: the function that want to be run

        // _f is the function that want to rrun
        let popUpBoxDiv = this.popUpBoxHtmlObject
        popUpBoxDiv.style.display = "flex"
        let questionTextDiv = this.popUpBoxHtmlObject.questionTextHtmlObject
        let answerPartDiv = this.popUpBoxHtmlObject.answerPartHtmlObject


        questionTextDiv.innerText = questionText

        choices.forEach(p=>{
            let answerBoxSpan = document.createElement("span")
            answerBoxSpan.className = "popUpBoxChoice"
            answerBoxSpan.innerText = p
            answerBoxSpan.style.display = "inline-block"
            answerBoxSpan.style.width = "40%"
            answerBoxSpan.style.margin = "auto"
            answerBoxSpan.style.textAlign = "center"

            answerBoxSpan.addEventListener("click", function(){

                _f(target, answerBoxSpan.innerText)
                answerPartDiv.innerHTML = ""
                popUpBoxDiv.style.display = "none"

            })

            answerPartDiv.append(answerBoxSpan)
        })
    }

    // findMirrorElement
    symmetryAction(sourceElement, actionFunction, parentTab=false, sourceAction = true){
        let tabType = ["mainTab", "mirrorTab"]

        let sourceClass = sourceElement.classList[1]
        console.log(sourceElement, sourceElement.soul, sourceClass);

        if (!parentTab){
            // console.log(sourceElement, sourceElement.soul);

            parentTab = sourceElement.soul.parentTab || sourceElement.soul.upperTab
        }

        let targetTab = parentTab == "mainTab"? "mirrorTab" : "mainTab"
        targetTab = windowManager[targetTab].tabWindowHtmlObject



        let targetElement = targetTab.querySelector(`.${sourceClass}`)
        console.log(sourceClass, targetElement);

        actionFunction(targetElement)
        if (sourceAction){
            actionFunction(sourceElement)
        }
    } // symmetryAction

    getScrollTopOfTabs(){
        let leftData = windowManager.tabArray["left"].map(p=>{
            return {
                tabID: p.tabID,
                scrollTop: p.tabWindowHtmlObject.scrollTop
            }
        })
        let rightData = windowManager.tabArray["left"].map(p=>{
            return {
                tabID: p.tabID,
                scrollTop: p.tabWindowHtmlObject.scrollTop
            }
        })
        return {
            leftTabData: leftData,
            rightTabData: rightData

        }
    }

    // saveData
    save(action=true){
      // action = false
        let mainTabSaveObject = this.mainTab.save()
        let referenceTabSaveObject = this.referenceTab.save()
        let scrollTopSaveObject = this.getScrollTopOfTabs()


        let bookmarkSaveObject = []

        this.tabArray["left"].forEach(tab=>{
            let tabBookmarkDict = tab.bookmarkInterface.saveBookmark()
            bookmarkSaveObject.push(tabBookmarkDict)
        })
        this.tabArray["right"].forEach(tab=>{
            let tabBookmarkDict = tab.bookmarkInterface.saveBookmark()
            bookmarkSaveObject.push(tabBookmarkDict)
        })



        mainTabSaveObject["referenceTab"] = referenceTabSaveObject

        mainTabSaveObject["scrollTopData"] = scrollTopSaveObject
        mainTabSaveObject["bookmarkSaveObject"] = bookmarkSaveObject

        console.log(mainTabSaveObject);
        if (action){
            this.ajaxSendJson(url, mainTabSaveObject, "save state", "success to save", function(){
                console.log("after sent ajax");
            })
        } else {
            return mainTabSaveObject
        }
    }

    summary(){
        let cellChain = this.mainTab.getCellChain()
        console.log(cellChain);
        return cellChain
    }

    sentImageSaveRequest(imageObject){
        if (imageObject.src.startsWith("data:image/png")){
          let createdDate = new Date().toLocaleString().split("/").join("-") + " "

          let title = document.querySelector(".titleField").innerText
          let chapter = document.querySelector(".chapterField").innerText

          let fileName = imageObject.src.split(",")[1].substring(0, 20)
          let imageSrc = imageObject.src

          let imageSaveData = {
            "fileName": fileName,
            "data": imageSrc,
            "chapter": chapter,
            "title": title,
          }

          this.ajaxSendJson(url, imageSaveData, "save image", "success to save image", async function(data){
              imageObject.src = await JSON.parse(data)["src"]
              // console.log(imageObject);
          })
        }// if start with image/png
    }

    ajaxSendJson(url, data, todo, msg, callback){
        var xhr = new XMLHttpRequest();
        data["todo"] = todo
        xhr.open("POST", url, true);
        xhr.setRequestHeader("X-CSRFToken", csrf_token);
        xhr.onreadystatechange =  async function() { // Call a function when the state changes.
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                // console.log(xhr.response);
                let result = await xhr.response

                if (callback){
                    callback(result)
                }
                return  result
            }
        }// xhr.onreadystatechange
        xhr.send(JSON.stringify(data));
    }


    // load data
    loadDataRequest(title="Title", chapter = "Chapter", response){
        let self = this

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("X-CSRFToken", csrf_token);
        xhr.onreadystatechange =  function() {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                let result = JSON.parse(xhr.response);
                response(result)
                // self.fromLoadCreatePage(result);
            }
        }// xhr setRequest
        // console.log(chapter);
        xhr.send(JSON.stringify({"title": title, "chapter":chapter, "todo": "load state"}));
    } // loadDataRequest

    djangoParseJSON(data){
        data = data.split("&#39;").join("\"")
        data = data.split("&quot;").join("\"")
        data = data.split("&lt;").join("<")
        data = data.split("&gt;").join(">")
        return data
    }


}
