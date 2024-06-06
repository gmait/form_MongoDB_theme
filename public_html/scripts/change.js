// Check time 
document.addEventListener('DOMContentLoaded', () => {    // use time 
    let currentHour = new Date().getHours();
    console.log(currentHour);
const body = document.body;
    if (currentHour >= 22 || currentHour < 6) {
        body.classList.add('night');
    } else if (currentHour < 22 || currentHour > 13) {
        body.classList.add('midday');
    } else { body.classList.add('day') };
});

//check localStorage for theme or 'day'
let theme = localStorage.getItem('theme') || 'day';
console.log(theme);
document.body.classList.add(theme);

//moon icon to toggle day and night
const toggleIcon = document.getElementById("toggleIcon");

toggleIcon.addEventListener('click', () => {
    // toggle theme
    if (theme === 'day') {
        theme = 'midday';
    } else if
        (theme === 'midday') {
        theme = 'night'
    } else {
        theme = 'day';
    }
    localStorage.setItem('theme', theme);

    document.body.classList.remove('day', 'midday', 'night');

    document.body.classList.add(theme);
});



const toggleButton = document.getElementById("toggleButton");

toggleButton.addEventListener('click', () => {
    // toggle theme
    if (theme === 'day') {
        theme = 'midday';
    } else if
        (theme === 'midday') {
        theme = 'night'
    } else {
        theme = 'day';
    }

    localStorage.setItem('theme', theme);

    document.body.classList.remove('day', 'midday', 'night');

    document.body.classList.add(theme);
});

// clock     

function updateTime() {
    let now = new Date();

    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    // Display currentTime
    const currentTimeElement = document.getElementById('currentTime');
    currentTimeElement.textContent = hours + ':' + minutes + ':' + seconds;
}

// Update time every second
setInterval(updateTime, 1000);

updateTime();



