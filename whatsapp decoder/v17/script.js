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

    // Extract lifetime message data
    const lifetimeMessagesData = extractLifetimeMessagesData(conversationText);
    console.log('Lifetime messages data extracted:', lifetimeMessagesData);

    // Update lifetime messages chart in the UI
    updateLifetimeMessagesChart(lifetimeMessagesData);

    // Extract online status data for the last 30 days
    const onlineStatusData = extractOnlineStatusData(conversationText, 30);
    console.log('Online status data extracted:', onlineStatusData);

    // Update online status chart in the UI
    updateOnlineStatusChart(onlineStatusData);
}

// Function to extract lifetime messages data
function extractLifetimeMessagesData(conversationText) {
    console.log('Extracting lifetime messages data');

    const lines = conversationText.split('\n');
    const lifetimeMessagesData = [];

    lines.forEach(line => {
        const match = line.match(/^\d{2}\.\d{2}\.\d{2}, \d{2}:\d{2} - ([\w\s-]+):/);
        if (match) {
            const sender = match[1];

            const existingEntry = lifetimeMessagesData.find(entry => entry.sender === sender);
            if (existingEntry) {
                existingEntry.messageCount++;
            } else {
                lifetimeMessagesData.push({ sender, messageCount: 1 });
            }
        }
    });

    return lifetimeMessagesData;
}

// Function to update lifetime messages chart in the UI
function updateLifetimeMessagesChart(lifetimeMessagesData) {
    console.log('Updating lifetime messages chart UI');

    const lifetimeMessagesSection = document.getElementById('lifetimeMessages');

    // Clear existing content
    lifetimeMessagesSection.innerHTML = '';

    // Create a canvas element for the chart
    const canvasElement = document.createElement('canvas');
    canvasElement.id = 'lifetimeMessagesChart';
    lifetimeMessagesSection.appendChild(canvasElement);

    // Prepare data for the chart
    const chartData = {
        labels: lifetimeMessagesData.map(entry => entry.sender),
        datasets: [{
            label: 'Lifetime Messages',
            data: lifetimeMessagesData.map(entry => entry.messageCount),
            backgroundColor: 'rgba(255, 99, 132, 0.2)', // Red background
            borderColor: 'rgba(255, 99, 132, 1)', // Red border
            borderWidth: 1
        }]
    };

    // Create the chart
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

// Function to extract online status data
function extractOnlineStatusData(conversationText, days) {
    console.log('Extracting online status data');

    const lines = conversationText.split('\n');
    const onlineStatusData = [];
    const currentDate = new Date();
    const thresholdDate = new Date();
    thresholdDate.setDate(currentDate.getDate() - days);

    lines.forEach(line => {
        const match = line.match(/^(\d{2}\.\d{2}\.\d{2}, \d{2}:\d{2}) - (\w+):/);
        if (match) {
            const timestamp = new Date(match[1].replace(/(\d{2}\.\d{2}\.\d{2}, \d{2}:\d{2})/, '$2 $1 GMT+0000'));
            const sender = match[2];

            if (!isNaN(timestamp) && timestamp >= thresholdDate) {
                const existingEntry = onlineStatusData.find(entry => entry.sender === sender);
                if (existingEntry) {
                    existingEntry.statusCount++;
                } else {
                    onlineStatusData.push({ sender, statusCount: 1 });
                }
            }
        }
    });

    return onlineStatusData;
}

// Function to update online status chart in the UI
function updateOnlineStatusChart(onlineStatusData) {
    console.log('Updating online status chart UI');

    const onlineStatusSection = document.getElementById('onlineStatus');

    // Clear existing content
    onlineStatusSection.innerHTML = '';

    // Create a canvas element for the chart
    const canvasElement = document.createElement('canvas');
    canvasElement.id = 'onlineStatusChart';
    onlineStatusSection.appendChild(canvasElement);

    // Prepare data for the chart
    const chartData = {
        labels: onlineStatusData.map(entry => entry.sender),
        datasets: [{
            label: 'Online Status (Last 30 days)',
            data: onlineStatusData.map(entry => entry.statusCount),
            backgroundColor: 'rgba(0, 123, 255, 0.2)', // Light blue background
            borderColor: 'rgba(0, 123, 255, 1)', // Light blue border
            borderWidth: 1
        }]
    };

    // Create the chart
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
