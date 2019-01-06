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

// TRIMMING. A trimming method is a method that can remove time slots based on simplistic conditions. I.E a method that doesn't require the construction of a timetable
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



function findPossibleTimetables() {
    let maxDays = parseInt(document.getElementById("maxDays").value);
    let maxBeforeBreak = parseInt(document.getElementById("maxHoursBeforeBreak").value);
    let minBreak = parseInt(document.getElementById("minBreakLength").value);
    let maxHours = parseInt(document.getElementById("minBreakLength").value);

    let timetableFinder = new TimetableFinder(maxDays, maxBeforeBreak, minBreak, maxHours, function(timetable) {
        let minDays =  document.getElementById("minDays").value;
        let minHoursBeforeBreak = document.getElementById("minHoursBeforeBreak").value;
        let maxBreak = document.getElementById("maxBreakLength").value;
        let minHours = document.getElementById("minHours").value;

        if(!timetable.fitsMinDays(minDays)) { console.log("Min days"); return false; }
        if(!timetable.fitsMinBeforeBreak(minHoursBeforeBreak)) { console.log("Min b4 break"); return false; }
        if(!timetable.fitsMaxBreakLength(maxBreak)) {console.log("Max break"); return false; }
        if(!timetable.isBelowMinHours(minHours)) {console.log("Min hour"); return false; }

        return true; 
    });
    console.log(timetableFinder.getTimetables()); 

}


class TimetableFinder {
    constructor(maxDays, maxBeforeBreak, minBreak, maxHours, timetableValidation) { 
        this.timetables = []; 
        this.classes = window.classes; 

        this.maxDays = maxDays;
        this.maxBeforeBreak = maxBeforeBreak;
        this.minBreak = minBreak;
        this.maxHours = maxHours;
        this.timetableValidation = timetableValidation;

        this.investigateClass(0, this.createEmptyTimetable());
    }

    investigateClass(target, workingTimetable) {
        // Go through each of the first, if it fits then send the timetable with slot added to the next class
        var targetClass = this.classes[Object.keys(this.classes)[target]]; 
        for(let i = 0; i < targetClass.slots.length; i++) {
            //console.log(i + " of " + target + " with " + JSON.stringify(workingTimetable));
            var slot = targetClass["slots"][i];
            //console.log(i + " of " + target + " adding " + JSON.stringify(slot));
            var newTimetable = this.createEmptyTimetable(); 
            newTimetable.setContents([JSON.parse(JSON.stringify(workingTimetable)).days, JSON.parse(JSON.stringify(workingTimetable)).groups]);
            if(newTimetable.addTimeSlot(Object.keys(this.classes)[target], slot.day, slot.time, slot.duration )) {
                if(target === Object.keys(this.classes).length - 1) {
                    if(this.timetableValidation(newTimetable)) {
                        this.timetables.push(newTimetable);
                    }      
                } else {
                    this.investigateClass(target + 1,newTimetable); 
                }       
            }
        }
 
    }

    getTimetables() {
        return JSON.parse(JSON.stringify(this.timetables));
    }

    createEmptyTimetable() {
        return new Timetable(this.maxDays, this.maxBeforeBreak, this.minBreak, this.maxHours); 
    }
}

class Timetable {
    constructor(maxDays, maxBeforeBreak, minBreak, maxHours) {
        this.days = new Object();
        this.groups = new Object(); 

        this.maxDays = maxDays;
        this.maxBeforeBreak = maxBeforeBreak;
        this.minBreak = minBreak;
        this.maxHours = maxHours;
    }

    addTimeSlot(name, day, start, duration) {
        let startSplit = start.split(":");
        let startTotal = (parseInt(startSplit[0]) * 60) + parseInt(startSplit[1]) ; 
        let timeTotal = startTotal + (duration * 60); 
        if(this.days[day] !== undefined) {
            for(let i = 0; i < this.days[day].length; i++) {
                let slot = this.days[day][i];
                // Check all conditions where the the new slot slot might overlap with the existing slot
                // Start at same time as slot || Start before slot but finish after slot start. I.E finish in the middle of the slot || Starting in the middle of slot
                if((startTotal === slot[0]) || (startTotal < slot[0] && timeTotal > slot[0]) || (startTotal > slot[0] && startTotal < slot[1])) {
                    return false; 
                }
            }
        } else {
            if(Object.keys(this.days).length >= this.maxDays) {
                return false; // Adding this time slot will result in going over the max days 
            }
            this.days[day] = []
        }

        this.makeNewGroups(startTotal, timeTotal,day);
        if(!this.fitsMaxBeforeBreak() || this.isAboveMaxHours()) {
            return false; 
        }

        if(!this.evaluateBreaks(function(breakValues, minBreak) {
            return (breakValues[1] - breakValues[0] > minBreak);
        }, this.minBreak)) {
            return false;
        }

        this.days[day].push([startTotal, timeTotal, name]); 
        return true; 
        
    }

