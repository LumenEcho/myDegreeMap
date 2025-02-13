let testDiv = document.getElementById("testDiv");
let degreeSelectionBox = document.getElementById("degreesChoice");
let classSelectionBox = document.getElementById("classChoice");
let degreesList = document.getElementById("degrees");
let classesList = document.getElementById("classes");
let semesterOneRow = document.getElementsByClassName("row")[1];

let degreeSearchButton = document.getElementById("degreeButton");
let classSearchButton = document.getElementById("classButton");

let classData;
let degreeData;

classSearchButton.addEventListener("click", () => createClassBox(classSelectionBox.value));
degreeSearchButton.addEventListener("click", () => createDegreeTemplate(degreeSelectionBox.value));


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
    classQueryCode = classQueryCode + (classQuery.substring(0, 8));
    console.log(classQueryCode);
    let classBox = document.createElement("div");
    classBox.className = "box";
    semesterOneRow.append(classBox);
    classBox.style.backgroundColor = "gray";

}

function createDegreeTemplate(degreeQuery) {
    
}

