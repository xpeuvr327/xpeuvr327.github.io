
function handleFile(event) {
    console.log('File input changed');
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            console.log('File loaded successfully');
            const conversationText = e.target.result;
            
            processConversation(conversationText);
        };
        reader.readAsText(file);
    }
}

function processConversation(conversationText) {
    console.log('Processing conversation');
    
    const memberStatistics = extractMemberStatistics(conversationText);
    console.log('Member statistics extracted:', memberStatistics);
    
    updateMemberStatisticsUI(memberStatistics);
    
    const onlineStatusData = extractOnlineStatusData(conversationText);
    console.log('Online status data extracted:', onlineStatusData);
    
    updateGraphicsUI(memberStatistics);
}

function extractMemberStatistics(conversationText) {
    console.log('Extracting member statistics');
    const lines = conversationText.split('\n');
    const memberStatistics = {
        totalMembers: 0,
        memberNames: [],
        messageCounts: {}
    };
    lines.forEach(line => {
        const match = line.match(/^\d{2}\.\d{2}\.\d{2}, \d{2}:\d{2} - ([^\n]+?):/);
        if (match) {
            const sender = match[1];
            if (!memberStatistics.memberNames.includes(sender)) {
                memberStatistics.totalMembers++;
                memberStatistics.memberNames.push(sender);
            }
            memberStatistics.messageCounts[sender] = (memberStatistics.messageCounts[sender] || 0) + 1;
        }
    });
    return memberStatistics;
}

function updateMemberStatisticsUI(memberStatistics) {
    console.log('Updating member statistics UI');
    const memberStatsSection = document.getElementById('memberStatistics');
    
    let totalMembersDiv = memberStatsSection.querySelector('#totalMembers');
    if (!totalMembersDiv) {
        totalMembersDiv = document.createElement('div');
        totalMembersDiv.id = 'totalMembers';
        memberStatsSection.appendChild(totalMembersDiv);
    }
    totalMembersDiv.textContent = `Total Members: ${memberStatistics.totalMembers}`;
    
    let memberNamesDiv = memberStatsSection.querySelector('#memberNames');
    if (!memberNamesDiv) {
        memberNamesDiv = document.createElement('div');
        memberNamesDiv.id = 'memberNames';
        memberStatsSection.appendChild(memberNamesDiv);
    }
    memberNamesDiv.innerHTML = `Member Names: ${memberStatistics.memberNames.join(', ')}`;
}

function extractOnlineStatusData(conversationText) {
    console.log('Extracting online status data');
    const lines = conversationText.split('\n');
    const onlineStatusData = [];
    lines.forEach(line => {
        const match = line.match(/^(\d{2}\.\d{2}\.\d{2}, \d{2}:\d{2}) - ([^\n]+?):/);
        if (match) {
            const timestamp = new Date(match[1].replace(/(\d{2}\.\d{2}\.\d{2}, \d{2}:\d{2})/, '$2 $1 GMT+0000'));
            const sender = match[2];
            if (!isNaN(timestamp)) {  
                onlineStatusData.push({ timestamp, sender, status: 'online' });
            }
        }
    });
    return onlineStatusData;
}

function updateGraphicsUI(memberStatistics) {
    console.log('Updating graphics UI');
    const graphicsSection = document.getElementById('graphics');
    const sortedMembers = Object.entries(memberStatistics.messageCounts).sort((a, b) => b[1] - a[1]);
    const totalMessages = sortedMembers.reduce((total, [name, count]) => total + count, 0);
    let leaderboardDiv = graphicsSection.querySelector('#leaderboard');
    if (!leaderboardDiv) {
        leaderboardDiv = document.createElement('div');
        leaderboardDiv.id = 'leaderboard';
        graphicsSection.appendChild(leaderboardDiv);
    }
    leaderboardDiv.innerHTML = `<h2>Ceux qui ont le plus parlé</h2>${sortedMembers.slice(0, 1000).map((entry, index) => {
        const [name, count] = entry;
        const percentage = ((count / totalMessages) * 100).toFixed(2);
        return `<p>${index + 1}. ${name} - ${count} messages (${percentage}%)</p>`;
    }).join('')}`;
    let canvasElement = graphicsSection.querySelector('#lifetimeMessagesChart');
    if (!canvasElement) {
        canvasElement = document.createElement('canvas');
        canvasElement.id = 'lifetimeMessagesChart';
        graphicsSection.appendChild(canvasElement);
    }
    
    const chartData = {
        labels: memberStatistics.memberNames,
        datasets: [{
            label: 'Lifetime Messages',
            data: memberStatistics.memberNames.map(name => memberStatistics.messageCounts[name] || 0),
            backgroundColor: 'rgba(255, 99, 132, 0.2)', 
            borderColor: 'rgba(255, 99, 132, 1)', 
            borderWidth: 1
        }]
    };
    console.log('Chart Data:', chartData);
    
    const ctx = canvasElement.getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
            scales: {
                x: { stacked: true },
                y: { stacked: true }
            }
        }
    });
}

function getUserLang(){
    const userLang = navigator.language || navigator.userLanguage;
    return userLang;
}

document.getElementById('fileInput').addEventListener('change', handleFile);
