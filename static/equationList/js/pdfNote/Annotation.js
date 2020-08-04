class Annotation{
    constructor(cellID, annotationID, relatedCell, data = null, addCellID=true, pinned=false){
        this.upperCell = relatedCell
        this.parentTab = this.upperCell.parentTab
        this.cellID = cellID
        this.annotationID = annotationID || 0
        this.annotationHtmlObject = this.create()
        this.panel = this.createAnnotationPanel()
        this.imageTextArray = []
        this.selectionBoxHtmlObject = this.createSelectionBox()

        if (!data) {
            this.appendIDHtmlObject()
        }

        let loadPromise = new Promise((res, err)=>{
            if (data) {
                this.load(data)
            } else {
                this.annotationHtmlObject.classList.add("annotation", `annotation_${this.cellID}_${this.annotationID}`)
            }
            res("finish loading")
        })
        .then((res, err)=>{
            this.mother.classList.add(`latexMotherCell_${this.cellID}_${this.annotationID}`)
            // this.addChangeEvent(this.mother)

        })
    }

    // create new cellNew
    create(){
        let self = this
        let annotation = document.createElement("div")
        annotation.setAttribute("aid", this.annotationID)

        let annotationContent = this.createLatexCells()
        annotation.soul = self


        annotation.append(annotationContent)
        this.annotationType = "textAnnotation"
        this.annotationContent = annotationContent


        annotation.save = function(){
            return self.save()
        }

        // to add keypress event
        this.annotationKeypressEvent(annotation)

        return annotation
    }

    annotationKeypressEvent(annotation){
      let self = this
      annotation.addEventListener("keydown", function(e){
          console.log(e);
          if (e.target.soul){
            setTimeout(function(){
              let message_data = {
                'message': {
                    "content": e.target.soul.save(),
                    "latexMotherCellInnerHTML": e.target.innerHTML,
                    'tab_identifier': e.target.soul.upperCell.upperTab.tabWindowHtmlObject.identifier,
                    'sender': "annotation",
                    "cellID": e.target.soul.cellID
                },
                'action': "motherCellUpdate"
              }

              chatSocket.send(JSON.stringify(message_data));

            }, 5)
          }
      })
    }


    createAnnotationPanel(){
        let panel = new AnnotationControlPanel(this)
        this.annotationHtmlObject.append(panel.AnnotationControlPanelHtmlObject)
        return panel
    }

    createSelectionBox(){
        let selectionBox = document.createElement("div")
        selectionBox.setAttribute("data-selected", "false")
        selectionBox.classList.add("annotationSelectBox", `annotationSelectBox_${this.cellID}_${this.annotationID}`)
        selectionBox.style.display = "none"
        this.annotationHtmlObject.append(selectionBox)

        selectionBox.addEventListener("click", function(){
            let status = selectionBox.getAttribute("data-selected")

            let new_status = status=="true" ? "false" : "true"
            selectionBox.setAttribute("data-selected", new_status)

        })

        return selectionBox
    }

    createLatexCells(){
        let self = this
        // annotation.update = function
        let annotationContent = document.createElement("div")
        annotationContent.classList.add("annotationContent")


        // latexMotherCell
        let latexMotherCell = document.createElement("div")
        this.mother = latexMotherCell
        latexMotherCell.soul = this
        this.latexMotherCell = latexMotherCell
        latexMotherCell.classList.add("latexMotherCell")
        latexMotherCell.contentEditable = true;
        latexMotherCell.style.minHeight = "40px"
        latexMotherCell.style.fontSize = "20px"
        latexMotherCell.style.border = "2px green solid"



        // to run render when the content of the latexMotherCell is changed. latexMotherCell
        latexMotherCell.addEventListener("DOMSubtreeModified", function(){
            let motherInnerText = latexMotherCell.innerHTML
            self.renderLatex(latexMotherCell, latexChildCell)
            latexMotherCell.classList.remove("selected")

            // changeMode("Command")

        })

        // to focus on the choosen latexMotherCell
        latexMotherCell.addEventListener("click", function(){

            let allMother = document.querySelectorAll(".latexMotherCell")
            allMother.forEach(mother=>{
                if (mother!=event.target){
                    mother.classList.remove("selected")
                    // mother.parentNode.querySelector("selectedLatexChildCell").classList.remove("selectedLatexChildCell")
                }
            })
            event.target.classList.add("selected")
            latexChildCell.classList.add("selectedLatexChildCell")
        })


        // why do we need this setTimeout method here?
        setTimeout(function(){
            self.renderLatex(latexMotherCell, latexChildCell)
        }, 2000)

        // latexChildCell
        let latexChildCell = document.createElement("div")
        this.child = latexChildCell
        latexChildCell.classList.add("latexChildCell")
        latexChildCell.contentEditable = false;

        // to hide the mother cell
        latexChildCell.addEventListener("click", function(){
            let latexMotherCell = latexChildCell.previousSibling
            latexMotherCell.style.display = "block"
        })

        let compileButton = document.createElement("button")
        this.compileButton = compileButton
        compileButton.innerHTML = "compile"
        compileButton.style.position = "relative"
        compileButton.style.left = "90%"

        compileButton.addEventListener("click", function(){
            let innerText = latexMotherCell.innerHTML
            latexMotherCell.style.display = "none"
            latexChildCell.classList.remove("selectedLatexChildCell")
        })
        compileButton.click()

        annotationContent.mother = latexMotherCell
        annotationContent.child= latexChildCell
        annotationContent.compileButton = compileButton

        annotationContent.append(latexMotherCell, latexChildCell, compileButton)

        return annotationContent
    }

    renderLatex(latexMotherCell, latexChildCell){

         function findPattern(pattern){
            let motherText = latexMotherCell.innerHTML.match(pattern)
            let newMotherHTML = latexMotherCell.innerHTML
            if (motherText){

                motherText.forEach(p=>{
                    let beforePattern = p
                    p = p.slice(2, p.length-2);
                    p = p.split("@").join("\\").split("##").join("$$")

                     MathJax.tex2svgPromise(p, {em: 12, ex: 6, display: false})
                      .then((html) => {
                          newMotherHTML=  newMotherHTML.replace(beforePattern, html.outerHTML)
                          latexChildCell.innerHTML = newMotherHTML
                      });
                })
            } else{
                latexChildCell.innerHTML = newMotherHTML
            }
        }//findPattern


        let pattern1 = /@[(](.*?)@[)]/g
        let pattern2 = /##(.*?)##/g


        findPattern(pattern1)
        findPattern(pattern2)

    }// renderLatex

    createImageAnnotation(){
        let self = this
        let image = new Image()
        image.src = ""

        let fileNameInput = document.createElement("input")
        fileNameInput.classList.add("fileNameInput")

        let imageTextButton = document.createElement("button")
        imageTextButton.addEventListener("click", function(){
            let imageText = document.createElement("div")
            imageText.contentEditable = true
            imageText.classList.add("imageText")
            imageText.style.background = "MistyRose"
            imageText.innerHTML = "imageText"
            self.annotationContent.append(imageText)
            self.imageTextArray.push(imageText)
        })
        imageTextButton.innerHTML = "add text"

        // add in the image part and hide the latex mother cell
        return [image, fileNameInput, imageTextButton]
    }

    createAnnotationControlPanel(){
        let _panel = new AnnotationControlPanel()
        _panel.create()

        this.controlPanel = _panel
        this.cell.append(_panel.cellControlPanel)
    }

    // copy,  and load
    copy(){

    }

    getImageTextArray(){
        // return this.imageTextArray.map(p=>p.innerText)
    }

    save(){
        let _panel = this.panel.AnnotationControlPanelHtmlObject

        let saveObject = {
            "cellID": this.cellID,
            "annotationID": this.annotationID,
            "questionStatus": this.questionStatus,
            "levelOfDifficultyButton": this.levelOfDifficulty,
            "annotationType": this.annotationType
        }

        if (this.annotationType == "textAnnotation"){
            saveObject["latexMotherCellInnerHTML"] = this.mother.innerHTML
        } else {
            saveObject["imageText"] = this.getImageTextArray()
            saveObject["fileName"] = this.fileName
            saveObject["src"] = this.src
        }

        return saveObject
    }

    update(){
        let mapping = {
            "latexMotherCell": ["innerHTML"],
            "levelOfDifficulty": this.levelOfDifficulty,
            "questionStatus": this.questionButton
        }

        this.annotationHtmlObject.setAttribute("data-level", this.levelOfDifficulty)


        // update text or image Annotation
        if (this.annotationType == "textAnnotation"){
            // to add the data of latexMotherCell Data to the dom element
            // each this["property"] equal to an html Object

            this.annotationContent.mother.innerHTML = this["latexMotherCellInnerHTML"]
        } else if (this.annotationType == "imageAnnotation"){
            let imageCluster = this.createImageAnnotation()
            let [image, fileNameInput, imageTextButton] = this.createImageAnnotation()
            image.src = this.src
            this.annotationContent.append(image, fileNameInput, imageTextButton)

            // hide the latex mother cell
            this.mother.style.display = "none"
            this.child.style.display = "none"
            this.compileButton.style.display = "none"
        } // update text or image Annotation


        // update buttons
        this.panel.questionButton.innerHTML = this.questionStatus
        if (this.questionStatus=="solved"){
            this.annotationContent.style.border = "yellow 14px dashed"
        }
    }

    load(loadData){
        // load cellID
        if (loadData["latexMotherCellInnerHTML"]){
            this.latexMotherCellInnerHTML = loadData["latexMotherCellInnerHTML"]
        } else {
            this.latexMotherCellInnerHTML = loadData["latexMotherCell"]
        }



        this.questionStatus = loadData["questionStatus"]
        this.annotationType = loadData["annotationType"]
        this.annotationID = loadData["annotationID"]
        this.levelOfDifficulty = loadData["levelOfDifficultyButton"]

        this.annotationContent.setAttribute("data-level", loadData["levelOfDifficulty"])

        this.src = loadData["src"]
        this.fileName = loadData["fileName"]
        this.imageTextArray = loadData["imageText"]

        // add annotation ID
        // this.annotationID = loadData["annotationID"]
        this.annotationHtmlObject.classList.add("annotation", `annotation_${this.cellID}_${this.annotationID}`)
        this.annotationHtmlObject.setAttribute("aid", this.annotationID)
        this.appendIDHtmlObject()

        // the above part is only for loading data, this part is for filling in the html object
        this.update()
    }// load Data

    appendIDHtmlObject(){
        let idHTMLObject = document.createElement("div")
        idHTMLObject.innerHTML = `annotation_${this.cellID}_${this.annotationID}`
        this.annotationHtmlObject.append(idHTMLObject)
    }

    addCellEvents(){
        this.cell.addEventListener("click", function(){
            let allCells = document.querySelectorAll(".cell")
            allCells.forEach(p=>p.classList.remove("selectedCell"))
            cell.classList.add("selectedCell")
        })
    }

    pasteImage(imgSrc){

        console.log(imgSrc);
        let self = this
        let createdDate =  new Date().toLocaleString().split("/").join("-") + " "

        let actionFunction = function(ele){

            let [image, fileNameInput, imageTextButton] = self.createImageAnnotation()

            ele.soul.annotationType = "imageAnnotation"
            ele.soul.src = imgSrc
            image.src = imgSrc
            image.createdDate = createdDate
            image.classList.add("pastedImage")

            fileNameInput.value = createdDate
            ele.soul.fileName = createdDate

            ele.soul.annotationContent.append(image, fileNameInput, imageTextButton)

            // hide the latex mother cell
            ele.soul.mother.style.display = "none"
            ele.soul.child.style.display = "none"
            ele.soul.compileButton.style.display = "none"
        }

        this.takeActions(this.annotationHtmlObject, actionFunction)
    }
}


