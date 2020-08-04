const ROOMNAME = JSON.parse(document.getElementById('room-name').textContent);

const chatSocket = new WebSocket(
   'ws://' + window.location.host + '/ws/chat/' + ROOMNAME + '/'
);

 chatSocket.onmessage = function(e) {
     const data = JSON.parse(e.data);
     console.log(data);
     if (data["action"]  == "initial_message"){
       console.log("receive inital message " + data.message);
       CHAT_USER_ID = data.message
     }
     else {
       // send data to the tab
       let tabType = data["message"]["tab_identifier"]["tabType"]
       
       let targetTabsArray = document.querySelectorAll("." + tabType)
       console.log(targetTabsArray);
       targetTabsArray.forEach(tab=>{
         tab.soul.updateFromSocketMessage(data)
       })
     }
};

 chatSocket.onclose = function(e) {
     console.error('Chat socket closed unexpectedly');
 };
