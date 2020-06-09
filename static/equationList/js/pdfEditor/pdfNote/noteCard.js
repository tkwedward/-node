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
    copyNoteContainer.style.display = "none"
    noteCardContainer.style.display = "none"
    pdfIframe.style.display = "none"
    flashCardContainer.style.display = "block"
    flashCardArea.style.display = "block"

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
