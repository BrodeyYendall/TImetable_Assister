
var classes = []; 

// TIMETABLE INPUT


function timetableToObject(toChange) { 
    let rows = toChange.split("\n"); 
    for(i = 0; i < rows.length; i++) { 
        rows[i] = rows[i].split("\t");  
        rows[i] = {day:rows[i][1].trim(), time:rows[i][2].trim(), location:rows[i][5].trim(), duration:rows[i][6].trim().substring(0,1)}; 
    }
    if(rows[0].day === "Day") { 
        rows.splice(0,1); 
    }
    return rows; 
}

function addClass() { 
    let inputTextArea = document.getElementById("input"); 
    let classToAdd = timetableToObject(inputTextArea.value); 
    classes.push(classToAdd); 
    classToTable(classToAdd); 
    //inputTextArea.value = ""
    console.log(classes); 
}

function classToTable(classToConvert) { 
    table = "<table><tr> <th>Day</th> <th>Time</th> <th>Location</th> <th>Duration</th> </tr>";
    for(i = 0; i < classToConvert.length; i++) { 
        table += "<tr> <td>" + classToConvert[i].day + "</td> <td>" + classToConvert[i].time + "</td> <td>" + classToConvert[i].location + "</td> <td>" + classToConvert[i].duration + "</td> </tr>" ;
    }


    table += "</table>";
    document.getElementById("test").innerHTML = table; 

}

// CONTROLLERS 

function trimDayController() { 
    var day = document.getElementById("daySelect").value; 
    for(i =0; i < classes.length; i++) {
        classes[i] = trimDay(classes[i], day); 
    }

    console.log("Classes trimmed of " + day + ", listing new class list:"); 
    console.log(classes); 
    classToTable(classes[0]); 
}

function trimBelowTimeController() { 
    var hour = document.getElementById("trimBelowHour").value; 
    var minute = document.getElementById("trimBelowMinute").value;
    for(i =0; i < classes.length; i++) {
        classes[i] = trimBelowTime(classes[i], hour, minute); 
    }
    console.log("All classes with a time eariler then " + hour + ":" + minute + " trimmed, listing new class list:")
    console.log(classes); 
    classToTable(classes[0]); 
}

function trimAboveTimeController() { 
    var hour = document.getElementById("trimAboveHour").value; 
    var minute = document.getElementById("trimAboveMinute").value;
    for(i =0; i < classes.length; i++) {
        classes[i] = trimAboveTime(classes[i], hour, minute); 
    }
    console.log("All classes with a time after " + hour + ":" + minute + " trimmed, listing new class list:")
    console.log(classes); 
    classToTable(classes[0]); 
}




// BELOW THIS COMMENT IS THE MODEL, ABOVE IS THE CONTROLLER



function trimDay(classes, day) { 
    for(i = 0; i < classes.length; i++) {
        if(day == classes[i].day) {
            classes.splice(i, 1);
            i--; 
        }
    }
    return classes; 
}


function trimBelowTime(classes, hour, minute) { 
    for(i = 0; i < classes.length; i++) {
        var classTime = classes[i].time.split(":"); 
        if((parseInt(classTime[0]) < hour) || ((parseInt(classTime[0]) === hour) && parseInt(classTime[1]) < minute )) {
            classes.splice(i, 1);
            i--; 
        }
    }
    return classes; 
}

function trimAboveTime(classes, hour, minute) { 
    for(i = 0; i < classes.length; i++) {
        var classTime = classes[i].time.split(":"); 
        if((parseInt(classTime[0])> hour) || ((parseInt(classTime[0]) === hour) && parseInt(classTime[1])> minute )) { 
            classes.splice(i, 1);
            i--; 
        }
    }
    return classes; 
}