// CONTROLLERS 


function findPossibleTimetables() {
    let workingTimetable = new TimetableFinder();
    console.log("Starting: ", workingTimetable.getTimetables()); 
    for(let i = 0; i < window.perferences.length; i++) {
        applyPerferenceFunction(window.perferences[i].name, window.perferences[i].value, workingTimetable);
        console.log(window.perferences[i].name, workingTimetable.getTimetables());
    }
    /*
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
    */  

}

function applyPerferenceFunction(perferenceName, value, timetableFinder) { 
    switch(perferenceName) {
        case "setMaxDays":
            timetableFinder.setMaxDays(value);
            return timetableFinder;

        case "setMinDays":
            timetableFinder.setMinDays(value); 
            return timetableFinder;

        case "removeSpecificDays":
            timetableFinder.removeSpecificDays(value); 
            return timetableFinder;

        case "earliestTimeStart":
            timetableFinder.setEarliestTimeStart(value); 
            return timetableFinder;

        case "latestTimeEnd":
            timetableFinder.setLatestTimeEnd(value); 
            return timetableFinder;

        case "excludeTimeRange":
            timetableFinder.setExcludeTimeRange(value);
            return timetableFinder;

        case "onlyTimeRange":
            timetableFinder.setOnlyTimeRange(value);
            return timetableFinder;

        case "minBeforeBreak":
            timetableFinder.setMinBeforeBreak(value);
            return timetableFinder;

        case "maxBeforeBreak":
            timetableFinder.setMaxBeforeBreak(value);
            return timetableFinder;
        case "minBreak":
            timetableFinder.setMinBreak(value);
            return timetableFinder;
        case "maxBreak":
            timetableFinder.setMaxBreak(value);
            return timetableFinder;
        case "minTotalTime":
            timetableFinder.setMinTotalTime(value);
            return timetableFinder;

        case "maxTotalTime":
            timetableFinder.setMaxTotalTime(value);
            return timetableFinder;

    }
}





// BELOW THIS COMMENT IS THE MODEL, ABOVE IS THE CONTROLLER

class TimetableFinder {
    constructor() { 
        this.timetables = []; 
        this.classes = window.classes;

        this.investigateClass(0, new Timetable());
    }

    investigateClass(target, workingTimetable) {
        // Go through each of the first, if it fits then send the timetable with slot added to the next class
        var targetClass = this.classes[Object.keys(this.classes)[target]]; 
        for(let i = 0; i < targetClass.slots.length; i++) {
            //console.log(i + " of " + target + " with " + JSON.stringify(workingTimetable));
            var slot = targetClass["slots"][i];
            //console.log(i + " of " + target + " adding " + JSON.stringify(slot));
            var newTimetable = new Timetable(); 
            newTimetable.setContents([JSON.parse(JSON.stringify(workingTimetable)).days, JSON.parse(JSON.stringify(workingTimetable)).groups]);
            if(newTimetable.addTimeSlot(Object.keys(this.classes)[target], slot.day, slot.time, slot.duration )) {
                if(target === Object.keys(this.classes).length - 1) {
                    this.timetables.push(newTimetable);    
                } else {
                    this.investigateClass(target + 1,newTimetable); 
                }       
            }
        }
 
    }

    setMaxDays(maxDays) { 
        this.timetables = this.timetables.filter(function(value) {
            //console.log("Max days", Object.keys(value.days).length+" <= "+parseInt(maxDays), Object.keys(value.days).length <= parseInt(maxDays)); 
            return Object.keys(value.days).length <= parseInt(maxDays); 
        }); 
    }

    setMinDays(minDays) { 
        this.timetables = this.timetables.filter(function(value) {
            //console.log("Max days", Object.keys(value.days).length+" >= "+parseInt(minDays), Object.keys(value.days).length >= parseInt(minDays)); 
            return Object.keys(value.days).length >= parseInt(minDays); 
        }); 
    }

    removeSpecificDays(days) {
        this.timetables = this.timetables.filter(function(value) {
            for(let i = 0; i < days.length; i++) {
                //console.log("Specific days", value.days, days[i]); 
                if(value.days[days[i]] !== undefined) {
                    return false;
                }
            }
            return true; 
        }); 
    }

    setEarliestTimeStart(earliestTime) { 
        this.timetables = this.timetables.filter(function(value) {
            for(let day in value.days) {
                for(let i = 0; i < value.days[day].length; i++ ) { 
                    //console.log("Earliest start", value.days[day][i][0], earliestTime)
                    if(value.days[day][i][0] < earliestTime) {
                        return false; 
                    }
                }
            }
            return true; 
        }); 
    }

    setLatestTimeEnd(latestTime) {
        this.timetables = this.timetables.filter(function(value) {
            for(let day in value.days) {
                for(let i = 0; i < value.days[day].length; i++ ) { 
                    //console.log("Include range", value.days[day][i][0], latestTime)
                    if(value.days[day][i][0] > latestTime) {
                        return false; 
                    }
                }
            }
            return true;
        }); 
    }

    setExcludeTimeRange(range) {
        this.timetables = this.timetables.filter(function(value) {
            for(let day in value.days) {
                for(let i = 0; i < value.days[day].length; i++ ) { 
                    //console.log("Exclude range 1", value.days[day][i][0]+" >= "+range[0]+" && "+value.days[day][i][0]+" <= "+range[1], value.days[day][i][0] >= range[0], value.days[day][i][0] <= range[1])
                    if(value.days[day][i][0] >= range[0] && value.days[day][i][0] <= range[1]) {
                        //console.log("Exclude range 2", range[2]+" == "+true+" || "+value.days[day][i][1]+" <= "+range[1], range[2] == true, value.days[day][i][1] <= range[1])
                        if(range[2] == true || value.days[day][i][1] <= range[1] ) {
                            return false; 
                        }
                    }
                }
            }
            return true;
        }); 
    }

