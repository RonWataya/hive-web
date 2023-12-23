document.addEventListener("DOMContentLoaded", function () {

  const userData = sessionStorage.getItem("userData");
  const user = JSON.parse(userData);
  const userStatus = user.status;
  const phoneId = user.phone;

  function updateSessionStorage() {
    // Fetch API endpoint to get updated user data based on phoneId
    fetch(`http://ec2-54-201-138-205.us-west-2.compute.amazonaws.com:2000/api/users/${phoneId}`)
      .then((response) => response.json())
      .then((updatedUserData) => {
        // Update session storage with the new data
        sessionStorage.setItem("userData", JSON.stringify(updatedUserData));
        verifyAccess();
      })
      .catch((error) => {
        console.error("Error fetching updated user data:", error);
        sessionStorage.clear();
        window.location.href = '../index.html';
      });
  }
  function verifyAccess(){
   
    console.log(userStatus);
    if(userStatus === "freemium"){
        sessionStorage.clear();
        window.location.href = '../index.html';
    }
}
updateSessionStorage();

    
  });

 