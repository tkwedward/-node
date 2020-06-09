/*
1. resize the width of pdf and note

2. add pdf to the select menu
pdfFileNameSubmit

3. pdfSelect
- change the src of iframe to import pdf

4. search function
*/


let resizeWidthInput = document.querySelector(".resizeWidth")
resizeWidthInput.addEventListener("click", function(){
    console.log("blur");
    let value = 40
    let noteContainer = document.querySelector(".noteContainer")
    let iframe = document.querySelector("iframe")

    noteContainer.style.width = value + "vw"
    iframe.style.left = value + "vw"
    iframe.style.width = 100-parseInt(value) + "vw"
})

let pdfFileNameSubmit = document.querySelector(".pdfFileNameSubmit")

pdfFileNameSubmit.addEventListener("click", function(){
    let pdfFileNameSubmit = document.querySelector(".pdfFileNameInput")
    let pdfSelect = document.querySelector(".pdfSelect")
    let pdfSelectOption = document.createElement("option")
    pdfSelectOption.value = staticPath + "/" + docTitle + "/" + pdfFileNameSubmit.value
    pdfSelectOption.innerHTML = pdfFileNameSubmit.value

    pdfSelect.append(pdfSelectOption)
})



let showQuestionButton =  document.querySelector(".showQuestionButton")
showQuestionButton.addEventListener("click", function(){

    if (event.target.innerHTML=="show Questions"){
        console.log(event.target);
        let allCells = document.querySelectorAll(".cell")
        allCells.forEach(p=>{
            p.style.display = "none"
        })

        allCells.forEach(p=>{
            let allAnnotation =  p.querySelectorAll(".annotation")
            allAnnotation.forEach(q=>{
                let questionButton = q.querySelector(".questionButton")
                if (questionButton){
                    console.log(questionButton);
                    if  (questionButton.innerHTML!="solved"){
                        q.style.display = "none"
                    }
                    else{
                        p.style.display = "block"
                    }
                } else{
                    q.style.display = "none"
                }
            })


        })
    }// want to show Questions
    else
    {
        let allCells = document.querySelectorAll(".cell")
        allCells.forEach(p=>{
            p.style.display = "block"
            let allAnnotation =  p.querySelectorAll(".annotation")
            allAnnotation.forEach(q=>{
                q.style.display =  "block"
            })
        })
    }
    event.target.innerHTML = event.target.innerHTML=="show Questions"?"restore":"show Questions"
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
