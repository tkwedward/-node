class Cell{
    constructor(upperTab, data = null, annotationID=0, pinned=false){
        this.correct = 0
        this.wrong = 0
        this.cellID = upperTab.maxCellID
        this.pinned = pinned
        this.sectionTitleLevel = 0
        this.annotationArray = []
        this.upperTab = upperTab
        this.cellHtmlObject = document.createElement("div")

        this.create()
        if (data) {
            this.load(data)
        } else {
            this.cellHtmlObject.classList.add("cell", `cell_${this.cellID}`)
            this.upperTab.maxCellID += 1
        }

    }

    // create new cellNew
    create(){
        this.createCellTitle()
        this.createCellControlPanel()
        this.addCellEvents()
    }

    initiate(){
        let firstAnnotation = createAnnotation("textAnnotation")
        this.cellHtmlObject.append(firstAnnotation)
    }

    // create new objects
    createCellTitle(){
        let cellTitle = document.createElement("h2")
        cellTitle.classList.add("cellTitle")
        cellTitle.contentEditable = true
        cellTitle.innerHTML = "Cell Title PlaceHolder"
        cellTitle.sectionTitle = "false"
        cellTitle.classList.add(`cellTitle_${this.cellID}`)

        // methods
        cellTitle.update = function(title){
            cellTitle.innerHTML = title
        }

        // put the cellTitle as attribute and append it to the cell
        this.cellTitle = cellTitle
        this.cellHtmlObject.append(cellTitle)

    }

    createAnnotation(data){
        // to create Annotation
        let upperCell = this
        let _a = new Annotation(upperCell, data)
        if (data){

        }
        this.annotationArray.push(_a)
        this.cellHtmlObject.append(_a.annotationHtmlObject)
        // return annotation

    }

    createCellControlPanel(){
        let _panel = new CellControlPanel()
        this.controlPanel = _panel
        this.cellHtmlObject.append(_panel.cellControlPanel)
    }

    // copy, save and load
    copy(){

    }


    save(){
        saveObject = {
            cellID: this.cellID,
            cellGREScore: {
                "correct": this.correct, "wrong":this.wrong
            },
            cellTitle: this.cellTitle.innerHTML,
            sectionTitle: {
                "title": this.sectionTitle,
                "level": this.sectionTitleLevel
            },
            pinButton: this.controlPanel.innerHTML,

            annotation: []
        }

        let goToPageButton = this.goToPageButton
        if (goToPageButton){
            saveObject["goToPageButton"] = goToPageButton.innerHTML
        } else {
            saveObject["goToPageButton"] = null
        }

        this.annotationArray.forEach(p=>{
            saveObject["annotation"].push(p.save())
        })

        return saveObject
    }


    load(loadData){
        // load cellID
        this.cellTitle.update(loadData["cellTitle"])
        this.cellHtmlObject.classList.add("cell", `cell_${loadData["cellID"]}`)
        let annotationData = loadData["annotation"]
        annotationData.forEach(a=>{
            this.createAnnotation(a)
        })


        // if (loadData["cellID"]){
        //     this.cellID = loadData["cellID"]
        //     cellID -= 1
        //     thtis.cell.append("cellID is " + cell.cellID)
        //     if (loadData["cellGREScore"] ){
        //         this.cellHtmlObject.correct = loadData["cellGREScore"]["correct"]
        //         this.cellHtmlObject.wrong = loadData["cellGREScore"]["wrong"]
        //     }
        // }
        //
        // this.cellControlPanel.pinButton.innerHTML = loadData["pinButton"]
        //
        //
        // if (loadData["sectionTitle"]){
        //     this.cellHtmlObject.sectionTitle = loadData["sectionTitle"]["title"] || loadData["sectionTitle"]
        //     this.cellHtmlObject.sectionTitleLevel = loadData["sectionTitle"]["level"] || 0
        //
        //     if (this.sectionTitle=="true"){
        //         this.cellHtmlObject.classList.add("sectionTitle")
        //         let sectionLevel = document.createElement("input")
        //         sectionLevel.classList.add("sectionLevelInput")
        //         sectionLevel.type = "number"
        //         sectionLevel.value = this.sectionTitleLevel;
        //         sectionLevel.addEventListener("input", function(){
        //             this.sectionTitleLevel = sectionLevel.value
        //             cell.setAttribute("titleLevel", sectionLevel.value)
        //
        //         })
        //         cell.querySelector(".cellControlPanel").append(sectionLevel)
        //     }
        // }
    }// load Data

    addCellEvents(){
        // focus cell
        let self = this
        this.upperTab.focusedCell = this
        this.cellHtmlObject.addEventListener("click", function(){
            let allCells = document.querySelectorAll(".cell")
            allCells.forEach(p=>p.classList.remove("selectedCell"))
            self.cellHtmlObject.classList.add("selectedCell")
        })

    }
}

class CellControlPanel{
    constructor(){
        this.cellControlPanel = document.createElement("div")
        this.cellControlPanel.classList.add("cellControlPanel")
        this.pinButton = null
        this.create()
    }

    createButton(buttonType, eventFunction){
        let button = document.createElement("button")
        button.classList.add(buttonType)
        button.addEventListener("click", eventFunction)
        return button
    }// createButton

    create(){
        let pinButton = this.createButton("pinButton", function(){
            pinButton.innerHTML = pinButton.innerHTML=="keep"? "release": "keep"
        })
        pinButton.innerHTML = "keep"
        this.pinButton = pinButton


        let addAnnotationButton = this.createButton("addAnnotationButton", function(){
            let newAnnotation = this.createAnnotation("textAnnotation")
            cell.insertBefore(newAnnotation, event.target.parentNode)
        })

        addAnnotationButton.innerHTML = "addAnnotation"
        this.addAnnotationButton = addAnnotationButton


        let sectionTitleButton = this.createButton("sectionTitleButton", function(){
            let targetCell = event.target.parentNode.parentNode
            targetCell.sectionTitle = targetCell.sectionTitle=="false"? "true": "false"

            if (targetCell.sectionTitle=="true"){
                targetCell.classList.add("sectionTitle")
                targetCell.sectionTitleLevel = 0
                let sectionLevel = document.createElement("input")
                sectionLevel.type = "number"
                sectionLevel.classList.add("sectionLevelInput")
                sectionLevel.value = targetCell.sectionTitleLevel;
                sectionLevel.addEventListener("input", function(){
                    // console.log(sectionLevel.value);
                    targetCell.sectionTitleLevel = sectionLevel.value
                    targetCell.setAttribute("titleLevel", sectionLevel.value)

                })

            } else {
                targetCell.classList.remove("sectionTitle")
                let sectionLevelInput = targetCell.querySelector(".sectionLevelInput")
                if (sectionLevelInput){
                    sectionLevelInput.remove()
                }

            }

            let sectionLevelInput = document.querySelectorAll(".sectionLevelInput")
            separateByLevel(Array.from(sectionLevelInput))
            setSectionColor()
        })
        sectionTitleButton.innerHTML = "section"
        this.sectionTitleButton = sectionTitleButton

        this.cellControlPanel.append(this.pinButton, this.addAnnotationButton, this.sectionTitleButton)
        // console.log(this.cellControlPanel)
    }// create
}
