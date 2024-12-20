const MAX_PROPERTIES = 50;

// Function to add property
function addProperty(picture, name, price) {
    const newProperty = { picture, name, price };
    fetch('http://localhost:3300/api/properties', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProperty)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Property added:', data);
        displayProperties();
    })
    .catch(error => {
        console.error('Error adding property:', error);
    });
}

// Function to delete property
function deleteProperty(index) {
    fetch(`http://localhost:3300/api/properties/${index}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        displayProperties();
    })
    .catch(error => {
        console.error('Error deleting property:', error);
    });
}

// Function to create property element with styling
function createPropertyElement(property, index, isAdmin = false) {
    const propertyElement = document.createElement('div');
    propertyElement.className = 'property-item';
    propertyElement.style.cssText = `
        margin: 10px;
        /*padding: 10px;*/
        border-radius: 8px;
        /*box-shadow: 0 2px 4px rgba(0,0,0,0.1);*/
        /*background: white;*/
        /*width: 50%;*/
    `;

    const image = document.createElement('img');
    image.src = property.picture;
    image.alt = property.name;
    image.style.cssText = `
        width: 15rem;
        height: 200px;
        object-fit: cover;
        border-radius: 4px;
    `;

    const name = document.createElement('h4');
    name.textContent = property.name;
    name.style.cssText = `
        margin: 8px 0;
        color: #333;
    `;

    const price = document.createElement('p');
    price.textContent = `Price: ${property.price}`;
    price.style.cssText = `
        color: #666;
        margin-bottom: 10px;
    `;

    propertyElement.appendChild(image);
    propertyElement.appendChild(name);
    propertyElement.appendChild(price);

    if (isAdmin) {
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-btn';
        deleteButton.onclick = () => deleteProperty(index);
        deleteButton.style.cssText = `
            background: #ff4444;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
        `;
        propertyElement.appendChild(deleteButton);
    }

    return propertyElement;
}

// Function to display properties
function displayProperties() {
    fetch('http://localhost:3300/api/properties')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(properties => {
        // Handle admin section (agent dashboard)
        const adminSection = document.getElementById('admin-section');
        if (adminSection) {
            adminSection.innerHTML = '';
            const adminContainer = document.createElement('div');
            adminContainer.style.cssText = `
                display: grid;
                grid-template-columns: 33.33% 33.33% 33.33%;;
                gap: 20px;
            `;
            properties.forEach((property, index) => {
                adminContainer.appendChild(createPropertyElement(property, index, true));
            });
            adminSection.appendChild(adminContainer);
        }

        // Handle user section (user dashboard)
        const userSection = document.getElementById('user-section');
        if (userSection) {
            userSection.innerHTML = '';
            const userContainer = document.createElement('div');
            userContainer.style.cssText = `
                display: grid;
                grid-template-columns: 33.33% 33.33% 33.33%;
                gap: 20px;
            `;
            properties.forEach((property, index) => {
                userContainer.appendChild(createPropertyElement(property, index, false));
            });
            userSection.appendChild(userContainer);
        }
    })
    .catch(error => {
        console.error('Error fetching properties:', error);
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'Error loading properties. Please refresh the page.';
        errorMessage.style.color = 'red';
        
        const container = document.getElementById('admin-section') || document.getElementById('user-section');
        if (container) {
            container.appendChild(errorMessage);
        }
    });
}

// Make functions available globally
window.addProperty = addProperty;
window.deleteProperty = deleteProperty;
window.displayProperties = displayProperties;

// Initialize properties display when DOM is loaded
document.addEventListener('DOMContentLoaded', displayProperties);