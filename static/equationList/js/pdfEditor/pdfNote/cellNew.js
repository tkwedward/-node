function changeMode(newMode){
    mode = newMode
    document.querySelector(".mode").innerHTML = newMode
}
// createNewCell
function createNewCell(addCellID=true){
    let cell = document.createElement("div")
    cell.classList.add("cell")

    cell.cellID = cellID || 0
    if (addCellID){
        cellID+=1
    }



    let cellTitle = document.createElement("h2")
    cellTitle.classList.add("cellTitle")
    cellTitle.contentEditable = true
    cellTitle.innerHTML = ""
    cellTitle.sectionTitle = "false"
    cell.append(cellTitle)

    let cellControlPanel = document.createElement("div")
    cellControlPanel.classList.add("cellControlPanel")

    // add elements
    // cellTitle, firstAnnotation, cellControlPanel
    cell.append(cellControlPanel)


    // events
    cell.addEventListener("click", function(){
        let allCells = document.querySelectorAll(".cell")
        allCells.forEach(p=>p.classList.remove("selectedCell"))
        console.log("I am a cell. I am being selected.")
        cell.classList.add("selectedCell")
    })

    cell.addEventListener("keydown", function(){
        console.log("copy cell");
        if (event.keyCode==82 && event.ctrlKey){// to insert cell
            let targetCell = event.target.parentNode.innerHTML


            let copyCell = document.createElement("div")
            copyCell.classList.add("copyCell")
            copyCell.innerHTML = targetCell


            let copyNoteContainer = document.querySelector(".copyNoteContainer")
            copyNoteContainer.innerHTML = ""
            copyNoteContainer.style.display = "block"
            copyNoteContainer.append(copyCell)

            let noteCardContainer = document.querySelector(".noteCardContainer")
            noteCardContainer.style.display= "none"

            copyNoteContainer.scrollTo(0, 0)
        }
    })


    let pinButton = createButton("pinButton", function(){
        pinButton.innerHTML = pinButton.innerHTML=="keep"? "release": "keep"
    })
    pinButton.innerHTML = "keep"



    let addAnnotationButton = createButton("addAnnotationButton", function(){
        let newAnnotation = createAnnotation("textAnnotation")
        cell.insertBefore(newAnnotation, event.target.parentNode)
    })
    addAnnotationButton.innerHTML = "addAnnotation"



    let sectionTitleButton = createButton("sectionTitleButton", function(){
        let targetCell = event.target.parentNode.parentNode
        targetCell.sectionTitle = targetCell.sectionTitle=="false"? "true": "false"

        if (targetCell.sectionTitle=="true"){
            targetCell.classList.add("sectionTitle")
        } else {
            targetCell.classList.remove("sectionTitle")
        }


        setSectionColor()
    })
    sectionTitleButton.innerHTML = "section"


    cellControlPanel.append(pinButton, addAnnotationButton, sectionTitleButton)

    cell.initiate = function(){
        let firstAnnotation = createAnnotation("textAnnotation")
        cell.append(firstAnnotation)
    }

    cell.save = function(){
        saveObject = {
            cellID: cell.cellID,
            cellTitle: cellTitle.innerHTML,
            sectionTitle: cell.sectionTitle,
            pinButton: pinButton.innerHTML,

            annotation: []
        }

        let annotations = cell.querySelectorAll(".annotation")
        let goToPageButton = cell.querySelector(".goToPageButton")
        if (goToPageButton){
            saveObject["goToPageButton"] = goToPageButton.innerHTML
        }

        annotations.forEach(p=>{
            saveObject["annotation"].push(p.save())
        })

        return saveObject
    }

    cell.load = function(loadData){
        if (loadData["cellID"]){
            cell.cellID = loadData["cellID"]
            cellID -= 1
            cell.append("cellID is " + cell.cellID)
        }

        // pinButton: keep / release
        let pinButton = cell.querySelector(".pinButton")
        pinButton.innerHTML = loadData["pinButton"]

        // sectionTitle = true / false
        cell.sectionTitle = loadData["sectionTitle"]

        if (cell.sectionTitle=="true"){
            cell.classList.add("sectionTitle")
        }

        // cellTitle
        cellTitle.innerHTML = loadData["cellTitle"] ||""
        loadData.annotation.forEach(p=>{
            let newAnnotation = createAnnotation(p.annotationType, p)

            newAnnotation.load(p)
            cell.insertBefore(newAnnotation, cellControlPanel)
        })





    }
    return cell
}


