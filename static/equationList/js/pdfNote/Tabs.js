class Tab{
    constructor(tabID, position, name, cellType){
        this.cellArray = []
        this.tabID = tabID
        this.position = position
        this.focusedCell = null
        this.tabWindowHtmlObject = this.create()
        this.maxCellID = 0
        this.name = name
        this.cellHead = null
        this.cellTail = null
        this.cellType = cellType
    }

    create(){
        let slaveWindow = document.createElement("div");

        slaveWindow.classList.add("tabWindow", this.position, `tab_${this.tabID}`)

        return slaveWindow
    }

    createNewCell(cellData){
        let _newCell = new this.cellType(this, cellData)
        this.cellArray.push(_newCell)
        this.tabWindowHtmlObject.append(_newCell.cellHtmlObject)
        return _newCell
    }


    selectByCellID(){

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

    save(){
        let title = document.querySelector(".titleField").innerHTML
        let chapter = document.querySelector(".chapterField").innerHTML
        let saveObject = {
            "title": title,
            "chapter": chapter,
            "cells": []
        }


        // let cellArray = this.cellHtmlObject.querySelectorAll(".cell")

        let cellChain = this.tabWindowHtmlObject.querySelectorAll(".cell");
        cellChain.forEach(p=>{
            saveObject["cells"].push(p.soul.save())
        })

        console.log(saveObject);
        return saveObject
    }

    fromLoadCreatePage(jsonResult){
        console.log(jsonResult);
        this.data = jsonResult
        this.maxAnnotationBlockID = parseInt(jsonResult["maxAnnotationBlockID"]) || 1

        let cellIDArray = jsonResult["cells"].map(p=>p.cellID)
        this.maxCellID = Math.max(...cellIDArray) + 1 || 1

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
    }

}

class NoteTab extends Tab{
    constructor(tabID, position, name, cellType){
        super(tabID, position, name, cellType)
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
    constructor(tabID, position, name, cellType){
        super(tabID, position, name, cellType)
        this.tabWindowHtmlObject.classList.add("sectionContainer")
        this.wrapper = this.createSectionWrapper()
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

        let tree = new SectionTree(root)

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

        // use the array to append the section html object to the tab
        this.sectionArray.forEach(p=>{
            // console.log(p);
            // this.wrapper.append(p.sectionHtmlObject)
        })
    }// fromCellsDataCreatePage

    createSection(){
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
        super(tabID, position, name, cellType)
        this.tabWindowHtmlObject.classList.add("referenceTabContainer")
        this.wrapper = this.createReferenceTabWrapper()
        this.functionBar = null
        this.searchInput = null

        this.createFunctionBar()
    }


    createReferenceTabWrapper(){
        let wrapper = document.createElement("div")
        return wrapper
    }

    createFunctionBar(){
        let functionBar = document.createElement("div")
        functionBar.classList.add("functionBar")
        this.functionBar = functionBar

        this.searchInput = this.createSearch()

        functionBar.append(this.searchInput)

        this.tabWindowHtmlObject.append(functionBar)


    }

    createSearch(){
        let searchInput = document.createElement("input")
        searchInput.classList.add("searchInput")
        searchInput.addEventListener("input", function(){
            console.log(event.target.value);
        })

        this.tabWindowHtmlObject.append(searchInput)

        return searchInput



    }

    takeAction(ele, actionFunction){
        actionFunction(ele)
    }


}
