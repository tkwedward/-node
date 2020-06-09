/*
1. resize the width of pdf and note

2. add pdf to the select menu
pdfFileNameSubmit

3. pdfSelect
- change the src of iframe to import pdf

4. search function
*/
let sizeSwitch = document.querySelector(".sizeSwitch")
sizeSwitch.size = "half"
sizeSwitch.addEventListener("click", function(){
    let pageWrapper = document.querySelector("#pageWrapper")
    if (sizeSwitch.size=="half"){
        sizeSwitch.size = "full"
        pageWrapper.style.gridTemplateColumns = "1fr"
        pdfContainer.style.display = "none"
    } else {
        sizeSwitch.size = "half"
        pageWrapper.style.gridTemplateColumns = "1fr 1fr"
        pdfContainer.style.display = "block"
    }

})


let showQuestionButton =  document.querySelector(".showQuestionButton")
showQuestionButton.addEventListener("click", function(){

    let allAnnotation =  document.querySelectorAll(".annotation")
    let questionContainer = document.querySelector(".questionContainer")
    let noteContainer = document.querySelector(".noteContainer")

    let orderedQuestions = []
    let dateSet = new Set()
    questionContainer.innerHTML = ""
    allAnnotation.forEach(q=>{
        let questionButton = q.querySelector(".questionButton")
        if (questionButton){
            if  (questionButton.innerHTML=="solved"){
                if (questionButton.questionCreateDate!=null){
                    let questionDate = new Date(questionButton.questionCreateDate)
                    dateSet.add(questionDate)
                    // convert the datetimeOBject into string with date only
                    questionDate = `${questionDate.getDate()}/${questionDate.getMonth()+1}/${questionDate.getFullYear()}`
                    orderedQuestions.push({"questionDate": questionDate, "object": q})
                }
            }// filter out with date questions
        }// if questionButton exist
    })// forEach annotation

    dateSet = Array.from(dateSet).sort(function(a,b){
        return new Date(b.getTime()) - new Date(a.getTime() );
    });
    console.log(dateSet);
    dateSet.forEach(d=>{
        let date = `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`
        let dateTitle = document.createElement("h2")
        dateTitle.innerHTML = date
        questionContainer.append(dateTitle)
        orderedQuestions.forEach(p=>{
            if (p["questionDate"]==date){
                console.log(p);
                let copyAnnotation = document.createElement("div")
                copyAnnotation.innerHTML = p["object"].innerHTML
                let copyAnnotationController = copyAnnotation.querySelector(".annotationControlPanel")

                let goToButton = document.createElement("button")
                goToButton.innerHTML = "goToQuestion"
                goToButton.addEventListener("click", function(){
                    p["object"].scrollIntoView()
                    noteContainer.scrollBy(0, -50)
                })
                copyAnnotationController.append(goToButton)
                questionContainer.append(copyAnnotation)
            }
        })
    })

    pdfContainerDirectChildTakeToTop(questionContainer)
})


//**************************************************
// search
//**************************************************
let searchInput = document.querySelector(".searchInput")
searchInput.addEventListener("keyup", function(){
    let searchItem = event.target.value.toLowerCase().split(", ")
    let allCells = document.querySelectorAll(".cell")
    let clonedAnnotations = new Set()
    let searchResultArea = document.querySelector(".searchResultArea")

    searchResultArea.innerHTML = ""

    allCells.forEach(cell=>{
        let allAnnotation = cell.querySelectorAll(".annotation")

        allAnnotation.forEach(annotation=>{
            searchItem.forEach(r=>{
                // use image name to search
                let img = annotation.querySelector("img")

                if (img){
                    let imgName = img.src.toLowerCase().split("/")
                    if (imgName[imgName.length-1].search(r)!=-1){
                        clonedAnnotations.add(annotation.annotationID)
                    } // if we cannot find an image
                }// if img exist
                // use file Name to search
                let fileNameInput = annotation.querySelector("input")
                if (fileNameInput){
                    let fileName = fileNameInput.innerHTML
                    if (fileName.search(r)!=-1){
                        clonedAnnotations.add(annotation.annotationID)
                    }
                }

                // use imagetext to search search
                let imageAnnotation = annotation.querySelectorAll(".imageText")
                imageAnnotation.forEach(text=>{
                    if (text){
                        if (text.innerHTML.toLowerCase().search(r)!=-1){
                            clonedAnnotations.add(annotation.annotationID)
                        }
                    }// if text
                })// forEach imageAnnotaiton
            })// forEach searchItem
        }) // forEach annotaiton
    })// forEach cell
    console.log(clonedAnnotations);



    //
    clonedAnnotations.forEach(p=>{
        let targetAnnotation = document.querySelectorAll("._"+ p)

        targetAnnotation.forEach(p=>{
            let newCell = createNewCell(false)
            newCell.querySelector(".cellControlPanel").remove()
            // console.log(p);
            let newAnnotation = p.parentNode.cloneNode()
            newAnnotation.innerHTML = p.parentNode.innerHTML
            // let annotationContent = p.innerHTML
            newCell.append(newAnnotation)
            searchResultArea.append(newCell)
        })


    })

})// search addEventListener


