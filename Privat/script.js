const fromCurrency = document.getElementById("from-currency");
const toCurrency = document.getElementById("to-currency");
const rateDate = document.getElementById("rate-date");
const convertBtn = document.getElementById("convert-btn");
const amountInput = document.getElementById("amount");
const resultBox = document.querySelector(".conversion-result");

// Встановити сьогоднішню дату як дефолтну
const today = new Date();
rateDate.valueAsDate = today;

function formatDate(date) {
  const [year, month, day] = date.split("-");
  return `${day}.${month}.${year}`;
}

async function loadRatesByDate(date) {
  const formatted = formatDate(date);
  const url = `http://localhost:7777/proxy?url=https://api.privatbank.ua/p24api/exchange_rates?date=${formatted}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const allRates = data.exchangeRate;

    const filteredRates = allRates.filter(rate => rate.purchaseRate && rate.saleRate);

    // Очистити старі варіанти
    [fromCurrency, toCurrency].forEach(select => {
      select.innerHTML = "";
      filteredRates.forEach(rate => {
        const option = document.createElement("option");
        option.value = rate.currency;
        option.textContent = rate.currency;
        select.appendChild(option);
      });
    });

    return filteredRates;
  } catch (e) {
    console.error("Помилка отримання курсу:", e);
    return [];
  }
}

function findRate(rates, currency) {
  return rates.find(rate => rate.currency === currency);
}

function convertCurrency(rates) {
  const from = fromCurrency.value;
  const to = toCurrency.value;
  const amount = parseFloat(amountInput.value);

  if (!from || !to || isNaN(amount) || amount <= 0) {
    resultBox.textContent = "Будь ласка, введіть коректні дані.";
    return;
  }

  const baseRate = rates.find(rate => rate.currency === from);
  const targetRate = rates.find(rate => rate.currency === to);

  if (!baseRate || !targetRate) {
    resultBox.textContent = "Не вдалося знайти курс для вибраних валют.";
    return;
  }

  // Конвертація: спочатку в UAH, потім у валюту "в"
  const inUAH = amount * baseRate.saleRate;
  const finalAmount = inUAH / targetRate.purchaseRate;

  resultBox.innerHTML = `
    <p>Сума: <strong>${amount} ${from}</strong></p>
    <p>Курс продажу (${from} → UAH): ${baseRate.saleRate}</p>
    <p>Курс купівлі (UAH → ${to}): ${targetRate.purchaseRate}</p>
    <p><strong>Отримаєте: ${finalAmount.toFixed(2)} ${to}</strong></p>
  `;
}

let currentRates = [];

// Завантажити курси при завантаженні
rateDate.addEventListener("change", async () => {
  currentRates = await loadRatesByDate(rateDate.value);
});

convertBtn.addEventListener("click", () => {
  convertCurrency(currentRates);
});

// Перший запуск
(async () => {
  currentRates = await loadRatesByDate(rateDate.value);
})();