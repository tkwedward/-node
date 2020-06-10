class Annotation{
    constructor(relatedCell, data = null, addCellID=true, className = "cell", annotationID=0, pinned=false){
        this.upperCell = relatedCell
        this.cellID = relatedCell.cellID

        if (!data) {
            this.annotationID = relatedCell.upperTab.maxAnnotationBlockID
            relatedCell.upperTab.maxAnnotationBlockID += 1
        }

        this.annotation = this.create()

        if (data) {
            this.load(data)
        }

    }

    // create new cellNew
    create(){
        let annotation = document.createElement("div")
        annotation.classList.add("annotation", `annotation_${this.cellID}_${this.annoannotationID}`)

        let annotationContent = this.createLatexCells()

        let panel = new AnnotationControlPanel(this)

        annotation.append(annotationContent, panel.htmlObject)

        this.htmlObject = annotation
        this.annotationContent = annotationContent


        return annotation

        // this.createAnnotationControlPanel()
        // this.addCellEvents()
    }


    createLatexCells(){
        let self = this
        // annotation.update = function
        let annotationContent = document.createElement("div")
        annotationContent.classList.add("annotationContent")


        // latexMotherCell
        let latexMotherCell = document.createElement("div")
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
        latexChildCell.classList.add("latexChildCell")
        latexChildCell.contentEditable = false;

        // to hide the mother cell
        latexChildCell.addEventListener("click", function(){
            let latexMotherCell = latexChildCell.previousSibling
            console.log(latexMotherCell);
            latexMotherCell.style.display = "block"
        })


        let compileButton = document.createElement("button")
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

    update(){
        let mapping = {
            "latexMotherCell": ["innerHTML"],
            "levelOfDifficulty": [],
            "questionStatus": []
        }
        this.annotationContent.mother.innerHTML = this["latexMotherCell"]

    }

    load(loadData){
        // load cellID
        Object.entries(loadData).forEach(p=>{
            let key = p[0]
            let value = p[1]
            this[key] = value
        })
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
        this.htmlObject = document.createElement("div")
        this.htmlObject.classList.add("cellControlPanel")
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
        console.log(this.upperAnnotation.upperCell);
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

        this.htmlObject.append(questionButton,  deleteButton, insertAbove, insertBelow, addToFlashCardButton, levelOfDifficultyButton)
        // console.log(this.cellControlPanel)
    }// create
}
