document.getElementById('signup-form').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent default form submission

    // Get form input values
    const name = document.getElementById('name').value ;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const phone = document.getElementById('phone-number').value;
    const password = document.getElementById('password').value;
    
    const role = "Agent"; // Assuming there's a role selection in the form, e.g. "buyer" or "agent"

    const submitButton = e.target.querySelector('button');
    submitButton.disabled = true;
    submitButton.textContent = 'Creating Account...';

    try {
        // Send sign-up data to the backend API
        const response = await fetch('https://estate-manager.onrender.com/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, address, phone, password, role })
        });

        if (response.ok) {
            const data = await response.json();
            alert(data.message || 'Account created successfully!');
            window.location.href = '/html-files/agentLogin.html'; // Redirect to login page after successful sign-up
        } else {
            const error = await response.json();
            alert(error.message || 'Account creation failed. Please try again.');
        }
    } catch (err) {
        console.error('Error:', err);
        alert('An error occurred while connecting to the server.');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Create Account';
    }
});
