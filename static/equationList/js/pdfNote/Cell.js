class Cell{
    constructor(upperTab, data = null, annotationID=0, pinned=false, tabAnnotationType= null){
        this.correct = 0
        this.wrong = 0
        this.cellID = upperTab.maxCellID
        this.maxAnnotationID = 0
        this.pinned = pinned
        this.annotationArray = []
        this.upperTab = upperTab
        this.parentTab = upperTab.name
        this.cellHtmlObject = document.createElement("div")
        this.tabAnnotationType = tabAnnotationType

        this.create()
        if (data) {
            this.load(data)
        } else {
            this.cellHtmlObject.classList.add("cell", `cell_${this.cellID}`)
            this.upperTab.maxCellID += 1
        }

        let cellIDObject = document.createElement("div")
        cellIDObject.innerHTML = this.cellID
        this.cellHtmlObject.append(cellIDObject)


    }


    getCellLevel(){
        let level = this.controlPanel.sectionInput.value
        return level
    }

    getCellTitle(){
        let title = this.cellTitle.innerHTML
        return title
    }

    // create new cellNew
    create(){
        let self = this
        this.cellHtmlObject.soul = this
        this.createCellTitle()
        this.createCellControlPanel()
        this.addCellEvents()
    }

    initiate(){
        let firstAnnotation = createAnnotation(this.cellID, this.maxAnnotationID)
        this.cellHtmlObject.append(firstAnnotation)
    }

    // create new objects
    createCellTitle(){
        let cellTitle = document.createElement("h2")
        cellTitle.soul = this
        cellTitle.classList.add("cellTitle")
        cellTitle.contentEditable = true
        cellTitle.innerHTML = `Cell Title ${this.cellID}`
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

    getNextAnnotationID(data){
        let nextAnnotationID = this.maxAnnotationID

        if (!data){
            this.maxAnnotationID += 1
        }

        return nextAnnotationID
    }

    createAnnotation(data){
        // to create Annotation
        let upperCell = this
        let nextAnnotationID = this.getNextAnnotationID(data)
        let _a = new this.tabAnnotationType(this.cellID, nextAnnotationID, upperCell, data)

        this.annotationArray.push(_a)
        this.cellHtmlObject.append(_a.annotationHtmlObject)
        // return annotation
        return _a.annotationHtmlObject

    }

    createCellControlPanel(){
        let _panel = new CellControlPanel(this)
        this.controlPanel = _panel
        this.cellHtmlObject.append(_panel.cellControlPanel)
    }

    // insertBelow, insertAbove, copy, save and load
    insertCell(position){
        let self = this
        let actionFunction = function(ele){
            // ele is the html
            console.log(ele);

            let upperTab = ele.soul.upperTab
            let newCell = upperTab.createNewCell()
            newCell.cellHtmlObject.parentNode.insertBefore(newCell.cellHtmlObject, ele)
            if (position == "below"){
                newCell.cellHtmlObject.parentNode.insertBefore(ele, newCell.cellHtmlObject)
            }

            newCell.controlPanel.addAnnotationButton.click()

            if (position == "below"){
                newCell.nextCell = ele.soul.nextCell
                newCell.previousCell = ele.soul
                if (ele.soul.nextCell){
                    ele.soul.nextCell.previousCell = newCell
                }

                ele.soul.nextCell = newCell
            } else {
                newCell.nextCell = ele.soul
                newCell.previousCell = ele.soul.previousCell

                if (ele.soul.previousCell){
                    ele.soul.previousCell.nextCell = newCell
                }

                ele.soul.prevousCell = newCell
            }
        }

        self.upperTab.takeAction(self.cellHtmlObject,actionFunction)
    }

    insertAbove(){

    }

    copy(){

    }

    save(){
        console.log(this);
        let saveObject = {
            cellID: this.cellID,
            maxAnnotationID: this.maxAnnotationID,
            sectionData: {"level" : this.getCellLevel()},
            sectionTitle: {"title" : this.getCellTitle()},
            sectionDataNew: {
                "level" : this.getCellLevel(),
                "title" : this.getCellTitle()
            },
            cellTitle: this.cellTitle.innerHTML,
            pinButton: this.controlPanel.innerHTML,
            annotation: []
        }

        let annotationArray = this.cellHtmlObject.querySelectorAll(".annotation")

        annotationArray.forEach(p=>{
            saveObject["annotation"].push(p.save())
        })

        return saveObject
    }

    load(loadData){
        // console.log(loadData);
        // load cellID
        this.cellTitle.update(loadData["cellTitle"])
        this.cellHtmlObject.classList.add("cell", `cell_${loadData["cellID"]}`)
        this.cellID = loadData["cellID"]

        this.loadMaxCellID(loadData)
        this.loadInSectionData(loadData)
        this.loadInAnnotationData(loadData)

    }// load Data

    loadMaxCellID(loadData){
        let annotationIDArray = loadData["annotation"].map(p=>p.annotationID)
        this.maxAnnotationID = Math.max(...annotationIDArray) + 1;
    }

    loadInSectionData(loadData){
        this.sectionData = loadData["sectionData"]

        this.sectionTitle = loadData["sectionTitle"]
        if (this.sectionDataNew){
            this.sectionDataNew  = loadData["sectionDataNew"]
            this.cellHtmlObject.setAttribute("sectionLevel", this.sectionDataNew.level)

        } else {
            this.sectionDataNew = {
                "title": loadData["cellTitle"],
                "level":loadData["sectionTitle"].level
            }
            this.cellHtmlObject.setAttribute("sectionLevel", this.sectionDataNew.level)
        }

        this.controlPanel.sectionInput.value = this.sectionDataNew.level
    }

    loadInAnnotationData(loadData){
        let annotationData = loadData["annotation"]
        annotationData.forEach(a_data=>{
            this.createAnnotation(a_data)
        })
    }

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
    constructor(upperCell){
        this.cellControlPanel = document.createElement("div")
        this.cellControlPanel.classList.add("cellControlPanel")
        this.upperCell = upperCell
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
        let self = this.upperCell
        let pinButton = this.createButton("pinButton", function(){
            pinButton.innerHTML = pinButton.innerHTML=="keep"? "release": "keep"
        })
        pinButton.innerHTML = "keep"
        this.pinButton = pinButton


        let addAnnotationButton = this.createButton("addAnnotationButton", function(){
            let newAnnotation = self.createAnnotation(this.cellID, this.maxAnnotationID)
        })

        addAnnotationButton.innerHTML = "addAnnotation"
        this.addAnnotationButton = addAnnotationButton


        let sectionInput = document.createElement("input")
        sectionInput.type = "number"
        sectionInput.classList.add("cellSectionInput")
        sectionInput.value = 0
        this.sectionInput = sectionInput
        sectionInput.addEventListener("change", function(event){
            let newValue = event.target.value

            self.cellHtmlObject.setAttribute("sectionLevel", newValue)
        })


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
            console.log(self);
            let sectionCellPairMap = self.controlPanel.separateByLevel(Array.from(sectionLevelInput))

            console.log(sectionCellPairMap);
            // setSectionColor()
        })
        sectionTitleButton.innerHTML = "section"
        this.sectionTitleButton = sectionTitleButton

        this.cellControlPanel.append(this.pinButton, this.addAnnotationButton, this.sectionTitleButton, this.sectionInput)
        // console.log(this.cellControlPanel)
    }// create

    separateByLevel(array){
        let sectionLevelValueMap = array.map(p=>parseInt(p.value))
        let sectionLevelValueCellPairMap = array.map(p=>{
            return {"level": parseInt(p.value), "cell": p}
        });

        // to create a list of minimum level's position
        let minLevel = Math.min(...sectionLevelValueMap);
        let minLevelPositionArray = []
        sectionLevelValueMap.forEach((p, i)=>{
            // console.log(p, i);
            if (p==minLevel)  minLevelPositionArray.push(i)

        })



        function chunkArray(targetArray, chunkPointsArray){
            let resultArray = []
            let currentPosition = 0
            // console.log(chunkPointsArray)
            chunkPointsArray.forEach(p=>{
                let copiedTargetArray = targetArray
                let cutArray = copiedTargetArray.slice(currentPosition, p)
                currentPosition = p
                resultArray.push(cutArray)
            })
            resultArray.push(targetArray.slice(currentPosition, targetArray.length))
            // console.log(sectionLevelValueMap);
            // console.log(resultArray);
            return resultArray

        }

        return sectionLevelValueCellPairMap
    }// separateByLevel
}

class NoteTabCell extends Cell{
    constructor(upperTab, data, annotationID, pinned, tabAnnotationType=NoteTabAnnotation){
        super(upperTab, data, annotationID=0, pinned=false, tabAnnotationType)
        this.monitor()
    }

    monitor(){
        let self = this
        let observer = new MutationObserver(function(mutations){
            let notTriggerList = ["latexChildCell"]
            let sourceElement = mutations[0].target

            if (mutations[0].type=="characterData"){
                console.log(mutations[0]);
                sourceElement = sourceElement.parentElement
                let actionFunction = function(ele){
                    ele.innerHTML = sourceElement.innerHTML
                }

                windowManager.symmetryAction(sourceElement, actionFunction, this.parentTab, false)
            }// mutations[0]=="characterData"
        })

        observer.observe(this.cellHtmlObject, {"characterData":true, "subtree": true, "childList": true})
    }

}

class ReferenceTabCell extends Cell{
    constructor(upperTab, data = null, annotationID=0, pinned=false, tabAnnotationType=ReferenceTabAnnotation){
        super(upperTab, data, annotationID, pinned, tabAnnotationType)
    }

    kick(){
        console.log("i am reference tab cell");
    }
}
