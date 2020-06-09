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

function pdfContainerDirectChildTakeToTop(target){
    let allChildOfPDFContainer = document.querySelectorAll(".pdfContainerDirectChild")
    allChildOfPDFContainer.forEach(p=>p.style.zIndex = 0)
    target.style.zIndex = 1000
}


let changeFrameButton = document.querySelector(".changeFrameButton")
let changeFrameIndex = 0
changeFrameButton.addEventListener("click", function(){
    // console.log("frame change");
    // let pdfContent = document.querySelector(".pdfContent")
    let pdfIframe = document.querySelector("#pdfIframe")
    let sectionColumn = document.querySelector(".noteCardContainer")
    let summaryContainer = document.querySelector(".summaryContainer")

    let loopArray = [pdfIframe, sectionColumn, summaryContainer]
    changeFrameIndex+=1
    let targetFrame = loopArray[changeFrameIndex%loopArray.length]
    pdfContainerDirectChildTakeToTop(targetFrame)
    // if (changeFrameButton.currentFrame == "canvasContainer"){
    //     pdfContainerDirectChildTakeToTop(pdfIframe)
    // } else {
    //     pdfContainerDirectChildTakeToTop(sectionColumn)
    //
    // }
    // changeFrameButton.currentFrame = changeFrameButton.currentFrame == "canvasContainer"? "section": "canvasContainer"
})

function separateByLevel(array){
    let sectionLevelValueMap = array.map(p=>parseInt(p.value))
    let sectionLevelValueCellPairMap = array.map(p=>{
        return {"level": parseInt(p.value), "cell": p}
    });

    // to create a list of minimum level's position
    let minLevel = Math.min(...sectionLevelValueMap);
    let minLevelPositionArray = []
    sectionLevelValueMap.forEach((p, i)=>{
        // console.log(p, i);
        if (p==minLevel)  minLevelPositionArray.push(i)

    })

    function chunkArray(targetArray, chunkPointsArray){
        let resultArray = []
        let currentPosition = 0
        // console.log(chunkPointsArray)
        chunkPointsArray.forEach(p=>{
            let copiedTargetArray = targetArray
            let cutArray = copiedTargetArray.slice(currentPosition, p)
            currentPosition = p
            resultArray.push(cutArray)
        })
        resultArray.push(targetArray.slice(currentPosition, targetArray.length))
        // console.log(sectionLevelValueMap);
        // console.log(resultArray);
        return resultArray

    }

    // let chunkedArray = chunkArray(array, minLevelPositionArray)
    // chunkArray.forEach(p=>{
    //
    // })

}

function layerizeArray(array){
    // array: [0, 0, 0, -2, -1, 0, 0, 0, -1, 0, 0, -2, -1, 0, 0, -2, 0]
    let resultArray = []
    let placeholder = {}
    let currentLevel = -1000
    let arrayLayer = 0

    array.forEach((p, i)=>{
        if (p == currentLevel){
            placeholder[arrayLayer].push(p)
            // console.log(resultArray);
        } else if (p > currentLevel){
            arrayLayer+=1;
            currentLevel = p
            placeholder[arrayLayer] = [p, ]
        } else if (p < currentLevel){
            resultArray.push(placeholder)
            arrayLayer = 1
            currentLevel = p
            placeholder = {}
            placeholder[arrayLayer] = [p, ]
        }
    })
    return resultArray
}
array = [0, 0, 0, -2, -1, 0, 0, 0, -1, 0, 0, -2, -1, 0, 0, -2, 0]
layerizeArray(array)


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
