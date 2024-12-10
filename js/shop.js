// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", () => {
    // Search Bar Functionality
    const searchInput = document.querySelector(".top-search input");
    const categoryCards = document.querySelectorAll(".category-card");
  
    // Filter categories based on search input
    searchInput.addEventListener("input", (e) => {
      const searchText = e.target.value.toLowerCase();
      categoryCards.forEach((card) => {
        const categoryName = card.querySelector("h3").textContent.toLowerCase();
        if (categoryName.includes(searchText)) {
          card.style.display = "block"; // Show card
        } else {
          card.style.display = "none"; // Hide card
        }
      });
    });
  
    // Dynamic Category Card Animation
    categoryCards.forEach((card) => {
      card.addEventListener("mouseover", () => {
        card.style.boxShadow = "0 6px 10px rgba(0, 0, 0, 0.15)";
      });
      card.addEventListener("mouseout", () => {
        card.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
      });
    });
  
    // Responsive Navbar Toggle for Mobile (Optional)
    const navbar = document.querySelector(".navbar nav ul");
    const navbarToggle = document.createElement("button");
    navbarToggle.textContent = "☰";
    navbarToggle.style.fontSize = "20px";
    navbarToggle.style.padding = "10px";
    navbarToggle.style.backgroundColor = "orange";
    navbarToggle.style.color = "white";
    navbarToggle.style.border = "none";
    navbarToggle.style.borderRadius = "5px";
    navbarToggle.style.cursor = "pointer";
    navbarToggle.style.display = "none"; // Initially hidden for non-mobile screens
  
    // Append toggle button to the navbar
    document.querySelector(".navbar").prepend(navbarToggle);
  
    // Toggle navigation menu on mobile screens
    navbarToggle.addEventListener("click", () => {
      if (navbar.style.display === "flex") {
        navbar.style.display = "none";
      } else {
        navbar.style.display = "flex";
      }
    });
  
    // Show toggle button for smaller screens
    window.addEventListener("resize", () => {
      if (window.innerWidth <= 768) {
        navbar.style.display = "none"; // Hide navbar initially
        navbarToggle.style.display = "block"; // Show toggle button
      } else {
        navbar.style.display = "flex"; // Show navbar for larger screens
        navbarToggle.style.display = "none"; // Hide toggle button
      }
    });
  
    // Trigger the resize event to apply the initial state
    window.dispatchEvent(new Event("resize"));
  });