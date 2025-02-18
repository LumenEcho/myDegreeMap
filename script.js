let testDiv = document.getElementById("testDiv");
let degreeSelectionBox = document.getElementById("degreesChoice");
let classSelectionBox = document.getElementById("classChoice");
let degreesList = document.getElementById("degrees");
let classesList = document.getElementById("classes");
let tableColumns = document.getElementsByClassName("row");
let semesterOneRow = document.getElementsByClassName("row")[1];
let semesterTops = document.getElementsByClassName("semesterTop");

let degreeSearchButton = document.getElementById("degreeButton");
let classSearchButton = document.getElementById("classButton");

let classBoxes;

let classData;
let degreeData;
let degreeJSON;
let classBoxIdCounter = 0;

let classesArray = [];

classSearchButton.addEventListener("click", () => {
    //Get just the course code from the query and submit it as the argument for the function
    let classQueryCode = "";
    let classQueryStopIndex = 0;
    for (let i = 0; i < classSelectionBox.value.length; i++) {
        if (classSelectionBox.value[i] === ' ') {
            classQueryStopIndex = i;
            break;
        }
    }

    classQueryCode = classQueryCode + (classSelectionBox.value.substring(0, classQueryStopIndex));
    console.log(classQueryCode);
    createClassBox(classQueryCode, 1)
});
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
        updateCreditsTotal();
    });
}


getClasses();
getDegrees();

for (let j = 0; j < semesterTops.length; j++) {
    semesterTops[j].children[1].textContent = "Credits: 0";
}

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

