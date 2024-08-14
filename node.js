const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/submit', async (req, res) => {
    const recaptchaResponse = req.body['g-recaptcha-response'];
    const secretKey = '6LcVnyYqAAAAAKVMcBBxaUydtuzTZORuxhPEwjhJ';

    const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaResponse}`;

    try {
        const response = await axios.post(verificationURL);
        if (response.data.success) {
            // Proceed with form submission
            res.send('Signup successful!');
        } else {
            res.send('reCAPTCHA verification failed. Please try again.');
        }
    } catch (error) {
        res.send('Error verifying reCAPTCHA. Please try again.');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});


