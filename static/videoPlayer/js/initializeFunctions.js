 var tag = document.createElement('script');
 let bookmarkArea = document.querySelector(".bookmarkArea")

 let barLeft = document.querySelector(".barLeft")
 let barRight = document.querySelector(".barRight")
 let videoData = document.querySelector(".videoData")
 let startTimeField = document.querySelector(".startTime")
 let endTimeField = document.querySelector(".endTime")
 // control area
 let replayButton = document.querySelector(".replay")
 replayButton.addEventListener("click", replay)
 // barLeft.addEventListener("")




 tag.src = "https://www.youtube.com/iframe_api";
 var firstScriptTag = document.getElementsByTagName('script')[0];
 firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

 // 3. This function creates an <iframe> (and YouTube player)
 //    after the API code downloads.
 let player;
 function onYouTubeIframeAPIReady() {
   player = new YT.Player('player', {
     height: '390',
     width: '640',
     videoId: 'FSyytu4ycUI',
     events: {
       'onReady': loadNote
       // 'onStateChange': onPlayerStateChange
     }
   });
 }

 // 4. The API will call this function when the video player is ready.
 function onPlayerReady(event) {
   event.target.playVideo();
 }

 // 5. The API calls this function when the player's state changes.
 //    The function indicates that when playing a video (state=1),
 //    the player should play for six seconds and then stop.
 var done = false;
 function onPlayerStateChange(event) {
   if (event.data == YT.PlayerState.PLAYING && !done) {
     setTimeout(stopVideo, 6000);
     done = true;
   }
 }

 function stopVideo() {
   player.stopVideo();
 }



function ajaxSendJson(url, data, todo, msg, callback){
    var xhr = new XMLHttpRequest();
    data["todo"] = todo
    xhr.open("POST", url, true);
    xhr.setRequestHeader("X-CSRFToken", csrf_token);
    xhr.onreadystatechange =  async function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            console.log("..........*******");
            console.log(msg);
            // console.log(xhr.response);
            result = await xhr.response

            if (callback){
                callback(result)
            }
            return  result

        }
    }
    xhr.send(JSON.stringify(data));
}

function djangoParseJSON(data){
    data = data.split("&#39;").join("\"")
    data = data.split("&quot;").join("\"")
    data = data.split("&lt;").join("<")
    data = data.split("&gt;").join(">")
    return data
}

function replay(){
    let _startTime = document.querySelector(".startTime").value
    let _endTime = document.querySelector(".endTime").value
    player.seekTo(_startTime)
    player.playVideo()
    setReplayRange(_startTime, _endTime)
}

function setReplayRange(startTime, stopTime){
    let videoCheckInterval = setInterval(function(){
        console.log("each check");
        let _currentTime = player.getCurrentTime()
        console.log(_currentTime, stopTime)
        if (stopTime < _currentTime){
            player.pauseVideo()
            clearInterval(videoCheckInterval)
        }
    }, 500)

}
