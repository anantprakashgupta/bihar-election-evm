function getDataFromExcel() {
    const scriptURL = "https://script.google.com/macros/s/AKfycbwWF-HfqSwtkost7Xgirw-3nJ-RL0_jgNvMNHpA15efsAEO0Pqq7qvftQxO0fYOglup/exec";
    
    // Show loading spinner before fetching data
    document.getElementById("loading").style.display = "block";
    document.getElementById("winnerSection").style.display = "none";
    document.getElementById("nameTable").style.display = "none";

    fetch(scriptURL)
    .then(response => response.json())
    .then(data => {
        console.log("Fetched Raw Data:", data); 
        
        if (!Array.isArray(data) || data.length < 2) {
            console.error("Invalid data format!");
            return;
        }

        let nameCount = {};
        let maxVotes = 0;
        let maxVotedNames = [];

        // Count votes
        for (let i = 1; i < data.length; i++) {
            let userName = data[i][0]; 
            if (userName) {
                nameCount[userName] = (nameCount[userName] || 0) + 1;

                // Track max votes
                if (nameCount[userName] > maxVotes) {
                    maxVotes = nameCount[userName];
                    maxVotedNames = [userName];
                } else if (nameCount[userName] === maxVotes) {
                    maxVotedNames.push(userName);
                }
            }
        }

        console.log("Unique Name Counts:", nameCount);
    
        document.getElementById("loading").style.display = "none";
        document.getElementById("winnerSection").style.display = "block";
        document.getElementById("nameTable").style.display = "block";
        displayNames(nameCount, maxVotedNames, maxVotes);
        launchConfetti();
    })
    .catch(error => {
        console.error("Error fetching data:", error);
        document.getElementById("loading").innerHTML = "<p style='color: red;'>❌ Error loading results. Please try again.</p>";
    });
}

function displayNames(nameCount, maxVotedNames, maxVotes) {
    let outputDiv = document.getElementById("nameTable");
    let winnerDiv = document.getElementById("winnerSection");

    outputDiv.innerHTML = ""; 
    winnerDiv.innerHTML = "";
    let table = `<table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Vote Count</th>
                        </tr>
                    </thead>
                    <tbody>`;

    for (let name in nameCount) {
        table += `<tr>
                    <td>${name}</td>
                    <td>${nameCount[name]}</td>
                  </tr>`;
    }

    table += `</tbody></table>`;
    outputDiv.innerHTML = table;
    if (maxVotedNames.length > 0) {
        winnerDiv.innerHTML = `<div class="winner-box">
            <h3>🏆 Highest Votes: ${maxVotes}</h3>
            <p>${maxVotedNames.join(", ")}</p>
        </div>`;
    }
}

function launchConfetti() {
    var duration = 5 * 1000; // 5 seconds
    var end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 2,  // Reduce particles
            angle: 60,
            spread: 10,  // Reduce spread
            origin: { x: 0 }
        });

        confetti({
            particleCount: 2,  // Reduce particles
            angle: 120,
            spread: 10,  // Reduce spread
            origin: { x: 1 }
        });

        if (Date.now() < end) {
            setTimeout(() => requestAnimationFrame(frame), 200); // Increase delay between frames
        }
    })();
}

getDataFromExcel();
