let flashCardOpenButton = document.querySelector(".flashCardOpen")
let flashCardContainer = document.querySelector(".flashCardContainer")
let flashCardArea = document.querySelector(".flashCardArea")
let copyNoteContainer = document.querySelector(".copyNoteContainer")
let noteCardContainer = document.querySelector(".noteCardContainer")
let pdfIframe = document.querySelector("#pdfIframe")

// globalVariables
let allFlashCard = []
let currentFlashCard = 0

flashCardOpenButton.addEventListener("click", function(){
    pdfContainerDirectChildTakeToTop(flashCardContainer)

    let allFlashCardAnnotation = Array.from(document.querySelectorAll(".annotation"))
    .filter(p=>p.flashCard==true)
    // allFlashCard.forEach(p=>{
    //     console.log(p.flashCard==true);
    // })

    allFlashCard = allFlashCardAnnotation.map(p=>{
        let newCell = createNewCell(false)
        newCell.querySelector(".cellControlPanel").remove()
        // console.log(p);
        let newAnnotation = p.cloneNode()
        newAnnotation.innerHTML = p.innerHTML
        // let annotationContent = p.innerHTML
        newCell.append(newAnnotation)
        // flashCardAnnotation.append(newCell)
        return newCell

    })




    flashCardArea.append(allFlashCard[currentFlashCard])
    console.log(allFlashCard);
})
// currentFlashCard
let flashCardControlPannel = document.querySelector(".flashCardControlPannel")
let previousFlashCard = document.querySelector(".previousFlashCard")
let nextFlashCard = document.querySelector(".nextFlashCard")
let goToAnswer = document.querySelector(".goToAnswer")
let progessFlashCard = document.querySelector(".progessFlashCard")

function showFlashCard(index){
    flashCardArea.innerHTML = ""
    flashCardArea.append(allFlashCard[index])
    progessFlashCard.innerHTML = +index+1+"/"+allFlashCard.length
}


previousFlashCard.addEventListener("click", function(){
    if (currentFlashCard >= 1){
        currentFlashCard -= 1
        showFlashCard(currentFlashCard)
    }
})

nextFlashCard.addEventListener("click", function(){
    if (currentFlashCard < allFlashCard.length-1){
        currentFlashCard += 1
        showFlashCard(currentFlashCard)
    }
})

goToAnswer.addEventListener("click", function(){
    let _card = flashCardArea.querySelector(".annotation")
    let annotationID = _card.querySelector(".annotationIDSpan").innerText
    console.log(annotationID);
    noteContainer.querySelector("._"+annotationID).parentNode.scrollIntoView()
    noteContainer.scrollBy(0, -50)
    // let targetAnnotation = noteContainer.querySelector(".annotation_"+annotationID)
    // console.log(targetAnnotation);
})


let summaryContainer = document.querySelector(".summaryContainer")
summaryContainer.save = function(){
    let allSummaryCellContainers = summaryContainer.querySelectorAll(".summaryCellContainer")
    let saveObjectArray = []

    allSummaryCellContainers.forEach(p=>{
        let saveObject = {
            "title": p.querySelector(".summaryCellTitle").innerText,
            "latexMotherCellHTML": p.querySelector(".latexMotherCell").innerHTML
        }
        // console.log(saveObject);
        saveObjectArray.push(saveObject)
    })
    return saveObjectArray
}

summaryContainer.load = function(data){
    // console.log(data);
    if(data){
        data.forEach(p=>{
            let summaryCellContainer = createSummaryContainer()
            let summaryCellTitle = summaryCellContainer.querySelector(".summaryCellTitle")
            let latexMotherCell = summaryCellContainer.querySelector(".latexMotherCell")

            summaryCellTitle.innerText = p["title"]
            latexMotherCell.innerHTML = p["latexMotherCellHTML"]
            summaryContainer.append(summaryCellContainer)
        })
    } else {
        let summaryCellContainer = createSummaryContainer()
        summaryContainer.append(summaryCellContainer)
    }
}// summaryContainer.load


function createSummaryContainer(){
    let summaryCellContainer = document.createElement("div")
    summaryCellContainer.style.width = "90%"
    summaryCellContainer.style.minHeight = "30%"
    summaryCellContainer.style.marginLeft = "auto"
    summaryCellContainer.style.marginRight = "auto"
    summaryCellContainer.classList.add("summaryCellContainer")
    // margin-left: auto;
    // margin-right: auto;
    // summaryCellContainer.style.minHeight = "20%"

    // title
    let summaryCellTitle = document.createElement("h1")
    summaryCellTitle.classList.add("summaryCellTitle")
    summaryCellTitle.contentEditable = "true"
    summaryCellTitle.innerHTML = "title"

    // cellbody
    let summaryCell = document.createElement("div")
    summaryCell.classList.add("summaryCell")
    summaryCell.style.minHeight = "150px"
    summaryCell.style.background = "wheat"

    let latexCellComponents = createLatexCell()
    let latexMotherCell = latexCellComponents[0]
    let latexChildCell = latexCellComponents[1]
    let compileButton = latexCellComponents[2]
    summaryCell.append(latexMotherCell, latexChildCell, compileButton)

    // controller
    let summaryCellController = document.createElement("div")
    summaryCellController.classList.add("summaryCellController")

    let addNewSummaryCellButton = document.createElement("button")
    addNewSummaryCellButton.innerHTML = "addNewSummaryCell"
    addNewSummaryCellButton.addEventListener("click", function (){
        let newSummaryCellContainer = createSummaryContainer()
        summaryContainer.insertBefore(newSummaryCellContainer, summaryCellContainer)
        summaryContainer.insertBefore(summaryCellContainer, newSummaryCellContainer)

    })

    let deleteSummaryCellButton = document.createElement("button")
    deleteSummaryCellButton.innerHTML = "delete"
    deleteSummaryCellButton.addEventListener("click", function (){
        summaryCellContainer.remove()
    })

    summaryCellController.append(addNewSummaryCellButton, deleteSummaryCellButton)

    summaryCellContainer.append(summaryCellTitle, summaryCell, summaryCellController)

    return summaryCellContainer
}
