class Tab{
    constructor(tabID, position, maxCellID, maxAnnotationID){
        this.cellArray = []
        this.tabID = tabID
        this.position = position
        this.focusedCell = null



        this.tabWindowHtmlObject = this.create()
        // this.mutationObserver = this.createMutationObserver()


    }
    createMutationObserver(){
        let self = this
        var mutationObserver = new MutationObserver(function(mutations) {
            for (let i=0; i < mutations.length; i++){
                if (self.focusedCell.cellHtmlObject==mutations[i].target){
                    console.log(self.focusedCell, new Date());
                    break
                }
            }
        });

        mutationObserver.observe(this.tabWindowHtmlObject, {
          attributes: true,
          characterData: true,
          childList: true
          // subtree: true,
          // attributeOldValue: true
        });

        return mutationObserver
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
