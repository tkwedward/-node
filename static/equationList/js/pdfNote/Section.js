class SectionTree{
    constructor(root, tab){
        this.tab = tab
        this.root = root
        this.root.level = -1
        this.totalNumberOfNode = 0
        this.placeholderArray = []
    }

    recursionCheck(lastNode, currentNode){
        // console.log(lastNode, currentNode);
        let difference;
        if (currentNode && lastNode){
            difference = currentNode.level - lastNode.level

            if (difference == 1){
                // create a sectionLinkList if there are no list

                if (lastNode.childrenList == null){

                    lastNode.childrenList = new SectionLinkList(lastNode, currentNode.level)
                }

                lastNode.childrenList.addNode(currentNode)
                this.totalNumberOfNode += 1

                return currentNode

            } else if (difference <= 0){
                lastNode = lastNode.parent
                return this.recursionCheck(lastNode, currentNode)
            }
        }
    }

    generateTreeFromNodeList(nodeList){
        let lastNode = this.root

        nodeList.forEach(p=>{
            let currentNode = p
            lastNode = this.recursionCheck(lastNode, currentNode)
        })
    }

    generateNodeHtmlObject(node){
        let self = this
        if (node.level!=-1){
            let htmlObject = document.createElement("div")
            htmlObject.classList.add("section", `section_${node.cell.cellID}`, `level_${node.level}`)
            htmlObject.innerHTML = node.title

            htmlObject.addEventListener("click", function(){
                let data = node.cell.cellHtmlObject.offsetTop
                self.tab.relatedTab.tabWindowHtmlObject.scrollTop = data - 100
            })

            return htmlObject
        }
    }

    transverseTree(currentNode = this.root, counter=0){
        this.generateNodeHtmlObject(currentNode)
        this.placeholderArray.push(currentNode)
        counter+=1
        currentNode.printed = true

        if (this.totalNumberOfNode < counter){
            this.placeholderArray.forEach(p=>{
                p.printed = false
            })
            return false
        }
        else if (this.getLeftMostChild(currentNode))
        {
            currentNode = this.getLeftMostChild(currentNode)
        }
        else if (currentNode.nextNode){
            currentNode = currentNode.nextNode
        }
        else if (currentNode.parent.nextNode)
        {
            currentNode = currentNode.parent.nextNode
        }
        else if (currentNode.printed && !currentNode.parent.nextNode){
            currentNode = currentNode.parent.parent.nextNode
        }
        this.transverseTree(currentNode, counter)

    }

    getLeftMostChild(node){

        if (node.childrenList){
            let leftMostChild = node.childrenList.getLeftMostNode()
            return leftMostChild
        } else {
            return null
        }
    }

    getRightMostChild(node){
        if (node.childrenList){
            let leftMostChild = node.childrenList.getRightMostNode()
            return leftMostChild
        } else {
            return null
        }
    }

    printAllChild(container, node=this.root){
        // to print section object in the section tab and also beautify the cells in the note tab
        if (node.childrenList){
            let childrenList = node.childrenList.listNode()

            childrenList.forEach(p=>{
                let sectionHtmlObject = this.generateNodeHtmlObject(p)
                container.append(sectionHtmlObject)
                this.printAllChild(container, p)
            })

            this.tab.tabWindowHtmlObject.append(container)
        } else {

        }
    }

}

class SectionLinkList{
    constructor(parent, level){
        this.head = null
        this.tail = null
        this.parentNode = parent
        this.level = level

        parent.childrenList = this
    }

    addNode(node){
        node.parent = this.parentNode
        node.sibilingList = this
        if (this.head == null && this.tail == null){
            this.head = node
            this.tail = node
        } else {
            this.tail.nextNode = node
            node.previousNode = this.tail
            this.tail = node
        }
    }

    listNode(){
        let nodeChain = []
        let currentNode = this.head
        while (currentNode){
            nodeChain.push(currentNode)
            currentNode = currentNode.nextNode
        }
        return nodeChain
    }

    getLeftMostNode(){
        return this.head
    }

    getRightMostNode(){
        return this.tail
    }
}

class Section{
    constructor(name, cellData, level=-1){
        this.name = name
        this.parent = null
        this.childrenList = null
        this.level = level

        this.cell = cellData
        if (cellData){
            this.title = cellData.cellTitle.innerHTML
            this.sectionDataNew = cellData.sectionDataNew

            this.level = 0
            if (this.cell.sectionData){
                this.level = this.cell.sectionData.level
            }
        }
    }

    createHtmlObject(){
        let section = document.createElement("div")
        section.innerHTML = this.title
        section.classList.add("section", `level_${this.level}`)
        this.sectionHtmlObject = section
        return section
    }

}
