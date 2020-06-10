class Tab{
    constructor(tabID, position, tabWindow, maxCellID, maxAnnotationID){
        this.cellArray = []
        this.tabID = tabID
        this.position = position
        this.tabWindow = tabWindow
    }

    createNewCell(cellData){
        let _newCell = new Cell(this, cellData)
        this.cellArray.push(_newCell)
        this.tabWindow.append(_newCell.cell)
    }

    selectByCellID(){

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
