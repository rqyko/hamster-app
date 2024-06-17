// Top bar
const topAppBarElement = document.querySelector(".mdc-top-app-bar");
const topAppBar = new MDCTopAppBar(topAppBarElement);

// Tab bar logica
const tabBar = new MDCTabBar(document.querySelector(".mdc-tab-bar"));

// Sheet openen
document
  .querySelector(".mdc-data-table__content")
  .addEventListener("click", (event) => {
    const imgElement = event.target.closest(".mdc-data-table__row").querySelector("img");
    const title = imgElement.title;
    const src = imgElement.src;
    const description = imgElement.getAttribute("data-description");
    const price = imgElement.getAttribute("data-price");

    // Huidige scrollpositie opslaan
    let = scrollPosition = window.scrollY;

    // Scrollen uitzetten
    document.body.style.position = "fixed";
    document.body.style.width = "100vw";

    document.querySelector(".sheet").style.backgroundColor = "white";
    document.querySelector(".sheet").style.paddingBottom = "100vh";
    document.querySelector("main").style.display = "flex";

    // Info toevoegen
    document.querySelector(".sheet img").src = src;
    document.querySelector("#header").innerHTML = title;
    document.querySelector("#title").innerHTML = title;
    document.querySelector("#description").innerHTML = description;
    document.querySelector("#price").innerHTML = price;

    document.querySelector(".sheet").classList.remove("sheet-out-of-view");

    // Huidige URL opslaan
    var currentPath = window.location.pathname;

    // Mooie nieuwe URL maken (regex code van Copilot)
    var newUrl = currentPath + "/" + title.toLowerCase().replace(/\s+/g, "-");
    // Nieuwe URL aanzetten
    history.pushState({ src: src, title: title }, title, newUrl);
  });

  // Tabblad veranderen
function toggle(tab) {
  switch (tab) {
    case "beer":
      document.querySelector(".mdc-tab--active").classList.remove("mdc-tab--active");
      document.querySelector(".mdc-tab").classList.add("mdc-tab--active");

      document.querySelector(".mdc-tab-indicator--active").classList.remove("mdc-tab-indicator--active");
      document.querySelector(".mdc-tab-indicator").classList.add("mdc-tab-indicator--active");

      document.querySelector(".beer").style.display = "flex";
      document.querySelector(".temperature").style.display = "none";
      document.querySelector(".food").style.display = "none";
      break;
    case "temperature":
      getForecast();

      document.querySelector(".beer").style.display = "none";
      document.querySelector(".temperature").style.display = "block";
      document.querySelector(".food").style.display = "none";
      break;
    case "food":
      getFoodRecommendations();

      document.querySelector(".beer").style.display = "none";
      document.querySelector(".temperature").style.display = "none";
      document.querySelector(".food").style.display = "block";
      break;
    default:
      document.querySelector(".beer").style.display = "flex";
      document.querySelector(".temperature").style.display = "none";
      document.querySelector(".food").style.display = "none";
  }
}

function closeSheet() {
  document.querySelector(".sheet").classList.add("sheet-out-of-view");
  document.body.style.overflow = "auto";
  document.body.style.position = "";
  document.body.style.top = "";

  // Originele scrollpositie terugzetten
  window.scrollTo(0, scrollPosition);

  history.pushState(null, "", "/index.html");
}