// createButton
function createButton(buttonType, eventFunction){
    let button = document.createElement("button")
    button.classList.add(buttonType)
    button.addEventListener("click", eventFunction)
    return button
}

function createAnnotationTitle(){
    let titleDIV = document.createElement("a")
    titleDIV.classList.add("annotationTitle")
    titleDIV.contentEditable = true
    titleDIV.innerHTML = "Title"
    titleDIV.style.fontSize = "25px"
    return titleDIV
}

// createAnnotation
function createAnnotation(annotationType, addAnnotationID=true){
    let currentAnnotation
    let annotation = document.createElement("div")
    let type = annotationType || "textAnnotation"
    annotation.classList.add(type, "annotation")
    annotation.style.marginBottom = "20px"
    annotation.annotationType = annotationType
    annotation.annotationID = annotationID
    // annotation.flashCard = "false"

    if (addAnnotationID){
        annotationID+=1
    }

    annotationLabel.innerHTML = annotationID

    // set level`
    annotation.levelOfDifficulty = "none"
    annotation.setAttribute("data-level", annotation.levelOfDifficulty)

    // annotation.style.background = "wheat"

    let annotationContent = document.createElement("div")
    annotationContent.classList.add("annotationContent")

    // annotationControlPanel
    let annotationControlPanel = document.createElement("div")
    annotationControlPanel.classList.add("annotationControlPanel")

    let questionButton = createButton("questionButton", function(){
        let status = event.target.innerHTML
        event.target.innerHTML = status=="question"? "solved": "question"
        if (status=="question"){
            event.target.parentNode.previousSibling.style.border = "yellow 14px dashed"
        } else {
            event.target.parentNode.previousSibling.style.border = "none"
        }
    })
    questionButton.innerHTML = "question"

    let deleteButton = createButton("deleteButton", ()=>{
        event.target.parentNode.parentNode.remove()
    })
    deleteButton.innerHTML = "delete"

    let insertAbove = createButton("insertAbove", function(){
        let newAnnotation = createAnnotation("textAnnotation")
        let targetAnnotation = event.target.parentNode.parentNode
        let parentNode = targetAnnotation.parentNode
        parentNode.insertBefore(newAnnotation, targetAnnotation)
    })
    insertAbove.innerHTML = "insertAbove"

    let insertBelow = createButton("insertBelow", function(){
        let newAnnotation = createAnnotation("textAnnotation")
        let targetAnnotation = event.target.parentNode.parentNode
        let parentNode = targetAnnotation.parentNode
        parentNode.insertBefore(newAnnotation, targetAnnotation)
        parentNode.insertBefore(targetAnnotation, newAnnotation)
    })
    insertBelow.innerHTML = "insertBelow"

    // flash card
    let addToFlashCardButton = createButton("addToFlashCardButton", function (){
        let _annotation = event.target.parentNode.parentNode
        let _cell = _annotation.parentNode

        _annotation.flashCard = _annotation.flashCard==true ? false: true
        event.target.style.background = event.target.style.background == ""? "yellow": ""
    })
    addToFlashCardButton.innerHTML = "flash card"


    let levelOfDifficultyButton = createButton("levelOfDifficultyButton", function (){
        let level = ["none", "easy", "medium", "difficult"]
        let currentLevel = annotation.levelOfDifficulty
        let nextIndex = (level.indexOf(currentLevel)+1)%4
        annotation.levelOfDifficulty = level[nextIndex]
        annotation.setAttribute("data-level", level[nextIndex])

    })
    levelOfDifficultyButton.innerHTML = "level"

    let mergeButton = createButton("mergeButton", function (){

    })


    annotationControlPanel.append(questionButton, deleteButton, insertAbove, insertBelow, addToQuestionBankButton, addToFlashCardButton, levelOfDifficultyButton)

    // latexMotherCell, latexChildCell
    if (annotationType=="textAnnotation"){
        annotationContent = textAnnotationContent(annotationContent)
        annotation.append(annotationContent)
    } else if (annotationType=="imageAnnotation"){

        let imageTextButton = imageAnnotationContent(annotationContent)
        annotationControlPanel.append(imageTextButton)
    }// imageAnnotation

    annotationControlPanel.append(linkPdfPageButton)
    annotation.append(annotationContent, annotationControlPanel)

    annotation.save = function(){
        let attributes = ["annotationType", "latexMotherCell"]

        let saveObject;


        if (annotationType=="textAnnotation"){
            let latexMotherCell = annotation.querySelector(".latexMotherCell")
            let questionButton = annotation.querySelector(".questionButton")

            saveObject = {
                questionStatus: questionButton.innerHTML,
                latexMotherCell: latexMotherCell.innerHTML
            }

        } else if (annotationType=="imageAnnotation"){
            saveObject = {
                imageText: [],
                src: "",
                createDate: "",
                fileName: "",
            }

            let imageTextAll = annotationContent.querySelectorAll(".imageText")
            imageTextAll.forEach(p=>{
                saveObject["imageText"].push(p.innerHTML)
            })


            let image = annotation.querySelector("img")
            saveObject.src = image.src
            saveObject.createDate = image.createDate

            saveImageAndGetURL(annotation)

            let fileName = annotation.querySelector(".fileNameInput").value
            saveObject["fileName"] = fileName

        }

        let annotationTitle = annotation.querySelector(".annotationTitle")
        if (annotationTitle){
            saveObject["annotationTitle"] = annotationTitle.innerHTML
        }

        saveObject["annotationType"] = annotation.annotationType
        saveObject["annotationID"] = annotation.annotationID
        saveObject["pageNumber"] = linkPdfPageButton.pageNumber
        saveObject["flashCard"] = annotation.flashCard
        saveObject["levelOfDifficulty"] = annotation.levelOfDifficulty
        console.log(saveObject["pageNumber"]);
        return saveObject
    }// save function

    annotation.load = function(data){
        // to create the id
        if (data["annotationID"]){
            annotation.annotationID = data["annotationID"]
            annotationID -= 1
            annotationLabel.innerHTML = annotationID
            let annotationIDSpan = document.createElement("span")
            annotationIDSpan.classList.add("annotationIDSpan", "_"+annotation.annotationID)
            annotationIDSpan.innerHTML = annotation.annotationID
            annotation.append(annotationIDSpan)
        }

        if (data["flashCard"]){
            annotation.flashCard = data["flashCard"]
            console.log(data["flashCard"]);
            if (data["flashCard"]==true){
                addToFlashCardButton.style.background = "yellow"
            }

        }

        // insert annotationTitle to the annotation
        if (data["annotationTitle"]){
            let annotationTitle = createAnnotationTitle()
            annotationTitle.innerHTML = data["annotationTitle"]
            annotationContent.parentNode.insertBefore(annotationTitle, annotationContent)
        }

        if (data["pageNumber"]){
            linkPdfPageButton.pageNumber = data["pageNumber"]
            linkPdfPageButton.innerHTML = "unlink"
            let pageNumber = document.querySelector("#pdf-page")


            let bookmark = createButton("goToPageButton", function(){
                let keyboardEvent = new Event("keydown")
                keyboardEvent.keyCode = 13
                pageNumber.value = bookmark.innerHTML.split(". ")[1]
                pageNumber.dispatchEvent(keyboardEvent)
            })
            bookmark.innerHTML = "go to P. "+ data["pageNumber"]
            bookmark.style.background = "gold"
            annotationControlPanel.append(bookmark)
        }


        if (data["levelOfDifficulty"]){
            annotation.levelOfDifficulty = data["levelOfDifficulty"]
            annotation.setAttribute("data-level", data["levelOfDifficulty"])
        }


        if (annotationType=="textAnnotation"){

            let latexMotherCell = annotation.querySelector(".latexMotherCell")

            let questionButton = annotation.querySelector(".questionButton")

            questionButton.innerHTML = data["questionStatus"]
            if (data["questionStatus"]=="solved"){
                annotationContent.style.border = "yellow 14px dashed"

            }

            latexMotherCell.innerHTML = data["latexMotherCell"]||data["innerHTML"]||"_"
            latexMotherCell.style.display = "none";
        } else if (annotationType=="imageAnnotation"){
            let image = annotationContent.querySelector("img")
            let fileNameInput = annotationContent.querySelector(".fileNameInput")


            let imageTextGroup = data["imageText"]
            if (typeof imageTextGroup == "string"){
                let imageText = createImageText(imageTextGroup)
                annotationContent.append(imageText)
            } else {
                if (imageTextGroup){
                    imageTextGroup.forEach(txt=>{
                        let imageText = createImageText(txt)
                        annotationContent.append(imageText)
                    })
                }

            }

            image = annotationContent.querySelector("img")
            image.src = data.src
            fileNameInput.value = data.fileName
            // annotationContent.append(image)

            // image.src = data.src
        }

    }

    return annotation
}



