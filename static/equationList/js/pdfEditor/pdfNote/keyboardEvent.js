
/*
    keydown events
    1. change to command mode

    - change to  edit mode
*/
document.addEventListener("keydown", function(){
    console.log(event.keyCode)
    if (navigator.platform=="MacIntel"){
        if (event.keyCode==70&& event.ctrlKey){ // 13==enter, to change into
            console.log("ervf");
            document.querySelector(".searchInput").focus()

        }// to change into cameramode
    }


})
