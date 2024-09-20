let currentWeek = 1;

window.onload = function() {
    // Parse the query parameter to get the initial week
    const urlParams = new URLSearchParams(window.location.search);
    const weekParam = urlParams.get('week');
    if (weekParam) {
        currentWeek = parseInt(weekParam, 10);
    } else {
        // Calculate the week number based on the current date
        const startDate = new Date('2024-08-26');
        const currentDate = new Date();
        const diffInDays = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24));
        currentWeek = Math.ceil(diffInDays / 7);
    }

    loadProfiles();

    // Load the default week only if no profile is selected
    if (!urlParams.get('profile')) {
        loadWeek(currentWeek);
    }
        // Add event listeners for navigation buttons
    document.getElementById('prevWeek').addEventListener('click', function() {
        if (currentWeek > 1) {
            currentWeek--;
            loadWeek(currentWeek);
        }
    });

    document.getElementById('nextWeek').addEventListener('click', function() {
        currentWeek++;
        loadWeek(currentWeek);
        console.log(currentWeek);
    });
};

function loadWeek(week) {
    fetch(`weeks/week${week < 10 ? '0' + week : week}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            sessionStorage.setItem(`week${week}`, JSON.stringify(data));
            console.log(`Week ${week} data loaded from JSON:`, data);
            displayPlanner(data);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
            // Ask for confirmation before generating new week data
            if (confirm('Voulez-vous créer une nouvelle semaine? (Reset après reload)')) {
                // Generate new week data
                const newWeekData = generateNewWeekData(week);
                sessionStorage.setItem(`week${week}`, JSON.stringify(newWeekData));
                displayPlanner(newWeekData);
            }
        });
}

function generateNewWeekData(week) {
    const startDate = new Date('2024-08-26');
    startDate.setDate(startDate.getDate() + (week - 1) * 7);

    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
    const newWeekDays = [];

    for (let i = 0; i < days.length; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        newWeekDays.push(`${days[i]} ${currentDate.getDate()}`);
    }

    const schedule = {};
    newWeekDays.forEach(day => {
        schedule[day] = [];
    });

    return {
        days: newWeekDays,
        schedule: schedule
    };
}

function displayPlanner(data) {
    let table = document.getElementById('planner');
    table.innerHTML = '';

    // Create table headers
    let headerRow = document.createElement('tr');
    let header = document.createElement('th');
    header.textContent = 'Heure/Jour';
    headerRow.appendChild(header);
    for(let day of data.days) {
        header = document.createElement('th');
        header.textContent = day;
        headerRow.appendChild(header);
    }
    table.appendChild(headerRow);

    // Create table data
    for(let i = 0; i < 11; i++) {
        let row = document.createElement('tr');
        let cell = document.createElement('td');
        cell.textContent = `Heure ${i + 1}`;
        row.appendChild(cell);
        for(let day of data.days) {
            cell = document.createElement('td');
            cell.id = day.toLowerCase() + (i + 1);
            if(data.schedule[day]) {
                let event = data.schedule[day].find(e => e.period === i + 1);
                if(event) {
                    cell.textContent = `${event.subject} - ${event.notes}`;
                }
            }
            // Add event listener to the cell
            cell.addEventListener('click', function() {
                let period = i + 1;
                let subject = prompt('Entrez le sujet de l\'événement');
                if (subject === null) {
                    return; // User clicked cancel, do nothing
                }
                let notes = prompt('Entrez des notes pour l\'événement');

                let event = {
                    period: period,
                    subject: subject,
                    notes: notes
                };

                if (!data.schedule[day]) {
                    data.schedule[day] = [];
                }

                // Find the index of the existing event for the specified period
                let eventIndex = data.schedule[day].findIndex(e => e.period === event.period);

                if (eventIndex !== -1) {
                    // Update the existing event
                    data.schedule[day][eventIndex] = event;
                } else {
                    // Add the new event
                    data.schedule[day].push(event);
                }

                sessionStorage.setItem(`week${currentWeek}`, JSON.stringify(data));
                console.log(`Event created/updated for week ${currentWeek}:`, data);
                displayPlanner(data);
            });
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    // Add time display feature
    if (data.timeScheme) {
        fetch(`time${data.timeScheme}.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(timeData => {
                for (let i = 0; i < timeData.times.length; i++) {
                    // Select the first column of each row (i.e., the 'Heure' column)
                    let heureCell = document.querySelector(`tr:nth-child(${i + 2}) td:first-child`);

                    // Prevent duplicate time display by checking if the time is already added
                    if (heureCell && !heureCell.dataset.timeAdded) {
                        heureCell.innerHTML += `<br>${timeData.times[i].start} - ${timeData.times[i].end}`;
                        heureCell.setAttribute('data-time-added', 'true');
                    }
                }
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
    }
}

function loadProfiles() {
    fetch('profiles.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(profiles => {
            const selectElement = document.getElementById('nameSelect');
            selectElement.innerHTML = ''; // Clear existing options

            // Add a default option
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Choisissez un profil';
            selectElement.appendChild(defaultOption);

            // Add profile options
            profiles.forEach(profile => {
                const option = document.createElement('option');
                option.value = profile.value;
                option.textContent = profile.name;
                selectElement.appendChild(option);
            });

            // Set the current profile based on the query parameter or default
            const urlParams = new URLSearchParams(window.location.search);
            const profileParam = urlParams.get('week');
            if (profileParam) {
                selectElement.value = profileParam;
            }

// Add event listener to update URL when a profile is selected
selectElement.addEventListener('change', function() {
    const selectedProfile = selectElement.value;
    if (selectedProfile) {
        const newUrl = new URL(window.location);
        newUrl.searchParams.set('week', selectedProfile);
        window.history.pushState({}, '', newUrl);
        currentWeek = parseInt(selectedProfile, 10);
        loadWeek(currentWeek);
    }
});

        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

document.getElementById('downloadUpdatedJson').addEventListener('click', function() {
    const data = JSON.parse(sessionStorage.getItem(`week${currentWeek}`));
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data))}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = `week${currentWeek}.json`;
    link.click();
});
