class Tab{
    constructor(tabID, position, name, cellType, tabType){
        this.cellArray = []
        this.tabID = tabID
        this.position = position
        this.focusedCell = null
        this.tabType = tabType
        this.name = name
        this.tabWindowHtmlObject = this.create()
        this.Toolbox = null
        this.maxCellID = 0
        this.cellHead = null
        this.cellTail = null
        this.cellType = cellType
        this.bookmarkInterface = this.createBookmarkInterface()
    }

    create(){
        let slaveWindow = document.createElement("div");
        console.log(roomName);
        slaveWindow.classList.add("tabWindow", this.position, `tab_${this.tabID}`, this.tabType)

        slaveWindow.identifier = {
          "position": this.position,
          "tabType": this.tabType,
          "roomName": roomName,
          "CHAT_USER_ID": CHAT_USER_ID,
        }

        console.log(slaveWindow.classList);

        return slaveWindow
    }

    createBookmarkInterface(){
      let bookmarkInterface = new TabBookmarkManager(this)
      return bookmarkInterface
    }

    createNewCell(cellData, append = true){
        let _newCell = new this.cellType(this, cellData)
        this.cellArray.push(_newCell)

        if (append){
            this.tabWindowHtmlObject.append(_newCell.cellHtmlObject)
        }

        return _newCell
    }


    selectByCellID(){

    }

    createToolBox(){
        this.Toolbox = new Toolbox(this)
        this.tabWindowHtmlObject.parentNode.append(this.Toolbox.toolBoxHtmlObject)
    }

    getCellChain(){
        let currentCell = this.cellHead
        let cellChain = []
        while (currentCell){
            cellChain.push(currentCell)
            currentCell = currentCell.nextCell
        }
        return cellChain
    }

    selectCells(){

    }

    pasteCellEvent(target, direction){
        let self = target.soul.upperTab
        let firstCell = windowManager.cellEditData[0]

        let referenceCell = target
        console.log(referenceCell);

        for (let i = 0; i <= windowManager.cellEditData.length - 1; i++){
            let target = windowManager.cellEditData[i]
            referenceCell.parentNode.insertBefore(target, referenceCell)
            if (direction=="down"){
                referenceCell.parentNode.insertBefore(referenceCell, target)
                referenceCell = target
            }
        }

        console.log(target, direction, firstCell , windowManager.copiedData, self);
    }

    save(){
        let title = document.querySelector(".titleField").innerHTML
        let chapter = document.querySelector(".chapterField").innerHTML
        let saveObject = {
            "title": title,
            "chapter": chapter,
            "cells": [],
            "bookmarkDict": null
        }


        // let cellArray = this.cellHtmlObject.querySelectorAll(".cell")

        let cellChain = this.tabWindowHtmlObject.querySelectorAll(".cell");
        cellChain.forEach(p=>{
            saveObject["cells"].push(p.soul.save())
        })

        return saveObject
    }

    fromLoadCreatePage(jsonResult){
        console.log(jsonResult);
        if (Object.entries(jsonResult["cells"]).length){ // check whether any data in the jsonResult Dictionary
            console.log(jsonResult);
            this.data = jsonResult
            this.maxAnnotationBlockID = parseInt(jsonResult["maxAnnotationBlockID"]) || 1

            let cellIDArray = jsonResult["cells"].map(p=>p.cellID)

            if (cellIDArray.length > 0){
                this.maxCellID = Math.max(...cellIDArray) + 1 || 1
            } else {
                this.maxCellID = 1
            }



            let cellsData = jsonResult["cells"]
            // console.log(this.mainTab);
            cellsData.forEach(_cellData=>{
                let newCell = this.createNewCell(_cellData)

                if (this.cellHead == null){
                    // to indicate the chain have something
                    this.cellHead = newCell
                    this.cellTail = newCell
                    newCell.previousCell = null
                    newCell.nextCell = null
                } else {
                    // to add new cell to the next cell of tail cell
                    this.cellTail.nextCell = newCell

                    // to add the previous cell of new cell to be the original tail cell
                    newCell.previousCell = this.cellTail
                    newCell.nextCell = null

                    // update the new tail cell
                    this.cellTail = newCell
                }
            })
            // to create summary page
            let summaryCellContainerData = jsonResult["summaryCellContainerData"]
            let annotationBlock = jsonResult["annotationBlock"]
        } else {
            console.log("no data in the file");
            this.createNewCell()
        }

    }// check if

}

