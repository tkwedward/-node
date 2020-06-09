let greModeButton = document.querySelector(".greMode")
let greContainer = document.querySelector(".greContainer")

greModeButton.addEventListener("click", function(){
    pdfContainerDirectChildTakeToTop(greContainer)
    let allCells = Array.from(document.querySelectorAll(".cell"))

    allCells = allCells.filter(p=>{
        return !p.classList.contains("sectionTitle")
    })
    console.log(allCells);

    let randomNumberArray = [...Array(allCells.length).keys()].sort(function() {
                                return .5 - Math.random();
                            });
    console.log(randomNumberArray);

    let randomVocabArray = randomNumberArray.map(p=>{
        return allCells[p]
    })


    function * greGenerator(array){
        yield * array
    }

    let greArray = greGenerator(randomVocabArray)

    function createQuestion(item){
        if (item){
            let vocabCell = item.value
            let textAnnotationArray = vocabCell.querySelectorAll(".textAnnotation")


            let vocab = vocabCell.querySelector(".cellTitle").innerHTML
            console.log(vocab);
            let hint = textAnnotationArray[0].querySelector(".latexMotherCell").innerHTML
            let answer = textAnnotationArray[1].querySelector(".latexMotherCell").innerHTML


            let vocabArea = document.querySelector(".vocabArea")
            vocabArea.style.background = "pink";
            vocabArea.style.margin = "10px"
            vocabArea.style.fontSize = "40px"

            let hintsArea = document.querySelector(".hintsArea")
            hintsArea.style.background = "pink";
            hintsArea.style.margin = "10px"

            let answerArea = document.querySelector(".answerArea")
            answerArea.style.background = "pink";
            answerArea.style.margin = "10px"

            let cellIDArea = document.querySelector(".cellIDArea")
            cellIDArea.style.background = "pink";
            cellIDArea.style.margin = "10px"

            let cellCorrectArea = document.querySelector(".cellCorrectArea")
            cellCorrectArea.style.background = "pink";
            cellCorrectArea.style.margin = "10px"

            let cellWrongArea = document.querySelector(".cellWrongArea")
            cellWrongArea.style.background = "pink";
            cellWrongArea.style.margin = "10px"

            vocabArea.innerHTML = vocab
            hintsArea.innerHTML = hint
            answerArea.innerHTML = answer
            cellIDArea.innerHTML = "cellID: " + vocabCell.cellID
            cellIDArea.connectedCell = vocabCell
            cellCorrectArea.innerHTML = "correct: " + vocabCell.correct
            cellWrongArea.innerHTML = "wrong: " + vocabCell.wrong
            // console.log(vocabCell.cellID);


        }

    }
    createQuestion(greArray.next());

    let nextButton = document.querySelector(".next")
    nextButton.addEventListener("click", function(){
        createQuestion(greArray.next())
    })
    let correctButton = document.querySelector(".correct")
    let wrongButton = document.querySelector(".wrong")
    correctButton.addEventListener("click", function(){
        let connectedCell = document.querySelector(".cellIDArea").connectedCell
        connectedCell.correct +=1
        console.log(connectedCell.correct);
        createQuestion(greArray.next())
    })
    wrongButton.addEventListener("click", function(){
        let connectedCell = document.querySelector(".cellIDArea").connectedCell
        connectedCell.wrong +=1
        console.log(connectedCell.wrong);
        createQuestion(greArray.next())
    })
})
