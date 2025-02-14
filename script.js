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

classSearchButton.addEventListener("click", () => createClassBox(classSelectionBox.value));
degreeSearchButton.addEventListener("click", () => createDegreeTemplate(degreeSelectionBox.value));
for (let i = 0; i < tableColumns.length; i++) {
    tableColumns[i].addEventListener("dragover", (dragBox) => {
        dragBox.preventDefault();
        dragBox.dataTransfer.dropEffect = "move";
    });
    tableColumns[i].addEventListener("drop", (dragBox) => {
        dragBox.preventDefault();
        const newLocation = dragBox.dataTransfer.getData("application/my-app");
        dragBox.target.appendChild(document.getElementById(newLocation));
    });
}


getClasses();
getDegrees();

//Requests the json file
//All operations with the json data must be called from within this function
async function getClasses() {
    const url="/coursesFile.json";
    const response = await fetch(url).then((response) => response.json());
    classData = response["courses"];
    console.log(classData);
    loadSearches(classData, classesList);
}

async function getDegrees() {
    const url = "/degrees.json";
    const response = await fetch(url).then((response) => response.json());
    degreeData = response["degrees"];
    console.log(degreeData);
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

function createClassBox(classQuery) {
    let classQueryCode = "";
    let classDataEntry;
    let foundClass = false;
    //Add allowing of class codes and ids with less than 8 character (csc1310)
    classQueryCode = classQueryCode + (classQuery.substring(0, 8));
    console.log(classQueryCode);

    

    for (let i = 0; i < classData.length; i++) {
        if (classData[i].code == classQueryCode) {
            classDataEntry = classData[i];
            foundClass = true;
            break;
        }
    }

    if (foundClass == false) {
        alert("Please enter a valid class. Selecting one from the the provided list is recommended");
        return 0;
    }
    //Overall class box
    let classBox = document.createElement("div");
    classBox.className = "box";
    semesterOneRow.append(classBox);

    //Top row of the box
    let boxInnerWrap = document.createElement("div");
    classBox.append(boxInnerWrap);
    boxInnerWrap.className = "boxInnerWrap";
    classBox.draggable = true;
    // Event listener for dragging the box
    classBox.addEventListener("dragstart", (dragBox) => {
        console.log("This dragged");
        dragBox.dataTransfer.effectAllowed = "move";
    });

    //Class code in top left of box
    let courseCodeDiv = document.createElement("div");
    courseCodeDiv.className = "courseCodeDiv";
    boxInnerWrap.append(courseCodeDiv);
    courseCodeDiv.textContent = classDataEntry["code"];

    //Checkbox container div in top right of box
    let checkBoxButtonDiv = document.createElement("div");
    checkBoxButtonDiv.className = "checkBoxButtonDiv";
    boxInnerWrap.append(checkBoxButtonDiv);

    //Actual checkbox in top right corner
    let courseCheckbox = document.createElement("input");
    courseCheckbox.type = "checkbox";
    checkBoxButtonDiv.className = "courseCheckbox";
    checkBoxButtonDiv.append(courseCheckbox);

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

