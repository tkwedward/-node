let saveButton = document.querySelector(".saveButton")
saveButton.addEventListener("click", function(){
    console.log("save success");
    saveNote()
})


function saveNote(){
    let allCells = document.querySelectorAll(".cell")
    let jsonData = {}
    let _usefulCellData = {}
    let title = document.querySelector(".noteTitle").innerHTML

    allCells.forEach(_cell=>{
        let _cellTitle = _cell.querySelector(".cellTitle").innerHTML
        _usefulCellData[_cellTitle] = []
        annotations = _cell.querySelectorAll(".annotation")

        annotations.forEach(_annotation=>{
            let _annotationData = {}

            if (_annotation.classList.contains("imageAnnotation")){
                let imgSrc = _annotation.querySelector("img").src
                _annotationData = {
                    "imgSrc":imgSrc,
                    "imgFileName": _annotation.querySelector(".fileNameInput").value,
                    "imageText": _annotation.querySelector(".imageText").innerHTML
                }

            }// if contain imageAnnotation
            _usefulCellData[_cellTitle].push(_annotationData)
        })// annotationData.forEach


    })// forEach Cell
    console.log("saveNotes");
    jsonData["pageData"]= _usefulCellData
    jsonData["chapter"] = false
    jsonData["title"] = title
    console.log(jsonData);
    ajaxSendJson(url, jsonData, "save useful", "success add to important", function(){
        console.log(url);
    })

}
console.log(docTitle);

Object.entries(data).forEach(p=>{
    let key = p[0]

    let cellData = p[1]
    if (key){
        let cell = createNewCell("important", false, loadData=true, "imageAnnotation")

        let title = document.createElement("h2")
        title.classList.add("cellTitle")
        title.innerHTML = key
        let cellControlPanel = cell.querySelector(".cellControlPanel")
        cell.insertBefore(title, cellControlPanel)
        cellData.forEach(anno=>{
            let imageAnnotation = createAnnotation("imageAnnotation")
            let image = new Image()
            image.src = anno.imgSrc


            let fileNameInput = document.createElement("input")
            fileNameInput.classList.add("fileNameInput")
            fileNameInput.value = anno.imgFileName
            let imageText = document.createElement("div")
            imageText.classList.add("imageText")
            imageText.innerHTML = anno.imageText
            imageAnnotation.append(image, fileNameInput, imageText)

            console.log(imageAnnotation);

            cell.append(imageAnnotation)
        })
        // let cellControlPanel = cell.querySelector(".cellControlPanel")
        // cell.insertBefore(imageAnnotation, cellControlPanel)
        // let noteContainer =
        document.querySelector(".noteContainer").append(cell)
    }

    console.log(key);
})
