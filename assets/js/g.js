
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
        firstname: this.querySelector('input[name="fullname"]').value,
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
