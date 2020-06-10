class Event{
    constructor(windowManager){
        this.eventList = {}
        this.createCopyMainTabEvent()
        this.windowManager = windowManager

        Object.entries(this.eventList).forEach(p=>{
            let eventName = p[0]
            let eventFunction = p[1]
            document.addEventListener(eventName, eventFunction)
        })
    }

    createCopyMainTabEvent(){
        let type = "keydown"
        let effect = function(){
            console.log(event.keyCode)
            if (navigator.platform=="MacIntel"){
                if (event.keyCode==82&& event.ctrlKey){ // 82==R
                    let copyOfMainTab = document.querySelector(".copyOfMainTab")

                    if (!copyOfMainTab){
                        console.log();
                        let newTab = windowManager.createNewTab("right", "Note")
                        let newTabHtmlObject = newTab.tabWindowHtmlObject
                        newTabHtmlObject.classList.add("copyOfMainTab")
                        newTabHtmlObject.style.background = "aliceblue"


                        // create cells from the one in the main tab
                        let mainTabData = windowManager.mainTab.data
                        console.log(mainTabData);
                        windowManager.fromLoadCreatePage(newTab, mainTabData)


                        let newTabID = newTab.tabID
                        console.log(newTab);
                        windowManager.showTab("right", newTabID)
                    }// if not copyOfMainTab
                }// to change into cameramode
            }
        }// effect function

        // add the effect to event list
        this.eventList[type] = effect
    } // createCopyMainTabEvent
}