class NoteTabAnnotation extends Annotation{
    constructor(cellID, annotationID, relatedCell, data = null, addCellID=true, pinned=false){
        super(cellID, annotationID, relatedCell, data, addCellID, pinned)
    }

    takeActions(sourceElement, actionFunction){
        windowManager.symmetryAction(sourceElement, actionFunction)
    }
}

class ReferenceTabAnnotation extends Annotation{
    constructor(cellID, annotationID, relatedCell, data = null, addCellID=true, pinned=false){
        super(cellID, annotationID, relatedCell, data, addCellID, pinned)
    }

    takeActions(sourceElement, actionFunction){
        actionFunction(sourceElement)
    }
}

class AnnotationControlPanel{
    constructor(annotationObject){
        this.AnnotationControlPanelHtmlObject = document.createElement("div")
        this.AnnotationControlPanelHtmlObject.classList.add("cellControlPanel")
        this.upperAnnotation = annotationObject
        this.cellID = annotationObject.cellID
        this.annotationID = annotationObject.annotationID
        this.create()
    }

    createButton(buttonType, eventFunction){
        let button = document.createElement("button")
        button.soul = this
        button.classList.add(buttonType)

        button.addEventListener("click", function(e){
          console.log("what is the detail?");
          console.log(e.detail);

          eventFunction()
          console.log(`________${e.target.soul.cellID}, ${e.target.soul.upperAnnotation.annotationHtmlObject.getAttribute("aid")}_________`);

          if (e.detail){
              stop = e.detail.stop
              console.log("I am not going to continue");
              if (!stop){ // stop
                let message_data = {
                  'message': {
                      'content': buttonType,
                      'tab_identifier': e.target.soul.upperAnnotation.upperCell.upperTab.tabWindowHtmlObject.identifier,
                      'sender': "annotationControlPanelButton",
                      "cellID": e.target.soul.cellID,
                      "annotationID": e.target.soul.upperAnnotation.annotationHtmlObject.getAttribute("aid"),
                    },
                    'action': "annotationControlPanelButton"
                  }

                  chatSocket.send(JSON.stringify(message_data));
              }
          }

          // eventFunction(e)

        })

        return button

    }// createButton