class NoteTab extends Tab{
    constructor(tabID, position, name, cellType){
        super(tabID, position, name, cellType, "noteTab")
        this.tabWindowHtmlObject.classList.add("noteContainer")
        let titleField = document.createElement("h1")
        titleField.contentEditable = true
        titleField.classList.add("titleField")
        titleField.innerHTML = docTitle

        let chapterField = document.createElement("h2")
        chapterField.contentEditable = true
        chapterField.classList.add("chapterField")
        chapterField.innerHTML = docChapter

        this.tabWindowHtmlObject.append(titleField, chapterField)
    }




    setSectionColor(){
        let allCells = this.getCellChain()
        let sectionTitleCurrent;
        let color = ["red", "orange", "yellow", "DarkSeaGreen", "blue", "purple", ""]
        let titleArray = []

        allCells.forEach((cell,index)=>{

            if (cell.sectionDataNew.level == 0){

            } else {
                if (titleArray.length!=0){
                    let sectionTitleInfo = titleArray[titleArray.length-1]["subTitle"]
                    sectionTitleInfo.push(cell.querySelector("h2"))
                }
            }


            cell.style.borderLeft = `15px solid ${color[(titleArray.length-1)%6]||"white"}`

        })

        let sectionColumn = document.querySelector(".sectionColumn")
        sectionColumn.innerHTML=""
        titleArray.forEach(p=>{
            let sectionLabel = document.createElement("div")
            sectionLabel.classList.add("sectionLabel")
            let sectionLink = document.createElement("a")

            sectionLink.innerHTML = p["sectionTitle"].innerText
            sectionLink.targetCellTop = p["sectionTitle"]
            scrollTo(sectionLink)
            sectionLabel.append(sectionLink)
            // sectionLink.subTitle = p["subTitle"]

            p["subTitle"].forEach(p=>{
                let subTitleLink = document.createElement("a")
                subTitleLink.classList.add("subTitleLabel")
                console.log(p);
                subTitleLink.innerHTML = "- " + p.innerText
                ;
                subTitleLink.targetCellTop = p
                scrollTo(subTitleLink)
                sectionLabel.append(subTitleLink)
            })
            sectionColumn.append(sectionLabel)
        })
    }

    takeAction(ele, actionFunction){
        windowManager.symmetryAction(ele, actionFunction)
    }
}

class SectionTab extends Tab{
    constructor(tabID, position, name, cellType, relatedTab){
        super(tabID, position, name, cellType, "sectionTab")
        this.tabWindowHtmlObject.classList.add("sectionContainer")
        this.wrapperHtmlObject = this.createSectionWrapper()
        this.relatedTab = relatedTab
        this.sectionArray = []
    }// constructor

    createSectionWrapper(){
        let wrapper = document.createElement("div")
        wrapper.classList.add("sectionWrapper")
        this.tabWindowHtmlObject.append(wrapper)
        return wrapper
    }

    createSectionTree(){
        let root = new Section("root")

        let tree = new SectionTree(root, this)

        this.tree = tree

        tree.generateTreeFromNodeList(this.sectionArray)
    }

    beautifyTree(){
        let color = ["red", "orange", "yellow", "green", "Lightgreen", "blue", "purple"]
        let level0_list = this.tree.root.childrenList.listNode()
        console.log(level0_list);
        level0_list.forEach((p, i)=>{
            let mod = i % color.length
            p.color = color[mod]
            p.cell.cellHtmlObject.style.borderLeft = `20px solid ${color[mod]}`
        })



        windowManager.bookmarkTab.wrapper.innerHTML = ""
    }

    returnExtremeChild(node, d){
        let direction;
        console.log(node.children[0].returnExtremNode(d));
        return node.children[0].returnExtremNode(d)
    }

