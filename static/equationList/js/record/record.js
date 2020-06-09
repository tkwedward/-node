

var width = 300;
var height = 300;
var thickness = 40;
var duration = 750;
var padding = 10;
var opacity = .8;
var opacityHover = 1;
var otherOpacityOnHover = .8;
var tooltipMargin = 13;
var radius = Math.min(width-padding, height-padding) / 2;
var color = d3.scaleOrdinal(d3.schemeCategory10);

var svg = d3.select("svg")
            .attr('class', 'pie')



// to convert time string into hh and mm
let convertToTime = function(timeString, dateString){
    let hour = timeString.slice(0, timeString.length-2)
    let min = timeString.slice(timeString.length-2, timeString.length)
    if (hour.length==1){
        hour = "0" + hour
    }

    let dateStringArray = dateString.split("/")
    let placeholder = ""
    placeholder = dateStringArray[0]
    dateStringArray[0] = dateStringArray[1]
    dateStringArray[1] = placeholder
    dateString = dateStringArray.join(" ")

    let formatedTime = hour + ":" + min + ":"+ "00"
    let formatedTimeResult = new Date(dateString + " " + formatedTime)
    return formatedTimeResult
}

// to send ajax request
function ajaxSendJson(url, data, todo, msg, callback){
    var xhr = new XMLHttpRequest();
    data["todo"] = todo
    xhr.open("POST", url, true);
    xhr.setRequestHeader("X-CSRFToken", csrf_token);
    xhr.onreadystatechange =  async function() { // Call a function when the state changes.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            console.log("..........*******");
            console.log(msg);
            // console.log(xhr.response);
            result = await xhr.response

            if (callback){
                callback(result)
            }
            return  result

        }
    }
    xhr.send(JSON.stringify(data));
}

let recordResult = document.querySelector(".recordResult")

let moneyResult =  document.querySelector(".moneyResult")
let recordInput =   document.querySelector(".recordInput")
let pieChartData;
let timeInputArray;
let moneyInputArray;
let currentDate = ""
let valueData = "11/10/2019\n820 surfing\n830 routine, brush\n845 routine, eating\n900 transit\n950 study, lecture\n1055 study, javascript\n1150 study, lecture\n1330 study, javascript\n1645 study, lab\n1700 transit\n1710 walk\n1800 study, lecture, mat 127A\n1820 routine, toilet\n1835 transit, home\n1845 routine, cooking\n1850 routine, 剪指甲"
recordInput.value = valueData


// when input data in the field, update the data

