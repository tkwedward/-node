let __PDF_DOC
let __PAGE_RENDERING_IN_PROGRESS = 0

let __CURRENT_PAGE = 1
let __TOTAL_PAGES;
let __SCALE_FACTOR = 1.55

// control box
let totalPage = document.querySelector("#totalPage")
let truePdfNumber = document.querySelector(".truePdfNumber")
let pdfPageInputBox = document.querySelector("#pdf-page")
let scale = document.querySelector(".scaleInput")
let lock = document.querySelector(".lock")
pdfPageInputBox.value = 1
let canvasContainer = document.querySelector(".canvasContainer")
let head = document.querySelector(".head")
let tail = document.querySelector(".tail")


// create New Annotaiton Block
// function newBlockCreate(data){
//     let newBlock = document.createElement("span")
//
//     // control panel
//     let newBlockControlPanel = document.createElement("div")
//     newBlockControlPanel.classList.add("annotationBlockControlPanel")
//
//     // deleteButton
//     let deleteButton = createButton("annotationBlockDeleteButton", function(){
//         newBlock.remove()
//     })
//     deleteButton.innerHTML = "delete"
//
//     // annotationBlockLinkButton
//     let annotationBlockLinkButton = createButton("annotationBlockLinkButton", function(){
//         console.log("link annotation");
//
//         let selectedAnnotation = document.querySelector(".annotation .selected").parentNode
//
//         let annotationTitle = createAnnotationTitle()
//         console.log(selectedAnnotation.parentNode);
//         selectedAnnotation.parentNode.insertBefore(annotationTitle, selectedAnnotation)
//
//
//         console.log(selectedAnnotation.annotationID);
//     })
//     annotationBlockLinkButton.innerHTML = "link"
//
//     // annotationBlockCancelButton
//     let annotationBlockCancelButton = createButton("annotationBlockCancelButton", function(){
//         let allAnnotationBlocks = document.querySelectorAll(".annotationBlock")
//         allAnnotationBlocks.forEach(block=>{
//             block.querySelector(".annotationBlockControlPanel").style.display = "none"
//         })
//     })
//     annotationBlockCancelButton.innerHTML = "cancel"
//
//     newBlockControlPanel.append(deleteButton, annotationBlockLinkButton, annotationBlockCancelButton)
//
//     // newBlockControlPanel position control
//     newBlockControlPanel.style.position = "relative"
//     newBlockControlPanel.style.top = "-15px"
//     newBlockControlPanel.style.display = "none"
//
//
//
//     newBlock.append(newBlockControlPanel)
//     newBlock.classList.add("annotationBlock")
//     newBlock.style.position = "absolute"
//     newBlock.addEventListener("mousedown", function(){
//         newBlock.mousedownTime1 = new Date()
//
//     })
//     newBlock.addEventListener("mouseup", function(){
//         let timeDifference = (new Date() - newBlock.mousedownTime1)/1000
//         console.log(timeDifference);
//         if (timeDifference > 0.5){
//             let allAnnotationBlocks = document.querySelectorAll(".annotationBlock")
//             allAnnotationBlocks.forEach(block=>{
//                 block.querySelector(".annotationBlockControlPanel").style.display = "block"
//             })
//
//         }
//     })
//
//     if (data){
//         newBlock.style.width = data["width"]
//         newBlock.style.height = data["height"]
//         newBlock.style.left = data["left"]
//         newBlock.style.top = data["top"]
//         newBlock.append(data["annotationBlockID"])
//         newBlock.style.background = "rgba(255, 240, 150, 0.4)"
//         newBlock.dimensionOutput = data
//     }
//     return newBlock
// }

