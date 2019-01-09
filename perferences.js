window.perferences = [
    {name:"setMaxDays", value:7}, 
    {name:"setMinDays", value:0},
    {name:"removeSpecificDays", value:[]},
    {name:"earliestTimeStart", value:0},
    {name:"latestTimeEnd", value:1700},
    {name:"excludeTimeRange", value:[0, 0, true]},
    {name:"onlyTimeRange", value:[0, 1439, true]},
    {name:"minBeforeBreak", value:0},
    {name:"maxBeforeBreak", value:1440},
    {name:"minBreak", value:0},
    {name:"maxBreak", value:1440},
    {name:"minTotalTime", value:0},
    {name:"maxTotalTime", value:1440}
]; 

function manageButtonSeries(button) { 
    let perferenceNumber =  Array.prototype.slice.call(document.getElementById("perferenceList").children).indexOf(findPerferenceContainer(button));
    let children = Array.prototype.slice.call(button.parentElement.children);
    let newValue = children.indexOf(button); 

    
    children[window.perferences[perferenceNumber].value].className = "";
    children[newValue].className = "clicked";
    window.perferences[perferenceNumber].value = newValue;
    console.log(window.perferences);
}

function manageMultiDaySeries(button) { 
    let perferenceNumber =  Array.prototype.slice.call(document.getElementById("perferenceList").children).indexOf(findPerferenceContainer(button));
    let children = Array.prototype.slice.call(button.parentElement.children);
    let newValue = children.indexOf(button); 

    if(children[newValue].className === "clicked") {
        let locationOfValue = window.perferences[perferenceNumber].value.indexOf(newValue);
        window.perferences[perferenceNumber].value.splice(locationOfValue, 1);
        children[newValue].className = "";
    } else { 
        children[newValue].className = "clicked";
        window.perferences[perferenceNumber].value.push(newValue);
    }
    console.log(window.perferences);
}

function convertToMinutes(time) {
    let timeSplit = time.split(":");
    return parseInt(timeSplit[0]) * 60 + parseInt(timeSplit[1]);
}

function manageTimeInput(input) { 
    let perferenceNumber =  Array.prototype.slice.call(document.getElementById("perferenceList").children).indexOf(findPerferenceContainer(input));
    let timeSplit = input.value.split(":");
    window.perferences[perferenceNumber].value = this.convertToMinutes(input.value);
    console.log(window.perferences);
}

function manageTimeRange(input) {
    let perferenceNumber =  Array.prototype.slice.call(document.getElementById("perferenceList").children).indexOf(findPerferenceContainer(input));
    let startingValue = this.convertToMinutes(input.parentElement.children.item(2).value);
    let endingValue = this.convertToMinutes(input.parentElement.children.item(4).value);

    if(startingValue <= endingValue) {
        input.parentElement.children.item(2).style.borderColor = "white";
        input.parentElement.children.item(4).style.borderColor = "white";
        input.parentElement.children.item(5).style.display = "none";

        window.perferences[perferenceNumber].value[0] = startingValue;
        window.perferences[perferenceNumber].value[1] = endingValue;
    } else {
        input.parentElement.children.item(2).style.borderColor = "red";
        input.parentElement.children.item(4).style.borderColor = "red";
        input.parentElement.children.item(5).style.display = "block";
    }
    
    console.log(window.perferences);
}

function manageTimeRangeCheckbox(checkbox) {
    let perferenceNumber =  Array.prototype.slice.call(document.getElementById("perferenceList").children).indexOf(findPerferenceContainer(checkbox));
    window.perferences[perferenceNumber].value[2] = checkbox.checked;
    console.log(window.perferences);
}

function manageHourMinuteInput(input) {
    let hours = input.parentElement.parentElement.children[2].children[1];
    let minutes = input.parentElement.parentElement.children[3].children[1];

    if(parseInt(hours.value) > 24) {
        hours.value = 24; 
    }

    if(minutes.value === "" || minutes.value) {
        minutes.value = 0; 
    } else { 
        if(parseInt(minutes.value) > 60) {
        minutes.value = 60;
        }

        if(parseInt(minutes.value) % 15 !== 0) {
            minutes.value = Math.round(parseInt(minutes.value) / 15) * 15;
        }

        if(parseInt(minutes.value) === 60 && parseInt(hours.value) !== 24) {
            minutes.value = 0;
            hours.value++; 
        }
    }

    
    let timeTotal = parseInt(minutes.value) + (parseInt(hours.value) * 60);
    let perferenceNumber =  Array.prototype.slice.call(document.getElementById("perferenceList").children).indexOf(findPerferenceContainer(input));
    window.perferences[perferenceNumber].value = timeTotal;
    console.log(window.perferences);
} 

function findPerferenceContainer(start) {
    let parent = start;
    do { 
        parent = parent.parentElement;
    } while (!parent.className.includes("perferenceContainer"));
    return parent;
}
