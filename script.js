let testDiv = document.getElementById("testDiv");
getClasses();

//Requests the json file
//All operations with the json data must be called from within this function
async function getClasses() {
    const url="/classFile.json";
    const response = await fetch(url).then((response) => response.json());
    let classData = response["classes"];
    console.log(classData);

    //testDiv.textContent = classData[0]["classId"]
}

//Remove lab classes from json file


