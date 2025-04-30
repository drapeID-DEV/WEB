const validators = {
  fullname: {
    validate: (value) => /^[A-Za-zА-Яа-яІіЇїЄєҐґ\s]{5,}$/.test(value),
    message: "Будь ласка, введіть коректне ПІБ (мінімум 5 символів).",
  },
  phone: {
    validate: (value) => /^(\+380\d{9}|0\d{9})$/.test(value),
    message: "Будь ласка, введіть коректний номер телефону.",
  },
  email: {
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: "Будь ласка, введіть коректну адресу електронної пошти.",
  },
  theme: {
    validate: (value) => value.length >= 4,
    message: "Будь ласка, введіть тему (мінімум 4 символи).",
  },
  description: {
    validate: (value) => value.length >= 10,
    message: "Будь ласка, опишіть звернення детальніше (мінімум 10 символів).",
  },
};

function throwErrorMessage(currentField, message = "Поле обов’язкове") {
  const prevErrorMessage = currentField.nextElementSibling;
  if (
    prevErrorMessage &&
    prevErrorMessage.classList.contains("error-message")
  ) {
    prevErrorMessage.remove();
  }

  const errorDiv = document.createElement("div");
  errorDiv.classList.add("error-message");
  errorDiv.innerText = message;
  currentField.addEventListener(`focus`, removeErrorMessage);
  currentField.insertAdjacentElement("afterend", errorDiv);
}

function validateForm(formData) {
  let formState = true;
  for (let key of formData.keys()) {
    const input = document.getElementById(key);

    if (!input.value.trim()) {
      throwErrorMessage(input);
      formState = false;
    }
  }
  return formState;
}

function removeErrorMessage(event) {
  const input = event.target;
  const error = input.nextElementSibling;

  if (error && error.classList.contains("error-message")) {
    error.remove();
  }

  input.removeEventListener("focus", removeErrorMessage);
}

const contactForm = document.querySelector(`.contact-form`);

const contactBtn = document.querySelector(`.contact-btn`);
contactBtn.addEventListener(`click`, sendMessageHandler);

const BOT_TOKEN = "8026405556:AAFUvr0C6Gj_emy24bAgp7ujmIxY-1z7B4o";
const CHAT_ID = "431893485";

async function sendMessageToTelegram(message) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: message,
      parse_mode: "HTML"
    })
  });
}

async function sendMessageHandler(event) {
  event.preventDefault();

  const formData = new FormData(contactForm);
  let isFormValid = true;
  let message = "<b>Нове повідомлення з форми:</b>\n";

  for (const [key, value] of formData.entries()) {
    const currentInputField = document.getElementById(key);
    const validator = validators[key];

    if (!value.trim() || !validator.validate(value.trim())) {
      throwErrorMessage(currentInputField, validator.message);
      isFormValid = false;
    } else {
      message += `<b>${key}:</b> ${value.trim()}\n`;
    }
  }

  if (isFormValid) {
    try {
      await sendMessageToTelegram(message);
      contactForm.reset();
      showInfoMessage("Форма успішно відправлена!");
    } catch (error) {
      console.error("Помилка надсилання до Telegram:", error);
      showInfoMessage("Сталася помилка при надсиланні повідомлення.");
    }
  }
}