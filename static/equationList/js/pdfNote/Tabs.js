class Tab{
    constructor(tabID, position, maxCellID, maxAnnotationID){
        this.cellArray = []
        this.tabID = tabID
        this.position = position
        this.focusedCell = null
        this.tabWindowHtmlObject = this.create()
        this.maxCellID = 0
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
    }

    selectByCellID(){

    }

    save(){
        let saveObject = {
            "title": docTitle,
            "chapter": docChapter,
            "cells": []
        }
        this.cellArray.forEach(p=>{
            saveObject["cells"].push(p.save())
        })


        return saveObject
    }

    fromLoadCreatePage(jsonResult){
        this.data = jsonResult
        this.maxAnnotationBlockID = parseInt(jsonResult["maxAnnotationBlockID"]) || 1
        // this.maxCellID = 0
        this.maxCellID = parseInt(jsonResult["maxCellID"]) || 1

        let cellsData = jsonResult["cells"]
        // console.log(this.mainTab);
        cellsData.forEach(_cellData=>{
            this.createNewCell(_cellData)
        })

        // to create summary page
        let summaryCellContainerData = jsonResult["summaryCellContainerData"]
        let annotationBlock = jsonResult["annotationBlock"]
    }

}

class NoteTab extends Tab{
    constructor(tabID, position){
        super(tabID, position)
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
}
