// Search function
function searchFun() {
  const searchInput = document.getElementById('search-inp').value.toLowerCase();
  const listingTitles = document.querySelectorAll('.listing-card .card-text b:first-of-type');

  listingTitles.forEach(title => {
    const card = title.closest('.listing-card');
    if (title && title.textContent && title.textContent.toLowerCase().includes(searchInput)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  'use strict'

  // Form validation setup
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })

  let taxSwitch = document.getElementById("flexSwitchCheckDefault");
  taxSwitch.addEventListener("click", () => {
    let taxInfo = document.getElementsByClassName("tax-info");
    for (let info of taxInfo) {
      if (info.style.display != "inline") {
        info.style.display = "inline";
      } else {
        info.style.display = "none";
      }
    }
  });

  // Get all filter elements
  const filterElements = document.querySelectorAll(".filter");
  const listingCards = document.querySelectorAll(".listing-card");

  filterElements.forEach((filter) => {
    filter.addEventListener("click", () => {
      // Get the property to filter by from the data-filter-property attribute
      const filterProperty = filter.getAttribute("data-filter");

      // Hide all listing cards
      listingCards.forEach((card) => {
        card.style.display = "none";
      });

      if (filterProperty === "all") {
        // Show all listing cards
        listingCards.forEach((card) => {
          card.style.display = "block";
        });
      } else {
        // Show only the listing cards that match the selected property
        const matchingCards = document.querySelectorAll(`[data-category="${filterProperty}"]`);
        matchingCards.forEach((card) => {
          card.style.display = "block";
        });
      }
    });
  });

  // Attach the search function to the search input
  const searchInput = document.getElementById('search-inp');
  if (searchInput) {
    searchInput.addEventListener('keyup', searchFun);
  }
});
