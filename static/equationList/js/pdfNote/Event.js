class EventSelfDefined{
    constructor(windowManager){
        this.eventList = {}
        this.createCopyMainTabEvent()
        this.createGetFocusCellEvent()
        this.createKeyboardEvent()
        this.createPasteImageEvent()
        this.windowManager = windowManager



        Object.entries(this.eventList).forEach(p=>{
            let eventName = p[0]
            let eventFunction = p[1]
            document.addEventListener(eventName, eventFunction)
        })
    }

    createPasteImageEvent(){
        document.onpaste = function(event){
          /* Paste event to create an image */
            let targetAnnotation = document.querySelector(".latexMotherCell.selected").soul;

            let items = (event.clipboardData || event.originalEvent.clipboardData).items;
            console.log(event);
            for (let index in items) {
                var item = items[index];
                if (item.kind === 'file') {
                    var blob = item.getAsFile();
                    var reader = new FileReader();
                    reader.onload = function(event){
                         if (event.target.result.startsWith("data:image")){
                         /*
                            send ajax request to the server and save the image to the hard disk
                         */
                            console.log(targetAnnotation);

                            targetAnnotation.pasteImage(event.target.result)

                        } // if it is an image
                    }; // reader onload
                    reader.readAsDataURL(blob);
                }// if
            }// for items
        } // copy and paste function for image
    }

    createKeyboardEvent(){
        document.addEventListener("keydown", function(){
            // save function, 83 = s
            if (event.keyCode==83 && event.ctrlKey){
                windowManager.save()
            }

            // new Cell Above, 65 = a
            if (event.keyCode==65 && event.ctrlKey){
                let selectedCell = document.querySelector(".selectedCell")

                selectedCell.soul.insertCell("above")
            }

            // new Cell below, 66 = b
            if (event.keyCode==66 && event.ctrlKey){
                let selectedCell = document.querySelector(".selectedCell")

                selectedCell.soul.insertCell("below")

            }// new Cell Below

            // copy current Cell, 67 = c, 88 = x
            if ((event.keyCode==67 || event.keyCode==88) && event.ctrlKey ){
                let selectedCells = Array.from(document.querySelectorAll(".selectedCell"))

                windowManager.cellEditData = selectedCells
            }// new Cell Below


            // copy current Cell, 78 = n
            if ((event.keyCode==78) && event.ctrlKey ){
                let selectedCell = document.querySelector(".selectedCell")
                let toolBox = selectedCell.soul.upperTab.toolBox.toolBoxHtmlObject
                toolBox.style.display = "flex"
                let cutButton = toolBox.soul.buttonDict.cutButton.buttonHtmlObject
                let confirmButton = toolBox.soul.buttonDict.confirmButton.buttonHtmlObject
                let pasteButton = toolBox.soul.buttonDict.pasteButton.buttonHtmlObject
                let exportButton =  toolBox.soul.buttonDict.exportButton.buttonHtmlObject
                console.log(toolBox.soul.buttonDict.cutButton);
                 // event 1
                 // choose the cell, then click cut

                let startChoosingPosition = new CustomEvent("startChoosingPosition")

                 // start the flow, choose the annotations that want to be copied

                selectedCell.soul.selectAnnotationMode()


                cutButton.addEventListener("click", function selectAnnotationWantToCopy(){
                     let selectedAnnotation = selectedCell.soul.returnSelectedAnnotation()

                     let startChoosingCellForPaste = new CustomEvent("startChoosingCellForPaste")

                     startChoosingCellForPaste["selectedCell"] = selectedCell
                     startChoosingCellForPaste["selectedAnnotation"] = selectedAnnotation

                     selectedCell.soul.hideSelectionBox()

                     toolBox.dispatchEvent(startChoosingCellForPaste)

                     cutButton.removeEventListener("click", selectAnnotationWantToCopy)
                 })


                toolBox.addEventListener("startChoosingCellForPaste", function startChoosingCellForPasteFunction(e){
                    console.log(e);
                    toolBox.removeEventListener("startChoosingCellForPaste", startChoosingCellForPasteFunction)

                    let selectedCopyCell = e.selectedCell
                    let selectedAnnotation = e.selectedAnnotation
                    selectedCopyCell.soul.hideSelectionBox()

                    pasteButton.addEventListener("click", function chooseCellForPastes(){
                        pasteButton.removeEventListener("click", chooseCellForPastes)
                        let selectedPasteCell = document.querySelector(".selectedCell")

                        selectedPasteCell.soul.selectAnnotationMode()

                        let startChoosingAnnotationPosition = new CustomEvent("startChoosingAnnotationPosition")
                        startChoosingAnnotationPosition["selectedAnnotation"] = selectedAnnotation
                        startChoosingAnnotationPosition["selectedPasteCell"] = selectedPasteCell

                        toolBox.dispatchEvent(startChoosingAnnotationPosition)
                    })
                })

                // step 3, choose the position to insert the cell
                toolBox.addEventListener("startChoosingAnnotationPosition", function startChoosingAnnotationPositionFunction(e){
                    toolBox.removeEventListener("startChoosingAnnotationPosition", startChoosingAnnotationPositionFunction)
                    console.log(e, e.selectedPasteCell, e.selectedPasteCell.soul.selectAnnotationMode)
                    let annotationArrayToBePasted = e.selectedAnnotation

                    confirmButton.addEventListener("click", function confirmPaste(){
                        confirmButton.removeEventListener("click", confirmPaste)
                        let selectedPasteCell = e["selectedPasteCell"]
                        let targetAnnotation = selectedPasteCell.soul.returnSelectedAnnotation()[0]

                        // target
                        annotationArrayToBePasted.forEach(a=>{

                            let a_data = a.save()
                            a.annotationHtmlObject.remove()
                            console.log(a_data);
                            // no data and do not append
                            let newAnnotation = targetAnnotation.upperCell.createAnnotation(false, false)

                            let newCellID = newAnnotation.soul.cellID
                            let newAnnotationID = newAnnotation.soul.annotationID

                            a_data["cellID"] = newCellID
                            a_data["annotationID"] = newAnnotationID

                            newAnnotation.soul.load(a_data)
                            targetAnnotation.upperCell.cellHtmlObject.insertBefore(newAnnotation, targetAnnotation.annotationHtmlObject)
                            targetAnnotation.upperCell.cellHtmlObject.insertBefore(targetAnnotation.annotationHtmlObject, newAnnotation)

                            targetAnnotation = newAnnotation.soul


                        })// forEach annotation

                        toolBox.soul.hideToolBox()
                    })// confirm button clicked


                    exportButton.addEventListener("click", function pasteAnnotationFunction(){
                        exportButton.removeEventListener("click", pasteAnnotationFunction)
                        let selectedPasteCell = e["selectedPasteCell"]
                        let targetAnnotation = selectedPasteCell.soul.returnSelectedAnnotation()[0]

                        annotationArrayToBePasted.forEach(a=>{
                            let a_data = a.save()
                            console.log(a_data);
                            // no data and do not append
                            let newAnnotation = targetAnnotation.upperCell.createAnnotation(false, false)

                            let newCellID = newAnnotation.soul.cellID
                            let newAnnotationID = newAnnotation.soul.annotationID

                            a_data["cellID"] = newCellID
                            a_data["annotationID"] = newAnnotationID

                            newAnnotation.soul.load(a_data)
                            targetAnnotation.upperCell.cellHtmlObject.insertBefore(newAnnotation, targetAnnotation.annotationHtmlObject)
                            targetAnnotation.upperCell.cellHtmlObject.insertBefore(targetAnnotation.annotationHtmlObject, newAnnotation)

                            targetAnnotation = newAnnotation.soul
                        })// forEach annotation
                        toolBox.soul.hideToolBox()
                    })
                })
            }// new Cell Below

            // paste current Cell, 86 = v
            if ((event.keyCode==86) && event.ctrlKey && false){
                // the cell that is a reference
                let selectedCell = document.querySelector(".selectedCell")
                windowManager.fillInPopUpBox("questionText", ["up", "down"], selectedCell,  selectedCell.soul.upperTab.pasteCellEvent);
            }// new Cell Below

            // deleteCell, 68 = d
            if (event.keyCode==68 && event.ctrlKey){// to delete the cell

                let selectedCell = document.querySelector(".selectedCell")

                let nextCell = selectedCell.soul.nextCell
                let previousCell = selectedCell.soul.previousCell

                if (nextCell){
                    nextCell.cellHtmlObject.classList.add("selectedCell")
                } else {
                    previousCell.cellHtmlObject.classList.add("selectedCell")
                }

                let actionFunction = function(ele){
                    ele.remove()
                    delete ele.soul
                }

                windowManager.symmetryAction(selectedCell, actionFunction)
            }// insert after the cell

        })
    } // createKeyboardEvent

    createGetFocusCellEvent(){
        let type = "click"
        let effect = function(){
            let target = event.target
            let isCell = event.target.classList.has("cell")
            if (isCell){
                console.log(event.target);
            }
        }
    }

    createCopyMainTabEvent(){
        let type = "keydown"
        let effect = function(){
            console.log(event.keyCode)
            if (navigator.platform=="MacIntel"){
                if (event.keyCode==82&& event.ctrlKey){ // 82==R
                    let copyOfMainTab = document.querySelector(".copyOfMainTab")

                    if (!copyOfMainTab){
                        console.log();
                        let newTab = windowManager.createNewTab("right", "Note")
                        let newTabHtmlObject = newTab.tabWindowHtmlObject
                        newTabHtmlObject.classList.add("copyOfMainTab")
                        newTabHtmlObject.style.background = "aliceblue"


                        // create cells from the one in the main tab
                        let mainTabData = windowManager.mainTab.data
                        console.log(mainTabData);
                        windowManager.fromLoadCreatePage(newTab, mainTabData)


                        let newTabID = newTab.tabID
                        console.log(newTab);
                        windowManager.showTab("right", newTabID)
                    }// if not copyOfMainTab
                }// to change into cameramode
            }
        }// effect function

        // add the effect to event list
        this.eventList[type] = effect
    } // createCopyMainTabEvent
}
