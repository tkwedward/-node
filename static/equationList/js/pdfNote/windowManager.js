class WindowManager{
    constructor(baseWindow){
        this.baseWindow = baseWindow
        this.tabArray = []
        this.tabIDList = []
    }


    createNewTab(position = left){
        let newTab = new Tab(0, position)
        this.tabArray.push(newTab)
    }

    removeTab(id){
        
    }
}

class Tab{


    constructor(tabID, position){
        this.cellArray = []
        this.tabID = tabID
        this.position = position
        this.noteContainer = masterWindow
    }

    createNewCell(){
        let _newCell = new Cell()
        this.cellArray.push(_newCell)
        this.noteContainer.append(_newCell.cell)
    }

    selectByCellID(){

    }
}
