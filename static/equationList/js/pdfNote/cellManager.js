class Cell{
    constructor(addCellID=true, className = "cell", annotationID=0, pinned=false, cellID=0){
        this.addCellID = true
        this.className = className
        this.correct = 0
        this.wrong = 0
        this.cellID = cellID
        this.pinned = pinned
        this.sectionTitleLevel = 0
        this.create()
    }

    // create new cellNew
    create(){
        this.cell = document.createElement("div")
        this.cell.classList.add(this.className)

        this.createCellTitle()
        this.createCellControlPanel()
        this.addCellEvents()
    }

    initiate(){
        let firstAnnotation = createAnnotation("textAnnotation")
        this.cell.append(firstAnnotation)
    }

    // create new objects

    createCellTitle(){
        let cellTitle = document.createElement("h2")
        cellTitle.classList.add("cellTitle")
        cellTitle.contentEditable = true
        cellTitle.innerHTML = "Cell Title PlaceHolder"
        cellTitle.sectionTitle = "false"
        this.cellTitle = cellTitle
        this.cell.append(cellTitle)
    }

    createAnotation(){
        // to create Annotation
        let annotation = ""
        return annotation

    }


    createCellControlPanel(){
        let _panel = new CellControlPanel()
        _panel.create()
        this.controlPanel = _panel
        this.cell.append(_panel.cellControlPanel)
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

        if (loadData["cellID"]){
            this.cellID = loadData["cellID"]
            cellID -= 1
            thtis.cell.append("cellID is " + cell.cellID)
            if (loadData["cellGREScore"] ){
                this.cell.correct = loadData["cellGREScore"]["correct"]
                this.cell.wrong = loadData["cellGREScore"]["wrong"]
            }
        }

        this.cellControlPanel.pinButton.innerHTML = loadData["pinButton"]


        if (loadData["sectionTitle"]){
            this.cell.sectionTitle = loadData["sectionTitle"]["title"] || loadData["sectionTitle"]
            this.cell.sectionTitleLevel = loadData["sectionTitle"]["level"] || 0

            if (this.sectionTitle=="true"){
                this.cell.classList.add("sectionTitle")
                let sectionLevel = document.createElement("input")
                sectionLevel.classList.add("sectionLevelInput")
                sectionLevel.type = "number"
                sectionLevel.value = this.sectionTitleLevel;
                sectionLevel.addEventListener("input", function(){
                    this.sectionTitleLevel = sectionLevel.value
                    cell.setAttribute("titleLevel", sectionLevel.value)

                })
                cell.querySelector(".cellControlPanel").append(sectionLevel)
            }
        }
    }// load Data

    addCellEvents(){
        this.cell.addEventListener("click", function(){
            let allCells = document.querySelectorAll(".cell")
            allCells.forEach(p=>p.classList.remove("selectedCell"))
            cell.classList.add("selectedCell")
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
            let newAnnotation = createAnnotation("textAnnotation")
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
        console.log(this.cellControlPanel)
    }// create
}
