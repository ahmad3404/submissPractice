const API_KEY = "16d85bf702974259b17e4dff4faeade4";
const BASE_URL = "https://api.football-data.org/v2/";

const LEAGUE_ID = 2021;

const ENDPOINT_COMPETITION = `${BASE_URL}competitions/${LEAGUE_ID}/teams`;
const ENDPOINT_SCORE = `${BASE_URL}competitions/PL/scorers`;

const fetchAPI = url => {
    return fetch(url, {
        headers: {
            'X-Auth-Token': API_KEY
        }
    })
        .then(res => {
            if (res.status !== 200) {
                console.log("Error: " + res.status);
                return Promise.reject(new Error(res.statusText))
            } else {
                return Promise.resolve(res)
            }
        })
        .then(res => res.json())
        .catch(err => {
            console.log(err)
        })
};


function getAllStandings() {
    if ("caches" in window) {
        caches.match(ENDPOINT_COMPETITION).then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    console.log("Competition Data: " + data);
                    showStanding(data);
                })
            }
        })
    }

    fetchAPI(ENDPOINT_COMPETITION)
        .then(data => {
            showStanding(data);
        })
        .catch(error => {
            console.log(error)
        })
}

function showStanding(data) {
    let teams = "";
    let standingElement =  document.getElementById("homeStandings");

    data.teams.forEach(function(team){
        teams += `
                <tr>
                    <td><img src="${team.crestUrl.replace(/^http:\/\//i, 'https://')}" width="30px" alt="badge"/></td>
                    <td>${team.name}</td>
                    <td>${team.founded}</td>
                    <td>${team.venue}</td>
                    <td>${team.clubColors}</td>
                    <td>${team.address}</td>
                    <td><button id="${team.id}" class="saveButton">Save</button></td>
                </tr>
        `;
    });
    
   

     standingElement.innerHTML = `
                <div class="card" style="padding-left: 24px; padding-right: 24px; margin-top: 30px;">

                <table class="striped responsive-table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Team Name</th>
                            <th>Founded</th>
                            <th>Venue</th>
                            <th>Club Colors</th>
                            <th>Address</th>
                            <th>Action</th>
                        </tr>
                     </thead>
                    <tbody id="teams">
                        ${teams}
                    </tbody>
                </table>
                
                </div>
    `;

    let saveButtons = document.querySelectorAll(".saveButton");
           for(let button of saveButtons) {
               button.addEventListener("click", function (event) {
                   let Id = event.target.id;
                   console.log("id adalah : "+ Id +" Tombol Save Diklik");
                   showStanding(data);
                   getID(Id);
                   console.log("Abis Diklik ID==> "+ Id);
               })
           }

}

function getID(tanda) {

    const ENDPOINT_LINK = `${BASE_URL}teams/${tanda}/`;
    console.log("Link nya "+ ENDPOINT_LINK); 
    fetchAPI(ENDPOINT_LINK)
        .then(data => {
            console.log("Hasil Parsing "+ data);
            dbInsertTeam(data);
        })
        .catch(error => {
            console.log(error)
        })
   
}

function getAllScore() {
    if ("caches" in window) {
        caches.match(ENDPOINT_SCORE).then(function (response) {
            if (response) {
                response.json().then(function (data) {
                    console.log("Score Data: " + data);
                    showScore(data);
                })
            }
        })
    }

    fetchAPI(ENDPOINT_SCORE)
        .then(data => {
            showScore(data);
        })
        .catch(error => {
            console.log(error)
        })
}


function showScore(data) {
    let scorers = "";
    let scoreElement =  document.getElementById("homeScore");

    data.scorers.forEach(function(score){
        scorers += `
                <tr>
                    <td>${score.player.name}</td>
                    <td>${score.team.name}</td>
                    <td>${score.numberOfGoals}</td>
                    
                </tr>
        `;
    });
    
   

     scoreElement.innerHTML = `
                <div class="card" style="padding-left: 24px; padding-right: 24px; margin-top: 30px;">

                <table class="striped responsive-table">
                    <thead>
                        <tr>
                            
                            <th>Name</th>
                            <th>Team</th>
                            <th>Count</th>
                           
                        </tr>
                     </thead>
                    <tbody id="scorers">
                        ${scorers}
                    </tbody>
                </table>
                
                </div>
    `;
}

function showAllSave() {
    dbGetAllTeam().then(subs => {
        let listTeam = "";
        let teTeam =  document.getElementById("HomeTeam");
        subs.forEach(sub => {
            listTeam += `
            <tr>
              <td><img src="${sub.crestUrl.replace(/^http:\/\//i, 'https://')}" width="30px" alt="badge"/></td>
              <td>${sub.name}</td>
              <td>${sub.founded}</td>
              <td>${sub.venue}</td>
              <td>${sub.clubColors}</td>
              <td>${sub.address}</td>
              <td><button id="${sub.id}" class="removeButton">Delete</button></td>
            </tr>
            `;
        });
       
        teTeam.innerHTML = `
                <div class="card" style="padding-left: 24px; padding-right: 24px; margin-top: 30px;">
                <table class="striped responsive-table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Team Name</th>
                            <th>Founded</th>
                            <th>Venue</th>
                            <th>Club Colors</th>
                            <th>Address</th>
                            <th>Action</th>
                        </tr>
                     </thead>
                    <tbody id="listTeam">
                        ${listTeam}
                    </tbody>
                </table>
                </div>
    `;

    let removeButtons = document.querySelectorAll(".removeButton");
           for(let button of removeButtons) {
               button.addEventListener("click", function (event) {
                   let Id = event.target.id;
                   dbDeleteTeam(Id).then(() => {
                       console.log("id yg didelete "+ Id);
                       showAllSave();
                   })
               })
           }
        
    })
 }