    fitsMinDays(minDays) {
        return (Object.keys(this.days).length >= minDays);
    }


    makeNewGroups(startTotal, timeTotal, day) {
        // A class followed immediately by another class is called a group. The following finds any groups in the slots 
        // If the new slot is a part of two different groups then those two slots become one
        let newGroup = -1; 
        if(this.groups[day] === undefined) {
            this.groups[day] = []; 
            this.groups[day].push([startTotal, timeTotal]);
            return; 
        }
        for(let i = 0; i < this.groups[day].length; i++) {
            if(this.groups[day][i][0] === timeTotal || this.groups[day][i][1] === startTotal) { // If the new slot fits in a group 
                if(newGroup !== -1) { // The new slot has already put into a group. Merge the two groups. 
                    if(this.groups[day][newGroup][0] === this.groups[day][i][1]) { 
                        this.groups[day][i][1] = this.groups[day][newGroup][1]
                    } else {
                        this.groups[day][i][0] = this.groups[day][newGroup][0]
                    }
                    this.groups[day].splice(this.groups[day].indexOf(newGroup), 1);
                } else {
                    newGroup = i; // Store the group the new slot joined with. 
                    if(this.groups[day][i][0] === timeTotal) {
                        this.groups[day][i][0] = startTotal;
                    } else { 
                        this.groups[day][i][1] = timeTotal; 
                    }
                }   
            } 
        }
        if(newGroup === -1) { // DIdn't join any groups
            this.groups[day].push([startTotal, timeTotal]);
        }
        
    }


    fitsMaxBeforeBreak() {
        for(let key in this.groups) {
            for(let j = 0; j < this.groups[key].length; j++) {
                //console.log(this.groups[key][j][1] - this.groups[key][j][0] +" > "+this.maxBeforeBreak)
                
                if(this.groups[key][j][1] - this.groups[key][j][0] > this.maxBeforeBreak) {
                    return false; 
                }
            }
        }
        
        return true; 
    }

    fitsMinBeforeBreak(minBeforeBreak) {
        for(let key in this.groups) {
            for(let j = 0; j < this.groups[key].length; j++) {
                //console.log(this.groups[key][j][1] - this.groups[key][j][0] +" > "+this.maxBeforeBreak)
                if(this.groups[key][j][1] - this.groups[key][j][0] < minBeforeBreak) {
                    return false; 
                }
            }
        }
        
        return true; 
    }

    isBelowMinHours(minHours) {
        for(let day in this.days) {
            if(this.calculateDayTotal(day) >= minHours) {
                return false;  
            }
        }
        return true; 
    }

    isAboveMaxHours() { 
        for(let day in this.days) {
            if(this.calculateDayTotal(day) > this.maxHours) {
                return true; 
            }
        }
        return false;
    }

    calculateDayTotal(day) {
        let dayTotal = 0; 
        for(let i = 0; i < this.days[day].length; i++) {
            dayTotal += this.days[day][1] - this.days[day][0];
        }
        return dayTotal;
    }


    evaluateBreaks(evulation, argument) { 
        this.sortGroups(); 
        for(let day in this.groups) {
            if(this.groups[day].length > 1) {
                for(let i = 0; i < this.groups[day].length - 1; i++) {
                    if(!evulation([this.groups[day][i][1], this.groups[day][i+1][0]], argument)) {
                        return false; 
                    } 
                }
            }
        }
        return true; 
    }

    fitsMaxBreakLength(maxBreakLength) {
        let result = this.evaluateBreaks(function(breakValues, maxBreakLength) {
            return (breakValues[1] - breakValues[0] < maxBreakLength);
        }, maxBreakLength); 
        if(!result) {
            return false;
        } else { 
            return true; 
        }
    }

    sortGroups() { 
        for(let day in this.groups) {
            this.groups[day] = this.groups[day].sort(function(a,b) {
                return a[0] - b[0];
            })
        }
    }

    getContents() { 
        return [this.days, this.groups]; 
    }

    setContents(value) {
        this.days = value[0];
        this.groups = value[1]; 
    }

    print() {
        console.log(JSON.parse(JSON.stringify(this.days)));
    }

        /*
    removeTimeSlot(name, day, start, duration) { 
        let startSplit = start.split(":");
        let startTotal = (parseInt(startSplit[0]) * 60) + parseInt(startSplit[1]) ; 
        let timeTotal = startTotal + (duration * 60); 
        this.days[day] = this.days[day].filter(function(value) {
            if(value[0] === startTotal && value[1] === timeTotal && value[2] === name) {
                return false; 
            } else {
                return true; 
            }
        }); 
    }*/ 
}