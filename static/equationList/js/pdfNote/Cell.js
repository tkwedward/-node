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
        this.selectionBoxHtmlObject = null

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

    searchCell(text){
      let resultsFromAnnotations = this.annotationArray.map(annotation=>{
        return annotation.searchAnnotation(text)
      })
      // if true, then no results from the annotation, make the cell disappear
      let resultFromCell = resultsFromAnnotations.every(p=>p==-1)
      console.log(resultsFromAnnotations);

      if (resultFromCell){
        this.cellHtmlObject.style.display = "none"
      } else {
        this.cellHtmlObject.style.display = "block"
      }
    }

    endSearchMode(){
      this.cellHtmlObject.style.display = "block"

      this.annotationArrray.forEach(p=>{
        p.annotationHtmlObject.style.display = "block"
      })

    }

    initiate(){
        let firstAnnotation = createAnnotation(this.cellID, this.maxAnnotationID)
        this.cellHtmlObject.append(firstAnnotation)
    }

    // create new objects
    createCellTitle(){
        let self = this
        let cellTitle = document.createElement("h2")
        cellTitle.soul = self
        cellTitle.classList.add("cellTitle")
        cellTitle.contentEditable = true
        cellTitle.innerHTML = `Cell Title ${this.cellID}`
        cellTitle.sectionTitle = "false"
        cellTitle.classList.add(`cellTitle_${this.cellID}`)
        // cellTitle.parentTab = this.upperTab

        // methods

        cellTitle.addEventListener("keydown", function(e){
          setTimeout(function(){
            console.log(e.target.soul);
            let message_data = {
              'message': {
                  "content": e.target.innerHTML,
                  'tab_identifier': e.target.soul.upperTab.tabWindowHtmlObject.identifier,
                  'sender': "cellTitle",
                  "cellID": e.target.soul.cellID
              },
              'action': "updateCellTitle"
            }

            chatSocket.send(JSON.stringify(message_data));

          }, 5)
        })

        cellTitle.update = function(title){
            cellTitle.innerHTML = title
            cellTitle.classList.remove(cellTitle.classList[1])
            cellTitle.classList.add(`cellTitle_${self.cellID}`)
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

    createAnnotation(data, append=true){
        // to create Annotation
        let upperCell = this
        let nextAnnotationID = this.getNextAnnotationID(data)
        let _a = new this.tabAnnotationType(this.cellID, nextAnnotationID, upperCell, data)

        this.annotationArray.push(_a)
        if (append){
            this.cellHtmlObject.append(_a.annotationHtmlObject)
        }

        // return annotation
        return _a.annotationHtmlObject

    }

    createCellControlPanel(){
        let _panel = new CellControlPanel(this)
        this.controlPanel = _panel
        this.cellHtmlObject.append(_panel.cellControlPanel)
    }

    // insertBelow, insertAbove, copy, save and load

    selectAnnotationMode(){
        this.annotationArray.forEach(a=>{
            a.selectionBoxHtmlObject.setAttribute("data-selected", "false")
        })
        this.annotationArray.forEach(a=>{
            a.selectionBoxHtmlObject.style.display = "block"
        })
    }

    hideSelectionBox(){
        this.annotationArray.forEach(a=>{
            a.selectionBoxHtmlObject.style.display = "none"
        })
    }

    returnSelectedAnnotation(){
        let selectedAnnotationArray =
        this.annotationArray.filter(a=>{
            let status = a.selectionBoxHtmlObject.getAttribute("data-selected")
            return status == "true"
        })
        this.hideSelectionBox()
        return selectedAnnotationArray
    }

    pasteCellEvent(target, direction){
        let self = target.soul.upperTab
        let firstCell = windowManager.cellEditData[0]

        let referenceCell = target
        console.log(referenceCell);

        for (let i = 0; i <= windowManager.cellEditData.length - 1; i++){
            let target = windowManager.cellEditData[i]
            referenceCell.parentNode.insertBefore(target, referenceCell)
            if (direction=="down"){
                referenceCell.parentNode.insertBefore(referenceCell, target)
                referenceCell = target
            }
        }
    }

    save(){
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
        this.cellID = loadData["cellID"]
        this.cellHtmlObject.classList.add("cell", `cell_${loadData["cellID"]}`)

        this.cellTitle.update(loadData["cellTitle"])


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
        this.controlPanel.sectionInput.value = 0

        this.sectionTitle = loadData["sectionTitle"]

        if (this.sectionDataNew){
            this.sectionDataNew  = loadData["sectionDataNew"]
            this.cellHtmlObject.setAttribute("sectionLevel", this.sectionDataNew.level)

        } else {
            if (loadData["sectionTitle"]){
                this.sectionDataNew = {
                    "title": loadData["cellTitle"],
                    "level":loadData["sectionTitle"].level
                }
            } else {
                this.sectionDataNew = {
                    "title": loadData["cellTitle"],
                    "level": 0
                }
            }

            this.cellHtmlObject.setAttribute("sectionLevel", this.sectionDataNew.level)
        }

        if (this.sectionData){
            this.controlPanel.sectionInput.value = this.sectionData.level || 0
        }

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
        button.soul = this
        button.classList.add(buttonType, buttonType + "_" + this.upperCell.cellID)


        button.addEventListener("click", function(e){
          eventFunction()
          console.log(`________${e.target.soul.upperCell.cellID}_______`);

          if (e.detail){
              stop = e.detail.stop
              console.log("I am not going to continue");
              if (!stop){ // stop
                let message_data = {
                  'message': {
                      "content": e.target.classList[1],
                      'tab_identifier': e.target.soul.upperCell.upperTab.tabWindowHtmlObject.identifier,
                      'sender': "cellControlPanelButton",
                      "cellID": e.target.soul.upperCell.cellID
                  },
                  'action': "cellControlButtonAction"
                }
                chatSocket.send(JSON.stringify(message_data));
              }// if not stop
          }
        })
        return button
    }// createButton

    create(){
        let self = this.upperCell
        let pinButton = this.createButton("pinButton", function(){
            pinButton.innerHTML = pinButton.innerHTML=="keep"? "release": "keep"
        })
        pinButton.innerHTML = "keep"
        this.pinButton = pinButton


        let addAnnotationButton = this.createButton("addAnnotationButton", function(e){
            let newAnnotation = self.createAnnotation(addAnnotationButton.soul.cellID, addAnnotationButton.soul.maxAnnotationID)
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

        let insertAboveButton = this.createButton("insertAboveButton", function(){
            let originalCell = insertAboveButton.soul.upperCell

            let newCell = insertAboveButton.soul.upperCell.upperTab.createNewCell()
            newCell.cellHtmlObject.querySelector(".addAnnotationButton").click()
            originalCell.cellHtmlObject.parentNode.insertBefore(newCell.cellHtmlObject, originalCell.cellHtmlObject)

        })
        insertAboveButton.innerHTML = "insert above"
        this.insertAboveButton = insertAboveButton

        let insertBelowButton = this.createButton("insertBelowButton", function(){
          let originalCell = insertBelowButton.soul.upperCell

          let newCell = insertBelowButton.soul.upperCell.upperTab.createNewCell()
          newCell.cellHtmlObject.querySelector(".addAnnotationButton").click()

          originalCell.cellHtmlObject.parentNode.insertBefore(newCell.cellHtmlObject, originalCell.cellHtmlObject)
          originalCell.cellHtmlObject.parentNode.insertBefore(originalCell.cellHtmlObject, newCell.cellHtmlObject)
        })
        insertBelowButton.innerHTML = "insert below"
        this.insertBelowButton = insertBelowButton

        let deleteButton = this.createButton("deleteButton", function(){
            let originalCell = deleteButton.soul.upperCell.cellHtmlObject
            originalCell.remove()
        })
        deleteButton.innerHTML = "deleteButton"
        this.deleteButton = deleteButton

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


        let increaseTitleLevelButton = this.createButton("increaseTitleLevelButton", function(){
          console.log(sectionInput);
          sectionInput.value = parseInt(sectionInput.value) + 1

        })
        increaseTitleLevelButton.innerHTML = "increase level"
        this.increaseTitleLevelButton = increaseTitleLevelButton

        let decreaseTitleLevelButton = this.createButton("decreaseTitleLevelButton", function(){
          console.log(sectionInput);
          sectionInput.value = parseInt(sectionInput.value) - 1

        })
        decreaseTitleLevelButton.innerHTML = "decrease level"
        this.decreaseTitleLevelButton = decreaseTitleLevelButton


        this.cellControlPanel.append(this.pinButton, this.addAnnotationButton, this.sectionTitleButton, this.insertAboveButton, this.insertBelowButton, this.increaseTitleLevelButton, this.decreaseTitleLevelButton, this.deleteButton, this.sectionInput)
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
        // this.monitor()
    }

}

class ReferenceTabCell extends Cell{
    constructor(upperTab, data = null, annotationID=0, pinned=false, tabAnnotationType=ReferenceTabAnnotation){
        super(upperTab, data, annotationID, pinned, tabAnnotationType)
    }
}
