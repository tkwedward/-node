let saveButton = document.querySelector(".saveButton")
saveButton.addEventListener("click", function(){
    console.log("save success");
    saveNote()
})
let title = document.querySelector(".noteTitle").innerHTML
let book = document.querySelector(".book").innerHTML
let chapter = document.querySelector(".noteChapter").innerHTML
/*
    Flow:
    saveNote => get cell Data => get annotation data

    1. saveNote:
    - to save the note

    2. updateNoteData:
    - to update the note data

    3. extractDataFromAnnotation:
    - to extract the data from annotations
*/
function createBaseSaveData(){
    let title = document.querySelector(".noteTitle").innerHTML
    let book = document.querySelector(".book").innerHTML
    let chapter = document.querySelector(".noteChapter").innerHTML


    let noteData = {
        "title": title,
        "chapter": chapter,
        "book": book,
        "cells": [],
        "annotationBlock": [],
        "counter": {},
        "pdfList": "",
        "maxCellID":cellID,
        "maxAnnotationBlockID":annotationBlockID,
        "pdfBookmark": []
    }
    return noteData
}

function saveNote(){
    let noteData = createBaseSaveData()
    let counter = document.querySelectorAll(".counter")

    let allCell = document.querySelectorAll(".noteContainer .cell")
    let allAnnotationBlocks = document.querySelectorAll(".annotationBlock")

    let bookmarkContainer = document.querySelector(".bookmarkContainer")
    noteData["pdfBookmark"] = bookmarkContainer.saveBookmark()
    // console.log(bookmarkContainer.saveBookmark());


    allAnnotationBlocks.forEach(block=>{
        if (block){
            noteData["annotationBlock"].push(block.dimensionOutput);
        }
    })


    allCell.forEach(p=>noteData["cells"].push(p.save()))
    console.log(noteData);
    ajaxSendJson(url, noteData, "save state", "success to save", function(){
        console.log("after sent ajax");
    })



} // saveNote

/*
    saveImageAndGetURL
*/

 async function saveImageAndGetURL(annotation, cellData){
    let title = document.querySelector(".noteTitle").innerHTML
    let chapter = document.querySelector(".noteChapter").innerHTML
    let fileName = annotation.querySelector(".fileNameInput").value
    let image = annotation.querySelector("img")

    let jsonData =  {"data": image.src, "fileName": fileName, "title": title, "chapter": chapter}


    let result;
    // send ajaxSendJson to server to get the reduced imagePath
    result = await ajaxSendJson(url, jsonData, "save image", "success save image",  async function(imagePath){
        let annotationData = {}
        annotationData["annotationType"] = "imageAnnotation"
        annotationData["fileName"] = await fileName
        let imagePathLink = await JSON.parse(imagePath)
        annotationData["src"] = imagePathLink.src
        annotationData["createDate"] = await image.createDate
        result = await annotationData
        return await annotationData
    })
    return  result
}

function checkURL(){
    let noteURL = document.URL.split("/")
    let noteURLTitle = noteURL[noteURL.length-2]
    let noteURLChapter = noteURL[noteURL.length-1]
    if (noteURLTitle!=title && noteURLChapter!=chapter){
        let basePath = "http://127.0.0.1:8000/equation/pdfNote/"
        window.location.href = basePath + title + "/" + chapter
    }
}
/*
    load data
    1. get the data
    2. loop the data
    3. if
*/

function loadDataRequest(title="Title", chapter = "Chapter"){
    title = document.querySelector(".noteTitle").innerHTML
    chapter = document.querySelector(".noteChapter").innerHTML
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("X-CSRFToken", csrf_token);
    xhr.onreadystatechange =  function() {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            let result = JSON.parse(xhr.response);
            fromLoadCreatePage(result);
        }
    }// xhr setRequest
    // console.log(chapter);
    xhr.send(JSON.stringify({"title": title, "chapter":chapter, "todo": "load state"}));
}


let annotationBlock;
function fromLoadCreatePage(jsonResult){
    let title = jsonResult["title"]
    let chapter = jsonResult["chapter"]
    let cellsData = jsonResult["cells"]
    annotationBlock = jsonResult["annotationBlock"]

    let counter = jsonResult["counter"]
    let pdfFileList = jsonResult["pdfFileList"]
    // console.log(jsonResult["maxAnnotationBlockID"]);
    annotationBlockID = parseInt(jsonResult["maxAnnotationBlockID"]) || 1
    cellID = parseInt(jsonResult["maxCellID"]) || 1


    let bookmarkContainer = document.querySelector(".bookmarkContainer")
    let bookmarkData = jsonResult["pdfBookmark"]
    if (bookmarkData){
        bookmarkContainer.loadBookmark(bookmarkData)
    }

    // console.log(bookmarkData);

    // if (counter){
    //     Object.entries(counter).forEach(p=>{
    //         let key = p[0]
    //         let value = p[1]
    //         let counterType = document.querySelector("."+key)
    //         let count = counterType.querySelector("span")
    //         count.innerHTML = value
    //     })
    // }

    cellsData.forEach(data=>{
        // console.log(data);

        let newCell = createNewCell()
        newCell.load(data)

        noteContainer.append(newCell)


        data.annotation.forEach(item=>{
            let annotation = createAnnotation(item.annotationType, item)

            noteContainer.append(newCell)
        })
    })

    setSectionColor()
}
loadDataRequest(title, chapter)
