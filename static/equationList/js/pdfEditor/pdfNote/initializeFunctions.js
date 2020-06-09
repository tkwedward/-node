function djangoParseJSON(data){
    data = data.split("&#39;").join("\"")
    data = data.split("&quot;").join("\"")
    data = data.split("&lt;").join("<")
    data = data.split("&gt;").join(">")
    return data
}


function changeMode(newMode){
    console.log("I change to "+newMode);
    mode = newMode
    document.querySelector(".mode").innerHTML = newMode
}

function ajaxSendJson(url, data, todo, msg, callback){
    console.log(data);
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

function clickCameraButton(){
    if( isMobile.any()){
        // screenSwitch = document.querySelector(".screenSwitch")
        let pageWrapper = document.querySelector("#pageWrapper")
        pageWrapper.style.gridTemplateColumns = "1fr"
        pdfContainer.style.display = "none"

        screenSwitch.innerHTML = "hide"
        let cameraInput = document.querySelector(".cameraInputButton")


    }
}// clickCameraButton
