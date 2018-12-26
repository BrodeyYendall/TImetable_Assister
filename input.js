var classes = []; 
var classCount = 0; 

function toggleClassContents(classContainer) { 
    let contents = classContainer.querySelector(".classHideShowContents"); 

    let imageContainer = classContainer.querySelector(".classHideShowHeader").querySelector(".instructionTextWrapper"); 
    let image = imageContainer.getElementsByTagName("img")[0]; 

    if(contents.style.display === "block" || contents.style.display === "") { 
        contents.style.display = "none"
        image.style.transform = "scaleY(1)";
    } else { 
        contents.style.display = "block";
        image.style.transform = "scaleY(-1)";
    }
}

function classEntryKeyPress(e) { 
    var code = (e.keyCode ? e.keyCode : e.which);
    if(code == 13) {
        addClass(); 
        e.preventDefault(); 
    }
}

function timetableToSlots(toChange) { 
    let rows = toChange.split("\n"); 
    rows.splice(0, 1);
    for(i = 0; i < rows.length; i++) { 
        rows[i] = rows[i].split("\t");  
        if(rows[i][0] == "") {
            rows[i].splice(0,1); 
        }
        rows[i] = {day:rows[i][1].trim(), time:rows[i][2].trim(), location:rows[i][5].trim(), duration:rows[i][6].trim().substring(0,1)}; 
    }
    if(rows[0].day === "Day") { 
        rows.splice(0,1); 
    }
    return rows; 
}

function classToTable(classToConvert) { 
    let table = "<table class='classTable'><tr> <th>Day</th> <th>Time</th> <th>Location</th> <th>Duration</th> </tr>";
    for(i = 0; i < classToConvert.length; i++) { 
        table += "<tr> <td>" + classToConvert[i].day + "</td> <td>" + classToConvert[i].time + "</td> <td>" + classToConvert[i].location + "</td> <td>" + classToConvert[i].duration + "</td> </tr>" ;
    }


    table += "</table>";
    return table; 
} 

function addClass() { 
    let slots = timetableToSlots(document.getElementById("classInput").value);
    let className =  document.getElementById("classNameInput").value; 
    if(className === null || className === "") {
        className = "Class " + classCount; 
    }

    let colour = document.getElementById("classColourInput").value;
    let classObject = {colour:colour, slots: slots}

    classes[className] = classObject; 
    classCount += 1; 

    document.getElementById("classList").innerHTML = visualiseClass(classObject, className) + document.getElementById("classList").innerHTML; 
}

function visualiseClass(classObject, name) { 

    let colourSub = classObject["colour"].substring(1);  // Removes the # at the start 
    let r = parseInt(colourSub.substring(0,2), 16);
    let g = parseInt(colourSub.substring(2,4), 16);
    let b = parseInt(colourSub.substring(4,6), 16);

    let luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // Calculate the "brightness" (luma) of the colour with luma coefficents https://en.wikipedia.org/wiki/Rec._709#Luma_coefficients

    let fontColour; 
    let image; 
    if(luma < 180) {    
        fontColour = "white";
        image = "arrowLight.png"
    } else {
        fontColour = "#636363"; // Colour used for black text, causes the text to appear more warm  
        image = "arrowDark.png"
    }

    let table = classToTable(classObject["slots"]); 

    let classHeaderStyle = "background-color:" + classObject["colour"] +  ";border-color: rgb(" + (r - 20) + "," + (g - 20) + "," + (b - 20) + "); display:block;"
    let classContentStyle = "background-color: rgba(" +  r + "," + g+ "," + b + "," + (0.2) + ")" +  ";border-color: rgb(" + (r - 20) + "," + (g - 20) + "," + (b - 20) + ")";

    return "\
    <div class='classContainer'>\
        <div class='classHideShowHeader' onclick='toggleClassContents(this.parentElement)' style='" + classHeaderStyle + "'>\
            <div class='className' style='color: " + fontColour + "'>" + name +"</div>\
            <div class='instructionTextWrapper'>\
                <span class='instructionText' style='color: " + fontColour + "'>Click to show more </span><img src='media/" + image + "'/>\
            </div>\
        </div>\
        <div class='classHideShowContents' style='" + classContentStyle + "'>\
            " + table + "\
        </div>\
    </div>";
}


function listTest() {
    var list = [1,2,{test: true, real:"yes"}]; 
    let object1 = {test: true, real:"yes"}; 
    let object2 = {test: true, real:"no"}; 
    let found = list.find(function(element) {
        return compareObjects(element, object1); 
    });
    console.log(found);
    if(compareObjects(object1, object2)) {
        console.log("found");
    } else {
        console.log("not found"); 
    }
}

function compareObjects(object1, object2) {; 
    if(JSON.stringify(object1) === JSON.stringify(object2) ) {
        return true;
    } else {
        return false; 
    }
}

