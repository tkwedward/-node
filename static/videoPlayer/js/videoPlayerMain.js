
function createSavePosition(){
    let bookmark = document.createElement("div")
    bookmark.classList.add("bookmark")
    bookmark.innerHTML = player.getCurrentTime()
    return bookmark
}


/*Controller video */

 document.addEventListener("keydown", function(){
     console.log(event.keyCode)
     if (navigator.platform=="MacIntel"){

         /*******************
          Save book mark
         ********************/
         if (event.keyCode==49&& event.ctrlKey){ // 49 = 1, save the data
             let start = player.getCurrentTime()
             startTimeField.value = start

             // bookmarkArea.append(bookmark)
         }// to change into cameramode

         if (event.keyCode==50&& event.ctrlKey){ // 50 = 2, save the data
             let end = player.getCurrentTime()
             endTimeField.value = end

             // bookmarkArea.append(bookmark)
         }// to change into cameramode


         /*******************
          Save book mark
         ********************/
         if (event.keyCode==66&& event.ctrlKey){ // 66 = b, save the data
             let bookmark = createSavePosition()
             bookmarkArea.append(bookmark)
         }// to change into cameramode

         /*******************
         Go back 5 seconds
         ********************/
         if (event.keyCode==81&& event.ctrlKey){//81 = q, go back 5s
             let t = player.getCurrentTime()
             player.seekTo(t-5)
         }

         if (event.keyCode==87&& event.ctrlKey){//87 = w, go forward 5s
             let t = player.getCurrentTime()
             player.seekTo(t+5)
         }

         /*******************
         Save the note
         ********************/
         if (event.keyCode==83&& event.ctrlKey){//83 = s, save the note
             saveNote()
         }// if save the note

         /*******************
         Pause or Play the video
         ********************/
         if (event.keyCode==192&& event.ctrlKey){//49 = 1, pause or play the video

            let status = player.getPlayerState()
            console.log(status);
            if (status==1){
                player.pauseVideo()
            } else if (status==2  || status==5) {
                player.playVideo()
            }
        }// pause or play
     }
 })


// Q0yDePEWqkw
 let loadYoutubeButton = document.querySelector(".loadYoutubeButton")
 console.log(loadYoutubeButton);
 loadYoutubeButton.addEventListener("click", function(){
    let youtubeLink = document.querySelector(".youtubeLink").value.split("?v=")
    console.log(youtubeLink);
    player.loadVideoById(youtubeLink[1])
 })


// new note
let newNoteButton = document.querySelector(".newNoteButton")
newNoteButton.addEventListener("click", function(){
    let noteTitle = document.querySelector(".noteTitle")
    let noteArea = document.querySelector(".noteArea")
    noteTitle.innerHTML = "New Note"
    noteArea.innerHTML = "New Area"
})


function videoDataAcquisition(){
    let totalTime = player.getDuration()
    let currentTime = player.getCurrentTime()

    return `totalTime = ${totalTime}, currentTime = ${currentTime}`
}

let checkPlayerInterval = setInterval(function(){
    if (player){
        let playerIframe = player.getIframe()
        videoData.innerHTML =  videoDataAcquisition()
        console.log(playerIframe);
        clearInterval(checkPlayerInterval)
    }
}, 1000)




// setRange(0, 3)
