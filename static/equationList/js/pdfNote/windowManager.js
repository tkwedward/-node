class WindowManager {
    constructor(){
        this.pageWrapper = document.querySelector("#pageWrapper")
        this.masterWindow = {
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
            console.log(loadDataExist);
            this.createNewTab(this.tabID, "left", "Note", loadDataExist)
            this.createNewTab(this.tabID, "right", "Note")

            this.fromLoadCreatePage(loadData)
        })
    }

    // create baseWindow for left or right
    createHalfWindow(position){
        let halfWindow = document.createElement("div")
        halfWindow.classList.add(position, "halfWindow")
        this.pageWrapper.append(halfWindow)
        return halfWindow
    }

    createNewTab(tabID, position = "left", tabType = "Note", data = false){
        // newTab = new tab object
        // slaveWindow = the window related to the tab object
        let newTab;
        let slaveWindow = document.createElement("div");

        slaveWindow.classList.add("tabWindow", position, `tab_${this.tabID}`)

        if (tabType == "Note"){
            console.log("this is note")
            newTab = new NoteTab(this.tabID, position, slaveWindow)

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
        this.masterWindow[position].append(newTab.tabWindow)
        this.renderTab(this.tabID, position)

        // update the overall tabID number
        this.tabID += 1
    }

    renderTab(tabID, position){
        this.tabArray[position].forEach(p=>{
            console.log(p.tabID, tabID);
            if (p.tabID == tabID){
                p.tabWindow.style.display = "block"
                // p.tabWindow.style.background = "gold"
            } else {
                p.tabWindow.style.display = "none"
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
                console.log(result);
                response(result)
                // self.fromLoadCreatePage(result);
            }
        }// xhr setRequest
        // console.log(chapter);
        xhr.send(JSON.stringify({"title": title, "chapter":chapter, "todo": "load state"}));
    } // loadDataRequest


    fromLoadCreatePage(jsonResult){
        this.mainTab.maxAnnotationBlockID = parseInt(jsonResult["maxAnnotationBlockID"]) || 1
        this.mainTab.maxCellID = parseInt(jsonResult["maxCellID"]) || 1

        console.log(jsonResult["cellArray"]);
        // let title = jsonResult["title"]
        // let chapter = jsonResult["chapter"]
        let cellsData = jsonResult["cells"]
        // console.log(this.mainTab);
        cellsData.forEach(_cellData=>{
            this.mainTab.createNewCell(_cellData)
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


let windowManager = new WindowManager()

let _noteContainer = document.querySelector(".noteContainer")
