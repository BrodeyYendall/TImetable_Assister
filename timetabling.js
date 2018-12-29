// CONTROLLERS 

function trimDayController() { 
    var day = document.getElementById("daySelect").value; 
    window.classes = trim(trimDay, window.classes, day)

    console.log("Classes trimmed of " + day + ", listing new class list:"); 
    console.log(window.classes); 
}

function trimBelowTimeController() { 
    var hour = parseInt(document.getElementById("trimBelowHour").value); 
    var minute = parseInt(document.getElementById("trimBelowMinute").value);
    window.classes = trim(trimBelowTime, window.classes, hour, minute)

    console.log("All classes with a time eariler then " + hour + ":" + minute + " trimmed, listing new class list:")
    console.log(window.classes); 
}

function trimAboveTimeController() { 
    var hour = parseInt(document.getElementById("trimAboveHour").value); 
    var minute = parseInt(document.getElementById("trimAboveMinute").value);
    window.classes = trim(trimAboveTime, window.classes, hour, minute)
    
    console.log("All classes with a time above " + hour + ":" + minute + " trimmed, listing new class list:")
    console.log(window.classes); 
}




// BELOW THIS COMMENT IS THE MODEL, ABOVE IS THE CONTROLLER

function trim(condition, classes, argument1, argument2) {
    for(let key in classes) {
        if(classes.hasOwnProperty(key)) {
            let slots = classes[key].slots;  
            for(let i = 0; i < slots.length; i++) {
                if(condition(slots[i],argument1, argument2)) {
                    slots.splice(i, 1);
                    i--; 
                }
            }
        }
    }
    return classes; 
}


function trimDay(slot, day) { 
    return day === slot["day"]; 
}


function trimBelowTime(slot, hour, minute) { 
    var classTime = slot.time.split(":"); 
    return ((parseInt(classTime[0]) < hour) || ((parseInt(classTime[0]) === hour) && parseInt(classTime[1]) < minute )); 
}

function trimAboveTime(slot, hour, minute) { 
    var classTime = slot.time.split(":"); 
    return ((parseInt(classTime[0])> hour) || ((parseInt(classTime[0]) === hour) && parseInt(classTime[1])> minute )); 
} 

