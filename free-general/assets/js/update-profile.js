document.addEventListener("DOMContentLoaded", function () {

  //modal functions
 

    //end of modal functions
  const responseMessage = document.getElementById("message");
  // Function to handle image selection
  document
    .getElementById("profileImageInput")
    .addEventListener("change", function (event) {
      const file = event.target.files[0];

      if (file) {
        const reader = new FileReader();

        reader.onloadend = function () {
          // Create an Image element to get the natural width and height of the image
          const img = new Image();
          img.src = reader.result;

          img.onload = function () {
            // Check if the image dimensions are within the specified limits
            if (img.width <= 360 && img.height <= 360) {
              // Display the selected image preview
              document.getElementById("previewImage").src = reader.result;

              // Store the base64 image data in a variable
              const base64ImageData = reader.result.split(",")[1];

              // Set the base64 image data in a hidden input field
              document.getElementById("base64ImageInput").value =
                base64ImageData;
            } else {
              alert("Image dimensions must be 300px x 300px or less.");
              // You may want to clear the file input or take other actions on invalid images
            }
          };
        };

        reader.readAsDataURL(file);
      }
    });

  // Function to remove the selected image
  function removeProfileImage() {
    // Reset the input field, display the default upload.png image, and clear the base64 image data
    document.getElementById("profileImageInput").value = "";
    document.getElementById("previewImage").src = "assets/img/upload.png";

    // Clear the base64 image data
    document.getElementById("base64ImageInput").value = "";
  }

  // Handle form submission
  document
    .getElementById("profileForm")
    .addEventListener("submit", async function (event) {
      event.preventDefault();

      // Get other form data
      const firstName = document.getElementById("firstName").value;
      const lastName = document.getElementById("lastName").value;
      const about = document.getElementById("about").value;
      const OtherPhone = document.getElementById("otherPhone").value;
      const Occupation = document.getElementById("job").value;
      const Address = document.getElementById("address").value;
      const Twitter = document.getElementById("twitter").value;
      const Facebook = document.getElementById("facebook").value;
      const Instagram = document.getElementById("instagram").value;
      const Linkedin = document.getElementById("linkedin").value;
      // ... (get other form fields similarly)

      // Get the base64 image data from the hidden input field
      const base64ImageData = document.getElementById("base64ImageInput").value;
      const userData = sessionStorage.getItem("userData");
      const user = JSON.parse(userData);
      const phoneId = user.phone;
      console.log(phoneId);

      // Prepare form data including the base64 image data
      const formData = {
        firstName: firstName,
        lastName: lastName,
        about: about,
        address: Address,
        occupation: Occupation,
        otherphone: OtherPhone,
        twitter: Twitter,
        facebook: Facebook,
        instagram: Instagram,
        linkedin: Linkedin,
        phone: phoneId,
        // ... (add other form fields similarly),
        photo: base64ImageData, // Add the base64 image data to the form data
      };

      // Fetch API endpoint to update user data in the backend
      try {
        const response = await fetch("http://ec2-54-201-138-205.us-west-2.compute.amazonaws.com:2000/api/users/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        // Handle the response as needed (e.g., show success message)
        const data = await response.json();
        console.log("Server Response:", data);

        // Check if the message is "user updated" or if the JSON is empty

        // Check if the message is "Mail sent" or if the JSON is empty
        if (data && data.message === "User updated successfully") {
          // Call function to update session storage with new data
          updateSessionStorage(formData.phone);
          openModal("Profile updated");
        } else {
          openModal("Error");
        }
      } catch (error) {
        console.error("Error:", error);
        // Handle errors (e.g., display error message to the user)
        openModal("Error");
      }
    });

  // Function to update session storage with new data
  function updateSessionStorage(phoneId) {
    // Fetch API endpoint to get updated user data based on phoneId
    fetch(`http://ec2-54-201-138-205.us-west-2.compute.amazonaws.com:2000/api/users/${phoneId}`)
      .then((response) => response.json())
      .then((updatedUserData) => {
        // Update session storage with the new data
        sessionStorage.setItem("userData", JSON.stringify(updatedUserData));
      })
      .catch((error) => {
        console.error("Error fetching updated user data:", error);
      });
  }

  //modal functions

});

//Update password
document.addEventListener("DOMContentLoaded", function () {
  // Retrieve form data from sessionStorage
  const responseMessage = document.getElementById("message");
  const currentPassword = document.getElementById("currentpassword");
  const passwordInput = document.getElementById("password");
  const repeatPass = document.getElementById("confirm");
  const passwordSubmit = document.getElementById("passwordSubmit");
  const passwordMatchError = document.getElementById("passwordMatchError"); // Corrected ID

  //update password
  passwordSubmit.addEventListener("click", async function (event) {
    event.preventDefault();
    const userData = sessionStorage.getItem("userData");
    const user = JSON.parse(userData);
    // Get the values of the password fields
    const password = passwordInput.value;
    const repeatPassword = repeatPass.value;

    // Check if passwords match
    if (password !== repeatPassword) {
      passwordMatchError.textContent = "New passwords do not match.";
      return; // Prevent form submission
    } else if (currentPassword.value !== user.password) {
      passwordMatchError.textContent = "Incorrect current password";
      console.log(user.password);
    } else {
      passwordMatchError.textContent = ""; // Clear the error message
      // Proceed with form submission
      // Prepare form data including the base64 image data

      // Note: 'phone' is not defined in your provided code
      // Replace it with the correct variable or value
      const formData = {
        // Replace 'phone' with the correct variable or value
        email: user.email,
        password: password,
      };

      try {
        const response = await fetch(
          "http://ec2-54-201-138-205.us-west-2.compute.amazonaws.com:2000/api/users/passwordReset",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        // Handle the response as needed (e.g., show success message)
        const data = await response.json();
        console.log("Server Response:", data);

        // Check if the message is "User updated successfully" or if the JSON is empty
        if (data && data.message === "User updated successfully") {
          updateSessionStorage(user.phone);
          openModal("Password updated");
        } else {
          // Set the text content of passwordMatchError
          openModal("Error");
        }
      } catch (error) {
        console.error("Error:", error);
        openModal("Error");
        // Handle errors (e.g., display error message to the user)
      }
    }
  });
  // Function to update session storage with new data
  function updateSessionStorage(phoneId) {
    // Fetch API endpoint to get updated user data based on phoneId
    fetch(`http://ec2-54-201-138-205.us-west-2.compute.amazonaws.com:2000/api/users/${phoneId}`)
      .then((response) => response.json())
      .then((updatedUserData) => {
        // Update session storage with the new data
        sessionStorage.setItem("userData", JSON.stringify(updatedUserData));
      })
      .catch((error) => {
        console.error("Error fetching updated user data:", error);
      });
  }
});

//Delete request
document.addEventListener("DOMContentLoaded", function () {
  // Retrieve form data from sessionStorage
  const responseMessage = document.getElementById("message");
  const deleteRequest = document.getElementById("deleteRequest");
  const deleteError = document.getElementById("deleteError");
  const deleteMessage = document.getElementById("delete");

  //send delete request
  deleteRequest.addEventListener("click", async function (event) {
    event.preventDefault();
    const userData = sessionStorage.getItem("userData");
    const user = JSON.parse(userData);
    // Get the values of the fields
    const requestMessage = deleteMessage.value;

    // Check if passwords match
    if (requestMessage !== "") {
      deleteError.textContent = ""; // Clear the error message

      const formData = {
        // Replace 'phone' with the correct variable or value
        email: user.email,
        phone: user.phone,
        reason: requestMessage,
        accountID: user.id,
      };

      try {
        const response = await fetch(
          "http://ec2-54-201-138-205.us-west-2.compute.amazonaws.com:2000/api/users/deleteRequest",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        // Handle the response as needed (e.g., show success message)
        const data = await response.json();
        console.log("Server Response:", data);

        // Check if the message is "User updated successfully" or if the JSON is empty
        if (data && data.message === "Delete request inserted successfully") {
          responseMessage.textContent =
            "Account delete request submitted, it takes 48 hours to permanently delete";
            openModal("Request submitted");
            
        } else {
          // Set the text content of passwordMatchError
          
          openModal("Error sending request");
        }
      } catch (error) {
        console.error("Error:", error);
        openModal("Error");
        // Handle errors (e.g., display error message to the user)
      }
    } else {
      deleteError.textContent = "Share us a reason before you proceed.";
      responseMessage.textContent = "";

      return; // Prevent form submission
    }
  });
});
