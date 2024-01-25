
let base64ImageData = '';
document.addEventListener("DOMContentLoaded", function () {

updateBusinessProfile();   
  const responseMessage = document.getElementById("message");
  // Function to handle image selection
  document.getElementById("profileImageInput") .addEventListener("change", function (event) {
      const file = event.target.files[0];

      if (file) {
        const reader = new FileReader();

        reader.onloadend = function () {
          // Create an Image element to get the natural width and height of the image
          const img = new Image();
          img.src = reader.result;

          img.onload = function () {
            // Check if the image dimensions are within the specified limits
            if (img.width <= 500 && img.height <= 500) {
              // Display the selected image preview
              document.getElementById("previewImage").src = reader.result;

              // Store the base64 image data in a variable
              const base64ImageData = reader.result.split(",")[1];

              // Set the base64 image data in a hidden input field
              document.getElementById("base64ImageInput").value =
                base64ImageData;
            } else {
              alert("Image dimensions must be 500px x 500px or less.");
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

  const buttonCreate = document.getElementById("buttoncreate");
  buttonCreate.addEventListener("click", async function (event) {
      event.preventDefault();

      // Get other form data
      const Form = document.getElementById('profileForm');
      const Country = Form.querySelector('select[name="country"]').value;
      const businessName = document.getElementById("businessname").value;
      const Note = document.getElementById("noteSelect").value;
      const Rates = document.getElementById("rates").value;
      const About = document.getElementById("about").value;
      const Terms = document.getElementById("terms").value;
  //    const Country = this.querySelector('select[name="country"]').value
      const City = document.getElementById("city").value;
      const Address = document.getElementById("address").value;
      const Whatsapp = document.getElementById("whatsapp").value;
      const Email = document.getElementById("email").value;
      const Phone = document.getElementById("phone").value;
      // ... (get other form fields similarly)

      // Get the base64 image data from the hidden input field
      base64ImageData = document.getElementById("base64ImageInput").value;
      const userData = sessionStorage.getItem("userData");
      const user = JSON.parse(userData);
      const userId = user.id;
      const category = user.category;
      

      // Prepare form data including the base64 image data
      const formData = {
        businessName: businessName,
        Note: Note,
        About: About,
        Rates: Rates,
        Category: category,
        Terms: Terms,
        Country:Country,
        City: City,
        Address: Address,
        Whatsapp: Whatsapp,
        Email: Email,
        Phone: Phone,
        userId: userId,
        // ... (add other form fields similarly),
        Logo: base64ImageData, // Add the base64 image data to the form data
      };

      // Fetch API endpoint to update user data in the backend
      try {
        const response = await fetch("https://malh.fun:4000/api/business/create", {
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
        if (data && data.message === "Profile successfully") {
          // Call function to update session storage with new data
         // updateSessionStorage(formData.phone);
          openModal("New Profile Created");
          updateBusinessProfile();
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
  

  //modal functions

});

async function UpdateBusiness() {
  try {
    // Your existing code for updating business profile
    const Form = document.getElementById('profileForm');
    const Country = Form.querySelector('select[name="country"]').value;
    const businessName = document.getElementById("businessname").value;
    const Note = document.getElementById("noteSelect").value;
    const Rates = document.getElementById("rates").value;
    const About = document.getElementById("about").value;
    const Terms = document.getElementById("terms").value;
    const City = document.getElementById("city").value;
    const Address = document.getElementById("address").value;
    const Whatsapp = document.getElementById("whatsapp").value;
    const Email = document.getElementById("email").value;
    const Phone = document.getElementById("phone").value;
    const base64ImageData = document.getElementById("base64ImageInput").value;
    const userData = sessionStorage.getItem("userData");
    const user = JSON.parse(userData);
    const userId = user.id;
    const category = user.category;

    const formData = {
      businessName: businessName,
      Note: Note,
      About: About,
      Rates: Rates,
      Category: category,
      Terms: Terms,
      Country: Country,
      City: City,
      Address: Address,
      Whatsapp: Whatsapp,
      Email: Email,
      Phone: Phone,
      userId: userId,
      Logo: base64ImageData,
    };

    // Your existing fetch code
    const response = await fetch("https://malh.fun:4000/api/business/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    console.log("Server Response:", data);

    if (data && data.message === "success") {
      openModal("Profile Updated");
      updateBusinessProfile();
    } else {
      openModal("Error");
    }
  } catch (error) {
    console.error("Error:", error);
    openModal("Error");
  }
}


//Delete profile
async function DeleteBusiness(){

    const userData = sessionStorage.getItem("userData");
    const businessData = sessionStorage.getItem("businessData")
    const user = JSON.parse(userData);
    const business = JSON.parse(businessData);

      const formData = {
      businessId: business.id,
      userId: user.id,
     
    };
    try {
      const response = await fetch(
        "https://malh.fun:4000/api/business/delete",
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
      if (data && data.message === "deleted") {
          updateBusinessProfile();
          openModal("Profile Deleted");
          
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

async function updateBusinessProfile() {
  try {
    const userData = sessionStorage.getItem("userData");
    const user = JSON.parse(userData);
    const userId = user.id;

    const response = await fetch(`https://malh.fun:4000/api/users/${userId}`);
    const updatedData = await response.json();

    // Directly update session storage with the new data
    sessionStorage.setItem("businessData", JSON.stringify(updatedData));
  } catch (error) {
    console.error("Error fetching updated user data:", error);
  }
}



