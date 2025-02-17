let testDiv = document.getElementById("testDiv");
let degreeSelectionBox = document.getElementById("degreesChoice");
let classSelectionBox = document.getElementById("classChoice");
let degreesList = document.getElementById("degrees");
let classesList = document.getElementById("classes");
let tableColumns = document.getElementsByClassName("row");
let semesterOneRow = document.getElementsByClassName("row")[1];

let degreeSearchButton = document.getElementById("degreeButton");
let classSearchButton = document.getElementById("classButton");

let classData;
let degreeData;
let classBoxIdCounter = 0;

classSearchButton.addEventListener("click", () => createClassBox(classSelectionBox.value, 1));
degreeSearchButton.addEventListener("click", () => createDegreeTemplate(degreeSelectionBox.value));
for (let i = 0; i < tableColumns.length; i++) {
    tableColumns[i].addEventListener("dragover", (dragBox) => {
        dragBox.preventDefault();
        dragBox.dataTransfer.dropEffect = "move";
    });
    tableColumns[i].addEventListener("drop", (dragBox) => {
        dragBox.preventDefault();
        const data = dragBox.dataTransfer.getData("text");
        tableColumns[i].appendChild(document.getElementById(data));
    });
}


getClasses();
getDegrees();

//Requests the json file
async function getClasses() {
    const url="/coursesFile.json";
    const response = await fetch(url).then((response) => response.json());
    classData = response["courses"];
    loadSearches(classData, classesList);
}

async function getDegrees() {
    const url = "/degrees.json";
    const response = await fetch(url).then((response) => response.json());
    degreeData = response["degrees"];
    loadSearches(degreeData, degreesList);
}


function loadSearches(data, searchBar) {
    for (let i = 0; i < data.length; i++) {
        let newOption = document.createElement("option");
        searchBar.append(newOption);
        if (searchBar == degreesList) {
            newOption.value = data[i]["degreeName"];
        }
        else if (searchBar == classesList) {
            classNameString = "";
            classNameString = data[i]["code"].concat(" ", data[i]["name"]);
            newOption.value = classNameString;
        }
        
    }
}

function createClassBox(classQuery, semester) {
    let classQueryCode = "";
    let classDataEntry;
    let foundClass = false;
    let classQueryStopIndex = 0;
    for (let j = 0; j < classQuery.length; j++) {
        if (classQuery[j] === ' ') {
            classQueryStopIndex = j;
            break;
        }
    }
    classQueryCode = classQueryCode + (classQuery.substring(0, classQueryStopIndex));

    for (let i = 0; i < classData.length; i++) {
        if (classData[i].code == classQueryCode) {
            classDataEntry = classData[i];
            foundClass = true;
            break;
        }
    }

    if (foundClass === false) {
        alert("Please enter a valid class. Selecting one from the the provided list is recommended");
        return 0;
    }
    //Overall class box
    let classBox = document.createElement("div");
    classBox.className = "box";
    classBox.id = "classbox" + classBoxIdCounter;
    classBoxIdCounter += 1;
    tableColumns[semester].append(classBox);
    //semesterOneRow.append(classBox);

    //Top row of the box
    let boxLeftWrap = document.createElement("div");
    classBox.append(boxInnerWrap);
    boxLeftWrap.className = "boxInnerWrap";
    classBox.draggable = true;
    // Event listener for dragging the box
    classBox.addEventListener("dragstart", (dragBox) => {
        dragBox.dataTransfer.dropEffect = "move"
        dragBox.dataTransfer.setData("text", dragBox.target.id);
        dragBox.dataTransfer.effectAllowed = "move";
    });

    //Right column in box
    let boxRightWrap = document.createElement("div");
    classBox.append(boxRightWrap);
    boxRightWrap.className = "boxRightWrap";

    //Class code in top left of box
    let courseCodeDiv = document.createElement("div");
    courseCodeDiv.className = "courseCodeDiv";
    boxLeftWrap.append(courseCodeDiv);
    courseCodeDiv.textContent = classDataEntry["code"];

    //Checkbox container div in top right of box
    let checkBoxButtonDiv = document.createElement("div");
    checkBoxButtonDiv.className = "checkBoxButtonDiv";
    boxRightWrap.append(checkBoxButtonDiv);

    //Actual checkbox in top right corner
    let courseCheckbox = document.createElement("input");
    courseCheckbox.type = "checkbox";
    checkBoxButtonDiv.className = "courseCheckbox";
    checkBoxButtonDiv.append(courseCheckbox);
    courseCheckbox.addEventListener("click", () => isCourseCompleted(courseCheckbox, classBox));

    //Name of class in 2nd row
    let nameDiv = document.createElement("div");
    nameDiv.className = "nameDiv";
    classBox.append(nameDiv);
    nameDiv.textContent = classDataEntry["name"];

    //Amount of credits in 3rd row
    let creditDiv = document.createElement("div");
    creditDiv.className = "creditDiv";
    classBox.append(creditDiv);
    creditDiv.textContent = `Credits: ${classDataEntry["credits"]}`;

    //More info button in 4th/bottom row
    let moreInfoDiv = document.createElement("div");
    moreInfoDiv.className = "moreInfoDiv";
    classBox.append(moreInfoDiv);
    moreInfoDiv.textContent = "More information >";
    moreInfoDiv.addEventListener("click", () => {console.log("You clicked more info!")});
}

function createDegreeTemplate(degreeQuery) {
    
}

function isCourseCompleted(checkbox, classBox) {
    console.log(classBox);
    if (checkbox.check === true) {
        classBox.style.backgroundColor = "#038d33";
    }
    else {
        classBox.style.backgroundColor = "#e7d2fa";
    }
}