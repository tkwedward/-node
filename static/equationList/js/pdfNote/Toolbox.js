class Toolbox{

    constructor(tab){
        this.tab = tab
        this.buttonDict = this.createButtonDict()
        this.toolBoxHtmlObject = this.createToolboxHtmlObject()
        this.tab.toolBox = this


        Object.entries(this.buttonDict).forEach(p=>{
            // to append buttons to the toolBox Html Object
            let key = p[0]
            let value = p[1]
            this.toolBoxHtmlObject.append(value.buttonHtmlObject)
        })


    }

    showButtons(buttonsWantedToShow){
        Object.entries(this.buttonDict).forEach(p=>{
            let _key = p[0]
            let _button = p[1]

            _button.buttonHtmlObject.style.display = "none"

            console.log(buttonsWantedToShow.indexOf(_key)!=-1);
            if (buttonsWantedToShow.indexOf(_key)!=-1){
                _button.buttonHtmlObject.style.display = "block"
            }
        })
    }

    createButtonDict(){
        let buttonDict = {
            "cutButton": new ToolBoxButton(this, "cut"),
            "pasteButton": new ToolBoxButton(this, "paste"),
            "exportButton": new ToolBoxButton(this, "export"),
            "confirmButton": new ToolBoxButton(this, "confirm")
        }
        return buttonDict
    }


    createToolboxHtmlObject(){
        let columnNumber;
        let itemPerColumn = 5
        let columnWidth = 60
        let columnHeight =  columnWidth * itemPerColumn
        if (Object.entries(this.buttonDict).length < itemPerColumn){
            columnNumber = 1
        } else {
            columnNumber = this.buttonArray.length % itemPerColumn + 1
        }

        let toolBox = document.createElement("div")
        toolBox.classList.add("toolBox", `toolBox_${this.tab.tabID}`)
        toolBox.style.display = "none"
        toolBox.style.width = columnWidth * columnNumber + "px"
        toolBox.style.height = columnHeight + "px"
        toolBox.style.flexDirection = "column"

        let toolBoxNameDiv = document.createElement("div")
        toolBoxNameDiv.classList.add("toolBoxName")
        toolBoxNameDiv.innerText = this.tab.position
        toolBox.append(toolBoxNameDiv)
        toolBox.soul = this

        return toolBox
    }

    fillInToolbox(){

    }

    hideToolBox(){
        this.toolBoxHtmlObject.style.display = "none"
    }

}

class ToolBoxButton{
    constructor(toolBox, message){
        this.message = message
        this.upperToolBox = toolBox
        this.buttonHtmlObject = this.createButtonHtmlObject()
    }

    createButtonHtmlObject(){
        let buttonHtmlObject = document.createElement("div")
        buttonHtmlObject.innerHTML = this.message
        buttonHtmlObject.classList.add("toolBoxButton")
        return buttonHtmlObject
    }

    updateButtonClickFunction(callback){
        let self = this
        this.buttonHtmlObject.onclick = function(){
            callback(self.message)
        }


    }

}// ToolboxButton class
