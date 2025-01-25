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
let nameField = signupForm.querySelector(".js-name-field");
let passwordField1 = signupForm.querySelector(".js-password1");
let passwordField2 = document.querySelector(".js-password2");
let tocField = document.querySelector(".js-toc-checkbox")

function crossValidatePasswords () {
    let password1 = passwordField1.value;
    let password2 = passwordField2.value;
    
    let pwdCrossValidation = document.querySelector(".js-pwd-cross");
    if (password1 !== password2) {
        pwdCrossValidation.innerText = "Passwords do not match.";
        pwdCrossValidation.classList.remove("hidden");
        return false;
    } else {
        pwdCrossValidation.innerText = "";
        pwdCrossValidation.classList.add("hidden");
        return true;
    }
}

function signupFormSubmitted(event) {
    event.preventDefault(); // Meg akadalyozza az urlap bekuldeset, alapertelmezett akciot, lefuttatja de nem kuldi be az urlapot
    let isValid = true;

    isValid = isValid && validateNameFieldRequired();
    isValid = isValid && validateEmailFieldFormat(); // itt csak a formatumot validaljuk
    isValid = isValid && validatePassword1Field(); 
    isValid = isValid && validatePassword2Field();
    isValid = isValid && acceptTocValidation();

    console.log("Bekuldott urlap ervenyes?", isValid);
    // TODO: ha ervenyes az urlap, be kuldjuk
}

function isRequired(text) {
    return text.trim().length > 0;
}

function isEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%*-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

function isUpperCase(char) {
    return /^[A-Z]$/.test(char);
}

function isLowerCase(char) {
    return /^[a-z]$/.test(char);
}

function isDigit(char) {
    return /^[0-9]$/.test(char);
}

function isSpecialCharacter(char) {
    return /^[^A-Za-z0-9]$/.test(char);
}

function isPasswordValid(password) {
    if (password.length < 8) return false;

    let hasUpperCase = false;
    let hasLowerCase = false;   
    let hasNumeric = false;
    let hasSpecialCharacter = false;

    for (let ch of password) {
        hasUpperCase = hasUpperCase || isUpperCase(ch);
        hasLowerCase = hasLowerCase || isLowerCase(ch);
        hasNumeric = hasNumeric || isDigit(ch);
        hasSpecialCharacter = hasSpecialCharacter || isSpecialCharacter(ch);
    }

    return hasUpperCase && hasLowerCase && hasNumeric && hasSpecialCharacter;
}

/*
    DRY     Don't Repeat Yourself       jo
    WET     We Enjoy Typing             rossz

    WET -> DRY: absztrakcio (hasonlo fugvenyeket "egybeolvasztani")
*/

/*
* Elvegzi a required validaciot a  weboldal sajat hibauzenet-megjelenitesevel.
*
* @param field {DOMNode} a validalando mezo
* @param validationFieldSelector {string} a validacios uzenetet tartalmazo mezo szelektora
* @param errorMessage {string} a hibauzenet a mezoben
* @param isValid {function} treu-t add vissza ha a field erteke ervenyes
* @param doTrim {boolean} trimmelendo a foeld erteke validacional) T/F
*        alapertelmezett erteke true ---> isValid-dal egybe forrasztottuk
* @returns {boolean} true iff field is valid (ha a field ervenyes)
*
* iff = if and only if
* akkor es csak akkor   a => b  b => a  a <=> b
*/

function validation(field, validationFieldSelector, errorMessage, isValid) {
    let validationField = document.querySelector(validationFieldSelector);
    let text = field.value;
    if (!isValid(text)) {
        validationField.innerText = errorMessage;
        validationField.classList.remove("hidden");
        return false;
    } else {
        validationField.classList.add("hidden");
        validationField.innerText = "";
        return true;
    }
}

function requiredValidation(field, selector, errorMessage) {
    return validation(field, selector, errorMessage, isRequired);
}

function isTocChecked() {
    return tocField.checked;
}

function acceptTocValidation() {
    return validation(tocField, ".js-toc-error", "Please accept our terms and conditions and privacy policy", isTocChecked)
}


function validateEmailFieldFormat() {
    return validation(emailField, ".js-email-validation", "Invalid email", isEmail);
}

function getEmailValidatorUrl() {
     //Eljatszuk hogy a szerverhez fordulunk.
    if (emailField.value.startsWith("invalid")) {
        return "../../dev/json/email_not_available.json";
    } if (emailField.value.startsWith("networkerror")) {
        return "../../dev/json/missing_json.json";
    }
    return "../../dev/json/email_available.json"; 
}

function validateEmailField() {
    if (!validateEmailFieldFormat()) return;
    
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

function validateNameFieldRequired() {
    return requiredValidation(nameField, ".js-name-validation", "Enter your name.");
}

function validatePassword1Field() {
    let isEntered = requiredValidation(passwordField1, ".js-pwd1-validation", "Enter your password.", false);
    if (isEntered) {
        let isValid = validation(
            passwordField1, 
            ".js-pwd1-validation", 
            "Password securty requirements: at least 8. Should contain upper case, lower case, numbers and a special character (e.g. @$,.?!_).", 
            isPasswordValid, 
            false);
        if (isValid && passwordField2.value.length > 0) {
            /* Ha a 2. jelszo nem ures, validaljuk, hogy azzonali vissza jelzest adjon arrol, hogy a mar beirt jelszavak nem egyeznek.
            Ha a 2. jelszo ures, akkor ne zavarjuk a felhasznalot, ugyis be fogja meg irni a confirm password uzenetet*/
            return crossValidatePasswords();
        }
    }
    return false
}

function validatePassword2Field() {
    return crossValidatePasswords ();
}

signupForm.addEventListener("submit", signupFormSubmitted);
nameField.addEventListener("blur", validateNameFieldRequired);
emailField.addEventListener("blur", validateEmailField);
passwordField1.addEventListener("blur", validatePassword1Field);
passwordField2.addEventListener("blur", validatePassword2Field);