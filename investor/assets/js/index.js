//functions


//Fetch company list for home page
function fetchCompanies(companyList, city, country, category) {
    fetch('https://moneyhive-mw.com:2000/api/ideas')
        .then(response => response.json())
        .then(data => {
            const companyListElement = document.getElementById(companyList);

            // Filter companies based on the provided city, country, and category
            const filteredCompanies = data.filter(company => {
                const matchCity = city ? company.city.toLowerCase().includes(city.toLowerCase()) : true;
                const matchCountry = country ? company.nationality.toLowerCase().includes(country.toLowerCase()) : true;
                const matchCategory = category ? company.category.toLowerCase().includes(category.toLowerCase()) : true;
                return matchCity && matchCountry && matchCategory;
            });

            companyListElement.innerHTML = ''; // Clear previous content

            filteredCompanies.forEach(company => {
                const companyProfile = document.createElement('div');
                companyProfile.className = 'col-xxl-4 col-md-6';
                companyProfile.innerHTML = `
                    <div class="company_profile_info" id="${company.name}">
                        <div class="company-up-info">
                        <img src="${company.photo ? `data:image/png;base64, ${company.photo}` : 'assets/img/hive-logo.png'}" alt="Logo">
                            <h3>${company.name}</h3>
                            <h4>${company.category}</h4>
                            <ul>
                                <li><a href="#" title="" class="follow">${company.founders}</a></li>
                                <li><a href="#" title="" class="message-us"><i class="fa fa-envelope"></i></a></li>
                            </ul>
                        </div>
                        <a href="#" title="" class="view-more-pro">View Profile</a>
                    </div>
                `;

                // Add event listener to each "View Profile" link
                const viewProfileLink = companyProfile.querySelector('.view-more-pro');
                const ProfileLink = companyProfile.querySelector('.message-us');
                viewProfileLink.addEventListener('click', () => {
                    // Retrieve company data and redirect to profile.html
                    const companyData = JSON.stringify(company);
                    sessionStorage.setItem('companyData', companyData);
                    window.location.href = 'portifolio.html';
                });

                ProfileLink.addEventListener('click', () => {
                    // Retrieve company data and redirect to profile.html
                    const companyData = JSON.stringify(company);
                    sessionStorage.setItem('companyData', companyData);
                    window.location.href = 'portifolio.html';
                });

                companyListElement.appendChild(companyProfile);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');

    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const cityInput = this.querySelector('input[name="city"]');
        const countryInput = this.querySelector('input[name="country"]');
        const city = cityInput.value.trim();
        const country = countryInput.value.trim();
        const categorySelect = document.getElementById('categorySelect');
        const category = categorySelect.value;


        // Call fetchCompanies with the city, country, and category to filter the companies
        fetchCompanies("companyList", city, country, category);
    });

    // Call fetchCompanies with empty strings for city, country, and category to load all companies initially
    fetchCompanies("companyList", "", "", "");

    // Event listener for category dropdown change
    const categorySelect = document.getElementById('categorySelect');
    categorySelect.addEventListener('change', function() {
        const cityInput = searchForm.querySelector('input[name="city"]');
        const countryInput = searchForm.querySelector('input[name="country"]');
        const city = cityInput.value.trim();
        const country = countryInput.value.trim();
        const category = categorySelect.value;

        // Call fetchCompanies with the city, country, and category to filter the companies
        fetchCompanies("companyList", city, country, category);
    });
});






/****************************************************************************************************/


//Function to retrieve company data to dispaly in a portifolio page
function portifolio(
    companyname,
    companycategory,
    companycountry,
    companyfounders,
    companyusername,
    companymail,
    companyphone,
    companymarket,
    companytraction,
    companysummary,
    companylogo
   
    

) {
   

    // Fetch stored company data
    const companyData = sessionStorage.getItem('companyData');

    if (companyData) {
        const company = JSON.parse(companyData);

        // Insert company data into the respective HTML elements
        document.getElementById(companyname).textContent = company.name;
        document.getElementById(companysummary).textContent = company.summary;
        document.getElementById(companyusername).textContent = company.username;
        document.getElementById(companytraction).textContent = company.traction;
        document.getElementById(companymarket).textContent = company.market;
        document.getElementById(companycountry).textContent = company.nationality;
        document.getElementById(companycategory).textContent = company.category;
        document.getElementById(companyfounders).textContent = company.founders;
        document.getElementById(companymail).textContent = company.useremail;
        document.getElementById(companyphone).textContent = company.userphone;
        const profileLogo = document.getElementById(companylogo);
        profileLogo.src = `data:image/png;base64,${company.photo}`;
       
    }
}


/****************************************************************************************************/

// Function to display reviews in the list
function displayReviews(reviews) {
    const listGroup = document.querySelector('.list-group');
    listGroup.innerHTML = ''; // Clear previous content

    reviews.forEach(review => {
        const listItem = document.createElement('a');
        listItem.className = 'list-group-item list-group-item-action';
        listItem.href = '#';

        listItem.innerHTML = `
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">${review.userName}</h5>
          <small class="text-muted">${new Date(review.date).toLocaleDateString()}</small>
        </div>
        <small class="text-muted">${review.review}</small>
      `;

        listGroup.appendChild(listItem);
    });
}


/****************************************************************************************************/


// Function to set up event listener for the review button
function setupReviewButtonListener() {
    const reviewButton = document.querySelector('.btn[data-bs-toggle="modal"]');

    reviewButton.addEventListener('click', function() {
        const companyId = this.getAttribute('data-company-id');
        fetchReviews(companyId);
    });
}


/****************************************************************************************************/

function fetchReviews(companyId) {
    fetch('https://moneyhive-mw.com:2000/api/reviews')
        .then(response => response.json())
        .then(data => {
            console.log('API Response:', data); // Log the API response for debugging
            const reviews = data.filter(review => review.companyId === companyId);
            console.log('Filtered Reviews:', reviews); // Log the filtered reviews for debugging
            displayReviews(reviews);
        })
        .catch(error => {
            console.error('Error fetching reviews:', error);
        });
}

/*********************************************************************************************** */
//Add review to portifolio

document.addEventListener('DOMContentLoaded', function() {
    // Retrieve form data from sessionStorage
    const responseMessage = document.getElementById('message');
    const reviewButton = document.getElementById('submitReview');
    const submitError = document.getElementById('submitError');
    const reviewMessage = document.getElementById('reviewMessage');


    reviewButton.addEventListener('click', async function(event) {
        event.preventDefault();

        //create date

        const currentDate = new Date();

        // Get individual components of the date
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
        const day = currentDate.getDate().toString().padStart(2, '0');

        // Create the date string in the format 'YYYY-MM-DD'
        const dateString = `${year}-${month}-${day}`;

        //set 
        const userData = sessionStorage.getItem('userData');
        const user = JSON.parse(userData);

        const companyData = sessionStorage.getItem('companyData');
        const company = JSON.parse(companyData);

        // Get the values of the fields
        const review = reviewMessage.value;


        // Check if review is blank
        if (review !== '') {
            submitError.textContent = ''; // Clear the error message

            const formData = {
                // Replace 'phone' with the correct variable or value
                userID: user.id,
                username: user.firstName + "  " + user.lastName,
                companyID: company.id,
                companyName: company.name,
                review: review,
                created: dateString,

            };

            try {
                const response = await fetch('https://moneyhive-mw.com:3000/api/users/reviews', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                // Handle the response as needed (e.g., show success message)
                const data = await response.json();
                console.log('Server Response:', data);

                // Check if the message is "User updated successfully" or if the JSON is empty
                if (data && data.message === "review inserted successfully") {
                    responseMessage.textContent = "Review submitted";


                } else {
                    // Set the text content of passwordMatchError
                    responseMessage.textContent = "Error sending request";
                }

            } catch (error) {
                console.error('Error:', error);
                // Handle errors (e.g., display error message to the user)
            }

        } else {

            submitError.textContent = 'Forgot to write a review.';
            responseMessage.textContent = "";

            return; // Prevent form submission

        }
    });





});


/****************************************************************************************************/

//Contact information and processing
document.addEventListener('DOMContentLoaded', function() {

    const fullName = document.getElementById('name');
    const emailaddress = document.getElementById('emailaddress');
    const phone = document.getElementById('Phone');
    const message = document.getElementById('inquiry');
    const submitBtn = document.getElementById('buttonInquiry');
    const submitError = document.getElementById('inquiryError');
    const responseMessage = document.getElementById('message');

    submitBtn.addEventListener('click', async function(event) {
        event.preventDefault();


        //set 
        const userData = sessionStorage.getItem('userData');
        const user = JSON.parse(userData);

        const companyData = sessionStorage.getItem('companyData');
        const company = JSON.parse(companyData);

        // Get the values of the fields
        const Name = fullName.value;
        const Email = emailaddress.value;
        const Phone = phone.value;
        const Message = message.value;



        // Check if phone and name is blank
        if (fullName !== '' && Message !== '' && Phone !== '') {
            submitError.textContent = ''; // Clear the error message

            const formData = {
                // Replace 'phone' with the correct variable or value
                Name:Name,
                email: Email,
                targetMail: company.useremail,
                message: Message,
                phone: Phone,
            };

            try {
                const response = await fetch('https://moneyhive-mw.com:3000/contact/inquiry', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                // Handle the response as needed (e.g., show success message)
                const data = await response.json();
                console.log('Server Response:', data);

                // Check if the message is "User updated successfully" or if the JSON is empty
                if (data && data.message === "Mail sent") {
                    
                    openModal("Email sent");


                } else {
                    // Set the text content of passwordMatchError
                   
                    openModal("Error");

                }

            } catch (error) {
                console.error('Error:', error);
                openModal("Error");
                // Handle errors (e.g., display error message to the user)
            }

        } else {

            submitError.textContent = 'Forgot to write inquiry.';
            responseMessage.textContent = "";
          

            return; // Prevent form submission

        }
    });

});

//fetch business  profiles
function updateBusinessProfile() {
    const userData = sessionStorage.getItem("userData");
    const user = JSON.parse(userData);
    const userId = user.id;
  
    fetch(`https://moneyhive-mw.com:4000/api/users/${userId}`)
      .then((response) => response.json())
      .then((updatedData) => {
        // Directly update session storage with the new data
        sessionStorage.setItem("businessData", JSON.stringify(updatedData));
      })
      .catch((error) => {
        console.error("Error fetching updated user data:", error);
      });
  }

  async function updateIdeaProfile() {
    try {
      const userData = sessionStorage.getItem("userData");
      const user = JSON.parse(userData);
      const userId = user.id;
  
      const response = await fetch(`https://moneyhive-mw.com:2000/api/users/ideas/${userId}`);
      const updatedData = await response.json();
  
      // Directly update session storage with the new data
      sessionStorage.setItem("ideaData", JSON.stringify(updatedData));
    } catch (error) {
      console.error("Error fetching updated user data:", error);
    }
  }
 

    document.addEventListener('DOMContentLoaded', function() {
      const signOutLink = document.querySelector('.dropdown-item[href="../index.html"]');
  
      if (signOutLink) {
        signOutLink.addEventListener('click', function(event) {
          // Prevent the default link behavior (navigating to the href)
          event.preventDefault();
  
          // Clear session storage
          sessionStorage.clear();
  
          // Clear browser cache (optional, not recommended for security reasons)
          // Note: This might not work in all browsers due to security restrictions.
          // Uncomment the line below if you still want to attempt it.
          // window.location.reload(true);
  
          // Navigate to the sign-out page
          window.location.href = this.getAttribute('href');
        });
      }
    });

  

//call the function to display list of companies on home page
//fetchCompanies("companyList");
// Call the function to set up the event listener for the review button
setupReviewButtonListener();
updateBusinessProfile();
updateIdeaProfile

//call fuction to setup portifolios
portifolio("companyName", "companyCategory","nationality", "founders", "username", "useremail", "userphone", "market", "traction", "summary","logo");