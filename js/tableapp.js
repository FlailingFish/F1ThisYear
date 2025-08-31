const DateTime = luxon.DateTime;
const clickableRows = document.getElementsByClassName("row-click");
const hiddenRows = document.getElementsByClassName("row-hidden");

let data;
let calendarTimes = new Array();
let calendarDates = new Array();
let calendarEventDates;
let calendarEventNames;

let currentIndex = -1;

for(let i = 0; i < clickableRows.length; i++)
{
    clickableRows[i].addEventListener("click", (event) => {

        if(i !== currentIndex && currentIndex !== -1)
        {
            hiddenRows[currentIndex].classList.add("collapse");
            clickableRows[currentIndex].setAttribute('id', '');
            let icon = clickableRows[currentIndex].querySelector("svg");
            icon.classList.remove("chevron-active");
            currentIndex = -1;
        }

        if(hiddenRows[i].classList.contains("collapse"))
        {
            hiddenRows[i].classList.remove("collapse")
            currentIndex = i;
            clickableRows[i].setAttribute('id', 'active-row-click');
            let icon = clickableRows[i].querySelector("svg");
            icon.classList.add("chevron-active");
        }
        else
        {
            hiddenRows[i].classList.add("collapse")
            clickableRows[i].setAttribute('id', '');
            let icon = clickableRows[i].querySelector("svg");
            icon.classList.remove("chevron-active");
        }
    });
}

async function getData(year) {
    const response = await fetch("data/2025.json");
    const json = await response.json();
    return json;
}

async function generateCalendarTimes() {
    var url = window.location.pathname;
    var year = url.substring(url.lastIndexOf('/')+1, url.lastIndexOf('/')+5);

    data = await getData(year);
  
    if ("content" in document.createElement("template")) {

        const calendarTimesTableTemplate = document.getElementById("calendartimestable");
        const calendarTableObjects = document.getElementsByClassName("row-click");
        
        calendarEventDates = document.getElementsByClassName("event-dates");
        calendarEventNames = document.getElementsByClassName("event-title");
        
        for(let i = 0; i < data.races.length; i++)
        {
            let clone = calendarTimesTableTemplate.content.cloneNode(true);
            
            let tableBody = clone.getElementById("calendartimestablebody");

            let raceSessionTimes = new Array();
            let raceSessionDates = new Array();
            
            if(data.races[i].nextevent)
            {
                calendarEventNames[i].classList.add("next-race");
                calendarEventDates[i].classList.add("next-race");
            }

            let startDate;
            let endDate;

            for(let j = 0; j < data.races[i].sessions.length; j++)
            {
                let row = document.createElement("tr");
                if(j !== data.races[i].sessions.length - 1)
                {
                    row.classList.add("table-border-after");
                }

                let nameColumn = document.createElement("td");
                nameColumn.innerHTML = data.races[i].sessions[j].name;
                row.appendChild(nameColumn);

                //Date column
                let timeToConvert = data.races[i].sessions[j].datetime;
                let trackDateTime = DateTime.fromISO(timeToConvert, {zone: data.races[i].timezone});
                let localDateTime = trackDateTime.toLocal();
                let dateColumn = document.createElement("td");
                dateColumn.innerHTML = localDateTime.weekdayLong + " " + localDateTime.monthLong + " " + localDateTime.day;
                row.appendChild(dateColumn);

                //Time column
                let timeColumn = document.createElement("td");
                timeColumn.innerHTML = localDateTime.toLocaleString(DateTime.TIME_24_SIMPLE);
                timeColumn.classList.add("table-right-side-data");
                row.appendChild(timeColumn);
                
                raceSessionDates.push(dateColumn);
                raceSessionTimes.push(timeColumn);

                tableBody.appendChild(row);
                
                //Start date
                if(j === 0)
                {
                    startDate = localDateTime;
                }
                //End date
                else if (j === data.races[i].sessions.length - 1)
                {
                    endDate = localDateTime;
                }
            }
            
            //Construct event dates
            constructEventDates(i, startDate, endDate);

            calendarTimes.push(raceSessionTimes);
            calendarDates.push(raceSessionDates);

            calendarTableObjects[i].after(clone);
            
            const driversTableBody = document.getElementById("driverstablebody");
            const driversConstructorsRowTemplate = document.querySelector("#driverstablerow");

            const constructorsTableBody = document.getElementById("constructorstablebody");
            
            //build drivers table
            if(i < data.drivers.length)
            {
                clone = driversConstructorsRowTemplate.content.cloneNode(true);
                let td = clone.querySelectorAll("td");

                td[0].textContent = i + 1;

                td[1].querySelector("div").innerText = data.drivers[i].name;

                let col = getTeamColorClass(data.drivers[i].team);
                if(col !== "")
                {
                    td[1].querySelector("div").classList.add(col);
                }

                td[2].textContent = data.drivers[i].points;
                driversTableBody.appendChild(clone);
            }

            //build constructors table
            if(i < data.constructors.length)
            {
                clone = driversConstructorsRowTemplate.content.cloneNode(true);
                let td = clone.querySelectorAll("td");
                
                td[0].textContent = i + 1;

                td[1].querySelector("div").innerText = data.constructors[i].team;

                let col = getTeamColorClass(data.constructors[i].id);
                if(col !== "")
                {
                    td[1].querySelector("div").classList.add(col);
                }

                td[2].textContent = data.constructors[i].points;
                constructorsTableBody.appendChild(clone);
            }
        }
    }
}

