document.addEventListener('DOMContentLoaded', () => {
    const clockInButton = document.getElementById('clock-in-btn');
    const clockOutButton = document.getElementById('clock-out-btn');
    const attendanceStatusElement = document.getElementById('attendance-status');
    const dateTimeElement = document.getElementById('date-time');
    const attendanceLogTableBody = document.querySelector('#attendance-log-table tbody');
    const successMessage = document.getElementById('message');
    const errorMessage = document.getElementById('error-message');
    const presentDaysElement = document.getElementById('present-days');
    const absentDaysElement = document.getElementById('absent-days');
    const weekOffElement = document.getElementById('week-off');
    const holidaysElement = document.getElementById('holidays');
    const logoutButton = document.getElementById('logout-btn');

    let currentDateTime = new Date();
    let clockInTime = null;
    let clockOutTime = null;
    let attendanceData = JSON.parse(localStorage.getItem('attendanceData')) || [];

    // Show the current date and time
    function updateDateTime() {
        currentDateTime = new Date();
        dateTimeElement.textContent = `Date & Time: ${currentDateTime.toLocaleString()}`;
    }

    // Display attendance logs in the table
    function displayAttendanceLogs() {
        attendanceLogTableBody.innerHTML = ''; // Clear the existing rows

        attendanceData.forEach(log => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${log.date}</td>
                <td>${log.clockInTime || 'N/A'}</td>
                <td>${log.clockOutTime || 'N/A'}</td>
                <td>${log.status || 'Absent'}</td>
            `;
            attendanceLogTableBody.appendChild(row);
        });

        updateStats();
    }

    // Update stats (Present, Absent, Week Off, Holidays)
    function updateStats() {
        const presentDays = attendanceData.filter(log => log.status === 'Present').length;
        const absentDays = attendanceData.filter(log => log.status === 'Absent').length;
        const weekOffDays = attendanceData.filter(log => log.status === 'Week Off').length;
        const holidays = attendanceData.filter(log => log.status === 'Holiday').length;

        presentDaysElement.textContent = presentDays;
        absentDaysElement.textContent = absentDays;
        weekOffElement.textContent = weekOffDays;
        holidaysElement.textContent = holidays;
    }

    // Clock In function
    clockInButton.addEventListener('click', () => {
        clockInTime = new Date().toLocaleTimeString();
        const currentDate = currentDateTime.toLocaleDateString();

        // Update attendance data
        const attendance = {
            date: currentDate,
            clockInTime,
            clockOutTime: null,
            status: 'Not Clocked Out'
        };

        attendanceData.push(attendance);
        localStorage.setItem('attendanceData', JSON.stringify(attendanceData));

        // Update UI
        attendanceStatusElement.innerHTML = `Attendance Status: <strong>Clocked In</strong>`;
        clockInButton.style.display = 'none';
        clockOutButton.style.display = 'inline-block';
        successMessage.textContent = 'Clocked In Successfully!';

        displayAttendanceLogs();
    });

    // Clock Out function
    clockOutButton.addEventListener('click', () => {
        clockOutTime = new Date().toLocaleTimeString();
        const currentDate = currentDateTime.toLocaleDateString();

        // Find the last clock-in record and update it with clock-out time
        const lastLog = attendanceData.find(log => log.date === currentDate && !log.clockOutTime);
        if (lastLog) {
            lastLog.clockOutTime = clockOutTime;
            lastLog.status = 'Present';
        }

        // Save updated attendance data
        localStorage.setItem('attendanceData', JSON.stringify(attendanceData));

        // Update UI
        attendanceStatusElement.innerHTML = `Attendance Status: <strong>Clocked Out</strong>`;
        clockInButton.style.display = 'inline-block';
        clockOutButton.style.display = 'none';
        successMessage.textContent = 'Clocked Out Successfully!';

        displayAttendanceLogs();
    });

    // Logout function
    logoutButton.addEventListener('click', () => {
        // Clear the localStorage
        localStorage.removeItem('attendanceData');
        
        // Redirect to login page
        window.location.href = '/login.html';
    });

    // Initial fetch and setup
    setInterval(updateDateTime, 1000); // Update time every second
    displayAttendanceLogs();  // Display attendance logs when the page loads
});
