//login
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const loginMessage = document.getElementById("loginMessage");
  const userDataUrl = "http://ec2-54-201-138-205.us-west-2.compute.amazonaws.com:3000/api/users";

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const loginValue = this.querySelector('input[name="loginValue"]').value;
    const password = this.querySelector('input[name="password"]').value;

    // Validate user input
    if (!loginValue || !password) {
      loginMessage.textContent =
        "Please enter both a valid phone number or email and password.";
      return;
    }

    try {
      // Fetch user data
      const response = await fetch(userDataUrl);
      const users = await response.json();

      const user = users.find(
        (u) =>
          (u.phone === parseInt(loginValue, 10) || u.email === loginValue) &&
          u.password === password
      );

      if (user) {
        // Successful login
        loginMessage.textContent = "Login successful! Redirecting...";

        // Store user data in sessionStorage
        sessionStorage.setItem("userData", JSON.stringify(user));

        // Redirect after a short delay

        // Check user category and redirect accordingly
        const redirectDelay = 1000; // Adjust the delay time if needed

        if (user.category === "General") {
            const redirectUrl = (user.status === "freemium") ? "/free-general/index" : "/general/index";
        
            setTimeout(() => {
                window.location.href = redirectUrl;
            }, redirectDelay);
        } else if (user.category === "Micro Lender") {
          const redirectUrl = (user.status === "freemium") ? "/free-business/index" : "/business/index";
            setTimeout(() => {
              window.location.href = redirectUrl;
            }, redirectDelay);
        } else if (user.category === "Microfinancier") {
          const redirectUrl = (user.status === "freemium") ? "/free-business/index" : "/business/index";
          setTimeout(() => {
            window.location.href = redirectUrl;
          }, redirectDelay);
      } else if (user.category === "Investor") {
        const redirectUrl = (user.status === "freemium") ? "/free-investor/index" : "/investor/index";
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, redirectDelay);
    } else {
      alert('Data not found');
            // Handle other categories if needed
        }
        
      } else {
        // Failed login
        loginMessage.textContent =
          "Incorrect phone number or email or password. Please try again.";
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      loginMessage.textContent =
        "An error occurred while logging in. Please try again later.";
    }
  });
});

//sign up
document.addEventListener("DOMContentLoaded", function () {
  const signupForm = document.getElementById("signupForm");
  const passwordInput = document.getElementById("password");
  const repeatPasswordInput = document.getElementById("repeat-password");
  const passwordMatchError = document.getElementById("passwordMatchError");

  // Function to handle the checkbox change event
  function handleCheckboxChange() {
    const checkbox = document.getElementById("c2");
    const getStartedButton = document.querySelector(
      '#signupForm button[type="submit"]'
    );

    if (checkbox.checked) {
      // If the checkbox is checked, enable the button
      getStartedButton.removeAttribute("disabled");
    } else {
      // If the checkbox is unchecked, disable the button
      getStartedButton.setAttribute("disabled", "disabled");
    }
  }

  // Attach the event listener to the checkbox
  const checkbox = document.getElementById("c2");
  checkbox.addEventListener("change", handleCheckboxChange);

  // Initially, disable the button since the checkbox is unchecked by default
  handleCheckboxChange();

  signupForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Get the values of the password fields
    const password = passwordInput.value;
    const repeatPassword = repeatPasswordInput.value;

    // Check if passwords match
    if (password !== repeatPassword) {
      passwordMatchError.textContent = "Passwords do not match.";
      return; // Prevent form submission
    } else {
      passwordMatchError.textContent = ""; // Clear the error message
      // Proceed with form submission or redirection to verification.html
      // You can add your logic here

      // Get form data
      const formData = {
        firstname: this.querySelector('input[name="firstname"]').value,
        lastname: this.querySelector('input[name="lastname"]').value,
        phone: this.querySelector('input[name="phone"]').value,
        email: this.querySelector('input[name="email"]').value,
        category: document.getElementById("categorySelect").value,
        password: password, // Use the validated password here
        country: this.querySelector('select[name="country"]').value, // Include the selected country
      };

      // Store form data in sessionStorage
      sessionStorage.setItem("signUpData", JSON.stringify(formData));

      // Redirect to the verification page
      window.location.href = "/verification.html";
    }
  });
});
