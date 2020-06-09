let dropZone = document.querySelector(".dropZone")

console.log(dropZone);
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropZone.addEventListener(eventName, preventDefaults, false)
})

function preventDefaults (e) {
  e.preventDefault()
  e.stopPropagation()
}

dropZone.addEventListener("drop", function(){
    console.log("something drop")
    console.log(event.dataTransfer);
})