function showPage(pageNumber, direction="down"){
    __PDF_DOC.getPage(pageNumber).then(function(page) {
        let viewport = page.getViewport(__SCALE_FACTOR);

        let canvasDIV = document.createElement("div")
        canvasDIV.classList.add("canvasDIV")
        canvasDIV.style.position = "relative"


        let canvas = document.createElement("canvas")
        canvas.pageNumber = pageNumber
        console.log(`The page is ${canvas.page}`);
        let canvasCtx = canvas.getContext("2d")
        let textLayer = document.createElement("div")
        canvasDIV.append(canvas, textLayer)
        canvasContainer.insertBefore(canvasDIV, tail)

        textLayer.classList.add("textLayer")
        textLayer.pageNumber = pageNumber
        textLayer.style.width = viewport.width+"px"
        textLayer.style.minHeight = viewport.height+"px"
        // textLayer.style.background = "rgba(10, 10, 10, 0.5)"
        textLayer.style.position = "absolute"
        // textLayer.offsetTop = canvas.offsetTop
        textLayer.style.left = 0
        textLayer.style.top = 0


        canvas.width = viewport.width
        canvas.height = viewport.height

        // page is rendered on a <canvas> element
        var renderContext = {
           canvasContext: canvasCtx,
           viewport: viewport
        };

        page.render(renderContext).then(function() {
           return page.getTextContent();
        }).then(function(textContent) {
            PDFJS.renderTextLayer({
                textContent: textContent,
                container: textLayer,
                viewport: viewport,
                textDivs: []
            });
        })// then render text


        // .then(function(){
        //     // draw Rectangle
        //     let startPosition;
        //     let dragging = false
        //     let endPosition;
        //     let newBlock;
        //     let movePosition;
        //     let textLayerDivArray = textLayer.querySelectorAll("div")
        //     let textLayerOffSetX;
        //     let textLayerOffSetY;    // to get the position data of the textlayer so that we can get the relative position
        //     let annotationOn = false
        //     function turnOnAndOffAnnotation(){
        //         if (annotationOn){
        //             textLayerDivArray.forEach(div=>{
        //                 div.style.pointerEvents = "none"
        //             })
        //         } else {
        //             textLayerDivArray.forEach(div=>{
        //                 div.style.pointerEvents = "default"
        //             })
        //         }
        //
        //     }// turnOnAndOffAnnotation
        //
        //     textLayer.addEventListener("click", function(){
        //         if (event.target==textLayer && annotationOn){
        //             if (!startPosition){
        //                 console.log("startPosition");
        //                 textLayerPositionData = textLayer.getClientRects()[0]
        //                 textLayerOffSetX = textLayerPositionData["x"]
        //                 textLayerOffSetY = textLayerPositionData["y"]
        //
        //                 startPosition = [event.clientX-textLayerOffSetX, event.clientY- textLayerOffSetY]
        //
        //                 newBlock = newBlockCreate()
        //                 textLayer.append(newBlock)
        //
        //                 dragging = true
        //             } else if (!endPosition){
        //                 newBlock.dimensionOutput["annotationBlockID"] = annotationBlockID
        //                 newBlock.append(annotationBlockID)
        //                 annotationBlockID+=1
        //                 console.log(newBlock.dimensionOutput,
        //                 annotationBlockID);
        //
        //                 dragging = false
        //                 newBlock = 0
        //                 startPosition = 0
        //                 endPosition = 0
        //                 movePosition = 0
        //
        //
        //                 testTextLayer = textLayer
        //                 testAnnotation = newBlock
        //
        //             }
        //         }// event.target==textlayer
        //
        //     })
        //
        //     textLayer.addEventListener("mousemove", function(){
        //         if (dragging && annotationOn){
        //             console.log(textLayerPositionData["x"]);
        //             movePosition = [event.clientX-textLayerOffSetX, event.clientY- textLayerOffSetY]
        //             let width = movePosition[0] - startPosition[0]
        //             let height = movePosition[1] - startPosition[1]
        //
        //             if (width<0&&height<0){
        //                 newBlock.style.left = movePosition[0]+ "px"
        //                 newBlock.style.top = movePosition[1]+ "px"
        //             }
        //             else if (width<0&&height>0){
        //                 newBlock.style.left = movePosition[0]+ "px"
        //                 newBlock.style.top = startPosition[1]+ "px"
        //             }
        //             else if (width>0&&height<0){
        //                 newBlock.style.left = startPosition[0]+ "px"
        //                 newBlock.style.top = movePosition[1]+ "px"
        //             }
        //             else if (width>0&&height>0){
        //                 newBlock.style.left = startPosition[0]+ "px"
        //                 newBlock.style.top = startPosition[1]+ "px"
        //             }
        //
        //             newBlock.style.width = Math.abs(width) + "px"
        //             newBlock.style.height = Math.abs(height) + "px"
        //             newBlock.style.background = "rgba(255, 240, 150, 0.4)"
        //
        //             newBlock.dimensionOutput = {
        //                 "width": newBlock.style.width,
        //                 "height": newBlock.style.height,
        //                 "left": newBlock.style.left,
        //                 "top": newBlock.style.top,
        //                 "page": pageNumber,
        //             }
        //         }// if dragging
        //     })// add  mousemove event
        // })// then
        // .then(function(){// to append anntatoin block to the page
        //     annotationBlock.forEach((blockData, i)=>{
        //         if (blockData){
        //             if (blockData.page == pageNumber){
        //                 console.log(annotationBlock);
        //                 console.log(blockData.page, pageNumber);
        //                 let newBlock = newBlockCreate(blockData)
        //                 console.log(newBlock);
        //                 textLayer.append(newBlock)
        //
        //                 delete annotationBlock[i]
        //                 console.log(annotationBlock);
        //             }
        //         }
        //     })
        //
        // })// then annotation block
    });// pdf_doc.getPage
    // tryLine = document.querySelectorAll(".tryLine")[0]
}



// to get the pdf file and show the current Page
// initialize
PDFJS.getDocument({ url: pdfPath })
     .then(function(pdfObject) {
         __PDF_DOC = pdfObject
         __TOTAL_PAGES = pdfObject.numPages
         __CURRENT_PAGE = 1
         console.log(__TOTAL_PAGES);
         totalPage.innerHTML = pdfObject.numPages
         showPage(__CURRENT_PAGE)
         showPage(__CURRENT_PAGE+1)
         showPage(__CURRENT_PAGE+2)
         truePdfNumber.value = __CURRENT_PAGE-20
     }
);

// change scale
scale.addEventListener("keydown", function(){
    if (event.keyCode==13){
        __SCALE_FACTOR = scale.value
        let allCanvas = Array.from(document.querySelectorAll("canvas"))

        let allPages = allCanvas.map(p=>p.pageNumber)
        allCanvas.forEach(p=>p.remove())
        allPages.forEach(page=>showPage(page))
        console.log(allPages);
    }
})
// lock

// go to page by pageInputBox
pdfPageInputBox.addEventListener("keydown", function(){
    if (event.keyCode==13){
        canvasContainer.scrollTo(0,0)
        let allCanvas = document.querySelectorAll("canvas")
        allCanvas.forEach(canvas=>canvas.remove())
        pdfPageInputBox.value = event.target.value
        truePdfNumber.value = parseInt(pdfPageInputBox.value) -20
        showPage(parseInt(event.target.value))
    }
})
