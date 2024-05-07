// Top bar
const topAppBarElement = document.querySelector(".mdc-top-app-bar");
const topAppBar = new MDCTopAppBar(topAppBarElement);

// Logic for hamburger menu
const drawer = MDCDrawer.attachTo(document.querySelector(".mdc-drawer"));

const hamburger = document.querySelector(".hamburger");
hamburger.addEventListener("click", (event) => {
  drawer.open = !drawer.open;
});

// Tab bar logic
const tabBar = new MDCTabBar(document.querySelector(".mdc-tab-bar"));

// Logic to reset tabs when clicking home button
const homeButton = document.querySelector(".home");

function resetTabs() {
  const tabs = document.querySelectorAll(".mdc-tab");
  tabs.forEach((tab) => {
    tab.classList.remove("mdc-tab--active");
  });

  const indicators = document.querySelectorAll(".mdc-tab-indicator");
  indicators.forEach((indicator) => {
    indicator.classList.remove("mdc-tab-indicator--active");
  });

  document.querySelectorAll(".mdc-image-list__item").forEach((element) => {
    element.style.display = "block";
  });
}

// Filter between tabs
function filter(category) {
  document.querySelectorAll(".mdc-image-list__item").forEach((element) => {
    element.style.display = "none";
  });
  document.querySelectorAll("." + category).forEach((element) => {
    element.style.display = "block";
  });
}

// Open hamster image when clicking on one in masonry list
document.querySelectorAll(".mdc-image-list__image").forEach((element) => {
  element.addEventListener("click", () => {
    const src = element.getAttribute("src");
    const title = element.getAttribute("title");

    document.querySelector("body").style.overflowY = "hidden";
    document.querySelector(".sheet").style.paddingBottom = "100vh";
    document.querySelector(".sheet img").style.position = "fixed";

    // Add title and img src
    document.querySelector(".sheet img").src = src;
    document.querySelector("#header").innerHTML = title;

    document.querySelector(".sheet").classList.remove("sheet-out-of-view");

    // Get the current URL path
    var currentPath = window.location.pathname;

    // Append title (replace is to remove the %20) to the current path
    var newUrl = currentPath + "/" + title.toLowerCase().replace(/\s+/g, "-");
    // Use pushState to change the state without reloading the page
    history.pushState({ src: src, title: title }, title, newUrl);
  });
});

// Close details when clicking the cross in detail screen
function closeSheet() {
  document.querySelector(".sheet").classList.add("sheet-out-of-view");
  document.querySelector("body").style.overflowY = "auto";

  history.pushState(null, "", "https://net24rboland.gc-webhosting.nl/");
}

document.querySelector("#close-button").addEventListener("click", () => {
  closeSheet();
});

window.addEventListener("popstate", function (event) {
  closeSheet();
});