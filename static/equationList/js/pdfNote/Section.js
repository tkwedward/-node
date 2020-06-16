class SectionTree{
    constructor(root){
        this.root = root
    }

    recursionCheck(lastNode, currentNode){
        console.log(lastNode, currentNode);
        let difference = currentNode.level - lastNode.level

        if (difference == 1){
            // create a sectionLinkList if there are no list
            if (!lastNode.childrenList){
                lastNode.childrenList = new SectionLinkList(lastNode, currentNode.level)
            }

            lastNode.childrenList.addNode(currentNode)
            return currentNode

        } else if (difference <= 0){
            lastNode = lastNode.parent
            return this.recursionCheck(lastNode, currentNode)
        }
    }

    generateTreeFromNodeList(nodeList){
        let lastNode = this.root

        nodeList.forEach(p=>{
            let currentNode = p
            lastNode = this.recursionCheck(lastNode, currentNode)
        })

        console.log(this.root);
    }

    generateNodeHtmlObject(node){
        let n = document.createElement("div")
        n.innerHTML = node.name
        n.classList.add(`level_${node.level}`)
        windowManager.bookmarkTab.wrapper.append(n)
    }

    printTree(currentNode = this.root){
        this.generateNodeHtmlObject(currentNode)



    }

    recursionPrintTree(){

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
            this.level = this.sectionDataNew.level
            // this.sectionHtmlObject = this.createSectionHtmlObject()
        }
    }


}
