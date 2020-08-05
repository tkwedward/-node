let windowManager;
let startEvent;
let checkMathJax = setInterval(function(){
    if (MathJax.tex2svgPromise){
        windowManager = new WindowManager()
        startEvent = new EventSelfDefined(windowManager)
        clearInterval(checkMathJax)

        
    }
}, 1000)