function createImageText(loadData=false){
    let imageText = document.createElement("div")
    imageText.contentEditable = true
    imageText.classList.add("imageText")
    imageText.style.background = "MistyRose"
    imageText.innerHTML = loadData||"imageText"
    return imageText
}

// let firstCell = createNewCell()
// document.querySelector(".noteContainer").append(firstCell)



function imageAnnotationContent(annotationContent, loadData={}){
    let image = new Image()
    image.src = ""
    let fileNameInput = document.createElement("input")
    fileNameInput.classList.add("fileNameInput")
    annotationContent.append(image, fileNameInput)

    let imageTextButton = createButton("imageTextButton", function(){
        let imageText = document.createElement("div")
        imageText.contentEditable = true
        imageText.classList.add("imageText")
        imageText.style.background = "MistyRose"
        imageText.innerHTML = "imageText"
        annotationContent.append(imageText)
    })
    imageTextButton.innerHTML = "add text"

    return [imageTextButton]
}

function textAnnotationContent(annotationContent, loadData={}){
    let latexMotherCell = document.createElement("div")
    latexMotherCell.classList.add("latexMotherCell")
    latexMotherCell.contentEditable = true;
    latexMotherCell.style.minHeight = "40px"
    latexMotherCell.style.fontSize = "20px"
    latexMotherCell.style.border = "2px green solid"
    latexMotherCell.innerHTML =  loadData["latexMotherCell"] || ""

    let latexChildCell = document.createElement("div")
    latexChildCell.classList.add("latexChildCell")
    latexChildCell.contentEditable = false;
    latexChildCell.innerHTML =  loadData["latexMotherCell"] || ""




    latexMotherCell.addEventListener("focus", function(){
        let allLatexMotherCell= document.querySelectorAll("latexMotherCell")
        allLatexMotherCell.forEach(p=>p.classList.remove("selected"))
        event.target.classList.add("selected")
        changeMode("Edit")
    })

    latexMotherCell.addEventListener("DOMSubtreeModified", function(){
        let motherInnerText = latexMotherCell.innerHTML
        renderLatex(latexMotherCell, latexChildCell)
        latexMotherCell.classList.remove("selected")

        // latexMotherCell.style.display = "none"

        changeMode("Command")

    })
    setTimeout(function(){
        renderLatex(latexMotherCell, latexChildCell)
    }, 2000)
    // renderLatex(latexMotherCell, latexChildCell)

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

    latexChildCell.addEventListener("click", function(){
        let latexMotherCell = event.target.previousSibling
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


    annotationContent.append(latexMotherCell, latexChildCell, compileButton)

    return annotationContent
}


function renderLatex(latexMotherCell, latexChildCell){

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
