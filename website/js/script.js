document.getElementById("contactform").addEventListener("submit", function(event) {
    event.preventDefault();

    let isValid = true;

    function clearErrors() {
        let errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.remove());
        let invalidFields = document.querySelectorAll('.invalid');
        invalidFields.forEach(field => field.classList.remove('invalid'));
    }

    clearErrors();

    let name = document.getElementById("name");
    let nameValue = name.value.trim();
    let validName = true;
    const allowedChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZа-яА-ЯёЁіІїЇєЄґҐ'’ -";
    if (nameValue.length < 2 || nameValue.length > 30) validName = false;
    for (let char of nameValue) {
        if (!allowedChars.includes(char)) {
            validName = false;
            break;
        }
    }
    if (!validName) {
        isValid = false;
        name.classList.add('invalid');
        let errorMessage = document.createElement("div");
        errorMessage.classList.add('error-message');
        errorMessage.textContent = "* Your name must be between 2 and 30 characters long, containing only letters, hyphens, or spaces.";
        name.parentElement.appendChild(errorMessage);
    }

    let age = document.getElementById("age");
    let ageValue = parseInt(age.value.trim());
    if (isNaN(ageValue) || ageValue < 18 || ageValue > 130) {
        isValid = false;
        age.classList.add('invalid');
        let errorMessage = document.createElement("div");
        errorMessage.classList.add('error-message');
        errorMessage.textContent = "* Age must be a number between 18 and 130.";
        age.parentElement.appendChild(errorMessage);
    }

    let email = document.getElementById("email");
    let emailValue = email.value.trim();
    if (emailValue.indexOf('@') === -1 || emailValue.indexOf('.') === -1 || emailValue.indexOf('@') > emailValue.lastIndexOf('.')) {
        isValid = false;
        email.classList.add('invalid');
        let errorMessage = document.createElement("div");
        errorMessage.classList.add('error-message');
        errorMessage.textContent = "* Invalid E-Mail format.";
        email.parentElement.appendChild(errorMessage);
    }

    let website = document.getElementById("company");
    let websiteValue = website.value.trim();
    if (websiteValue !== "") {
        let websiteParts = websiteValue.split(".");
        if (websiteParts.length < 2 || websiteParts[0].length === 0 || websiteParts[websiteParts.length - 1].length < 2) {
            isValid = false;
            website.classList.add('invalid');
            let errorMessage = document.createElement("div");
            errorMessage.classList.add('error-message');
            errorMessage.textContent = "* Invalid site URL format.";
            website.parentElement.appendChild(errorMessage);
        }
    }

    let message = document.getElementById("message");
    let messageValue = message.value.trim();
    if (messageValue.length < 10 || messageValue.length > 350) {
        isValid = false;
        message.classList.add('invalid');
        let errorMessage = document.createElement("div");
        errorMessage.classList.add('error-message');
        errorMessage.textContent = "* The message must be between 10 and 350 characters.";
        message.parentElement.appendChild(errorMessage);
    }

    if (isValid) {
        alert("The form has been successfully submitted!");
        this.submit();
    }
});

document.querySelectorAll(".user-data").forEach(function(input) {
    input.addEventListener("focus", function() {
        this.classList.remove("invalid");
        let errorMessage = this.parentElement.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    });
});