document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let confirmPassword = document.getElementById('confirm-password').value;
    let phone = document.getElementById('phone').value;
    let dob = document.getElementById('dob').value;
    let gender = document.getElementById('gender').value;
    let recaptchaResponse = grecaptcha.getResponse();

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    if (!validateEmail(email)) {
        alert('Please enter a valid email address!');
        return;
    }

    if (!validatePhone(phone)) {
        alert('Please enter a valid phone number!');
        return;
    }

    if (recaptchaResponse.length === 0) {
        alert('Please complete the CAPTCHA!');
        return;
    }

    alert('Signup successful!');
    // You can add code here to submit the form data to your server
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function validatePhone(phone) {
    const re = /^\d{11}$/;
    return re.test(String(phone));
}
