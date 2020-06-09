let bookMenuSelect = document.querySelector(".bookMenuSelect")
let addBookSubmit = document.querySelector(".addBookSubmit")

bookMenuSelect.create = function(bookName, bookLink){
    let newBook = document.createElement("li")
    newBook.bookLink = bookLink
    newBook.innerHTML = bookName
    console.log(bookLink);
    newBook.addEventListener("click", function(){
        openBook(bookLink)
    })

    bookMenuSelect.append(newBook)


}


addBookSubmit.addEventListener("click", function(){
    let addBookInput = document.querySelector(".addBookInput")
    bookLink = addBookInput.value
    bookName = addBookInput.value.split("/").pop()
    bookMenuSelect.create(bookName, bookLink)
})


bookMenuSelect.save = function(){
    let allBooks = bookMenuSelect.querySelectorAll("li")
    let bookList = []
    allBooks.forEach(p=>{
        let bookData = {
            "bookName": p.innerHTML,
            "bookLink": p.bookLink
        }
        bookList.push(bookData)
    })
    return bookList
}

bookMenuSelect.load = function(data){
    if (data){
        if (data.length){
            console.log(data.length);
            data.forEach(p=>bookMenuSelect.create(p.bookName, p.bookLink))
            console.log(data[0].bookLink);
            openBook(data[0].bookLink)
        }
    }

}

let __PDF_DOC
let __PAGE_RENDERING_IN_PROGRESS = 0

let __CURRENT_PAGE = 1
let __TOTAL_PAGES;
let __SCALE_FACTOR = 1.9

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
let direction
// create annotaiton block
// ****
// ***


function keepNumberOfCanvasToFive(direction){

    let allCanvasDIV = document.querySelectorAll(".canvasDIV")
    let canvasNumber = allCanvasDIV.length
    console.log("Number of Canvas is ", allCanvasDIV.length);
    if (canvasNumber>5){
        if (direction=="up"){
            allCanvasDIV[canvasNumber-1].remove()
            allCanvasDIV[canvasNumber-2].remove()
        } else {
            allCanvasDIV[0].remove()
            allCanvasDIV[1].remove()
        }

    }
}


function showPage(pageNumber, scaleFactor=__SCALE_FACTOR, direction="down"){
    pageNumber = parseInt(pageNumber)
    __PDF_DOC.getPage(pageNumber).then(function(page) {
        let viewport = page.getViewport(scaleFactor);

        let canvasDIV = document.createElement("div")
        canvasDIV.classList.add("canvasDIV")
        canvasDIV.style.position = "relative"


        let canvas = document.createElement("canvas")
        canvas.pageNumber = pageNumber
        let canvasBottomLine = document.createElement("div")
        canvasBottomLine.classList.add("canvasBottomLine")
        canvasBottomLine.style.background = "red"
        canvasBottomLine.style.height = "5px"
        canvasBottomLine.pageNumber = pageNumber+1

        let upPageNumber = document.createElement("div")
        upPageNumber.classList.add("upPageNumber")
        upPageNumber.innerHTML = pageNumber + " up"
        let downNumber = document.createElement("div")
        downNumber.classList.add("downNumber")
        downNumber.innerHTML = pageNumber + " down"
        // console.log(canvasBottomLine.parentNode);
        console.log(canvasDIV.childNodes);

// append(pageNumber)
        console.log(`The page is ${canvas.pageNumber}`);
        let canvasCtx = canvas.getContext("2d")
        let textLayer = document.createElement("div")


        canvasDIV.append(canvas, textLayer, canvasBottomLine)


        if (direction=="up"){
            canvasContainer.insertBefore(canvasDIV, head)
            canvasContainer.insertBefore(head, canvasDIV)
        } else {
            canvasContainer.insertBefore(canvasDIV, tail)
        }


        textLayer.classList.add("textLayer")
        textLayer.pageNumber = pageNumber
        canvas.style.width = viewport.width+"px"
        canvas.style.minHeight = viewport.height+"px"
        textLayer.style.width = viewport.width+"px"
        textLayer.style.minHeight = viewport.height+"px"
        // textLayer.style.background = "rgba(10, 10, 10, 0.5)"
        textLayer.style.position = "absolute"
        // textLayer.offsetTop = canvas.offsetTop
        textLayer.style.left = 0
        textLayer.style.top = 0


        canvas.width = viewport.width
        canvas.height = viewport.height


        // pageNumberObserver
        let pageNumberObserver = new IntersectionObserver(function(entries){;
            // let newCanvasContainer = createNewPage("up")
            keepNumberOfCanvasToFive()
            if (entries[0].isIntersecting) {
                pdfPageInputBox.value = entries[0].target.pageNumber
                truePdfNumber.value = entries[0].target.pageNumber -18

                let allCanvasBottomLine = document.querySelectorAll(".canvasBottomLine")
                allCanvasBottomLine.forEach(p=>{
                    p.style.display="block"
                })
                entries[0].target.style.display="none"
             }
        }, {threshold:0.5});
        pageNumberObserver.observe(canvasBottomLine)

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


        .then(function(){
                // annotatoin blokc
        })// then annotation block
    });// pdf_doc.getPage
    // tryLine = document.querySelectorAll(".tryLine")[0]
}