    setOnlyTimeRange(range) {
        this.timetables = this.timetables.filter(function(value) {
            for(let day in value.days) {
                for(let i = 0; i < value.days[day].length; i++ ) { 
                    //console.log("Include range 1:", value.days[day][i][1]+" < "+range[0]+" || "+value.days[day][i][0]+" > "+range[1],value.days[day][i][1] < range[0],value.days[day][i][0] > range[1]  );
                    if(value.days[day][i][1] < range[0] || value.days[day][i][0] >= range[1]) {
                        //console.log("Include range 2:", range[2]+" == "+false+" && "+ value.days[day][i][1]+" > "+range[1], range[2] == false, value.days[day][i][1] > range[1]);
                        if(range[2] == false &&  value.days[day][i][1] > range[1] ) {
                            return false; 
                        }
                    }
                }
            }
            return true;
        });  
    }

    setMinBeforeBreak(minBeforeBreak) {
        this.timetables = this.timetables.filter(function(value) {
            value.sortGroups();
            for(let key in value.groups) {
                for(let i = 0; i < value.groups[key].length - 1; i++) {
                    //console.log("Min before", value.groups[key][i][1]+" - "+value.groups[key][i][0]+" < "+minBeforeBreak, value.groups[key][i][1] - value.groups[key][i][0]+" < "+minBeforeBreak, value.groups[key][i][1] - value.groups[key][i][0] < minBeforeBreak); 
                    if(value.groups[key][i][1] - value.groups[key][i][0] < minBeforeBreak) {
                        return false; 
                    }
                }
            }
            return true; 
        });  
    }

    setMaxBeforeBreak(maxBeforeBreak) {
        this.timetables = this.timetables.filter(function(value) {
            value.sortGroups();
            for(let key in value.groups) {
                for(let i = 0; i < value.groups[key].length - 1; i++) {
                    //console.log("Max before", value.groups[key][i][1]+" - "+value.groups[key][i][0]+" > "+maxBeforeBreak, value.groups[key][i][1] - value.groups[key][i][0]+" > "+maxBeforeBreak, value.groups[key][i][1] - value.groups[key][i][0] > maxBeforeBreak); 
                    if(value.groups[key][i][1] - value.groups[key][i][0] > maxBeforeBreak) {
                        return false; 
                    }
                }
            }
            return true; 
        }); 
    }

    setMinBreak(minBreak) {
        this.timetables = this.timetables.filter(function(value) {
            value.sortGroups();
           for(let key in value.groups) {
               for(let i = 0; i < value.groups[key].length - 1; i++) { 
                   //console.log("Min break",value.groups[key][i + 1][0]+" - "+value.groups[key][i][1]+" < "+minBreak, value.groups[key][i + 1][0] - value.groups[key][i][1]+" < "+minBreak, value.groups[key][i + 1][0] - value.groups[key][i][1] < minBreak);
                   if(value.groups[key][i + 1][0] - value.groups[key][i][1] < minBreak) {
                       return false; 
                   }
               }
           }
           return true;  
       }); 
    }

    setMaxBreak(maxBreak) {
        this.timetables = this.timetables.filter(function(value) {
            value.sortGroups();
           for(let key in value.groups) {
               for(let i = 0; i < value.groups[key].length - 1; i++) { 
                //console.log("Max break", value.groups[key][i + 1][0]+" - "+value.groups[key][i][1]+" > "+maxBreak, value.groups[key][i + 1][0] - value.groups[key][i][1]+" > "+maxBreak, value.groups[key][i + 1][0] - value.groups[key][i][1] > maxBreak);
                   if(value.groups[key][i + 1][0] - value.groups[key][i][1] > maxBreak) {
                       return false; 
                   }
               }
           }
           return true;  
       }); 
    }

    setMinTotalTime(minTotalTime) { 
        this.timetables = this.timetables.filter(function(value) {
            for(let key in value.days) {
                let total = 0; 
                for(let i = 0; i < value.days[key].length; i++) {
                    total += value.days[key][i][1] - value.days[key][i][0]; 
                }
                //console.log("Min total time", total+" < "+minTotalTime, total < minTotalTime); 
                if(total < minTotalTime) {
                    return false; 
                }
            }
            return true; 
        });  
    }

    setMaxTotalTime(maxTotalTime) { 
        this.timetables = this.timetables.filter(function(value) {
            for(let key in value.days) {
                let total = 0; 
                for(let i = 0; i < value.days[key].length; i++) {
                    total += value.days[key][i][1] - value.days[key][i][0]; 
                }
                //console.log("Max total time",total+" > "+maxTotalTime, total > maxTotalTime);
                if(total > maxTotalTime) {
                    return false; 
                }
            }
            return true; 
        }); 
    }

    getTimetables() {
        return JSON.parse(JSON.stringify(this.timetables));
    }
}

class Timetable {
    constructor() {
        this.days = new Object();
        this.groups = new Object(); 
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
            this.days[day] = []
        }

        this.makeNewGroups(startTotal, timeTotal, day);
        this.days[day].push([startTotal, timeTotal, name]); 
        return true; 
        
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
        } else {
            this.sortGroups();
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
}