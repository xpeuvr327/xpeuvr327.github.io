// Function to handle file input change
function handleFile(event) {
    console.log('File input changed');

    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            console.log('File loaded successfully');

            const conversationText = e.target.result;

            // Call the processConversation function with the conversation text
            processConversation(conversationText);
        };

        reader.readAsText(file);
    }
}

// Function to process conversation text
function processConversation(conversationText) {
    console.log('Processing conversation');

    // Extract member statistics
    const memberStatistics = extractMemberStatistics(conversationText);
    console.log('Member statistics extracted:', memberStatistics);

    // Update member statistics in the UI
    updateMemberStatisticsUI(memberStatistics);

    // Extract online status data
    const onlineStatusData = extractOnlineStatusData(conversationText);
    console.log('Online status data extracted:', onlineStatusData);

    // Update graphics in the UI
    updateGraphicsUI(onlineStatusData);
}

// Function to extract member statistics
function extractMemberStatistics(conversationText) {
    console.log('Extracting member statistics');

    const lines = conversationText.split('\n');
    const memberStatistics = {
        totalMembers: 0,
        memberNames: [],
        messageCounts: {}
    };

    lines.forEach(line => {
        const match = line.match(/^\d{2}\.\d{2}\.\d{2}, \d{2}:\d{2} - (\w+):/);
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

// Function to update member statistics in the UI
function updateMemberStatisticsUI(memberStatistics) {
    console.log('Updating member statistics UI');

    const memberStatsSection = document.getElementById('memberStatistics');

    // Create or update a div element to display total members
    let totalMembersDiv = memberStatsSection.querySelector('#totalMembers');
    if (!totalMembersDiv) {
        totalMembersDiv = document.createElement('div');
        totalMembersDiv.id = 'totalMembers';
        memberStatsSection.appendChild(totalMembersDiv);
    }
    totalMembersDiv.textContent = `Total Members: ${memberStatistics.totalMembers}`;

    // Create or update a div element to display member names
    let memberNamesDiv = memberStatsSection.querySelector('#memberNames');
    if (!memberNamesDiv) {
        memberNamesDiv = document.createElement('div');
        memberNamesDiv.id = 'memberNames';
        memberStatsSection.appendChild(memberNamesDiv);
    }
    memberNamesDiv.innerHTML = `Member Names: ${memberStatistics.memberNames.join(', ')}`;
}

// Function to extract online status data
function extractOnlineStatusData(conversationText) {
    console.log('Extracting online status data');

    const lines = conversationText.split('\n');
    const onlineStatusData = [];

    lines.forEach(line => {
        const match = line.match(/^\d{2}\.\d{2}\.\d{2}, \d{2}:\d{2} - (\w+):/);
        if (match) {
            const timestamp = new Date(match[1]);
            const sender = match[2];

            onlineStatusData.push({ timestamp, sender, status: 'online' });
        }
    });

    return onlineStatusData;
}

// Function to update graphics in the UI
function updateGraphicsUI(onlineStatusData) {
    console.log('Updating graphics UI');

    const graphicsSection = document.getElementById('graphics');

    // Create a canvas element for the chart
    let canvasElement = graphicsSection.querySelector('#onlineStatusChart');
    if (!canvasElement) {
        canvasElement = document.createElement('canvas');
        canvasElement.id = 'onlineStatusChart';
        graphicsSection.appendChild(canvasElement);
    }

    // Extract unique member names
    const uniqueMembers = [...new Set(onlineStatusData.map(entry => entry.sender))];

    // Prepare data for the chart
    const chartData = {
        labels: onlineStatusData.map(entry => entry.timestamp.toLocaleTimeString()),
        datasets: uniqueMembers.map(member => {
            const memberData = onlineStatusData
                .filter(entry => entry.sender === member)
                .map(entry => entry.status === 'online' ? 1 : 0);

            return {
                label: member,
                data: memberData,
                borderColor: getRandomColor(),
                backgroundColor: 'rgba(0, 123, 255, 0.2)', // Light blue background
                borderWidth: 1
            };
        })
    };

    // Create or update the chart
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

// Helper function to get a random color
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Attach the handleFile function to the file input change event
document.getElementById('fileInput').addEventListener('change', handleFile);

console.log('Script loaded');
