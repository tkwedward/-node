function loadNote(){
    let loadDataArea = document.querySelector(".loadDataArea")
    let data = JSON.parse(djangoParseJSON(jsonFile))["data"]
    data.forEach(p=>{
        let title = document.createElement("ol")
        title.innerHTML = p
        title.style.fontSize = "20px";
        loadDataArea.append(title)


        title.addEventListener("click", function(){
            let noteData = {"noteTitle": p}
            ajaxSendJson(url, noteData, "load video note record", "success to save", function(result, p = player){
                let noteTitle = document.querySelector(".noteTitle")
                let noteArea = document.querySelector(".noteArea")

                result = JSON.parse(djangoParseJSON(result))
                console.log(result);
                p.pla
                p.seekTo(result["currentTime"])
                noteTitle.innerHTML = result["noteTitle"]
                noteArea.innerHTML = result["noteContent"]
            })
        })
    })

    console.log(player);
    noteData = {
        "noteTitle": data[0],
    }

    ajaxSendJson(url, noteData, "load video note record", "success to load", function(result, p=player){
        console.log("load video note record successfully");
        let noteTitle = document.querySelector(".noteTitle")
        let noteArea = document.querySelector(".noteArea")
        result = JSON.parse(djangoParseJSON(result))

        p.seekTo(result["currentTime"])
        noteTitle.innerHTML = result["noteTitle"]
        noteArea.innerHTML = result["noteContent"]
    })
}
// let timeout = setTimeout(loadNote, 3000)



function saveNote(){
    let noteTitle = document.querySelector(".noteTitle").innerText
    let noteContent = document.querySelector(".noteArea").innerHTML
    let youtubeLink = player.getVideoUrl()
    console.log(player);
    let noteData = {
        "noteTitle": noteTitle,
        "noteContent": noteContent,
        "youtubeLink": youtubeLink,
        "currentTime": player.getCurrentTime()
    }
    console.log(noteData);

    ajaxSendJson(url, noteData, "save video note record", "success to save", function(){
        console.log("save video note record successfully");
        let leftColumn = document.querySelector(".leftColumn")
        let successMessage = document.createElement("div")
        successMessage.innerHTML = "save Successfully"
        successMessage.style.fontSize = "40px"
        successMessage.style.color = "red"
        leftColumn.append(successMessage)
        setTimeout(function(){
            successMessage.remove()
        }, 2000)
    })
}
