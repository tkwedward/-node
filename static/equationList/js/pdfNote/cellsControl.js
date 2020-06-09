/*
cellControl Action
1.
*/
let sideChosen = "left"
let leftSide = document.querySelector(".leftSide")
let rightSide = document.querySelector(".rightSide")
let selectedCell

function createPasteButton(_class, _name){
    // create copy and paste button
    let button = document.createElement("button")
    button.classList.add("pasteButton", _class)
    button.innerHTML = _name

    button.addEventListener("click", function(){
        console.log(button, selectedCell, button.parentNode)
        button.parentNode.insertBefore(selectedCell, button)



        let pasteButtons = document.querySelectorAll(".pasteButton")

        pasteButtons.forEach(p=>p.remove())
    })

    return button
}

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

    if (mode=="Command" || 1){
        if (navigator.platform=="MacIntel"){



        ////////////////
        // 88==x, to insert cell before
        ///////////////
        if (event.keyCode==88 && event.ctrlKey){// to copy the cell wanted to move
            selectedCell = document.querySelector(".selectedCell")
            console.log(selectedCell)

        }

        if (event.keyCode==86 && event.ctrlKey){// to copy the cell wanted to move
            if (selectedCell){
                let targetCell = document.querySelector(".selectedCell")

                let pasteButtons = document.querySelectorAll(".pasteButton")

                pasteButtons.forEach(p=>p.remove())

                let buttonUp = createPasteButton("insertUp", "insert Up")

                let buttonDown = createPasteButton("insertDown", "insert Down")

                targetCell.parentNode.insertBefore(buttonUp, targetCell)
                targetCell.parentNode.insertBefore(buttonDown, targetCell)
                targetCell.parentNode.insertBefore(targetCell, buttonDown)

                console.log(selectedCell);
            }
        }

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
        // 66==b, to insert cell after
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
        // 84==t, to add title to the cell
        ////////////////
            if (event.keyCode==84 && event.ctrlKey){
                console.log("I want to add new button");
                let selectedCell = document.querySelector(".cell.selectedCell")
                let titleButton = selectedCell.querySelector(".titleButton")
                titleButton.click()

            }// to move to the previous cell
        ////////////////


            ////////////////
            // 192==`, to change L <-> R, ctrl+`
            ////////////////

            if (event.keyCode==192 && event.ctrlKey){
                sideChosen = (sideChosen=="left") ? "right" : "left"
                console.log(sideChosen);
                leftSide.classList.toggle("focus")
                rightSide.classList.toggle("focus")
            }



            function positionFunction(_class, color, shiftKey){
                let _left = document.querySelector(".left.noteContainer")
                let _right = document.querySelector(".right.copyNoteContainer")
                let targetCell = (sideChosen == "left") ?  _left: _right


                console.log(targetCell, targetCell.scrollTop);
                let position = document.querySelector(_class)

                if (!shiftKey){
                    position.style.background = color
                    position.savedPosition = targetCell.scrollTop
                    console.log(position.savedPosition );
                } else {
                    console.log(position.savedPosition );
                    console.log("shift is pressed");
                    targetCell.scrollTop = position.savedPosition
                }

            }

            ////////////////
            // 49==1, save position 1, ctrl+1
            ////////////////
            if (event.keyCode==49 && event.ctrlKey){
                positionFunction(".position1", "yellow", event.shiftKey)
            }


            ////////////////
            // 50 == 2, save position 2, ctrl+2
            ////////////////
            if (event.keyCode==50 && event.ctrlKey){
                positionFunction(".position2", "Crimson", event.shiftKey)
            }

            ////////////////
            // 51 == 3, save position 3, ctrl+3
            ////////////////
            if (event.keyCode==51 && event.ctrlKey){
                positionFunction(".position3", "DarkSeaGreen", event.shiftKey)
            }


            ////////////////
            // 52 == 4, save position 4, ctrl+4
            ////////////////
            if (event.keyCode==52 && event.ctrlKey){
                positionFunction(".position4", "IndianRed", event.shiftKey)
            }

            if (event.keyCode==82 && event.ctrlKey){// to create right side content
                console.log("right")
                let copyNoteContainer = document.querySelector(".copyNoteContainer")
                let leftNoteContainer = document.querySelector(".noteContainer").cloneNode(true)

                copyNoteContainer.innerHTML = leftNoteContainer.innerHTML

                let allTextAnnotation = copyNoteContainer.querySelectorAll(".textAnnotation")
                console.log(allTextAnnotation);
                allTextAnnotation.forEach(p=>{
                    let latexMotherCell = p.querySelector(".latexMotherCell")
                    let latexChildCell = p.querySelector(".latexChildCell")

                    renderLatex(latexMotherCell, latexChildCell)
                })

                pdfContainerDirectChildTakeToTop(copyNoteContainer)
            }
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
