/*
 paste Event
*/
function createImageContainer(containerType){
    /*
        Contains two part, one is image, which will be added later
        The other one is fileName, which is used to save the image later

        properties
        - class name

        event:
        Annotation:
        - when click, it change the mode
    */

    /*
        If command mode, then create a new cell, if edit mode, create
    */
    // create div
    let imageContainer
    let target = document.querySelector(".latexMotherCell.selected").parentNode.parentNode;
    console.log(target);
    if (target){
        console.log(target);
        imageContainer= createAnnotation("imageAnnotation")
        console.log(imageContainer);
        target.parentNode.insertBefore(imageContainer, target)
        target.remove()
    } else {
        imageContainer= document.querySelector(".annotationContent.selected")
    }


    imageContainer.addEventListener("focus", function(){
        imageContainer.classList.toggle("selected")
        console.log("focus event");
    })

    imageContainer.addEventListener("blur", function(){
        imageContainer.classList.toggle("selected")
        console.log("blur event");
    })


    let img = new Image()
    img.createDate = new Date()
    img.classList.add("pastedImage")
    imageContainer.append(img)




    // let counterFileName = updateCounter()

    // let fileName  =  document.createElement("input")
    // fileName.classList.add("fileNameInput")
    // fileName.type  = "text"
    // fileName.value  = counterFileName
    // imageContainer.append(fileName)
    return imageContainer
}


function updateCounter(){
    let counterSelected = document.querySelector(".counter.selected")
    let suffix = counterSelected.getAttribute("data-text")
    console.log(suffix);
    let count =  document.querySelector(".counter.selected span")
    currentCount = count.innerHTML;
    count.innerHTML = parseInt(count.innerHTML) + 1

    if (suffix==null){
        return currentCount
    } else {
        return suffix + " " + currentCount
    }

}

document.onpaste = function(event){
  /* Paste event to create an image */
    var items = (event.clipboardData || event.originalEvent.clipboardData).items;
    for (index in items) {
        var item = items[index];
        if (item.kind === 'file') {
            var blob = item.getAsFile();
            var reader = new FileReader();
            reader.onload = function(event){
              // console.log(typeof(event.target.result.startsWith));
                 if (event.target.result.startsWith("data:image")){
                 /*
                    send ajax request to the server and save the image to the hard disk
                 */
                    console.log(event.target.result);
                    let imageContainer = createImageContainer("imageAnnotation")

                    let img = imageContainer.querySelector("img")
                    img.src = event.target.result
                    imageContainer.contentEditable =false

                } // if it is an image
            }; // reader onload
            reader.readAsDataURL(blob);
        }// if
    }// for items
} // copy and paste function for image
