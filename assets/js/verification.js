document.addEventListener('DOMContentLoaded', function() {
    // Retrieve form data from sessionStorage
    const formDataJSON = sessionStorage.getItem('signUpData');
    const verificationCodeInput = document.getElementById('verificationCode');
    const sendVerificationButton = document.getElementById('sendVerificationButton');
    let verificationCode = '';
    let verificationMethod = '';
    const verificationError = document.getElementById('verificationError');

    // Function to generate a random 6-digit verification code
    function generateVerificationCode() {
        return Math.floor(100000 + Math.random() * 900000);
    }

    if (formDataJSON) {
        // Parse the JSON data
        const formData = JSON.parse(formDataJSON);

        // Use the formData object for verification or display
        // console.log(formData);

        // Attach an event listener to the radio buttons
        const radioButtons = document.querySelectorAll('input[name="request_method"]');
        radioButtons.forEach(function(radioButton) {
            radioButton.addEventListener('change', function() {
                // Check which radio button is selected
                if (radioButton.value === 'sms') {
                    // Generate a new random 6-digit verification code for SMS
                    verificationMethod = 'sms';
                    verificationError.textContent = '';
                } else if (radioButton.value === 'email') {
                    // Generate a new random 6-digit verification code for email
                    verificationMethod = 'email';
                    verificationError.textContent = '';

                }
            });
        });

        // Send verification data to email/sms
        sendVerificationButton.addEventListener('click', function() {
            // Check if a verification code has been generated
            // Generate a random 6-digit verification code for email/sms initially
            const initialVerificationCode = generateVerificationCode();
            verificationCode = initialVerificationCode;

            if (verificationCode) {
                // Check if a verification method is selected
                if (verificationMethod) {
                    // Prepare the data to send to the backend
                    const verificationData = {
                        code: verificationCode,
                        method: verificationMethod,
                        email: formData.email,
                        phone: formData.phone,
                    };

                    // Send the verification data to the backend using fetch or another method
                    // Replace 'your-backend-url' with your actual backend URL
                    fetch('http://ec2-54-201-138-205.us-west-2.compute.amazonaws.com:3000/verification', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(verificationData),
                        })
                        .then(response => {
                            // Handle the response from the backend (e.g., success or error)
                            if (response.ok) {
                                // Verification successful
                                console.log(`Verification code sent`);
                                verificationError.textContent = 'Verification code sent';
                                // You can proceed with registration or further actions here
                            } else {
                                // Verification failed
                                console.error(`Verification code not sent`);
                                alert('Verification code not sent, click submit request button');
                            }
                        })
                        .catch(error => {
                            console.error('Error:', error);
                        });
                } else {
                    console.error('Select a verification method (SMS or email) before sending.');
                    verificationError.textContent = 'Select a verification method (SMS or email) before sending.';
                }
            } else {
                console.error('Generate a verification code before sending.');
                verificationError.textContent = '';
            }
        });

        // Continue with registration

        // Attach an input event listener to the input field
        verificationCodeInput.addEventListener('input', function() {
            // Get the current value of the input
            const codeValue = this.value.trim().toString();
           // console.log('Entered Code:', codeValue);
           // console.log('Correct Code:', verificationCode);

            // Check if the input value has reached 6 digits
            if (codeValue.length === 6) {
                if (codeValue === verificationCode.toString()) {
                    // The entered code matches the correct code
                    verificationError.textContent = ''; // Clear the error message

                    // Get the formData from sessionStorage
                    const formDataJSON = sessionStorage.getItem('signUpData');
                    const formData = JSON.parse(formDataJSON);

                    // Add the verification code to the formData
                    formData.verificationCode = codeValue;

                    // Send the formData to the backend
                    fetch('http://ec2-54-201-138-205.us-west-2.compute.amazonaws.com:3000/api/register', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(formData),
                        })
                        .then((response) => {
                            if (response.ok) {
                                // Redirect to a success page or handle success
                                verificationError.textContent = 'Registration successful, redirecting to login page';
                                setTimeout(() => {

                                    window.location.href = '/index.html';
                                }, 2000);

                            } else {
                                // Handle backend errors
                                console.error('Backend error:', response.status);
                                verificationError.textContent = 'Something went wrong, contact support';
                            }
                        })
                        .catch((error) => {
                            console.error('Error sending data to backend:', error);
                            verificationError.textContent = 'Something went wrong, contact support';
                        });
                } else {
                    // The entered code does not match the correct code
                    verificationError.textContent = 'Incorrect code. Please try again.'; // Display the error message
                }
            } else {
                // Reset the error message when the input length is not 6
                verificationError.textContent = '';
            }
        });

    } else {
        // Handle the case where there is no data in sessionStorage
        console.log('No form data found.');
        // You can redirect the user back to the registration page or handle it accordingly.
    }
});