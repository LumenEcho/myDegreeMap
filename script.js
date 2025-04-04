
let testDiv = document.getElementById("testDiv");
let degreeSelectionBox = document.getElementById("degreesChoice");
let classSelectionBox = document.getElementById("classChoice");
let degreesList = document.getElementById("degrees");
let classesList = document.getElementById("classes");
let tableColumns = document.getElementsByClassName("row");
let semesterOneRow = document.getElementsByClassName("row")[1];
let semesterTops = document.getElementsByClassName("semesterTop");
let semesterSelect = document.getElementById("semesterSelect");

let degreeSearchButton = document.getElementById("degreeButton");
let classSearchButton = document.getElementById("classButton");

let moreInfoBox = document.getElementById("dialogBox");
let dialogCloseButton = document.getElementById("dialogCloseButton");

let dialogClassNameBox = document.getElementById("dialogClassNameDiv");
let dialogClassCodeBox = document.getElementById("dialogClassCodeDiv");
let dialogClassCreditsBox = document.getElementById("dialogClassCreditsDiv");
let dialogClassDescriptionBox = document.getElementById("dialogDescriptionDiv");

let totalCreditsBox = document.getElementById("totCompCred");

//Color variables
let completedColor = "#75d481";
let prereqsmetColor = "#ffeb5b";
let prereqsnotmetColor = "#f57e98";

let totalCompletedCredits = 0;

let classBoxes;

let classData;
let degreeData;
let degreeJSON;
let classBoxIdCounter = 0;

let classesNamesArray = [];
let classesObjectsArray = [];

dialogCloseButton.addEventListener("click", () => {moreInfoBox.close();});

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
    createClassBox(classQueryCode, semesterSelect.value);
    semesterSelect.value = "";
    classSelectionBox.value = "";
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

//Requests the json file for the classes
async function getClasses() {
    const url="/coursesFile.json";
    const response = await fetch(url).then((response) => response.json());
    classData = response["courses"];
    loadSearches(classData, classesList);
}

//Requests the json file for the degrees list
async function getDegrees() {
    const url = "/degrees.json";
    const response = await fetch(url).then((response) => response.json());
    degreeData = response["degrees"];
    loadSearches(degreeData, degreesList);
}

//Requests the json file for the degree template in the argument
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
            let classNameString = "";
            classNameString = data[i]["code"].concat(" ", data[i]["name"]);
            newOption.value = classNameString;
        }
        
    }
}

function createClassBox(classQuery, semester) {
    //Make transfer credit semester option support
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

    //Support for transfer credits
    if (semester === "Transfer Credits") {
        semester = 0;
    }

    //Overall class box
    let classBox = document.createElement("div");
    classBox.completedClass = false;
    classBox.className = "box";
    classBox.id = "classbox" + classBoxIdCounter;
    classBoxIdCounter += 1;
    tableColumns[semester].append(classBox);

    classBox.classCode = classDataEntry["code"];
    classBox.schoolClassName = classDataEntry["name"];
    classBox.classDescription = classDataEntry["description"];
    

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
    classBox.classCredits = Number(classDataEntry["credits"]);

    //More info button in 4th/bottom row
    let moreInfoDiv = document.createElement("div");
    moreInfoDiv.className = "moreInfoDiv";
    boxText.append(moreInfoDiv);
    moreInfoDiv.textContent = "More information >";
    moreInfoDiv.addEventListener("click", () => {moreInformation("normal", classBox)});

    classBox.prerequisites = classDataEntry["prerequisites"];
    //Nullish Coalescing Assignment Operator
    classBox.prerequisites ??= 0;

    //Auto-complete courses added to transfer credits
    if (semester === 0) {
        courseCheckbox.checked = true;
        isCourseCompleted(courseCheckbox, classBox);
    }

    updateCreditsTotal();

    classesNamesArray.push(classDataEntry["code"]);
    classesObjectsArray.push(classBox);

    updatePreReqs();
}