    create(){
        let self = this
        let annotation = this.upperAnnotation.annotationHtmlObject

        // create question buttun
        let questionButton = this.createButton("questionButton", function(){

                let status = questionButton.innerHTML
                questionButton.innerHTML = status=="question"? "solved": "question"
                self.upperAnnotation.questionStatus = questionButton.innerHTML


                if (status=="question"){
                    questionButton.parentNode.previousSibling.style.border = "yellow 14px dashed"
                    questionButton.questionCreateDate = new Date()
                } else {
                    questionButton.parentNode.previousSibling.style.border = "none"
                    questionButton.questionCreateDate = null
                }

        })
        questionButton.classList.add(`questionButton_${this.cellID}_${this.annotationID}`)
        questionButton.innerHTML = "question"
        this.questionButton = questionButton

        // 2. delete Button
        let deleteButton = this.createButton("deleteButton", ()=>{
            let targetAnnotation = event.target.parentNode.parentNode
            targetAnnotation.remove()
        })
        deleteButton.innerHTML = "delete"
        this.deleteButton = deleteButton
        // 3. insertAbove

        let insertAbove = this.createButton("insertAbove", function(){
            console.log("insert above");
            let newAnnotation = self.upperAnnotation.upperCell.createAnnotation()
            let parentNode = self.upperAnnotation.annotationHtmlObject.parentNode
            parentNode.insertBefore(newAnnotation, self.upperAnnotation.annotationHtmlObject)
        })
        insertAbove.innerHTML = "insertAbove"
        this.insertAbove = insertAbove

        // 4. insertBelow
        let insertBelow = this.createButton("insertBelow", function(e){

            let newAnnotation = self.upperAnnotation.upperCell.createAnnotation()

            let parentNode = self.upperAnnotation.annotationHtmlObject.parentNode
            parentNode.insertBefore(newAnnotation, self.upperAnnotation.annotationHtmlObject)
            parentNode.insertBefore(self.upperAnnotation.annotationHtmlObject, newAnnotation)
        })
        insertBelow.innerHTML = "insertBelow"
        this.insertBelow = insertBelow

        // flash card
        let addToFlashCardButton = this.createButton("addToFlashCardButton", function (){
            let _annotation = event.target.parentNode.parentNode
            let _cell = _annotation.parentNode

            _annotation.flashCard = _annotation.flashCard==true ? false: true
            event.target.style.background = event.target.style.background == ""? "yellow": ""
        })
        this.addToFlashCardButton = addToFlashCardButton
        addToFlashCardButton.innerHTML = "flash card"

        let levelOfDifficultyButton = this.createButton("levelOfDifficultyButton", function (){
            console.log(annotation);
            let level = ["none", "easy", "medium", "difficult"]
            let currentLevel = annotation.soul.levelOfDifficulty

            console.log(currentLevel);
            let nextIndex = (level.indexOf(currentLevel)+1)%4

            annotation.levelOfDifficulty = level[nextIndex]
            annotation.soul.levelOfDifficulty = level[nextIndex]

            annotation.setAttribute("data-level", level[nextIndex])

        })
        this.levelOfDifficultyButton = levelOfDifficultyButton

        levelOfDifficultyButton.innerHTML = "level"

        this.AnnotationControlPanelHtmlObject.append(questionButton,  deleteButton, insertAbove, insertBelow, addToFlashCardButton, levelOfDifficultyButton)
    }// create new annotation

}
