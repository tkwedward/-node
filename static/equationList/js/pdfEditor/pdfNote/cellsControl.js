/*
cellControl Action
1.
*/
document.addEventListener("keydown", function(){
    console.log(event.keyCode)
    if (navigator.platform=="MacIntel"){
        if (event.keyCode==83&& event.ctrlKey){ // 13==enter, to change into
            saveNote()

        }// to change into cameramode

        if (event.keyCode==27){
            console.log("change to command mode");
            changeMode("Command")
        }
    }

    if (mode=="Command"){
        if (navigator.platform=="MacIntel"){
        ////////////////
        // 65==a, to insert cell before
        ///////////////
            if (event.keyCode==65 && event.ctrlKey){// to insert cell before the selected cell
                let selectedCell = document.querySelector(".cell.selectedCell")
                selectedCell.classList.remove("selectedCell")
                console.log("new cell above");
                let newCell = createNewCell()
                newCell.initiate()
                newCell.classList.add("selectedCell")
                selectedCell.parentNode.insertBefore(newCell, selectedCell)
            }//insert before the cell

        ////////////////
        // 66==b, to insert concept cell after
        ///////////////
            if (event.keyCode==66 && event.ctrlKey){// to insert cell after the selected cell
                let selectedCell = document.querySelector(".cell.selectedCell")
                selectedCell.classList.remove("selectedCell")
                console.log("new cell below");
                let newCell = createNewCell()
                newCell.initiate()
                newCell.classList.add("selectedCell")
                selectedCell.parentNode.insertBefore(newCell, selectedCell)
                selectedCell.parentNode.insertBefore(selectedCell, newCell)
                // newCell.scrollIntoView()
            }// insert after the cell

        ////////////////
        // 68==d, to delete a cell
        ///////////////
            if (event.keyCode==68 && event.ctrlKey){// to delete the cell
                let allCells = document.querySelectorAll(".cell")

                if (allCells.length>1){
                    let selectedCell = document.querySelector(".cell.selectedCell")
                    selectedCell.classList.remove("selectedCell")

                    // find the position of the selected cell

                    let positionOfSelectedCell = Array.from(allCells).indexOf(selectedCell)

                    if (allCells[positionOfSelectedCell+1]){
                        allCells[positionOfSelectedCell+1].classList.add("selectedCell")
                    } else if (allCells[positionOfSelectedCell-1]){
                        allCells[positionOfSelectedCell-1].classList.add("selectedCell")
                    }
                    selectedCell.remove()
                }


                // newCell.scrollIntoView()
            }// insert after the cell

        ////////////////
        // 73==i, to move to the previous cell
        ////////////////
            if (event.keyCode==73 && event.ctrlKey){
                let selectedCell = document.querySelector(".cell.selectedCell")
                let allCells = document.querySelectorAll(".cell")
                if (selectedCell!=allCells[0]){
                    selectedCell.classList.remove("selectedCell")
                    selectedCell.previousSibling.classList.add("selectedCell")
                }
            }// to move to the previous cell

        ////////////////
        // 73==i, to move to the next cell
        ////////////////
            if (event.keyCode==75 && event.ctrlKey){
                let selectedCell = document.querySelector(".cell.selectedCell")
                let allCells = document.querySelectorAll(".cell")
                if (selectedCell!=allCells[allCells.length-1]){
                    selectedCell.classList.remove("selectedCell")
                    selectedCell.nextSibling.classList.add("selectedCell")
                }
            }// to move to the previous cell

        ////////////////
        // 84==t, to add title to the cell
        ////////////////
            if (event.keyCode==84 && event.ctrlKey){
                console.log("I want to add new button");
                let selectedCell = document.querySelector(".cell.selectedCell")
                let titleButton = selectedCell.querySelector(".titleButton")
                titleButton.click()

            }// to move to the previous cell
        ////////////////

        // 84==t, to add title to the cell
        ////////////////
            if (event.keyCode==67 && event.ctrlKey){
                console.log("I want to add a camera cell");
                let selectedCell = document.querySelector(".cell.selectedCell")
                let cameraAnnotationButton = selectedCell.querySelector(".addCameraAnnotationButton")
                cameraAnnotationButton.click()
            }// to move to the previous cell

            ////////////////
            // 81==h, switch on and off the counter, ctrl+q
            ////////////////
            if (event.keyCode==81 && event.ctrlKey){
                let counterContainer = document.querySelector(".counterContainer")
                counterContainer.style.display = counterContainer.style.display=="block"? "none": "block"

                let pageWrapper = document.querySelector("#pageWrapper")
                pageWrapper.style.top= pageWrapper.style.top == "72px"? "0px": "72px"
                pageWrapper.style.height= pageWrapper.style.height == "92vh"? "100vh": "92vh"

                let noteContainer = document.querySelector(".noteContainer")
                toggleHeight(noteContainer)

                let pdfContainer = document.querySelector(".pdfContainer")
                toggleHeight(pdfContainer)

                let iframe = document.querySelector("iframe")
                toggleHeight(iframe)

                function toggleHeight(div){
                    div.style.height = div.style.height == "92vh"? "100vh":"92vh"
                }



            }// to move to the previous cell

            ////////////////
            // 72==h, to switch the window from showing pdf part or note
            ////////////////
                if (event.keyCode==87 && event.ctrlKey){
                    console.log("yes");
                    let screenSwitch = document.querySelector(".screenSwitch").innerHTML
                    let pageWrapper = document.querySelector("#pageWrapper")
                    let pdfContainer = document.querySelector(".pdfContainer")
                    console.log("I want to hide hte image");
                    let allAnnotation = document.querySelectorAll(".annotation")

                    document.querySelector(".screenSwitch").innerHTML = screenSwitch == "show"? "hide": "show"
                    if (screenSwitch=="hide"){
                        pageWrapper.style.gridTemplateColumns = "1fr"
                        pdfContainer.style.display = "none"

                    } else {
                        console.log("hhoiwr");
                        pageWrapper.style.gridTemplateColumns = "1fr 1fr"
                        pdfContainer.style.display = "block"

                    }
                }// to move to the previous cell
        }// check for os
    } // if command mode
    else
    {
        if (navigator.platform=="MacIntel"){
        ////////////////
        // 65==a, to insert cell before
        ///////////////
        console.log("I want to add new annotation");
            if (event.keyCode==78 && event.ctrlKey){// to insert cell before the selected cell
                console.log("I want to add new annotation");
                let selectedCell = document.querySelector(".cell.selectedCell")

                let addNoteButton = selectedCell.querySelector(".addAnnotationButton")
                addNoteButton.click()
            }//insert before the cell
        }
    }


})
