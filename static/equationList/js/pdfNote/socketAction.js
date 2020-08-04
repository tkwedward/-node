const roomName = JSON.parse(document.getElementById('room-name').textContent);

const chatSocket = new WebSocket(
   'ws://' + window.location.host + '/ws/chat/' + roomName + '/'
);

 chatSocket.onmessage = function(e) {
     const data = JSON.parse(e.data);
     console.log(data);
     if (data["action"]  == "initial_message"){
       console.log("receive inital message " + data.message);
       CHAT_USER_ID = data.message
     }
     else if (data.action == "motherCellUpdate")
     {

       let tab_identifier = data["message"]["tab_identifier"]
       let annotation_content = data["message"]["content"]
       let sender = data["message"]["sender"]

       let annotationID = annotation_content["annotationID"]
       let cellID = annotation_content["cellID"]
       let motherContent = data["message"]["latexMotherCellInnerHTML"]

        let tabPostion = tab_identifier["position"]
        let tabType = tab_identifier["tabType"]
        let roomName = tab_identifier["roomName"]
        let chatID = tab_identifier["CHAT_USER_ID"]

        let targetTabsArray = document.querySelectorAll("." + tabType)

        targetTabsArray.forEach(p=>{
          let checkroomName = p.identifier["roomName"] == roomName

          if (checkroomName){
            let differentPosition = p.identifier["position"] != tabPostion
            let differentChatID = p.identifier["CHAT_USER_ID"] != chatID

            // first check if they have the same id, if not, then check if they have the same position
            if (differentChatID || differentPosition){
                let targetMotherCell = p.querySelector(`.latexMotherCell_${cellID}_${annotationID}`)
                console.log(targetMotherCell);
                targetMotherCell.innerHTML = motherContent
            }
          }
        })
     } // mother cell update
};

 chatSocket.onclose = function(e) {
     console.error('Chat socket closed unexpectedly');
 };