// var pdfPath = "/static/equationList/books/Phy_115B/Townsend.pdf"
// to get the pdf file and show the current Page
// initialize
function openBook(pdfPath){

    PDFJS.getDocument({ url: pdfPath })
         .then(function(pdfObject) {
             __PDF_DOC = pdfObject
             __TOTAL_PAGES = pdfObject.numPages
             __CURRENT_PAGE = 1
             console.log(__TOTAL_PAGES);
             totalPage.innerHTML = pdfObject.numPages
             showPage(__CURRENT_PAGE)
             truePdfNumber.value = __CURRENT_PAGE-20
         })
         .then(function(){
             let option = {
                 // threshold: [0.25, 0.5, 0.75, 1],
                 rootMargin: "800px 0px"
             }
           let ioUp = new IntersectionObserver(function(entries){;
               // let newCanvasContainer = createNewPage("up")

               console.log("new Up");
               direction = "up"
               // showPage(parseInt(pdfPageInputBox.value))
               // keepNumberOfCanvasToFive("up")
               // head.style.display = "none"
           }, option);

           let ioDown = new IntersectionObserver(function(entries){
               // let newCanvasContainer = createNewPage("down")
               direction = "down"
               let allDownPageNumber = document.querySelectorAll(".upPageNumber")


               console.log("new Down");
               // let pageNumber = document.querySelector()
               __CURRENT_PAGE+=1
               showPage(__CURRENT_PAGE)
               allDownPageNumber = document.querySelectorAll(".upPageNumber")

               keepNumberOfCanvasToFive("down")

           }, option);

           // ioUp.observe(head);
           ioDown.observe(tail);
         })
}



// change scale
scale.addEventListener("keydown", function(){
    console.log("scale");
    if (event.keyCode==13){
        let allCanvas = Array.from(document.querySelectorAll("canvas"))
        console.log(allCanvas);
        let allPages = allCanvas.map(p=>p.pageNumber)
        allCanvas.forEach(p=>p.remove())
        __SCALE_FACTOR = parseFloat(scale.value)
        allPages.forEach(page=>showPage(page, __SCALE_FACTOR))
        console.log(allPages);

    }
})
// lock

// go to page by pageInputBox
pdfPageInputBox.addEventListener("keydown", function(){
    if (event.keyCode==13){
        console.log(1231431412);
        pdfContainer.scrollTo(0,0)
        let allCanvas = document.querySelectorAll(".canvasDIV")
        allCanvas.forEach(canvas=>canvas.remove())

        pdfPageInputBox.value = parseInt(event.target.value)
        __CURRENT_PAGE = parseInt(event.target.value)
        truePdfNumber.value = parseInt(pdfPageInputBox.value) -20
        showPage(__CURRENT_PAGE)

    }
})
