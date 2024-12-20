document.addEventListener('DOMContentLoaded', () => {
    const userName = localStorage.getItem('userName');
    const userRole = localStorage.getItem('userRole');

    // Check if the user is logged in
    if (!userName || !userRole) {
        alert('You are not logged in.');
        window.location.href = '/index.html';
        return;
    }

    // Display user information on the dashboard
    if (userRole === "Agent") {
        document.getElementById('user-name').textContent = `Welcome, ${userRole} ${userName}!`;
    } 
    else if (userRole === "Buyer") {
        document.getElementById('user-name').textContent = `Welcome, ${userName}!`;
    }

    //document.getElementById('user-name').textContent = `Welcome, ${userRole},${userName}!`;
    // document.getElementById('user-role').textContent = `Role: ${userRole}`;
});