async function getDegreeTemplate(url) {
    const response = await fetch(url).then((response) => response.json());
    degreeJSON = response;
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
    let classDataEntry;
    let foundClass = false;

    for (let i = 0; i < classData.length; i++) {
        if (classData[i].code == classQuery) {
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
    classBox.completedClass = false;
    classBox.className = "box";
    classBox.id = "classbox" + classBoxIdCounter;
    classBoxIdCounter += 1;
    tableColumns[semester].append(classBox);

    //Top row of the box
    let boxCheck = document.createElement("div");
    classBox.append(boxCheck);
    boxCheck.className = "boxCheck";
    classBox.draggable = true;
    // Event listener for dragging the box
    classBox.addEventListener("dragstart", (dragBox) => {
        dragBox.dataTransfer.dropEffect = "move"
        dragBox.dataTransfer.setData("text", dragBox.target.id);
        dragBox.dataTransfer.effectAllowed = "move";
    });

    //Checkbox container div in top of box
    let checkBoxButtonDiv = document.createElement("div");
    checkBoxButtonDiv.className = "checkBoxButtonDiv";
    boxCheck.append(checkBoxButtonDiv);

    //Actual checkbox in top
    let courseCheckbox = document.createElement("input");
    courseCheckbox.type = "checkbox";
    checkBoxButtonDiv.className = "courseCheckbox";
    checkBoxButtonDiv.append(courseCheckbox);
    courseCheckbox.addEventListener("click", () => isCourseCompleted(courseCheckbox, classBox));

    //Bottom of box
    let boxText = document.createElement("div");
    classBox.append(boxText);
    boxText.className = "boxText";

    //Class code in bottom of box
    let courseCodeDiv = document.createElement("div");
    courseCodeDiv.className = "courseCodeDiv";
    boxText.append(courseCodeDiv);
    courseCodeDiv.textContent = classDataEntry["code"];

    //Name of class in 2nd row
    let nameDiv = document.createElement("div");
    nameDiv.className = "nameDiv";
    boxText.append(nameDiv);
    nameDiv.textContent = classDataEntry["name"];

    //Amount of credits in 3rd row
    let creditDiv = document.createElement("div");
    creditDiv.className = "creditDiv";
    boxText.append(creditDiv);
    creditDiv.textContent = `Credits: ${classDataEntry["credits"]}`;
    classBox.classCredits = classDataEntry["credits"];

    //More info button in 4th/bottom row
    let moreInfoDiv = document.createElement("div");
    moreInfoDiv.className = "moreInfoDiv";
    boxText.append(moreInfoDiv);
    moreInfoDiv.textContent = "More information >";
    moreInfoDiv.addEventListener("click", () => {console.log("You clicked more info!")});

    updateCreditsTotal();
    classesArray.push(classDataEntry["code"]);
}

function createOptionsClassBox(classOptionsArray, classOptionsName, semester, credits) {
    //Outer Class Box
    let classBox = document.createElement("div");
    classBox.completedClass = false;
    classBox.className = "box";
    classBox.id = "classbox" + classBoxIdCounter;
    classBoxIdCounter += 1;
    tableColumns[semester].append(classBox);

    //Top row of the box
    let boxCheck = document.createElement("div");
    classBox.append(boxCheck);
    boxCheck.className = "boxCheck";
    classBox.draggable = true;
    // Event listener for dragging the box
    classBox.addEventListener("dragstart", (dragBox) => {
        dragBox.dataTransfer.dropEffect = "move"
        dragBox.dataTransfer.setData("text", dragBox.target.id);
        dragBox.dataTransfer.effectAllowed = "move";
    });
    
    //Checkbox container div in top of box
    let checkBoxButtonDiv = document.createElement("div");
    checkBoxButtonDiv.className = "checkBoxButtonDiv";
    boxCheck.append(checkBoxButtonDiv);

    //Actual checkbox in top
    let courseCheckbox = document.createElement("input");
    courseCheckbox.type = "checkbox";
    checkBoxButtonDiv.className = "courseCheckbox";
    checkBoxButtonDiv.append(courseCheckbox);
    courseCheckbox.addEventListener("click", () => isCourseCompleted(courseCheckbox, classBox));

    //Bottom of box
    let boxText = document.createElement("div");
    classBox.append(boxText);
    boxText.className = "boxText";

    //Class code in bottom of box
    let courseCodeDiv = document.createElement("div");
    courseCodeDiv.className = "courseCodeDiv";
    boxText.append(courseCodeDiv);
    courseCodeDiv.textContent = classOptionsName;

    //Name of class in 2nd row
    let nameDiv = document.createElement("div");
    nameDiv.className = "nameDiv";
    boxText.append(nameDiv);
    nameDiv.textContent = "Choose one of the available classes";

    //Amount of credits in 3rd row
    let creditDiv = document.createElement("div");
    creditDiv.className = "creditDiv";
    boxText.append(creditDiv);
    creditDiv.textContent = `Credits: ${credits}`;
    classBox.classCredits = credits;

    //More info button in 4th/bottom row
    let moreInfoDiv = document.createElement("div");
    moreInfoDiv.className = "moreInfoDiv";
    boxText.append(moreInfoDiv);
    moreInfoDiv.textContent = "More information >";
    moreInfoDiv.addEventListener("click", () => {console.log("You clicked more info!")});


    classesArray.push("options");
}

function createElectivesBox(semester, credits) {
    //Outer Class Box
    let classBox = document.createElement("div");
    classBox.completedClass = false;
    classBox.className = "box";
    classBox.id = "classbox" + classBoxIdCounter;
    classBoxIdCounter += 1;
    tableColumns[semester].append(classBox);

    //Top row of the box
    let boxCheck = document.createElement("div");
    classBox.append(boxCheck);
    boxCheck.className = "boxCheck";
    classBox.draggable = true;
    // Event listener for dragging the box
    classBox.addEventListener("dragstart", (dragBox) => {
        dragBox.dataTransfer.dropEffect = "move"
        dragBox.dataTransfer.setData("text", dragBox.target.id);
        dragBox.dataTransfer.effectAllowed = "move";
    });
    
    //Checkbox container div in top of box
    let checkBoxButtonDiv = document.createElement("div");
    checkBoxButtonDiv.className = "checkBoxButtonDiv";
    boxCheck.append(checkBoxButtonDiv);

    //Actual checkbox in top
    let courseCheckbox = document.createElement("input");
    courseCheckbox.type = "checkbox";
    checkBoxButtonDiv.className = "courseCheckbox";
    checkBoxButtonDiv.append(courseCheckbox);
    courseCheckbox.addEventListener("click", () => isCourseCompleted(courseCheckbox, classBox));

    //Bottom of box
    let boxText = document.createElement("div");
    classBox.append(boxText);
    boxText.className = "boxText";

    //Class code in bottom of box
    let courseCodeDiv = document.createElement("div");
    courseCodeDiv.className = "courseCodeDiv";
    boxText.append(courseCodeDiv);
    courseCodeDiv.textContent = "Electives";

    //Name of class in 2nd row
    let nameDiv = document.createElement("div");
    nameDiv.className = "nameDiv";
    boxText.append(nameDiv);
    nameDiv.textContent = "Choose one of the available classes";

    //Amount of credits in 3rd row
    let creditDiv = document.createElement("div");
    creditDiv.className = "creditDiv";
    boxText.append(creditDiv);
    creditDiv.textContent = `Credits: ${credits}`;
    classBox.classCredits = credits;

    //More info button in 4th/bottom row
    let moreInfoDiv = document.createElement("div");
    moreInfoDiv.className = "moreInfoDiv";
    boxText.append(moreInfoDiv);
    moreInfoDiv.textContent = "More information >";
    moreInfoDiv.addEventListener("click", () => {console.log("You clicked more info!")});


    classesArray.push("elective");
}

async function createDegreeTemplate(degreeQuery) {
    let startingClassesArray = [];
    let classFound = false;
    for (let m = 0; m < classesArray.length; m++) {
        startingClassesArray[m] = classesArray[m];
    }

    switch(degreeQuery) {
        case "Computer Science: No Concentration":
            await getDegreeTemplate("/csc_core.json");
            break;
        case "Computer Science: Data Science and Artifical Intelligence Concentration":
            await getDegreeTemplate("/csc_dsai.json");
            break;
        case "Computer Science: Cybersecurity Concentration":
            await getDegreeTemplate("/csc_cybersecurity.json");
            break;
        case "Computer Science: High Performance Computing Concentration":
            await getDegreeTemplate("/csc_hpc.json");
            break;
        default:
            alert("Please enter a valid degree");
            return;
    }


    //For each class in the degree
    for (let i = 0; i < degreeJSON["classes"].length; i++) {
        classFound = false;
        if (startingClassesArray.length > 0) {
            //For each class in the starting classes array
            for (let j = 0; j < startingClassesArray.length; j++) {
                if (degreeJSON["classes"][i]["classCode"] === classesArray[j]) {
                    classFound = true;
                    break;
                }
                else if (degreeJSON["classes"][i]["classCode"] === 1) {

                }
                else {
                    classFound = false;
                }
            }
                if (classFound === false) {
                    if (degreeJSON["classes"][i]["classCode"] === "options") {
                        createOptionsClassBox(degreeJSON["classes"][i]["options"], degreeJSON["classes"][i]["optionsName"], degreeJSON["classes"][i]["semester"], degreeJSON["classes"][i]["credits"]);
                    }
                    else if (degreeJSON["classes"][i]["classCode"] === "elective") {
                        createElectivesBox(degreeJSON["classes"][i]["semester"], degreeJSON["classes"][i]["credits"]);
                    }
                    else {
                        createClassBox(degreeJSON["classes"][i]["classCode"], degreeJSON["classes"][i]["semester"]);
                    }
                }
            
        }
        else {
            if (degreeJSON["classes"][i]["classCode"] === "options") {
                createOptionsClassBox(degreeJSON["classes"][i]["options"], degreeJSON["classes"][i]["optionsName"], degreeJSON["classes"][i]["semester"], degreeJSON["classes"][i]["credits"]);
            }
            else if (degreeJSON["classes"][i]["classCode"] === "elective") {
                createElectivesBox(degreeJSON["classes"][i]["semester"], degreeJSON["classes"][i]["credits"]);
            }
            else {
                createClassBox(degreeJSON["classes"][i]["classCode"], degreeJSON["classes"][i]["semester"]);
            }
        }
        
    }
   updateCreditsTotal();
}

function isCourseCompleted(checkbox, classBox) {
    if (checkbox.checked === true) {
       classBox.style.backgroundColor = "#48D607";
       classBox.completedClass = true;
    }
    else {
        classBox.style.backgroundColor = "#e7d2fa";
        classBox.completedClass = false;
    }
}

function updateCreditsTotal() {
    let semesterCredits = 0;
    for (let i = 0; i < tableColumns.length; i++) {
        semesterCredits = 0;
        for (let j = 0; j < tableColumns[i].children.length; j++) {
            semesterCredits += tableColumns[i].children[j].classCredits;
        }
        semesterTops[i].children[1].textContent = `Credits: ${semesterCredits}`;
    }
}

