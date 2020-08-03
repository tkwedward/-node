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
            this.mother.latexMotherCellHTMLObject.classList.add(`latexMotherCell_${this.cellID}_${this.annotationID}`)
            // this.addChangeEvent(this.mother)

        })
    }

    // create new cellNew
    create(){
        let self = this
        let annotation = document.createElement("div")
        annotation.soul = this
        let annotationContent = this.createLatexCells()
        annotationContent.parentTab = this.parentTab
        annotationContent.soul = this

        annotation.append(annotationContent)
        this.annotationType = "textAnnotation"
        this.annotationContent = annotationContent

        annotation.save = function(){
            return self.save()
        }

        return annotation
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
        annotationContent.classList.add("annotationContent", )

        let latexMotherCell =  new LatexMothercell(this.parentTab)
        let latexChildCell = new LatexChildCell(this.parentTab)

        // 母子相認
        latexMotherCell.addEvents(latexChildCell)
        latexChildCell.addEvents(latexMotherCell)

        let compileButton = document.createElement("button")
        this.compileButton = compileButton
        compileButton.innerHTML = "compile"
        compileButton.style.position = "relative"
        compileButton.style.left = "90%"

        compileButton.addEventListener("click", function(){
            let innerText = latexMotherCell.latexMotherCellHTMLObject.innerHTML
            latexMotherCell.latexMotherCellHTMLObject.style.display = "none"
            latexChildCell.latexChildCellHTMLObject.classList.remove("selectedLatexChildCell")
        })
        compileButton.click()




        this.mother = latexMotherCell
        this.child = latexChildCell
        this.latexMotherCell = latexMotherCell

        annotationContent.mother = latexMotherCell
        annotationContent.child= latexChildCell
        annotationContent.compileButton = compileButton

        annotationContent.append(latexMotherCell.latexMotherCellHTMLObject, latexChildCell.latexChildCellHTMLObject, compileButton)

        return annotationContent
    }


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
            saveObject["latexMotherCellInnerHTML"] = this.mother.latexMotherCellHTMLObject.innerHTML
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

            this.annotationContent.mother.latexMotherCellHTMLObject.innerHTML = this["latexMotherCellInnerHTML"]

        } else if (this.annotationType == "imageAnnotation"){
            let imageCluster = this.createImageAnnotation()
            let [image, fileNameInput, imageTextButton] = this.createImageAnnotation()
            image.src = this.src
            this.annotationContent.append(image, fileNameInput, imageTextButton)

            // hide the latex mother cell
            this.mother.latexMotherCellHTMLObject.style.display = "none"
            this.child.latexChildCellHTMLObject.style.display = "none"
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
        button.classList.add(buttonType)
        button.addEventListener("click", eventFunction)
        return button
    }// createButton

    create(){
        let self = this
        let annotation = this.upperAnnotation.annotationHtmlObject
        let questionButton = this.createButton("questionButton", function(){
            let sourceElement = event.target
            console.log(sourceElement);

            let actionFunction = function(ele){

                let status = ele.innerHTML
                ele.innerHTML = status=="question"? "solved": "question"
                self.upperAnnotation.questionStatus = ele.innerHTML


                if (status=="question"){
                    ele.parentNode.previousSibling.style.border = "yellow 14px dashed"
                    ele.questionCreateDate = new Date()
                } else {
                    ele.parentNode.previousSibling.style.border = "none"
                    ele.questionCreateDate = null
                }
            }


            console.log(self.upperAnnotation);
            windowManager.symmetryAction(sourceElement, actionFunction, self.upperAnnotation.parentTab)
        })
        questionButton.classList.add(`questionButton_${this.cellID}_${this.annotationID}`)
        questionButton.innerHTML = "question"
        this.questionButton = questionButton

        // 2. delete Button
        let deleteButton = this.createButton("deleteButton", ()=>{
            let sourceElement = event.target.parentNode.parentNode
            let actionFunction = function(ele){
                ele.remove()
            }

            self.upperAnnotation.takeActions(sourceElement, actionFunction)
        })
        deleteButton.innerHTML = "delete"
        this.deleteButton = deleteButton
        // 3. insertAbove
        let insertAbove = this.createButton("insertAbove", function(){
            let sourceElement = self.upperAnnotation.annotationHtmlObject
            let actionFunction = function(ele){
                let newAnnotation = ele.soul .upperCell.createAnnotation()
                let parentNode = ele.parentNode
                parentNode.insertBefore(newAnnotation, ele)
            }

            self.upperAnnotation.takeActions(sourceElement, actionFunction)
        })
        insertAbove.innerHTML = "insertAbove"
        this.insertAbove = insertAbove

        // 4. insertBelow
        let insertBelow = this.createButton("insertBelow", function(){
            let sourceElement = self.upperAnnotation.annotationHtmlObject
            let actionFunction = function(ele){
                let newAnnotation = ele.soul .upperCell.createAnnotation()
                let parentNode = ele.parentNode
                parentNode.insertBefore(newAnnotation, ele)
                parentNode.insertBefore(ele, newAnnotation)
            }

            // actionFunction(sourceElement)
            console.log(self.upperAnnotation);
            self.upperAnnotation.takeActions(sourceElement, actionFunction)

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

class LatexMothercell {
    constructor(parentTab){
        this.latexMotherCellHTMLObject = this.createHTMLObject()
        this.parentTab = parentTab

    }

    createHTMLObject(){
      let latexMotherCell = document.createElement("div")
      latexMotherCell.classList.add("latexMotherCell")
      latexMotherCell.contentEditable = true;
      latexMotherCell.style.minHeight = "40px"
      latexMotherCell.style.fontSize = "20px"
      latexMotherCell.style.border = "2px green solid"
      latexMotherCell.soul = this
      return latexMotherCell
    }

    addEvents(childCell){
      let self = this
      this.childCell = childCell

      this.latexMotherCellHTMLObject.addEventListener("DOMSubtreeModified", function(){
          let motherInnerText = self.latexMotherCellHTMLObject.innerHTML
          self.renderLatex()
          self.latexMotherCellHTMLObject.classList.remove("selected")

      })

      // to focus on the choosen latexMotherCell
      this.latexMotherCellHTMLObject.addEventListener("click", function(){
          let allMother = document.querySelectorAll(".latexMotherCell")
          allMother.forEach(mother=>{
              if (mother!=event.target){
                  mother.classList.remove("selected")
                  // mother.parentNode.querySelector("selectedLatexChildCell").classList.remove("selectedLatexChildCell")
              }
          })
          event.target.classList.add("selected")
          self.childCell.latexChildCellHTMLObject.classList.add("selectedLatexChildCell")
      })
    }// addEditEvent

    renderLatex(){
        let pattern1 = /@[(](.*?)@[)]/g
        let pattern2 = /##(.*?)##/g

        this.findPattern(pattern1)
        this.findPattern(pattern2)

        let imageArray = this.latexMotherCellHTMLObject.querySelectorAll("img")

        imageArray.forEach(p=>{
          if (p.src.substring(0, 10) == "data:image"){

          }
        })
// data:image/png
    }

    findPattern(pattern){
        let motherTextArray = this.latexMotherCellHTMLObject.innerHTML.match(pattern)
        let renderedHTML = this.latexMotherCellHTMLObject.innerHTML
        if (motherTextArray){

            motherTextArray.forEach(p=>{
                let beforePattern = p
                p = p.slice(2, p.length-2);
                p = p.split("@").join("\\").split("##").join("$$")

                 MathJax.tex2svgPromise(p, {em: 12, ex: 6, display: false})
                  .then((html) => {
                      renderedHTML =  renderedHTML.replace(beforePattern, html.outerHTML)
                      this.childCell.latexChildCellHTMLObject.innerHTML = renderedHTML
                  });
            })

        } else{
            this.childCell.latexChildCellHTMLObject.innerHTML = renderedHTML
        }

    }




}

class LatexChildCell {
    constructor(parentTab){
        this.latexChildCellHTMLObject = this.createHTMLObject()
        this.parentTab = parentTab
        this.addEvents()
    }

    createHTMLObject(){
      let latexChildCell = document.createElement("div")
      latexChildCell.classList.add("latexChildCell")
      latexChildCell.contentEditable = false;
      latexChildCell.soul = this
      return latexChildCell
    }

    addEvents(motherCell){
      let self = this
      this.motherCell = motherCell

      this.latexChildCellHTMLObject.addEventListener("click", function(){
          self.motherCell.latexMotherCellHTMLObject.style.display = "block"
      })
    }
}
