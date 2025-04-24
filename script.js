let configDataObj;
let candidates;
function fetchGitHubUser(apiUrl, targetVar) {
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`GitHub User Not Found: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(`GitHub User Data from `, data);
            if (targetVar === "candidates") {
                candidates = data;  
                renderCandidates(data); 
            } else if (targetVar === "config") {
                configDataObj = data; 
                updateHeaderText(configDataObj)
            }
        })
        .catch(error => console.error("Error fetching data:", error));
}
fetchGitHubUser("https://anantprakashgupta.github.io/evmCOnfigData/evmdata.json", "candidates");
fetchGitHubUser("https://anantprakashgupta.github.io/AllConfig/allConfig.json", "config");


let voted = localStorage.getItem("voted") === "true";
let votedIndex = localStorage.getItem("votedIndex");

function updateHeaderText(config) {
    if (config) {
        document.getElementById("header").textContent = config[0].header || "";
        document.getElementById("header2").textContent = config[0].header2 || "";
        document.getElementById("header3").textContent = config[0].header3 || "";
       
    }
}

function renderCandidates(candidates) {
    const list = document.getElementById("candidates-list");
    list.innerHTML = ""; 

    candidates.forEach((candidate, index) => {
        const isNameEmpty = !candidate.name.trim(); // Check if name is empty or blank
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><img src="${candidate.img}" width="30"></td>
            <td>${candidate.name}</td>
            <td><img src="${candidate.symbol}" width="30"></td>
            <td style="white-space: nowrap;">
             ⇚ <button class="vote-btn" onclick="castVote(this)" data-index="${index}" 
                 ${voted || isNameEmpty ? "disabled" : ""}>Vote</button>
            </td>
            <td><div class="led" id="led-${index}"></div></td>
        `;
        list.appendChild(row);
    });

    if (voted && votedIndex !== null) {
        highlightVotedCandidate(votedIndex);
    }
}




let audio = new Audio('beep.mp3'); 
function castVote(button) {

    if (voted) {
        // displayMessage("You have already voted!", true);
        return;
    }
    audio.play();
    voted = true;
    const index = button.getAttribute("data-index");
    localStorage.setItem("voted", "true");
    localStorage.setItem("votedIndex", index);

    document.querySelectorAll(".vote-btn").forEach(btn => btn.disabled = true);
    highlightVotedCandidate(index);
    // displayMessage(`Successfully voted for ${candidates[index].name}!`, false);

    storeDatainExcel(candidates[index].name)
}

function highlightVotedCandidate(index) {
    document.getElementById("main-led").style.backgroundColor = "green";
    document.getElementById(`led-${index}`).style.backgroundColor = "#00ff62";
    // displayMessage(`You have already voted for ${candidates[index].name}.`, true);
}

// function displayMessage(text, isWarning) {
//     const messageElem = document.getElementById("message");
//     messageElem.textContent = text;
//     messageElem.classList.toggle("warning", isWarning);
// }

function resetVote() {
    localStorage.removeItem("voted");
    localStorage.removeItem("votedIndex");
    location.reload();
}
// renderCandidates();

const scriptURL = "https://script.google.com/macros/s/AKfycbwWF-HfqSwtkost7Xgirw-3nJ-RL0_jgNvMNHpA15efsAEO0Pqq7qvftQxO0fYOglup/exec";
function storeDatainExcel(userName){
    console.log({userName})
    fetch(scriptURL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({userName})
    }).then(() => {
        // displayMessage(`Successfully voted for ${userName}!`, false);
    }).catch(error => {
       console.log('error data not store!')
        console.error(error);
    })

}
    // function taskSchedular(date ,time){
    //     function getISTDate() {
    //         return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    //     }
    //     const [year, month, day] = date.split('-').map(Number);
    //     const [hours, minutes] = time.split(':').map(Number);
    //     const nowIST = getISTDate();

    //     const scheduledIST = new Date(year, month - 1, day, hours, minutes, 0);
    //     console.log("🕒 Current Time (Asia/Kolkata):", nowIST.toLocaleString());
    //     console.log("📅 Scheduled Time (Asia/Kolkata):", scheduledIST.toLocaleString());
    //     const checkInterval = setInterval(() => {
    //         const now = getISTDate();
    //         // console.log("⏳ Checking at:", now.toLocaleString());
    //         if (now >= scheduledIST) {
    //             console.log("🚀 Task Executed at:", now.toLocaleString());
    //             clearInterval(checkInterval);
    //         }
    //     }, 1000);
    // }

    // taskSchedular("2025-03-27", "11:51")

    // Get the current visit count
// Get last count from localStorage, default is 5 if not set


function visitorCount() {
    const scriptURL = "https://script.google.com/macros/s/AKfycbwWF-HfqSwtkost7Xgirw-3nJ-RL0_jgNvMNHpA15efsAEO0Pqq7qvftQxO0fYOglup/exec";

    fetch(scriptURL)
        .then(response => response.json())
        .then(data => {
            console.log("Last visitor count data:", data);
            if (!Array.isArray(data) || data.length < 1 || !Array.isArray(data[0]) || data[0].length < 4) {
                console.error("Invalid data format!");
                return;
            }
            let lastVisitorCount = parseInt(data[0][3], 10); 
            if (isNaN(lastVisitorCount)) lastVisitorCount = 0; 
            let lastCountNo = lastVisitorCount + 1;
            console.log("Updated visit count:", lastCountNo);

            fetch(scriptURL, {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lastCountNo }),  
            }).then(() => {
                console.log("Updated count in DataBase:", lastCountNo);
                document.body.innerHTML += `<p style="color: #3b2c2c;">Users visited: ${lastCountNo}</p>`;
            }).catch(error => {
                console.error("Error updating count:", error);
            });

        })
        .catch(error => {
            console.error("Error fetching data:", error);
            let loadingElement = document.getElementById("loading");
            if (loadingElement) {
                loadingElement.innerHTML = "<p style='color: red;'>❌ Error loading results. Please try again.</p>";
            }
        });
}
visitorCount();