    fromCellsDataCreatePage(cellChain){
        // use a cell chain to create section array
        this.sectionArray = cellChain.map((p,i) => new Section(`cell_${p.cellID}`, p))
    }// fromCellsDataCreatePage

    updateSection(){

    }

    createSectionHtmlObject(){
        let self = this

        // create a section title in the section tab and when you click it, it can go to the cell in the main tab
        let htmlObject = document.createElement("div")

        htmlObject.classList.add("section", `section_${this.cell.cellID}`, `level_${this.cell.sectionDataNew["level"]}`)
        htmlObject.innerHTML = this.title

        htmlObject.addEventListener("click", function(){
            let data = self.cell.cellHtmlObject.offsetTop
            console.log(data);
            windowManager.mainTab.tabWindowHtmlObject.scrollTop = data - 20
        })

        return htmlObject
    }
} // Section Tab


class ReferenceTab extends Tab{
    constructor(tabID, position, name, cellType){
        super(tabID, position, name, cellType, "referenceTab")

        this.tabWindowHtmlObject.classList.add("referenceTabContainer")
        this.wrapperHtmlObject = this.createReferenceTabWrapper()
        this.searchInput = null
        this.functionBar = this.createFunctionBar()

        console.log(this.wrapperHtmlObject);

        this.tabWindowHtmlObject.append(this.functionBar, this.wrapperHtmlObject)
    }


    createReferenceTabWrapper(){
        let wrapper = document.createElement("div")
        wrapper.classList.add("referenceTabWrapper")
        return wrapper
    }

    createFunctionBar(){
        let functionBar = document.createElement("div")
        functionBar.classList.add("functionBar")

        this.searchInput = this.createSearch()

        functionBar.append(this.searchInput)

        return functionBar
    }

    createSearch(){
        let searchInput = document.createElement("input")
        searchInput.classList.add("searchInput")
        searchInput.addEventListener("input", function(){
            console.log(event.target.value);
        })



        return searchInput

    }

    takeAction(ele, actionFunction){
        actionFunction(ele)
    }


}


class TabBookmarkManager{
  constructor(tab){
    this.tabType = "bookmarkManager"
    this.motherTab = tab
    this.color = ["red", "orange", "yellow", "purple"]
    this.bookmarkDict = {
      "tabID": tab.tabID,
      "1": {},
      "2": {},
      "3": {},
      "4": {}
    }
    this.buttonArray = []

    this.bookmarkHtmlObject = this.createBookmarkHtmlObject()

  }

  createBookmarkHtmlObject(){
      let bookmarkArea = document.querySelector("." + this.motherTab.position + "TabBookmarkArea")

      let bookmarkInterface = document.createElement("div")
      bookmarkInterface.classList.add("tab_"+ this.motherTab.tabID, this.motherTab.position+"_bookmark")
      bookmarkInterface.setAttribute("tabid", this.motherTab.tabID)
      bookmarkInterface.innerHTML = "tab_" + this.motherTab.tabID

      let numberOfBookmark = 4

      for (let i = 0; i < numberOfBookmark; i++){
          let button = document.createElement("button")
          button.innerHTML = i+1
          console.log(this.bookmarkDict);
          this.bookmarkDict[i+1]["color"] = this.color[i]
          this.bookmarkDict[i+1]["position"] = 0
          this.bookmarkDict[i+1]["button"] = i+1
          this.buttonArray.push(button)
          bookmarkInterface.append(button)
      }

      bookmarkArea.append(bookmarkInterface)
      return bookmarkInterface
  }

  addBookmark(number, position){
    this.bookmarkDict[number]["position"] = position
    this.buttonArray[number-1].style.background = this.bookmarkDict[number]["color"]

  }

  saveBookmark(){
    return this.bookmarkDict
  }

  loadBookmark(data){
    this.bookmarkDict = data

    Object.entries(data).forEach(p=>{
      if (p[0]!="tabID"){
        let bookmarkDict = p[1]
        let button = this.buttonArray[bookmarkDict.button-1];
        if (bookmarkDict.position != 0){
            button.style.background = bookmarkDict.color
        }
      }

    })

  }


}
