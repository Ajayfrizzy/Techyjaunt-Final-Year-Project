document.addEventListener("DOMContentLoaded", function () {
    // Initialize display of properties
    displayProperties();
    

    // Displaying of properties for users
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
          const userSection = document.getElementById("user-section");
      
          if (!userSection) {
            console.error("User section element not found");
            return;
          }
      
          if (properties.length === 0) {
            userSection.innerHTML = "<p>No properties listed yet.</p>";
            return;
          }
      
         userSection.innerHTML = properties
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
                      <p>Location: ${escapeHtml(property.location)}</p>
                  </div>
              `
            )
            .join("");
        } catch (error) {
          console.error("Error fetching properties:", error);
          const userSection = document.getElementById("user-section");
          if (userSection) {
            userSection.innerHTML =
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


      const imgReviewed = document.querySelector('.img-reviewed');
      const nextBtn =  document.querySelector('.right-btn');
      const backBtn = document.querySelector('.left-btn');
  
      nextBtn.addEventListener('click', ()=>{
          imgReviewed.scrollLeft +=900;
          imgReviewed.style.scrollBehavior = "smooth";
          console.log("Next button clicked")
      })
  
      backBtn.addEventListener('click', ()=>{
          imgReviewed.scrollLeft -=900;
          imgReviewed.style.scrollBehavior = "smooth";
          console.log("Back button clicked")
      })
});