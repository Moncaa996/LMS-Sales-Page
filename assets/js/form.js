/*
    Kliens oldali validacio
        - kenyelem (hibak jelzese urlap bekuldese eloot)
        -hatekonysag ( nem kell varni a szerverre)
        -biztonsag (kicsit nehezebb megtamadni az oldalt 
        mert tobb ido es energia egy ervennyes request osszedobasa mint az urlap kitoltese)
    Szerver oldali validacio
*/

let signupForm = document.querySelector(".js-signup-form");
let emailField = signupForm.querySelector(".js-email-field");

function signupFormSubmitted(event) {
    event.preventDefault(); // Meg akadalyozza az urlap bekuldeset, alapertelmezett akciot, lefuttatja de nem kuldi be az urlapot

    let password1 = document.querySelector(".js-password1").value;
    let password2 = document.querySelector(".js-password2").value;
    console.groupCollapsed(password1, password2, password1 === password2);
    
    let pwdCrossValidation = document.querySelector(".js-pwd-cross");
    if (password1 !== password2) {
        pwdCrossValidation.innerText = "Passwords do not match.";
        pwdCrossValidation.classList.remove("hidden");
    } else {
        pwdCrossValidation.innerText = "";
        pwdCrossValidation.classList.add("hidden");
    }
}

function getEmailValidatorUrl() {
     //Eljatszuk hogy a szerverhez fordulunk.
    let email = emailField.value;
    if (emailField.value.startsWith("invalid")) {
        return "../../dev/json/email_not_available.json";
    } if (emailField.value.startsWith("networkerror")) {
        return "../../dev/json/missing_json.json";
    }
    return "../../dev/json/email_available.json"; 
}

function emailFieldBlurred() {
let emailValidationField = document.querySelector(".js-email-validation");    
   fetch(getEmailValidatorUrl())
        .then(r => r.json()) //.then(function(r) {return r.jason();})
        .then(response => { // .then(function(response) {)
            if (!response.available) {
                emailValidationField.innerText = "This email is not available.";
                emailValidationField.classList.remove("hidden");
            } else {
                emailValidationField.innerText = "";
                emailValidationField.classList.add("hidden");
            }
        })
        .catch((error) => {
            emailValidationField.innerText = `
            The registration is not available. 
            Please try again later.
            `.trim();
            emailValidationField.classList.remove("hidden");
        });
}

signupForm.addEventListener("submit", signupFormSubmitted);
emailField.addEventListener("blur", emailFieldBlurred);