//***************************
// bookmark panel
//***************************
let pdfContainer = document.querySelector(".pdfContainer")
let pdfPage = document.querySelector("#pdf-page")

let bookmarkContainer = document.querySelector(".bookmarkContainer")
let bookmarkPanel = document.querySelector(".bookmarkPanel")
let addBookmarkButton = document.querySelector(".addBookmarkButton")
let bookmarkTitleInput = document.querySelector(".bookmarkTitleInput")


bookmarkContainer.saveBookmark = function(){
    let allBookmark = bookmarkPanel.querySelectorAll(".bookmarkTitle")

    saveData = Array.from(allBookmark).map(p=>{
        return {bookmarkPage: p.pdfPage, bookmarkTitle: p.innerHTML, bookmarkLevel: p.bookmarkLevel}
    })
    console.log(allBookmark);
    return saveData
}

bookmarkContainer.loadBookmark = function(data){
    console.log(data);
    data.forEach(p=>{
        console.log(p);
        bookmarkPanel.append(createBookmark(p))
    })
}

function createBookmark(data){
    let data_bookmarkPage;
    let data_bookmarkTitle;
    let data_bookmarkLevel;
    if (data){
        data_bookmarkPage = data["bookmarkPage"]
        data_bookmarkTitle = data["bookmarkTitle"]
        data_bookmarkLevel = data["bookmarkLevel"]
    }

    let bookmarkTitle = document.createElement("div")
    bookmarkTitle.classList.add("bookmarkTitle")
    bookmarkTitle.innerHTML = data_bookmarkTitle || bookmarkTitleInput.value
    bookmarkTitle.pdfPage = data_bookmarkPage || pdfPage.value
    bookmarkTitle.bookmarkLevel = data_bookmarkLevel || 1
    console.log(bookmarkTitle.innerHTML, bookmarkTitle.pdfPage);
    bookmarkTitle.addEventListener("click", function(){
        allBookmarkTitle = document.querySelectorAll(".bookmarkTitle")
        allBookmarkTitle.forEach(p=>{
            p.style.background = ""
            p.classList.remove("selectedBookmark")
        })
        event.target.style.background = "OrangeRed";
        event.target.classList.add("selectedBookmark")
        let keyboardEvent = new Event("keydown")
        keyboardEvent.keyCode = 13
        pdfPage.value =  bookmarkTitle.pdfPage
        pdfPage.dispatchEvent(keyboardEvent)
        pdfContainer.scrollTo(0, 0)
    })

    return bookmarkTitle
}

bookmarkContainer.createBookmark = createBookmark

addBookmarkButton.addEventListener("click", function(){
    let pdfPage = document.querySelector("#pdf-page")
    let bookmarkTitle = createBookmark()
    bookmarkPanel.append(bookmarkTitle)
})

let pdfBookmarkButton = document.querySelector(".pdfBookmark")
pdfBookmarkButton.addEventListener("click", function(){
    bookmarkContainer.style.display = "block"
})

let bookmarkPanelClose = document.querySelector(".bookmarkPanelClose")
bookmarkPanelClose.addEventListener("click", function(){
    console.log(1234);
    bookmarkContainer.style.display = "none"
})

let bookmark_raiseLevel = document.querySelector(".bookmark_raiseLevel")
let bookmark_lowerLevel = document.querySelector(".bookmark_lowerLevel")
let bookmark_delete = document.querySelector(".bookmark_delete")

bookmark_delete.addEventListener("click", function(){
    console.log(1234);
    let selectedBookmark = document.querySelector(".selectedBookmark")
    console.log(selectedBookmark);
    selectedBookmark.remove()
})



//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////


let currentPosition  = 0
let savePositionButton = document.querySelector(".saveCurrentPosition")
let goToPosition = document.querySelector(".goToPosition")

savePositionButton.addEventListener("click", function(){
    currentPosition = noteContainer.scrollTop
    console.log(currentPosition);
})

goToPosition.addEventListener("click", function(){
    noteContainer.scrollTo(0, currentPosition)
})
