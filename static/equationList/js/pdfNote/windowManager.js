class WindowManager {
    constructor(){
        this.pageWrapper = document.querySelector("#pageWrapper")
        this.masterWindowHtmlObject = {
            "left": this.createHalfWindow("left"),
            "right": this.createHalfWindow("right")
        }
        this.tabArray = {
            "left": [],
            "right": []
        }

        this.tabIDList = []
        this.tabID = 0

        // loadData and create initial tabs
        let promise = new Promise((response, errorj)=>{
            let loadData = this.loadDataRequest(docTitle, docChapter, response)
        })
        promise.then(loadData =>{
            this.loadData = loadData
            let loadDataExist = true ? loadData : false
            let starterTab1 = this.createNewTab("left", "Note", loadDataExist, "mainTab")
            this.mainTab = starterTab1
            let starterTab2 = this.createNewTab("right", "Note", loadDataExist, "mirrorTab")
            this.mirrorTab = starterTab2

            let bookmarkTab = this.createNewTab("right", "Section", loadDataExist, "sectionTab")
            this.bookmarkTab = bookmarkTab

            this.mainTab.fromLoadCreatePage(loadData)
            starterTab2.fromLoadCreatePage( loadData)

        }).then(()=>{
            let cellChain = this.mainTab.getCellChain()
            console.log("sectionTab management");
            // console.log(cellChain);
            this.bookmarkTab.fromCellsDataCreatePage(cellChain)
            this.bookmarkTab.createSectionTree()

        })
    }

    // create baseWindow for left or right
    createHalfWindow(position){
        let halfWindow = document.createElement("div")
        halfWindow.classList.add(position, "halfWindow")
        this.pageWrapper.append(halfWindow)

        return halfWindow
    }

    showTab(position, tabID){
        this.tabArray[position].forEach(tab=>{
            if (tab.tabID == tabID){
                tab.tabWindowHtmlObject.style.display = "block"
            } else {
                tab.tabWindowHtmlObject.style.display = "none"
            }
        })
        this.masterWindowHtmlObject["position"]
    }

    createNewTab(position = "left", tabType = "Note", data = false, name){
        // newTab = new tab object
        // slaveWindow = the window related to the tab object
        let newTab

        if (tabType == "Note"){
            newTab = new NoteTab(this.tabID, position, name)

            // initialize the cell with an annotation, or fill in it with data
            if (data==false){
                newTab.createNewCell()
            }
        } // if tabType == "Note"
        else if  (tabType == "Section")
        {
            newTab = new SectionTab(this.tabID, position, name)
        }

        // console.log(this.tabArray["left"].push)
        this.tabArray[position].push(newTab)
        // add the tabs into the masterWIndow left or right array
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

    // findMirrorElement
    symmetryAction(sourceElement, actionFunction, parentTab=false, sourceAction = true){
        let tabType = ["mainTab", "mirrorTab"]

        let sourceClass = sourceElement.classList[1]
        console.log(sourceElement);

        if (!parentTab){
            parentTab = sourceElement.soul.parentTab
        }

        let targetTab = parentTab == "mainTab"? "mirrorTab" : "mainTab"
        targetTab = windowManager[targetTab].tabWindowHtmlObject

        let targetElement = targetTab.querySelector(`.${sourceClass}`)
        console.log(targetElement, sourceClass);

        actionFunction(targetElement)
        if (sourceAction){
            actionFunction(sourceElement)
        }
    } // symmetryAction

    // saveData
    save(action=true){
        let saveObject = this.mainTab.save()
        console.log(saveObject);
        if (action){
            this.ajaxSendJson(url, saveObject, "save state", "success to save", function(){
                console.log("after sent ajax");
            })
        } else {
            return saveObject
        }
    }

    summary(){
        let cellChain = this.mainTab.getCellChain()
        console.log(cellChain);
        return cellChain
    }

    ajaxSendJson(url, data, todo, msg, callback){
        console.log(data);
        var xhr = new XMLHttpRequest();
        data["todo"] = todo
        xhr.open("POST", url, true);
        xhr.setRequestHeader("X-CSRFToken", csrf_token);
        xhr.onreadystatechange =  async function() { // Call a function when the state changes.
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                console.log("..........*******");
                console.log(msg);
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




}