function createOptionsClassBox(classOptionsArray, classOptionsName, semester, credits) {
    //Outer Class Box
    let classBox = document.createElement("div");
    classBox.completedClass = false;
    classBox.className = "box";
    classBox.id = "classbox" + classBoxIdCounter;
    classBoxIdCounter += 1;
    tableColumns[semester].append(classBox);

    classBox.classOptionsName = classOptionsName;
    classBox.classOptions = classOptionsArray;

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
    moreInfoDiv.addEventListener("click", () => {moreInformation("options", classBox)});

    classBox.prerequisites = -1;
    classesNamesArray.push("options");
    classesObjectsArray.push(classBox);
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
    moreInfoDiv.addEventListener("click", () => {moreInformation("elective", classBox)});


    classBox.prerequisites = -1;
    classesNamesArray.push("elective");
    classesObjectsArray.push(classBox);
}

async function createDegreeTemplate(degreeQuery) {
    let startingclassesNamesArray = [];
    let classFound = false;
    for (let m = 0; m < classesNamesArray.length; m++) {
        startingclassesNamesArray[m] = classesNamesArray[m];
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
        if (startingclassesNamesArray.length > 0) {
            //For each class in the starting classes array
            for (let j = 0; j < startingclassesNamesArray.length; j++) {
                if (degreeJSON["classes"][i]["classCode"] === classesNamesArray[j]) {
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
    updatePreReqs();
    degreeSelectionBox.value = "";
}

function isCourseCompleted(checkbox, classBox) {
    if (checkbox.checked === true) {
       classBox.style.backgroundColor = completedColor;
       classBox.completedClass = true;
       totalCompletedCredits += Number(classBox.classCredits);
    }
    else {
        classBox.style.backgroundColor = prereqsnotmetColor;
        classBox.completedClass = false;
        totalCompletedCredits -= Number(classBox.classCredits);
    }
    totalCreditsBox.textContent = `Total Completed Credits: ${totalCompletedCredits}`;
    updatePreReqs();
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

function updatePreReqs() {
    let completedClasses = 0;
    //Iterates through list of class objects
    for (let i = 0; i < classesObjectsArray.length; i++) {
        completedClasses = 0;
        if (classesObjectsArray[i].completedClass === false) {
            if(classesObjectsArray[i].prerequisites === 0) {
                classesObjectsArray[i].style.backgroundColor = prereqsmetColor;
            }
            else {
                //Iterates through prerequisite array
                for (let j = 0; j < classesObjectsArray[i].prerequisites.length; j++) {
                    //Iterates through objects array searching for prerequisite class matches
                    for (let k = 0; k < classesObjectsArray.length; k++) {
                        if (classesObjectsArray[i].prerequisites[j] === classesObjectsArray[k].children[1].children[0].textContent) {
                            if (classesObjectsArray[k].completedClass === true) {
                                completedClasses += 1;
                            }
                        }
                    }
                }
                if (completedClasses === classesObjectsArray[i].prerequisites.length) {
                    classesObjectsArray[i].style.backgroundColor = prereqsmetColor;
                }
                else {
                    classesObjectsArray[i].style.backgroundColor = prereqsnotmetColor;
                }
            }
        }
        
    }
}

function moreInformation(type, classInfo) {

    /*Swal.fire ({

    });*/
    moreInfoBox.style.opacity = 1;
    let concatDesc = "";
    if (type === "normal") {
        dialogClassNameBox.textContent = classInfo.schoolClassName;
        dialogClassCodeBox.textContent = classInfo.classCode;
        dialogClassCreditsBox.textContent = `Credits: ${classInfo.classCredits}`;
        dialogClassDescriptionBox.textContent = classInfo.classDescription;
    }
    else if (type === "options") {
        dialogClassNameBox.textContent = classInfo.classOptionsName;
        dialogClassCodeBox.textContent = "You may choose any of the following classes";
        dialogClassCreditsBox.textContent = `Credits: ${classInfo.classCredits}`;
        dialogClassDescriptionBox.textContent = classInfo.classOptions.toString();

    }
    else {
        dialogClassNameBox.textContent = "Free Elective";
        dialogClassCreditsBox.textContent = `Credits: ${classInfo.classCredits}`;
        dialogClassDescriptionBox.textContent = `You may pick any classes as long as they total up to at least ${classInfo.classCredits} credits.`;
    }
    moreInfoBox.showModal();

}