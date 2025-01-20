let signupForm = document.querySelector(".js-signup-form")

function signupFormSubmitted(event) {
    event.preventDefault();

    let password1 = document.querySelector(".js-password1").value;
    let password2 = document.querySelector(".js-password2").value;
    console.groupCollapsed(password1, password2, password1 === password2);

    if (password1 !== password2) {
        // Az alert ideiglenes ne hasznald design elemkent
        alert("Passwords do not match");
    }
}

signupForm.addEventListener("submit", signupFormSubmitted)