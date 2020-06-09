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

        this.createNewTab(this.tabID, "left", "Note")
        this.createNewTab(this.tabID, "right", "Note")
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
            if (data){

            } else {
                newTab.createNewCell()
                newTab.createNewCell()
                newTab.createNewCell()
                newTab.createNewCell()
                newTab.createNewCell()
                newTab.createNewCell()
                newTab.createNewCell()
                newTab.createNewCell()

                this.loadDataRequest(docTitle, docChapter)
                // this.createNewCell({"initiate":true})
            }
        }// if tabType == "Note"

        // console.log(this.tabArray["left"].push)
        this.tabArray[position].push(newTab)
        console.log(this.masterWindow[position]);
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
    loadDataRequest(title="Title", chapter = "Chapter"){
        self = this
        title = document.querySelector(".noteTitle").innerHTML
        chapter = document.querySelector(".noteChapter").innerHTML
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("X-CSRFToken", csrf_token);
        xhr.onreadystatechange =  function() {
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                let result = JSON.parse(xhr.response);
                console.log(result);
                self.fromLoadCreatePage(result);
            }
        }// xhr setRequest
        // console.log(chapter);
        xhr.send(JSON.stringify({"title": title, "chapter":chapter, "todo": "load state"}));
    } // loadDataRequest


    fromLoadCreatePage(jsonResult){
        console.log(jsonReult);
        let title = jsonResult["title"]
        let chapter = jsonResult["chapter"]
        let cellsData = jsonResult["cells"]

        let summaryCellContainerData = jsonResult["summaryCellContainerData"]
        annotationBlock = jsonResult["annotationBlock"]

        let counter = jsonResult["counter"]
        let pdfFileList = jsonResult["pdfFileList"]
        // console.log(jsonResult["maxAnnotationBlockID"]);
        annotationBlockID = parseInt(jsonResult["maxAnnotationBlockID"]) || 1
        cellID = parseInt(jsonResult["maxCellID"]) || 1


        let bookmarkContainer = document.querySelector(".bookmarkContainer")
        let bookmarkData = jsonResult["pdfBookmark"]
        if (bookmarkData){
            bookmarkContainer.loadBookmark(bookmarkData)
        }

        let summaryContainer = document.querySelector(".summaryContainer")
        // console.log(summaryCellContainerData);
        summaryContainer.load(summaryCellContainerData)

        cellsData.forEach(data=>{
            // console.log(data);

            let newCell = createNewCell()
            newCell.load(data)

            noteContainer.append(newCell)


            data.annotation.forEach(item=>{
                let annotation = createAnnotation(item.annotationType, item)

                noteContainer.append(newCell)
            })
        })

        setSectionColor()
    }

}

class Tab{
    constructor(tabID, position, tabWindow){
        this.cellArray = []
        this.tabID = tabID
        this.position = position
        this.tabWindow = tabWindow
    }

    createNewCell(initiate=false){
        if (initiate == true){

        }
        let _newCell = new Cell()
        this.cellArray.push(_newCell)
        this.tabWindow.append(_newCell.cell)
    }

    selectByCellID(){

    }

    append(div){
        console.log(div);
        this.tabWindow.append(div)
    }
}

class NoteTab extends Tab{
    constructor(tabID, position, baseWindow){
        super(tabID, position, baseWindow)
        console.log(this.tabWindow)
        this.tabWindow.classList.add("noteContainer")

        let titleField = document.createElement("h1")
        titleField.contentEditable = true
        titleField.classList.add("titleField")
        titleField.innerHTML = docTitle

        let chapterField = document.createElement("h2")
        chapterField.contentEditable = true
        chapterField.classList.add("chapterField")
        chapterField.innerHTML = docChapter

        this.tabWindow.append(titleField, chapterField)


    }
}


let windowManager = new WindowManager()

let _noteContainer = document.querySelector(".noteContainer")
