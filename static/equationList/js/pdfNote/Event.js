class Event{
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
            if ((event.keyCode==67 || event.keyCode==88) && event.ctrlKey){
                let selectedCells = Array.from(document.querySelectorAll(".selectedCell"))

                windowManager.cellEditData = selectedCells
            }// new Cell Below


            // copy current Cell, 78 = n
            if ((event.keyCode==78) && event.ctrlKey){
                 let selectedCell = document.querySelector(".selectedCell")

                 selectedCell.soul.selectAnnotationMode()
                 // Array.from(document.querySelectorAll(".selectedCell"))

                // windowManager.cellEditData = selectedCells
            }// new Cell Below

            // paste current Cell, 86 = v
            if ((event.keyCode==86) && event.ctrlKey){
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
