var classes = new Object(); 
var classCount = 0; 
var originalName = ""; 
const defaultColours = ["#ea7869", "#ec9c62", "#66bef9", "#c18eff", "#47c512", "#db3720", "#ce661a", "#097cca", "#821cff", "#80ef51"]; 
var colourCount = 1; 


function toggleClassContents(event) { 
    let eventTarget = event["target"];
    if(!eventTarget.matches(".classColourChange, .classNameChange")) {
        let classContainer = eventTarget.parentElement.parentElement;
        if(eventTarget.className === "classHideShowHeader") {
            classContainer = eventTarget.parentElement; 
        } else if(eventTarget.className === "instructionText" || eventTarget.nodeName === "IMG") {
            classContainer = classContainer.parentElement;
        }
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
    let className =  document.getElementById("classNameInput").value; 
    if(classes[className] === undefined) {
        let slots = timetableToSlots(document.getElementById("classInput").value);
        while(classes[className] !== undefined || className === null || className === "") {
            className = "Class " + classCount; 
            classCount += 1; 
            console.log(className);
        }
    
        let colour = document.getElementById("classColourInput").value;
        let classObject = {colour:colour, slots: slots}
    
        classes[className] = classObject; 
    
        let classList = document.getElementById("classList");
        let visualisedClass = visualiseClass(classObject, className); 
    
        classList.insertBefore(visualisedClass, classList.childNodes[0]); 
    
        visualisedClass.querySelector(".classHideShowHeader").addEventListener("click", toggleClassContents);

        document.getElementById("classNameInput").value = ""; 
        document.getElementById("classInput").value = ""; 
        document.getElementById("classColourInput").value = defaultColours[colourCount % defaultColours.length]; // The modulus operation means that the colours will continuously loop 
        colourCount++; 
    } else {
        alert("Name is already in use");
    }
}

function visualiseClass(classObject, name) { 
    name = escapeHTML(name); 

    let rgb = getRGB(classObject["colour"]); 
    let luma = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]; // Calculate the "brightness" (luma) of the colour with luma coefficents https://en.wikipedia.org/wiki/Rec._709#Luma_coefficients
    let borderColour = "rgb(" + (rgb[0] - 40) + "," + (rgb[1] - 40) + "," + (rgb[2] - 40) + ")"; 


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

    let classHeaderStyle = "background-color:" + classObject["colour"] +  ";border-color: " + borderColour + ";";
    let classNameChangeStyle = "color: " + fontColour + ";background-color: " + classObject["colour"] + ";"; 
    let classContentStyle = "background-color: rgba(" +  rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + (0.2) + ")" +  ";border-color: " + borderColour + ";";

    let visualisedOjbect = document.createElement("div");
    visualisedOjbect.className = "classContainer";   
    visualisedOjbect.innerHTML = "\
    <div class='classHideShowHeader' style='" + classHeaderStyle + "'>\
        <input class='classNameChange' style='" + classNameChangeStyle + "' type='text' maxlength='30' value='" + name + "' onfocus='getOriginalName(this);' onchange='changeName(this);'>\
        <input type='color' class='classColourChange' onchange='changeClassColour(this.parentElement, this);' value='" + classObject["colour"] + "' style='border-color:"+fontColour +";'>\
        <div class='instructionTextWrapper'>\
            <span class='instructionText' style='color: " + fontColour + "'>Click to show more </span><img src='media/" + image + "'/>\
        </div>\
    </div>\
    <img class='removeButton' src='media/remove.png' onclick='removeObject(this.parentElement);'/>\
    <div class='classHideShowContents' style='" + classContentStyle + "'>\
        " + table + "\
    </div>"; 
    return visualisedOjbect; 
}

function removeObject(classContainer) {
    let className = classContainer.querySelector(".classHideShowHeader").querySelector(".classNameChange").value;
    delete classes[className]; 
    document.getElementById("classList").removeChild(classContainer);
}

function changeClassColour(classHeader, newColour) { 
    let className = classHeader.querySelector(".classNameChange"); 
    classes[className.value].colour = newColour.value; 

    let rgb = getRGB(newColour.value); 
    let luma = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]; // Calculate the "brightness" (luma) of the colour with luma coefficents https://en.wikipedia.org/wiki/Rec._709#Luma_coefficients
    let borderColour = "rgb(" + (rgb[0] - 40) + "," + (rgb[1] - 40) + "," + (rgb[2] - 40) + ")"; 

    let fontColour; 
    let image; 
    if(luma < 180) {    
        fontColour = "white";
        image = "arrowLight.png"
    } else {
        fontColour = "#636363"; // Colour used for black text, causes the text to appear more warm  
        image = "arrowDark.png"
    }

    newColour.style.borderColor = fontColour;

    classHeader.style.borderColor = borderColour;
    classHeader.style.backgroundColor = newColour.value;

    let classNameChange = classHeader.querySelector(".classNameChange"); 
    classNameChange.style.backgroundColor = newColour.value;
    classNameChange.style.color = fontColour; 

    let instructionTextWrapper = classHeader.querySelector(".instructionTextWrapper"); 
    instructionTextWrapper.querySelector(".instructionText").style.color = fontColour; 
    instructionTextWrapper.getElementsByTagName("img")[0].src = "media/" + image; 
    
    classHeader.parentElement.querySelector(".classHideShowContents").style = "background-color: rgba(" +  rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + (0.2) + ")" +  ";border-color: " + borderColour + ";";
}

function getRGB(colour) {
    rgb = []
    if(colour.charAt(0) === "#") { 
        colour = colour.substring(1);  // Removes the # at the start
    }
     
    rgb.push(parseInt(colour.substring(0,2), 16));
    rgb.push(parseInt(colour.substring(2,4), 16));
    rgb.push(parseInt(colour.substring(4,6), 16));
    return rgb; 
}

function compareObjects(object1, object2) {; 
    if(JSON.stringify(object1) === JSON.stringify(object2) ) {
        return true;
    } else {
        return false; 
    }
}

function getOriginalName(nameContainer) {
    originalName = nameContainer.value; 
}

function changeName(nameContainer) {
    if(classes[nameContainer.value] === undefined) { 
        let classbject = classes[originalName];
        delete classes[originalName]; 
        classes[nameContainer.value] = classbject;
    } else {
        alert("Couldn't change name. The new name was already in use");
        nameContainer.value = originalName; 
    }

}

function escapeHTML(string) { // https://stackoverflow.com/questions/6234773/can-i-escape-html-special-chars-in-javascript
    return string.replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
