let currentWeek;

window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const weekParam = urlParams.get('week');
    if (weekParam) {
        currentWeek = parseInt(weekParam, 10);
    } else {
        const startDate = new Date('2024-08-24');
        const currentDate = new Date();
        const diffInDays = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24));
        currentWeek = Math.ceil(diffInDays / 7);
    }

    loadWeek(currentWeek);
    loadProfiles();
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
            alert('Cette semaine n\'a pas encore été créée.');
        });
}

function displayPlanner(data) {
    let table = document.getElementById('planner');
    table.innerHTML = '';

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
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

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
                    let heureCell = document.querySelector(`tr:nth-child(${i + 2}) td:first-child`);
                    if (heureCell) {
                        heureCell.innerHTML += `<br>${timeData.times[i].start} - ${timeData.times[i].end}`;
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
            selectElement.innerHTML = '';

            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Choisissez un profil';
            selectElement.appendChild(defaultOption);

            profiles.forEach(profile => {
                const option = document.createElement('option');
                option.value = profile.value;
                option.textContent = profile.name;
                selectElement.appendChild(option);
            });

            const urlParams = new URLSearchParams(window.location.search);
            const profileParam = urlParams.get('week');
            if (profileParam) {
                selectElement.value = profileParam;
            }

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

