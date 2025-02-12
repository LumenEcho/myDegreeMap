let testDiv = document.getElementById("testDiv");
let degreeSelectionBox = document.getElementById("degreesChoice");
let classSelectionBox = document.getElementById("classChoice");
let degreesList = document.getElementById("degrees");
let classesList = document.getElementById("classes");

getClasses();
getDegrees();

//Requests the json file
//All operations with the json data must be called from within this function
async function getClasses() {
    const url="/coursesFile.json";
    const response = await fetch(url).then((response) => response.json());
    let classData = response["courses"];
    console.log(classData);
    loadSearches(classData, classesList);
    //testDiv.textContent = classData[0]["classId"]
}

async function getDegrees() {
    const url = "/degrees.json";
    const response = await fetch(url).then((response) => response.json());
    let degreeData = response["degrees"];
    console.log(degreeData);
    loadSearches(degreeData, degreesList);
}


function loadSearches(data, searchBar) {
    for (i = 0; i < data.length; i++) {
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

