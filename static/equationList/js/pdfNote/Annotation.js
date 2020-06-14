class Annotation{
    constructor(cellID, annotationID, relatedCell, data = null, addCellID=true, pinned=false){
        this.upperCell = relatedCell
        console.log(cellID);
        this.cellID = cellID
        this.annotationID = annotationID


        if (!data) {

        }

        this.annotationHtmlObject = this.create()

        let loadPromise = new Promise((res, err)=>{
            if (data) {
                this.load(data)
            } else {
                annotationHtmlObject.classList.add("annotation", `annotation_${this.cellID}_${this.annotationID}`)
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
        let annotation = document.createElement("div")
        let annotationContent = this.createLatexCells()
        let panel = new AnnotationControlPanel(this)

        annotation.append(annotationContent, panel.AnnotationControlPanelHtmlObject)
        this.annotationType = "textAnnotation"
        this.annotationContent = annotationContent
        this.panel = panel
        return annotation
    }

    addChangeEvent(dom){
        let other = document.querySelectorAll(`.latexMotherCell_${this.cellID}_${this.annotationID}`);
        let observer = new MutationObserver(function(mutations){
            // console.log(mutations);
        })
        observer.observe(dom, {"attributes": true})
    }

    createLatexCells(){
        let self = this
        // annotation.update = function
        let annotationContent = document.createElement("div")
        annotationContent.classList.add("annotationContent")


        // latexMotherCell
        let latexMotherCell = document.createElement("div")
        this.mother = latexMotherCell
        this.latexMotherCell = latexMotherCell
        latexMotherCell.classList.add("latexMotherCell")
        latexMotherCell.contentEditable = true;
        latexMotherCell.style.minHeight = "40px"
        latexMotherCell.style.fontSize = "20px"
        latexMotherCell.style.border = "2px green solid"

        this.addChangeEvent(latexMotherCell)

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
            console.log(latexMotherCell);
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
                    // console.log(beforePattern);
                     MathJax.tex2svgPromise(p, {em: 12, ex: 6, display: false})
                      .then((html) => {

                          // console.log(html.outerHTML);
                          newMotherHTML=  newMotherHTML.replace(beforePattern, html.outerHTML)
                          // console.log(newMotherHTML);
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
            annotationContent.append(imageText)
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

    // copy, save and load
    copy(){

    }

    save(){
        let _panel = this.panel.AnnotationControlPanelHtmlObject


        let questionButton = _panel.querySelector(".questionButton").innerHTML
        let levelOfDifficultyButton = _panel.querySelector(".levelOfDifficultyButton").innerHTML

        let saveObject = {
            "cellID": this.cellID,
            "annotationID": this.annotationID,
            "questionButton": questionButton,
            "levelOfDifficultyButton": levelOfDifficultyButton,
            "annotationType": this.annotationType
        }

        if (this.annotationType == "textAnnotation"){
            saveObject["latexMotherCellInnerHTML"] = this.mother.innerHTML
        } else {
            saveObject["imageText"] = this.imageText
            saveObject["fileName"] = this.fileName
            saveObject["src"] = this.src
        }

        return saveObject
    }

    update(){
        let mapping = {
            "latexMotherCell": ["innerHTML"],
            "levelOfDifficulty": [],
            "questionStatus": []
        }

        if (this.annotationType == "textAnnotation"){
            // to add the data of latexMotherCell Data to the dom element
            // each this["property"] equal to an html Object
            this.annotationContent.mother.innerHTML = this["latexMotherCell"]
        } else if (this.annotationType == "imageAnnotation"){
            let imageCluster = this.createImageAnnotation()
            console.log(imageCluster);

            // console.log(this.createImageAnnotation());
            let [image, fileNameInput, imageTextButton] = this.createImageAnnotation()
            image.src = this.src
            this.annotationContent.append(image, fileNameInput, imageTextButton)

            // hide the latex mother cell
            this.mother.style.display = "none"
            this.child.style.display = "none"
            this.compileButton.style.display = "none"
        }
    }

    load(loadData){
        // load cellID

        this.latexMotherCell = loadData["latexMotherCell"]
        this.questionStatus = loadData["questionStatus"]
        this.annotationType = loadData["annotationType"]
        this.annotationID = loadData["annotationID"]
        this.levelOfDifficulty = loadData["levelOfDifficulty"]
        this.src = loadData["src"]
        this.fileName = loadData["fileName"]
        this.imageText = loadData["imageText"]

        // add annotation ID
        // this.annotationID = loadData["annotationID"]
        this.annotationHtmlObject.classList.add("annotation", `annotation_${this.cellID}_${this.annotationID}`)
        let idHTMLObject = document.createElement("div")
        idHTMLObject.innerHTML = `annotation_${this.cellID}_${this.annotationID}`
        this.annotationHtmlObject.append(idHTMLObject)

        // the above part is only for loading data, this part is for filling in the html object
        this.update()
    }// load Data

    addCellEvents(){
        this.cell.addEventListener("click", function(){
            let allCells = document.querySelectorAll(".cell")
            allCells.forEach(p=>p.classList.remove("selectedCell"))
            cell.classList.add("selectedCell")
        })
    }
}

class AnnotationControlPanel{
    constructor(annotationObject){
        this.AnnotationControlPanelHtmlObject = document.createElement("div")
        this.AnnotationControlPanelHtmlObject.classList.add("cellControlPanel")
        this.upperAnnotation = annotationObject
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

        let questionButton = this.createButton("questionButton", function(){
            let status = event.target.innerHTML
            event.target.innerHTML = status=="question"? "solved": "question"
            if (status=="question"){
                event.target.parentNode.previousSibling.style.border = "yellow 14px dashed"
                questionButton.questionCreateDate = new Date()
                console.log(questionButton.questionCreateDate);
            } else {
                event.target.parentNode.previousSibling.style.border = "none"
                questionButton.questionCreateDate = null
            }
        })
        questionButton.innerHTML = "question"
        this.questionButton = questionButton

        // 2. delete Button
        let deleteButton = this.createButton("deleteButton", ()=>{
            event.target.parentNode.parentNode.remove()
        })
        deleteButton.innerHTML = "delete"
        this.deleteButton = deleteButton
        // 3. insertAbove
        let insertAbove = this.createButton("insertAbove", function(){
            // upperLeve1 1 = annotation
            // upperLevel 2 = cell

            let newAnnotation = self.upperAnnotation.upperCell.createAnnotation()
            console.log(self.upperAnnotation);
            let targetAnnotation = self.upperAnnotation.htmlObject
            console.log(targetAnnotation);
            let parentNode = targetAnnotation.parentNode
            parentNode.insertBefore(newAnnotation, targetAnnotation)
            // parentNode.insertBefore(newAnnotation, targetAnnotation)
        })
        insertAbove.innerHTML = "insertAbove"
        this.insertAbove = insertAbove

        // 4. insertBelow
        let insertBelow = this.createButton("insertBelow", function(){
            let newAnnotation = this.upperLevel.createAnnotation("textAnnotation")
            let targetAnnotation = event.target.parentNode.parentNode
            let parentNode = targetAnnotation.parentNode
            parentNode.insertBefore(newAnnotation, targetAnnotation)
            parentNode.insertBefore(targetAnnotation, newAnnotation)
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
            let level = ["none", "easy", "medium", "difficult"]
            let currentLevel = annotation.levelOfDifficulty
            let nextIndex = (level.indexOf(currentLevel)+1)%4
            annotation.levelOfDifficulty = level[nextIndex]
            annotation.setAttribute("data-level", level[nextIndex])

        })
        this.levelOfDifficultyButton = levelOfDifficultyButton
        levelOfDifficultyButton.innerHTML = "level"

        this.AnnotationControlPanelHtmlObject.append(questionButton,  deleteButton, insertAbove, insertBelow, addToFlashCardButton, levelOfDifficultyButton)
        // console.log(this.cellControlPanel)
    }// create
}