function getTeamColorClass(team)
{
    if(team === "fer") { return "team-colour-ferrari"; }
    if(team === "mcl") { return "team-colour-mclaren"; }
    if(team === "rbr") { return "team-colour-redbull"; }
    if(team === "mer") { return "team-colour-mercedes"; }
    if(team === "ast") { return "team-colour-astonmartin"; }
    if(team === "haa") { return "team-colour-haas"; }
    if(team === "alp") { return "team-colour-alpine"; }
    if(team === "rab") { return "team-colour-vcarb"; }
    if(team === "wir") { return "team-colour-williams"; }
    if(team === "sau") { return "team-colour-sauber"; }

    return "";
}

function constructEventDates(index, startDate, endDate)
{
    if(startDate.monthLong === endDate.monthLong)
    {
        calendarEventDates[index].innerHTML = startDate.monthLong + " " + startDate.day + "-" + endDate.day;
    }
    else
    {
        calendarEventDates[index].innerHTML = startDate.monthLong + " " + startDate.day + " - " + endDate.monthLong + " " + endDate.day;
    }
}

const selectElement = document.getElementById("timeselectdropdown");
selectElement.addEventListener("change", (event) => {
    for(let i = 0; i < data.races.length; i++)
    {
        let startDate;
        let endDate;

        for(let j = 0; j < data.races[i].sessions.length; j++)
        {
            //Date column
            let timeToConvert = data.races[i].sessions[j].datetime;
            let trackDateTime = DateTime.fromISO(timeToConvert, {zone: data.races[i].timezone});
            let localDateTime = trackDateTime.toLocal();

            if(event.target.value == 1)
            {
                calendarDates[i][j].innerHTML = trackDateTime.weekdayLong + " " + trackDateTime.monthLong + " " + trackDateTime.day;
                calendarTimes[i][j].innerHTML = trackDateTime.toLocaleString(DateTime.TIME_24_SIMPLE);
                
                //Start date
                if(j === 0)
                {
                    startDate = trackDateTime;
                }
                //End date
                else if (j === data.races[i].sessions.length - 1)
                {
                    endDate = trackDateTime;
                }
            }
            else
            {
                calendarDates[i][j].innerHTML = localDateTime.weekdayLong + " " + localDateTime.monthLong + " " + localDateTime.day;
                calendarTimes[i][j].innerHTML = localDateTime.toLocaleString(DateTime.TIME_24_SIMPLE);

                //Start date
                if(j === 0)
                {
                    startDate = localDateTime;
                }
                //End date
                else if (j === data.races[i].sessions.length - 1)
                {
                    endDate = localDateTime;
                }
            }
        }

        constructEventDates(i, startDate, endDate);
    }
});

generateCalendarTimes();
