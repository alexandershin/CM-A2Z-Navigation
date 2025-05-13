// Get City List from JSON
async function getCities() {
  try {
    const response = await fetch("Files/navigation.json");
    const data = await response.json();

    const navList = document.getElementById("navList");
    const slideBar = document.getElementById("slideBar");

    function moveSlideBar(selected) {
      const isVertical = window.innerWidth <= 944;

      if (isVertical) {
        const { offsetTop, offsetHeight } = selected;
        slideBar.style.width = "1px";
        slideBar.style.height = `${offsetHeight}px`;
        slideBar.style.top = `${offsetTop}px`;
        slideBar.style.left = "0";
      } else {
        const { offsetLeft, offsetWidth } = selected;
        slideBar.style.width = `${offsetWidth}px`;
        slideBar.style.left = `${offsetLeft}px`;
        slideBar.style.top = "";
        slideBar.style.height = "1px";
      }
    }

    data.cities.forEach((city) => {
      const listItem = document.createElement("li");
      listItem.textContent = city.label;

      listItem.addEventListener("click", () => {
        const allItems = navList.querySelectorAll("li");
        allItems.forEach((item) => {
          item.classList.remove("active");
        });

        listItem.classList.add("active");

        moveSlideBar(listItem);
        showTime(city.label);
      });
      navList.appendChild(listItem);
    });

    const firstItem = navList.querySelector("li");
    if (firstItem) {
      firstItem.classList.add("active");
      moveSlideBar(firstItem);
      showTime(firstItem.textContent);
    }

    window.addEventListener("resize", () => {
      const activeItem = navList.querySelector("li.active");
      if (activeItem) {
        moveSlideBar(activeItem);
      }
    });
  } catch (error) {
    console.error("Error fetching cities:", error);
  }
}
getCities();

// City Time Functionality
const cityTimeZones = {
  Cupertino: "America/Los_Angeles",
  "New York City": "America/New_York",
  London: "Europe/London",
  Amsterdam: "Europe/Amsterdam",
  Tokyo: "Asia/Tokyo",
  "Hong Kong": "Asia/Hong_Kong",
  Sydney: "Australia/Sydney",
};

let clockInterval;

function showTime(cityLabel) {
  const clockDisplay = document.getElementById("clockDisplay");
  const timeZone = cityTimeZones[cityLabel];

  function updateClock() {
    const now = new Date();
    const options = {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    };

    clockDisplay.innerHTML = `
  <span class="city-name">${cityLabel}</span>
  <br>
  <span class="city-time">${new Intl.DateTimeFormat("en-US", options).format(
    now
  )}</span>
`;
  }

  clearInterval(clockInterval);
  updateClock();
  clockInterval = setInterval(updateClock, 1000);
}
