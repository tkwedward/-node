console.log(data);

Object.entries(data).forEach(title_item=>{
    let title = title_item[0]
    chapterObject = Object.entries(title_item[1])

    chapterObject.forEach(chapter_item=>{
        let chapter = chapter_item[0]
        let cellObject = Object.entries(chapter_item[1])

        cellObject.forEach(cell_item=>{
            let cellData = {
                "cellID": cell_item[1]["cellID"],
                "cellTitle": cell_item[1]["cellTitle"],
                "sectionTitle": "false",
                "pinButton": "save",
                "linkPdfPageButton": "link PDF",
                "annotation": []
            }

            delete cell_item[1].cellID
            delete cell_item[1].cellTitle
            let annotationObject = Object.entries(cell_item[1])

            annotationObject.forEach(annotation_item=>{
                let annotationID = annotation_item[0]
                if (typeof annotation_item[1]=="object"){
                    cellData["annotation"].push(annotation_item[1])
                }
            })// annotation OBject


            let loadCell = createNewCell()
            loadCell.load(cellData)
            noteContainer.append(title + "\t"+ chapter, loadCell)
        })// cellObject

    })// chapterObject
})// data
