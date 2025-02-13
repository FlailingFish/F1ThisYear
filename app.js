async function getYearData(year) {
console.log("../data/" + year + ".json");
    const response = await fetch("../data/" + year + ".json");
    const json = await response.json();
    return json;
}

async function buildPage() {
    var url = window.location.pathname;
    var year = url.substring(url.lastIndexOf('/')+1, url.lastIndexOf('/')+5);

    const data = await getYearData(year);
    buildTables(data);
}

function buildTables(tableData) {
    if ("content" in document.createElement("template")) {

        const calendarTableBody = document.getElementById("calendartablebody");
        const calendarRowTemplate = document.querySelector("#calendartablerow");

        const driversTableBody = document.getElementById("driverstablebody");
        const driversConstructorsRowTemplate = document.querySelector("#driverstablerow");

        const constructorsTableBody = document.getElementById("constructorstablebody");
        
        for (let i = 0; i < tableData.races.length; i++) {
           //build calendar table
           let clone = calendarRowTemplate.content.cloneNode(true);
           let td = clone.querySelectorAll("td");
           td[0].textContent = tableData.races[i].name;
           td[1].textContent = tableData.races[i].dates;
           calendarTableBody.appendChild(clone);

           //build drivers table
           if(i < tableData.drivers.length)
           {
                clone = driversConstructorsRowTemplate.content.cloneNode(true);
                let td = clone.querySelectorAll("td");
                td[0].querySelector("div").innerText = tableData.drivers[i].name;

                let col = getTeamColorClass(tableData.drivers[i].team);
               if(col !== "")
                 {
                    td[0].querySelector("div").classList.add(col);
              }

                td[1].textContent = tableData.drivers[i].points;
                driversTableBody.appendChild(clone);
           }

           //build constructors table
           if(i < tableData.constructors.length)
           {
                clone = driversConstructorsRowTemplate.content.cloneNode(true);
                let td = clone.querySelectorAll("td");
                td[0].querySelector("div").innerText = tableData.constructors[i].team;

                let col = getTeamColorClass(tableData.constructors[i].team);
                if(col !== "")
                  {
                     td[0].querySelector("div").classList.add(col);
               }

                td[1].textContent = tableData.constructors[i].points;
                constructorsTableBody.appendChild(clone);
           }
        }

    } else {

    }
}

function getTeamColorClass(team)
{
    if(team === "Ferrari") { return "team-colour-ferrari"; }
    if(team === "Mclaren Mercedes") { return "team-colour-mclaren"; }
    if(team === "Red Bull Racing Honda RBPT") { return "team-colour-redbull"; }
    if(team === "Mercedes") { return "team-colour-mercedes"; }
    if(team === "Aston Martin Aramco Mercedes") { return "team-colour-astonmartin"; }
    if(team === "Haas Ferrari") { return "team-colour-haas"; }
    if(team === "Alpine Renault") { return "team-colour-alpine"; }
    if(team === "RB Honda RBPT") { return "team-colour-vcarb"; }
    if(team === "Williams Mercedes") { return "team-colour-williams"; }
    if(team === "Kick Sauber Ferrari") { return "team-colour-sauber"; }

    return "";
}

buildPage();