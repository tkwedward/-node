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
            let starterTab1 = this.createNewTab("left", "Note", loadDataExist)
            let starterTab2 = this.createNewTab("right", "Note", loadDataExist)

            this.fromLoadCreatePage(this.mainTab ,loadData)
            this.fromLoadCreatePage(starterTab2 ,loadData)
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

    createNewTab(position = "left", tabType = "Note", data = false){
        // newTab = new tab object
        // slaveWindow = the window related to the tab object
        let newTab

        if (tabType == "Note"){
            newTab = new NoteTab(this.tabID, position)

            // initialize the cell with an annotation, or fill in it with data
            if (data==false){
                newTab.createNewCell()
            }
        }// if tabType == "Note"

        // console.log(this.tabArray["left"].push)
        this.tabArray[position].push(newTab)
        if (this.tabID == 0){
            this.mainTab = newTab
        }
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


    fromLoadCreatePage(tab, jsonResult){
        tab.data = jsonResult
        tab.maxAnnotationBlockID = parseInt(jsonResult["maxAnnotationBlockID"]) || 1
        tab.maxCellID = parseInt(jsonResult["maxCellID"]) || 1

        let cellsData = jsonResult["cells"]
        // console.log(this.mainTab);
        cellsData.forEach(_cellData=>{
            tab.createNewCell(_cellData)
        })

        // to create summary page
        let summaryCellContainerData = jsonResult["summaryCellContainerData"]
        let annotationBlock = jsonResult["annotationBlock"]

        // let summaryContainer = document.querySelector(".summaryContainer")
        // console.log(summaryCellContainerData);
        // summaryContainer.load(summaryCellContainerData)


    //     cellsData.forEach(data=>{
    //         // console.log(data);
    //
    //         let newCell = createNewCell()
    //         newCell.load(data)
    //
    //         noteContainer.append(newCell)
    //
    //
    //         data.annotation.forEach(item=>{
    //             let annotation = createAnnotation(item.annotationType, item)
    //
    //             noteContainer.append(newCell)
    //         })
    //     })
    //
    //     setSectionColor()
    }

}
