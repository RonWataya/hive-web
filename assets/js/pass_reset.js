document.addEventListener('DOMContentLoaded', function() {
    // Retrieve form data from sessionStorage

    const verificationCodeInput = document.getElementById('verificationCode');

    const sendVerificationButton = document.getElementById('sendVerificationButton');
    let verificationCode = '';
    let verificationMethod = 'email';
    const verificationError = document.getElementById('verificationError');
    //const formData = JSON.parse(formDataJSON);

    // Function to generate a random 6-digit verification code
    function generateVerificationCode() {
        return Math.floor(100000 + Math.random() * 900000);
    }

    //send verification email
    sendVerificationButton.addEventListener('click', function() {
        // Check if a verification code has been generated
        // Generate a random 6-digit verification code for email/sms initially
        const initialVerificationCode = generateVerificationCode();
        verificationCode = initialVerificationCode;
        const emailInput = document.getElementById('email').value.trim();

        // Check if email is not blank
        if (emailInput === '') {
            alert('Please enter your email address.');
            return;
        }

        if (verificationCode) {
            // Check if a verification method is selected

            // Prepare the data to send to the backend
            const verificationData = {
                code: verificationCode,
                method: verificationMethod,
                email: emailInput,
            };
            sessionStorage.setItem('passwordData', JSON.stringify(verificationData));
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

    });
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


                window.location.href = '/pass_renew.html';


            } else {
                // The entered code does not match the correct code
                verificationError.textContent = 'Incorrect code. Please try again.'; // Display the error message
            }
        } else {
            // Reset the error message when the input length is not 6
            verificationError.textContent = '';
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Retrieve form data from sessionStorage

    const passwordInput = document.getElementById('password');
    const repeatPass = document.getElementById('confirm');
    const passwordSubmit = document.getElementById('passwordSubmit');
    const passwordMatchError = document.getElementById('passwordMatchError'); // Corrected ID

    //update password
    passwordSubmit.addEventListener('click', async function(event) {
        event.preventDefault();

        // Get the values of the password fields
        const password = passwordInput.value;
        const repeatPassword = repeatPass.value;

        // Check if passwords match
        if (password !== repeatPassword) {
            passwordMatchError.textContent = 'Passwords do not match.';
            return; // Prevent form submission
        } else {
            passwordMatchError.textContent = ''; // Clear the error message
            // Proceed with form submission 
            // Prepare form data including the base64 image data

            const userData = sessionStorage.getItem('passwordData');
            const user = JSON.parse(userData);
            //console.log(user.email);

            // Note: 'phone' is not defined in your provided code
            // Replace it with the correct variable or value
            const formData = {
                // Replace 'phone' with the correct variable or value
                email: user.email,
                password: password,
            };

            try {
                const response = await fetch('http://ec2-54-201-138-205.us-west-2.compute.amazonaws.com:2000/api/users/passwordReset', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                // Handle the response as needed (e.g., show success message)
                const data = await response.json();
                //console.log('Server Response:', data);

                // Check if the message is "User updated successfully" or if the JSON is empty
                if (data && data.message === "User updated successfully") {
                    passwordMatchError.textContent = "Password updated";
                    setTimeout(() => {

                        window.location.href = '/index.html';
                    }, 2000);
                } else {
                    // Set the text content of passwordMatchError
                    passwordMatchError.textContent = "Error updating password";
                }

            } catch (error) {
                console.error('Error:', error);
                // Handle errors (e.g., display error message to the user)
            }
        }
    });

});