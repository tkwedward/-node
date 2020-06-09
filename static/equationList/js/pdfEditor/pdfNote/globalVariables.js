let id = 0
let mode = "Command"
let noteContainer = document.querySelector(".noteContainer")
// the annotation ID and cellID is initialized in the fromLoadCreatePage function in newSaveAndLoad
let annotationID =1;
let cellID = 1;
let annotationLabel  = document.querySelector(".annotationID")
let cellLabel  = document.querySelector(".cellID")


let createNewNoteButton = document.querySelector(".newPageButton")

createNewNoteButton.addEventListener("click", function(){
    let basePath = "http://127.0.0.1:8000/equation/pdfNote/"
    window.location.href = basePath + "Title/Chapter"
}, false)

// To upload pdf Image
// let uploadImageButton = document.querySelector(".navUploadImageButton")
// uploadImageButton.addEventListener("input", function(){
//     let pdfContainer = document.querySelector(".pdfContainer")
//     let fr = new FileReader()
//     fr.onload = function(){
//         let image = pdfContainer.querySelector("img")
//         if (!image){
//             image = new Image()
//             pdfContainer.append(image)
//         }
//
//         image.src = fr.result
//         image.classList.add("pdfImage")
//         image.style.maxWidth="100%"
//         image.style.transform="rotate(0deg)"
//
//     }
//     fr.readAsDataURL(event.target.files[0]);
// })//uploadImageButton.addEventListener


let pdfImageSubmit = document.querySelector(".pdfImageSubmit")
pdfImageSubmit.addEventListener("click", function(){
    let title = document.querySelector(".noteTitle").innerHTML
    let chapter = document.querySelector(".noteChapter").innerHTML
    let folder = "cameraImage"

    let pageNumber = document.querySelector(".pdfImageFileNameNumber")
    let fileName = document.querySelector(".pdfImageFileName").value + "_" + pageNumber.value
    pageNumber.value = parseInt(pageNumber.value)+1

    let image = document.querySelector(".pdfContainer img")

    let jsonData =  {"data": image.src, "fileName": fileName, "title": title, "chapter": chapter, "folderName": folder}

    let result = ajaxSendJson(url, jsonData, "save image", "success save image",  async function(result){
        let imagePath = JSON.parse(result)["src"]
        image.src = await imagePath
    })
})

let rotateButton = document.querySelector(".rotateImage")
rotateButton.addEventListener("click", function(){
    let pdfImageContainer = document.querySelector(".pdfImageContainer")
    let pdfImage = document.querySelector(".pdfImage")
    let rotateAngle = pdfImage.style.transform.split("(")[1].split("deg")[0]
    let newAngle = (parseInt(rotateAngle) + 90)%360
    pdfImage.style.transform = "rotate(" + newAngle + "deg)";
    // pdfImage.style.position = "absolute"
    // pdfImage.style.top = 0
    // transform: rotate(90deg);
    // width: 100vh;
})

let changeFrameButton = document.querySelector(".changeFrameButton")
changeFrameButton.currentFrame = "canvasContainer"
changeFrameButton.addEventListener("click", function(){
    console.log("frame change");
    let copyNoteContainer = document.querySelector(".copyNoteContainer")
    copyNoteContainer.style.display = "none"
    let pdfContent = document.querySelector(".pdfContent")
    let pdfIframe = document.querySelector("#pdfIframe")
    let canvasContainer = document.querySelector(".canvasContainer")
    let sectionColumn = document.querySelector(".noteCardContainer")
    let flashCardContainer = document.querySelector(".flashCardContainer")
    let summaryContainer = document.querySelector(".summaryContainer")

    if (changeFrameButton.currentFrame == "canvasContainer"){
        pdfIframe.style.display = "block"
        canvasContainer.style.display = "block"
        sectionColumn.style.display = "none"
        flashCardContainer.style.display = "none"
    } else {
        pdfIframe.style.display = "none"
        canvasContainer.style.display = "none"
        sectionColumn.style.display = "block"
    }
    changeFrameButton.currentFrame = changeFrameButton.currentFrame == "canvasContainer"? "section": "canvasContainer"
})



function setSectionColor(){
    let allCells = document.querySelectorAll(".cell")
    let sectionTitleCurrent;
    let color = ["red", "orange", "yellow", "DarkSeaGreen", "blue", "purple", ""]
    let titleArray = []

    allCells.forEach(cell=>{
        sectionTitleCurrent = cell.querySelector("h2")
        if (cell.sectionTitle=="true"){
            titleArray.push({sectionTitle: sectionTitleCurrent, subTitle:[]})
        } else {
            if (titleArray.length!=0){
                let sectionTitleInfo = titleArray[titleArray.length-1]["subTitle"]
                sectionTitleInfo.push(cell.querySelector("h2"))
            }
        }


        cell.style.borderLeft = `15px solid ${color[(titleArray.length-1)%6]||"white"}`

    })

    let sectionColumn = document.querySelector(".sectionColumn")
    sectionColumn.innerHTML=""
    titleArray.forEach(p=>{
        let sectionLabel = document.createElement("div")
        sectionLabel.classList.add("sectionLabel")
        let sectionLink = document.createElement("a")

        sectionLink.innerHTML = p["sectionTitle"].innerText
        sectionLink.targetCellTop = p["sectionTitle"]
        scrollTo(sectionLink)
        sectionLabel.append(sectionLink)
        // sectionLink.subTitle = p["subTitle"]

        p["subTitle"].forEach(p=>{
            let subTitleLink = document.createElement("a")
            subTitleLink.classList.add("subTitleLabel")
            console.log(p);
            subTitleLink.innerHTML = "- " + p.innerText
            ;
            subTitleLink.targetCellTop = p
            scrollTo(subTitleLink)
            sectionLabel.append(subTitleLink)
        })
        sectionColumn.append(sectionLabel)



    })

}




function scrollTo(ele){
    ele.addEventListener("click", function(){
        let noteContainer = document.querySelector(".noteContainer")
        // noteContainer.scroll(0, ele.targetCellTop)
        event.target.targetCellTop.scrollIntoView()
        noteContainer.scrollBy(0, -50)

    })
}

annotation = document.querySelectorAll(".annotation")

annotation.forEach(a=>{
    let clickEvent = function(){
        let selected
        event.target.style.border = "2px solid gold"
    }

    a.addEventListener("click", clickEvent, false)
})


annotation.forEach(a=>{
    a.removeEventListener("click", clickEvent)
})