function zoek() {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=Lloret&appid=36c9b37421f4674d22bfd4ea024cffb4&units=metric&cnt=8`,
    {}
  )
    .then((response) => response.json())
    .then((data) => {
      let time;
      let temp;

      data.list.forEach((result) => {
        const icon = result.weather[0].icon;
        temp = Math.round(result.main.temp);
        time = new Date(result.dt_txt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        document.querySelector(".mdc-data-table").style.display = "block";

        // Nieuwe rij aanmaken en class toevoegen
        var newRow = document.createElement("tr");
        newRow.className = "mdc-data-table__row";

        // Nieuwe cellen aanmaken
        var timeCell = document.createElement("td");
        var tempCell = document.createElement("td");
        var beerCell = document.createElement("td");

        // Classes toevoegen aan cellen
        timeCell.className = "mdc-data-table__cell time";
        tempCell.className = "mdc-data-table__cell temp";
        beerCell.className = "mdc-data-table__cell radar";

        timeCell.innerHTML = time;
        tempCell.innerHTML = temp + "°C";
        beerCell.innerHTML = Math.round(-0.075 * temp + 5.25) + " per uur";

        newRow.appendChild(timeCell);
        newRow.appendChild(tempCell);
        newRow.appendChild(beerCell);

        // Afbeelding toevoegen
        var beerImgCell = document.createElement("td");
        beerImgCell.className = "mdc-data-table__cell";
        beerImgCell.style.display = "flex";

        if (temp < 0) {
          var beerImg = document.createElement("img");
          beerImg.src = "images/vodka.png";
          beerImg.className = "beer-image";
          beerImg.title = "Vodka";
          beerImg.alt = "Vodka";
          beerImg.setAttribute(
            "data-description",
            "A strong vodka drink for cold weather."
          );
          beerImgCell.appendChild(beerImg);
        } else {
          var { url, title, description, price } =
            getRandomImage();
          var beerImg = document.createElement("img");
          beerImg.src = url;
          beerImg.className = "beer-image";
          beerImg.title = title;
          beerImg.alt = title;
          beerImg.setAttribute("data-description", description);
          beerImg.setAttribute("data-price", price);
          beerImgCell.appendChild(beerImg);
        }

        newRow.appendChild(beerImgCell);
        document.querySelector(".mdc-data-table__content").appendChild(newRow);
      });
    });
}

// Random drankje ophalen
function getRandomImage() {
  const images = [
    {
      url: "images/sanmiguel-can.png",
      title: "San Miguel",
      description: "Een echte Spaanse dorstlesser",
      price: "Tekoop aan het strand voor €1.50",
    },
    {
      url: "images/mojito.png",
      title: "Mojito",
      description: "Heerlijke cocktail met munt en limoen",
      price: "Tekoop aan het strand voor €7.00",
    },
    {
      url: "images/estrella-can.png",
      title: "Estrella",
      description: "Een lekker verfrissend Spaans biertje",
      price: "Tekoop aan het strand voor €1.80",
    },
  ];

  const randomImage = images[Math.floor(Math.random() * images.length)];
  return randomImage;
}

function getForecast() {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=Lloret&appid=36c9b37421f4674d22bfd4ea024cffb4&units=metric`
  )
    .then((response) => response.json())
    .then((data) => {
      const forecastContainer = document.querySelector(
        ".weatherforecast-tomorrow"
      );
      forecastContainer.innerHTML = ""; // Eerdere forecast legen

      // Om hoogste en laagste temperatuur in op te slaan
      const dailyTemperatures = {};

      data.list.forEach((result) => {
        const date = new Date(result.dt_txt).toLocaleDateString("nl-NL", {
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
        });

        const temp = result.main.temp;

        // Logica om de hoogste en laagste temperatuur te vinden
        if (!dailyTemperatures[date]) {
          dailyTemperatures[date] = {
            maxTemp: temp,
            minTemp: temp,
          };
        }

        dailyTemperatures[date].maxTemp = Math.max(
          dailyTemperatures[date].maxTemp,
          temp
        );
        dailyTemperatures[date].minTemp = Math.min(
          dailyTemperatures[date].minTemp,
          temp
        );
      });

      // Display the forecast for each date
      for (const date in dailyTemperatures) {
        const dayData = dailyTemperatures[date];

        // Card aanmaken
        const cityIconWrapper = document.createElement("div");
        cityIconWrapper.className = "city-icon-wrapper";

        // Datum erin zetten
        const cityDate = document.createElement("div");
        cityDate.textContent = date;
        cityDate.className = "city-date";
        cityIconWrapper.appendChild(cityDate);

        // Info erin zetten
        const tempRange = document.createElement("div");
        tempRange.textContent = `max: ${Math.round(
          dayData.maxTemp
        )}°C | min: ${Math.round(dayData.minTemp)}°C`;
        tempRange.className = "temp-range";
        cityIconWrapper.appendChild(tempRange);

        forecastContainer.appendChild(cityIconWrapper);
      }
    });
}

function getFoodRecommendations() {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=Lloret&appid=36c9b37421f4674d22bfd4ea024cffb4&units=metric`
  )
    .then((response) => response.json())
    .then((data) => {
      const weatherDescription = data.list[0].weather[0].main;
      let foodRecommendation = "";

      switch (weatherDescription) {
        case "Rain":
          foodRecommendation = "Het regent.";
          break;
        case "Clear":
          foodRecommendation = "Het is helder weer.";
          break;
        case "Clouds":
          foodRecommendation = "Het is bewolkt.";
          break;
        default:
          foodRecommendation =
            "Het weer is normaal dus zoek zelf wat lekkers uit!";
      }

      const weatherInfoElement = document.querySelector(".weather-info");
      weatherInfoElement.textContent =
        foodRecommendation + " Dit zijn suggesties om te eten:";

      const foodSuggestions = {
        Rain: [
          {
            name: "Pizza",
            description: "Lekker pizzatje gaat er altijd in met slecht weer",
            image: "images/pizza.jpg",
          },
        ],
        Clear: [
          {
            name: "Salade",
            description: "Zodat je lichaam het niet begeeft",
            image: "images/salad.jpg",
          },
          {
            name: "Drank-ijsje",
            description: "Voor verkoeling, wel met alcohol!",
            image: "images/ice.webp",
          },
        ],
        Clouds: [
          {
            name: "Pasta",
            description: "Pasta pesto.. Hier zegt toch niemand nee tegen?",
            image: "images/pasta-pesto.jpeg",
          },
          {
            name: "Bruschetta",
            description:
              "Lekker broodje met tomaat, balsamico, olie, en basilicum",
            image: "images/bruschetta.jpg",
          },
        ],
        Default: [
          {
            name: "Maaltijd naar keuze",
            description: "Kies iets lekkers dat bij het weer past!",
            image: "images/meal-of-choice.jpg",
          },
        ],
      };

      // Leegmaken welme suggesties er al staan
      const foodSuggestionsContainer = document.querySelector(".food-suggestions");
      foodSuggestionsContainer.innerHTML = "";

      const suggestions = foodSuggestions[weatherDescription] || foodSuggestions.Default;

      // Alle suggesties tonen
      suggestions.forEach((food) => {
        const card = document.createElement("div");
        card.classList.add("food-suggestion");

        const image = document.createElement("img");
        image.src = food.image;
        image.alt = food.name;
        card.appendChild(image);

        const name = document.createElement("h3");
        name.textContent = food.name;
        card.appendChild(name);

        const description = document.createElement("p");
        description.textContent = food.description;
        card.appendChild(description);

        foodSuggestionsContainer.appendChild(card);
      });
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
    });
}

window.onload = function () {
  document.querySelector(".beer").style.display = "flex";
  document.querySelector(".temperature").style.display = "none";
  document.querySelector(".food").style.display = "none";

  zoek();
};