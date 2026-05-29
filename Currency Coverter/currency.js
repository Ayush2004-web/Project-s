const countries = [
  {
    country: "INDIA",
    currency_code: "inr",
    country_code: "IN",
  },
   {
    country: "UNITED STATES OF AMERICA",
    currency_code: "usd",
    country_code: "US",
  },
  {
    country: "UNITED KINGDOM",
    currency_code: "gbp",
    country_code: "GB",
  },
  {
    country: "EUROPE",
    currency_code: "eur",
    country_code: "EU",
  },
  {
    country: "JAPAN",
    currency_code: "jpy",
    country_code: "JP",
  },
  {
    country: "CANADA",
    currency_code: "cad",
    country_code: "CA",
  },
];

const country1 = document.getElementById("country1");
const country2 = document.getElementById("country2");

const flag1 = document.getElementById("flag1");
const flag2 = document.getElementById("flag2");

const amount = document.getElementById("orgAmount");
const convertBtn = document.getElementById("convertBtn");
const result = document.getElementById("newAmount");
const rateText = document.getElementById("rateText");
const loading = document.getElementById("loading");
const swapBtn = document.getElementById("swapBtn");

//errors
const errorFrom = document.getElementById("errorFrom");
const errorTo = document.getElementById("errorTo");
const errorAmount = document.getElementById("errorAmount");

//drop_down
function loadCountries() {
  countries.forEach((item) => {
    let option1 = document.createElement("option");
    option1.value = `${item.currency_code},${item.country_code}`;
    option1.textContent = item.country;
    country1.appendChild(option1);
    let option2 = document.createElement("option");
    option2.value = `${item.currency_code},${item.country_code}`;
    option2.textContent = item.country;
    country2.appendChild(option2);
  });

  country1.value = "usd,US";
  country2.value = "inr,IN";
}
loadCountries();

function updateFlag(selectElement, flagElement) {
  let value = selectElement.value;
  let code = value.split(",")[1];
  flagElement.src = `https://flagsapi.com/${code}/flat/64.png`;
  flagElement.onerror = function () {
    flagElement.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  };
}
updateFlag(country1, flag1);
updateFlag(country2, flag2);
country1.addEventListener("change", () => {
  updateFlag(country1, flag1);

  errorFrom.innerHTML = "";
});
country2.addEventListener("change", () => {
  updateFlag(country2, flag2);
  errorTo.innerHTML = "";
});
amount.addEventListener("input", () => {
  errorAmount.innerHTML = "";
});

//convert
async function convertCurrency() {
  errorFrom.innerHTML = "";
  errorTo.innerHTML = "";
  errorAmount.innerHTML = "";
  if (country1.value === "") {
    errorFrom.innerHTML = "Please select a From country.";
    return;
  }
  if (country2.value === "") {
    errorTo.innerHTML = "Please select a To country.";
    return;
  }
  if (amount.value === "") {
    errorAmount.innerHTML = "Please enter an amount.";
    return;
  }
  if (Number(amount.value) <= 0) {
    errorAmount.innerHTML = "Amount must be greater than zero.";
    return;
  }
  let fromCurrency = country1.value.split(",")[0];

  let toCurrency = country2.value.split(",")[0];

  let enteredAmount = Number(amount.value);

  // Same Currency
  if (fromCurrency === toCurrency) {
    result.innerHTML = `Converted Amount : ${enteredAmount.toFixed(2)} ${toCurrency.toUpperCase()}`;

    rateText.innerHTML = `1 ${fromCurrency.toUpperCase()} = 1 ${toCurrency.toUpperCase()}`;

    return;
  }

  try {
    loading.innerHTML = "Converting...";

    convertBtn.innerHTML = "Loading...";

    result.innerHTML = "";

    rateText.innerHTML = "";

    // API
    let response = await fetch(
      `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${fromCurrency}.json`,
    );

    let data = await response.json();

    let rate = data[fromCurrency][toCurrency];

    let convertedAmount = enteredAmount * rate;

    result.innerHTML = `Converted Amount : ${convertedAmount.toFixed(2)} ${toCurrency.toUpperCase()}`;

    rateText.innerHTML = `1 ${fromCurrency.toUpperCase()} = ${rate.toFixed(2)} ${toCurrency.toUpperCase()}`;
  } catch (error) {
    result.innerHTML = "Something went wrong. Please try again.";
  } finally {
    loading.innerHTML = "";

    convertBtn.innerHTML = "Convert";
  }
}

// Convert Button
convertBtn.addEventListener("click", convertCurrency);

// Swap Button
swapBtn.addEventListener("click", () => {
  let temp = country1.value;

  country1.value = country2.value;

  country2.value = temp;

  updateFlag(country1, flag1);

  updateFlag(country2, flag2);

  if (amount.value !== "") {
    convertCurrency();
  }
});
