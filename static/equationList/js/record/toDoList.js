

let record_tabs = document.querySelector(".record_tabs")
record_tabs.areaLink = "recordInputContainer"
record_tabs.addEventListener("click", tabsToggle)

let toDoList_tabs = document.querySelector(".toDoList_tabs")
toDoList_tabs.areaLink = "toDoListContainer"
toDoList_tabs.addEventListener("click", tabsToggle)

function tabsToggle(){
    let allInputContainers = document.querySelectorAll("._inputContainer")
    allInputContainers.forEach(p=>p.style.display="none")
    let areaLink = document.querySelector("."+event.target.areaLink)
    areaLink.style.display="block"
}

/* To do list */
let toDoList = document.querySelector(".toDoList")
let toDoListOutput = document.querySelector(".toDoListOutput")

toDoList.addEventListener("input", function(){
    toDoListOutput.innerHTML = ""
    let inputArray = event.target.value.split("\n")
    console.log(inputArray);
    inputArray.forEach(p=>{
        let toDoItem = document.createElement("div")
        toDoItem.classList.add("toDoItem")
        toDoItem.innerHTML = p
        toDoListOutput.append(toDoItem)
    })

})
