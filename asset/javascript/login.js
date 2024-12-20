document.getElementById('login-form').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent default form submission

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const submitButton = e.target.querySelector('button');
    submitButton.disabled = true;
    submitButton.textContent = 'Signing In...';

    try {
        // Send login credentials to the backend API
        const response = await fetch('https://estate-manager.onrender.com/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            const payload = JSON.parse(atob(data.token.split('.')[1]));

            // Save the token to localStorage
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userName', payload.name);
            localStorage.setItem('userRole', payload.role);

            // Redirect based on user role
            if (data.role === 'Buyer') {
                window.location.href = './userDashboard.html'; // Redirect to user dashboard
            } else if (data.role === 'Agent') {
                window.location.href = './agentDashboard.html'; // Redirect to agent dashboard
            } else {
                alert('Invalid role detected. Please contact support.');
            }
        } else {
            const error = await response.json();
            alert(error.message || 'Login failed. Please try again.');
        }
    } catch (err) {
        console.error('Error:', err);
        alert('An error occurred while connecting to the server.');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Sign In';
    }
});
