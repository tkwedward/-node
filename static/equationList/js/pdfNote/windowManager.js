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
    }

    // create baseWindow for left or right
    createHalfWindow(position){
        let halfWindow = document.createElement("div")
        halfWindow.classList.add(position, "halfWindow")
        this.pageWrapper.append(halfWindow)
        return halfWindow
    }

    createNewTab(tabID, position = "left", tabType = "Note"){
        let slaveWindow = document.createElement("div");
        let newTab;

        slaveWindow.classList.add("masterWindow", position, `tab_${this.tabID}`)

        if (tabType == "Note"){
            console.log("this is note")
            newTab = new Tab(0, position, slaveWindow)
        }

        // console.log(this.tabArray["left"].push)
        this.tabArray[position].push(newTab)
        this.masterWindow[position].append(slaveWindow)
        this.renderTab(this.tabID, position)

        // update the overall tabID number
        this.tabID += 1
    }

    renderTab(tabID, position){
        this.tabArray[position].forEach(p=>{
            console.log(p);
            if (p.tabID == tabID){
                p.baseWindow.style.display = "block"
                p.baseWindow.style.background = "blue"
            } else {
                p.baseWindow.style.display = "none"
            }
        })

    }

    removeTab(id){

    }
}

class Tab{
    constructor(tabID, position, baseWindow){
        this.cellArray = []
        this.tabID = tabID
        this.position = position
        this.baseWindow = baseWindow
    }

    createNewCell(){
        let _newCell = new Cell()
        this.cellArray.push(_newCell)
        this.noteContainer.append(_newCell.cell)
    }

    selectByCellID(){

    }
}

class NoteTab extends Tab{
    constructor(tabID, position, baseWindow){
        super(tabID, position, baseWindow)

    }
}


let windowManager = new WindowManager()

let _noteContainer = document.querySelector(".noteContainer")
windowManager.createNewTab(0, "left")
