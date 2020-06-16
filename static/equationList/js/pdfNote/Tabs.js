class Tab{
    constructor(tabID, position, name){
        this.cellArray = []
        this.tabID = tabID
        this.position = position
        this.focusedCell = null
        this.tabWindowHtmlObject = this.create()
        this.maxCellID = 0
        this.name = name
        this.cellHead = null
        this.cellTail = null
    }

    create(){
        let slaveWindow = document.createElement("div");

        slaveWindow.classList.add("tabWindow", this.position, `tab_${this.tabID}`)

        return slaveWindow
    }

    createNewCell(cellData){
        let _newCell = new Cell(this, cellData)
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
        console.log(jsonResult);
        // to create summary page
        let summaryCellContainerData = jsonResult["summaryCellContainerData"]
        let annotationBlock = jsonResult["annotationBlock"]
    }

}

class NoteTab extends Tab{
    constructor(tabID, position, name){
        super(tabID, position, name)
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
}

class SectionTab extends Tab{
    constructor(tabID, position, name){
        super(tabID, position, name)
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
        let root = new Section("root", -1)
        //
        //
        // let s1 = new Section("s1", 0)
        // let s1_1 = new Section("s1_1", 1)
        // let s1_2 = new Section("s1_2", 1)
        //
        // let s2 = new Section("s2", 0)
        // let s2_1 = new Section("s2_1", 1)
        // let s2_2 = new Section("s2_2", 1)
        // let s2_3 = new Section("s2_3", 1)
        //
        // let s3 = new Section("s3", 0)
        // let s3_1 = new Section("s3_1", 1)
        //
        // let s4 = new Section("s4", 0)
        // let s4_1 = new Section("s4_1", 1)
        // let s4_2 = new Section("s4_2", 1)
        // let s4_3 = new Section("s4_3", 1)
        // let s4_4 = new Section("s4_4", 1)
        //
        //
        // let all_nodes = [s1, s1_1, s1_2, s2, s2_1, s2_2, s2_3, s3, s3_1, s4, s4_1, s4_2, s4_3, s4_4]

        let tree = new SectionTree(root)
        let secionArray = windowManager.mainTab.getCellChain()


        console.log(windowManager.mainTab.getCellChain());
        // tree.generateTreeFromNodeList(this.sectionArrays)

        windowManager.bookmarkTab.wrapper.innerHTML = ""

        // tree.printTree()
        //
        //
        // let level1_linkList = new SectionLinkList(this.root, 0)
        // level1_linkList.addNode(s1)
        // level1_linkList.addNode(s2)
        // level1_linkList.addNode(s3)
        // level1_linkList.addNode(s4)
        //
        // let s1_childLinkList = new SectionLinkList(s1, 1)
        // s1_childLinkList.addNode(s1_1)
        // s1_childLinkList.addNode(s1_2)
        //
        // let s2_childLinkList = new SectionLinkList(s2, 1)
        // s2_childLinkList.addNode(s2_1)
        // s2_childLinkList.addNode(s2_2)
        // s2_childLinkList.addNode(s2_3)
        //
        // let s3_childLinkList = new SectionLinkList(s3, 1)
        // s3_childLinkList.addNode(s3_1)
        //
        // let s4_childLinkList = new SectionLinkList(s4, 1)
        // s4_childLinkList.addNode(s4_1)
        // s4_childLinkList.addNode(s4_2)
        // s4_childLinkList.addNode(s4_3)
        // s4_childLinkList.addNode(s4_4)
        //
        // console.log(level1_linkList.listNode());
        // console.log(s2_childLinkList.listNode());
        // console.log(s2);

    }

    returnExtremeChild(node, d){
        let direction;
        console.log(node.children[0].returnExtremNode(d));
        return node.children[0].returnExtremNode(d)
    }



    fromCellsDataCreatePage(cellChain){
        // use a cell chain to create section array
        this.sectionArray = cellChain.map((p,i) => new Section(`node_${i}`, 0, p))

        // use the array to append the section html object to the tab
        this.sectionArray.forEach(p=>{
            this.wrapper.append(p.sectionHtmlObject)
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
}