recordInput.addEventListener("input", function(){
    let textInputArray = event.target.value.split("\n")
    let timeResult =  document.querySelector(".timeResult")
    timeInputArray = []
    moneyInputArray = []
    console.log(timeResult);
    timeResult.innerText = ""

    pieChartData = {
        "totalTime": 24*3600,
        "sumTime": 0,
        "categories": new Set(),
        "classifiedData": {}
    }

    let datePattern = new RegExp("\\d+/\\d+/\\d{4}")

    textInputArray.forEach(p=>{
        if (p.startsWith("$")){
            moneyInputArray.push(p)
        } else if (p.match(datePattern)){
            currentDate = p

        } else if (p.length>0){
            // 將每個 item 都 split 開, 然後取得時間和 event
            let splitItem = p.split(" ")
            let time = splitItem.shift()
            let dateTime = convertToTime(time, currentDate)

            let eventAndCategory = splitItem.join(" ").split(", ")
            let _category = eventAndCategory[0]
            let _event = eventAndCategory[1]

            // put objects into the timeInputArray so that we can create a

            timeInputArray.push({"category": _category, "event": _event, "dateTime": dateTime})
        }
    })// forEach

    // find out time difference of each term, and then find out the categories for the pieChartData
    timeInputArray.forEach((p, i)=>{
        if (i>0){
            let firstItemTime = timeInputArray[i-1]["dateTime"]
            let currentItemTime = p["dateTime"]

            let timeDifference = currentItemTime - firstItemTime
            p["timeDifference"] = timeDifference/1000
            pieChartData["categories"].add(p["category"])
            pieChartData["classifiedData"][p["category"]] = 0
        }
    })// forEach timeInputArray

    // put items into the output div and then plot the pie chart

    let timeSum = 0
    let dateItem = document.createElement("div")
    dateItem.classList.add("dateItem")
    dateItem.innerHTML = currentDate
    timeResult.append(dateItem)

    function convertSecondToHourAndMinute(seconds){
        let hh = Math.floor(seconds / 60 / 60);
        seconds -= hh  * 60 * 60;
        let mm = Math.floor(seconds / 60);
        return {hh, mm}
    }

    timeInputArray.slice(1,timeInputArray.length)
    .forEach(p=>{
        // to create item in the result
        let timeDifference = p["timeDifference"]
        timeSum+= timeDifference
        let {hh, mm} = convertSecondToHourAndMinute(timeDifference)



        let timeItem = document.createElement("div")
        timeItem.classList.add("timeItem")
        timeItem.innerHTML = p["category"] + " " + "\t" + hh + " hour, " + mm + " minutes"
        timeResult.append(timeItem)

        // add time to the categories
    })


    let totalTime = convertSecondToHourAndMinute(timeSum)
    let total_hh = totalTime["hh"]
    let total_mm = totalTime["mm"]

    console.log(convertSecondToHourAndMinute(timeSum));
    let timeItem = document.createElement("div")
    timeItem.classList.add("totalTime")
    timeItem.innerHTML = "The total time is " + " " + "\t" + total_hh + " hour, " + total_mm + " minutes"
    timeResult.append(timeItem)

    console.log(timeInputArray);

    // sum up all the time in the pieChartData and plot the pie chart
    let sumTime = 0
    // Object.entries(pieChartData["classifiedData"]).forEach(p=>{
    //
    // })
    timeInputArray.forEach(item=>{
        if (item["timeDifference"]){
            pieChartData["classifiedData"][item["category"]]+=item["timeDifference"]
            pieChartData["sumTime"] += item["timeDifference"]
        }
    })
    console.log(sumTime);
    let data = Object.entries(pieChartData["classifiedData"])
                     .map(p=>{
                        return {name:p[0], value:p[1]}
                     })
    change(data);



})// add eventListener

function change(data){
    svg.selectAll("g").remove()
    d3.select(".legend").remove()
    var g = svg.append('g')
               .attr('transform', 'translate(' + (width/2) + ',' + (height/2) + ')');

    var arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

    var pie = d3.pie()
    .value(function(d) { return d.value; })
    .sort(null);

    var path = g.selectAll('path')
      .data(pie(data))
      .enter()
      .append("g")
      .append('path')
      .attr('d', arc)
      .attr('fill', (d,i) => color(i))
      .style('opacity', opacity)
      .style('stroke', 'white')



     let legend = d3.select(".pieChart").append('div')
     			.attr('class', 'legend')
     			.style('margin-top', '30px');

     let keys = legend.selectAll('.key')
     			.data(data)
     			.enter().append('div')
     			.attr('class', 'key')
     			.style('display', 'flex')
     			.style('align-items', 'center')
     			.style('margin-right', '20px');

     		keys.append('div')
     			.attr('class', 'symbol')
     			.style('height', '10px')
     			.style('width', '10px')
     			.style('margin', '5px 5px')
     			.style('background-color', (d, i) => color(i));

     		keys.append('div')
     			.attr('class', 'name')
     			.text(d => {
                    let hh = Math.floor(d.value / 60 / 60);
                    d.value -= hh  * 60 * 60;
                    let mm = Math.floor(d.value / 60);

                    return `${d.name} (${hh} hour ${mm} min)`
                });

     		keys.exit().remove();
}


let saveButton = document.querySelector(".saveButton")
saveButton.addEventListener("click", function(){

    let recordInput = document.querySelector(".recordInput")
    let diaryInput = document.querySelector(".diaryInput")
    let toDoList = document.querySelector(".toDoList")
    let result = {
        currentDate: currentDate,
        data:{
            pieChartData: pieChartData,
            timeInputArray: timeInputArray,
            moneyInputArray: moneyInputArray,
            diaryInput: diaryInput.value,
            toDoList: toDoList.value
        },
        todo: "save record"
    }

    console.log(result);
    ajaxSendJson(url, result, "save record")

})

let changeEvent = new Event("input")
recordInput.dispatchEvent(changeEvent)
