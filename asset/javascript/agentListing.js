// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize display of properties
  displayProperties();

  // Get user info from token and update welcome message
  const token = localStorage.getItem("authToken");
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userNameElement = document.getElementById("user-name");
      if (userNameElement && payload.name) {
        userNameElement.textContent = `Welcome ${payload.name}!`;
      }
    } catch (error) {
      console.error("Error parsing token:", error);
    }
  }
});

document
  .getElementById("property-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Please log in to add properties");
        return;
      }

      const formData = new FormData(this);
      const property = {
        title: formData.get("title"),
        description: formData.get("description"),
        type: formData.get("type"),
        price: parseFloat(formData.get("price")),
        amenities: formData
          .get("amenities")
          .split(",")
          .map((item) => item.trim()),
        status: formData.get("status"),
        // Change this part
        location: {
          address: formData.get("address")  // or formData.get("address") depending on your form field name
        }
      };

      // Add this validation before the image compression
if (!property.price || isNaN(property.price)) {
    alert("Please enter a valid price");
    return;
  }
  
  if (!property.location.address) {
    alert("Please enter a valid address");
    return;
  }

      const picture = formData.get("picture");
      if (picture) {
        // Ensure file size is below the initial 5MB limit
        if (picture.size > 5 * 1024 * 1024) {
          alert("Image size exceeds 5MB. Please upload a smaller file.");
          return;
        }

        // Compress the image using CompressorJS
        new Compressor(picture, {
          quality: 0.6, // Compression quality (adjust as needed)
          maxWidth: 1024, // Resize width
          maxHeight: 1024, // Resize height
          success(result) {
            const reader = new FileReader();
            reader.onload = async function (e) {
              try {
                property.images = [e.target.result]; // Convert to Base64

                // Send the property data to the server
                const response = await fetch(
                  "https://estate-manager.onrender.com/api/properties",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(property),
                  }
                );

                if (!response.ok) {
                  const errorData = await response.json();
                  throw new Error(errorData.message || "Failed to add property");
                }

                const result = await response.json();
                alert("Property added successfully!");
                window.location.href = "/html-files/agentDashboard.html";
              } catch (error) {
                console.error("Detailed error:", error);
                alert(`Error adding property: ${error.message}`);
              }
            };

            reader.onerror = function (error) {
              console.error("FileReader error:", error);
              alert("Error reading compressed image file");
            };

            reader.readAsDataURL(result); // Read the compressed image
          },
          error(err) {
            console.error("Compression error:", err);
            alert("Failed to compress image. Please try again.");
          },
        });
      } else {
        alert("Please upload an image.");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      alert(`Error: ${error.message}`);
    }
  });

// Displaying of properties for Agent
async function displayProperties() {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(
      "https://estate-manager.onrender.com/api/properties",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch properties");
    }

    const properties = await response.json();
    const adminSection = document.getElementById("admin-section");

    if (!adminSection) {
      console.error("Admin section element not found");
      return;
    }

    if (properties.length === 0) {
      adminSection.innerHTML = "<p>No properties listed yet.</p>";
      return;
    }

    adminSection.innerHTML = properties
      .map(
        (property) => `
            <div class="property-card">
                ${
                  property.images && property.images[0]
                    ? `<img src="${property.images[0]}" alt="${property.title}" 
                         onerror="this.src='../asset/images/placeholder.jpg'" 
                         style="max-width: 200px;">`
                    : '<div class="no-image">No image available</div>'
                }
                <h2>${escapeHtml(property.title)}</h2>
                <p>${escapeHtml(property.description)}</p>
                <p>Type: ${escapeHtml(property.type)}</p>
                <p>Price: $${escapeHtml(String(property.price))}</p>
                <p>Amenities: ${property.amenities
                  .map((a) => escapeHtml(a))
                  .join(", ")}</p>
                <p>Status: ${escapeHtml(property.status)}</p>
                <p>Location: ${property.location && property.location.address ? escapeHtml(property.location.address) : 'Address not provided'}</p>
<button class="delete-btn" data-property-id="${property._id}">Delete</button>
            </div>
        `
      )
      .join("");
  } catch (error) {
    console.error("Error fetching properties:", error);
    const adminSection = document.getElementById("admin-section");
    if (adminSection) {
      adminSection.innerHTML =
        '<p class="error">Error loading properties. Please try again later.</p>';
    }
  }
};

// Helper function to prevent XSS
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}


// Function to delete property
async function deleteProperty(propertyId) {
    console.log('Delete function called with ID:', propertyId); // Debug log

    if (!confirm("Are you sure you want to delete this property?")) {
        return;
    }

    try {
        const token = localStorage.getItem("authToken");
        if (!token) {
            console.log('No token found'); // Debug log
            alert("Please log in to delete properties");
            window.location.href = "./agentLogin.html";
            return;
        }

        console.log('Making delete request for property:', propertyId); // Debug log

        const response = await fetch(
            `https://estate-manager.onrender.com/api/properties/${propertyId}`,
            {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log('Response status:', response.status); // Debug log

        if (response.ok) {
            console.log('Delete successful'); // Debug log
            alert("Property deleted successfully!");
            
            // Remove the property card from DOM
            const propertyCard = document.getElementById(`property-${propertyId}`);
            if (propertyCard) {
                propertyCard.remove();
            }
            
            // Refresh the display
            await displayProperties();
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete property');
        }
    } catch (error) {
        console.error('Error in deleteProperty:', error); // Debug log
        alert(`Error deleting property: ${error.message}`);
    }
}

// Add this after your displayProperties function
document.addEventListener('DOMContentLoaded', function() {
    console.log('Setting up delete button listeners'); // Debug log
    
    document.getElementById('admin-section').addEventListener('click', function(event) {
        if (event.target.classList.contains('delete-btn')) {
            console.log('Delete button clicked'); // Debug log
            const propertyId = event.target.dataset.propertyId;
            console.log('Property ID from button:', propertyId); // Debug log
            
            if (propertyId) {
                deleteProperty(propertyId);
            } else {
                console.error('No property ID found on button');
            }
        }
    });
});