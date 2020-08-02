let windowManager;
let startEvent;
let checkMathJax = setInterval(function(){
    if (MathJax.tex2svgPromise){
        windowManager = new WindowManager()
        startEvent = new EventSelfDefined(windowManager)
        clearInterval(checkMathJax)
    }
}, 1000)
// console.log(MathJax);
// let windowManager = new WindowManager()

// let masterWindow = document.querySelector(".noteContainer")
// k = new CellManager(0, masterWindow)
// k.createNewCell()
// console.log(k)
