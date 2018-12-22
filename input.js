var classes = []; 

function toggleClassContents(classContainer) { 
    let contents = classContainer.querySelector(".classHideShowContents"); 
    contents.style.display = (contents.style.display === "block") ? "none":"block";
}

function classEntryKeyPress(e) { 
    var code = (e.keyCode ? e.keyCode : e.which);
    if(code == 13) {
        addClass(); 
        e.preventDefault(); 
    }
}

function timetableToObject(toChange) { 
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
    let classObject = timetableToObject(document.getElementById("classInput").value);
    let className =  document.getElementById("classNameInput").value; 
    classes.push(classObject); 
    if(className === null || className === "") {
        className = "Class " + classes.length; 
    }

    let table = classToTable(classObject); 
    let tableContainer = "<div class='classContainer'><div class='classHideShowHeader' onclick='toggleClassContents(this.parentElement)'>" ; 
    tableContainer += "<div id='className'>" + className +"</div><div id='instructionText'>Click to show more</div>"; 
    tableContainer += "</div><div class='classHideShowContents'>"; 
    tableContainer += table +"</div></div>"; 
    document.getElementById("classList").innerHTML = tableContainer + document.getElementById("classList").innerHTML; 

    document.getElementById("classInput").value = null; 
    document.getElementById("classNameInput").value = "";
}