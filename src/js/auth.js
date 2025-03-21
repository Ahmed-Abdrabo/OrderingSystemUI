const API_URL = "https://orderingsystemserver.runasp.net/api"; // Backend API URL
// const API_URL = "https://localhost:7018/api"; // Backend API URL

document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");

  if (token) {
      // Redirect to CustomerOrder if token exists
      window.location.href = "CustomerOrder.html";
  }
});


$("#login").submit(function (e) {
  e.preventDefault();

  const email = $("#email").val();
  const emailError = $("#emailError");
  const password = $("#password").val();
  const passwordError = $("#passwordError");
  const errorMessage = $("#errorMessage"); // Ensure it's a jQuery object

  const submitBtn = $("#submit");

  emailError.addClass("hidden");
  passwordError.addClass("hidden");

  let isValid = true;

  const emailRegex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;
  //email validation
  if (!email) {
    emailError.removeClass("hidden");
    emailError.text("email is required");
    isValid = false;
  } else if (!emailRegex.test(email)) {
    emailError.removeClass("hidden");
    emailError.text("email is not valid");
    isValid = false;
  }
  // password validations
  if (!password) {
    passwordError.removeClass("hidden");
    passwordError.text("Password is required");
    isValid = false;
  } else if (password.length < 8) {
    passwordError.removeClass("hidden");
    passwordError.text("Password min chars 8");
    isValid = false;
  }
  //

  if (isValid) {
    // ajax call goes here
    submitBtn.attr("disabled", "disabled") ;
    submitBtn.html(`
        <div role="status">
            <svg aria-hidden="true" class="w-6 h-6 text-white animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
            <span class="sr-only">Loading...</span>
        </div>
    `);


    $.ajax({
      url: `${API_URL}/Account/login`, // API URL
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ email: email, password: password }),
      success: function (response) {
        if (response.token) {
          console.log("success");
          
          localStorage.setItem("token", response.token);
          localStorage.setItem("userEmail", response.email);
          localStorage.setItem("displayName", response.displayName);
          localStorage.setItem("userRole", response.role); // Example: "admin" or "user"

          window.location.href = "CustomerOrder.html"; // Redirect on success
        } else {
          console.log("success");

          errorMessage.text(response.message).removeClass("hidden");
          submitBtn.removeAttr("disabled").text("Sign In");
        }
      },
      error: function (xhr) {
        submitBtn.removeAttr("disabled").text("Sign In");
        let errorText = "An error occurred. Please try again.";

        if (xhr.responseJSON) {
          if (xhr.responseJSON.errors && Array.isArray(xhr.responseJSON.errors)) {
            // Display validation errors
            errorText = xhr.responseJSON.errors.join("<br>");
          } else if (xhr.responseJSON.message) {
            errorText = xhr.responseJSON.message;
          }
        }

        errorMessage.html(errorText).removeClass("hidden");
      }
    });
  }
});

$("#register").submit(function (e) {
  e.preventDefault();

  const displayName = $("#displayName").val();
  const displayNameError = $("#displayNameError");
  const email = $("#email").val();
  const emailError = $("#emailError");
  const phoneNumber = $("#phoneNumber").val();
  const phoneNumberError = $("#phoneNumberError");
  const password = $("#password").val();
  const passwordError = $("#passwordError");
  const errorMessage = $("#errorMessage");
  const submitBtn = $("#submit");

  displayNameError.addClass("hidden");
  emailError.addClass("hidden");
  phoneNumberError.addClass("hidden");
  passwordError.addClass("hidden");
  errorMessage.addClass("hidden");

  let isValid = true;

  const emailRegex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex = /^[0-9]{10,15}$/;

  if (!displayName) {
      displayNameError.removeClass("hidden").text("Full Name is required");
      isValid = false;
  }

  if (!email) {
      emailError.removeClass("hidden").text("Email is required");
      isValid = false;
  } else if (!emailRegex.test(email)) {
      emailError.removeClass("hidden").text("Email is not valid");
      isValid = false;
  }

  if (!phoneNumber) {
      phoneNumberError.removeClass("hidden").text("Phone Number is required");
      isValid = false;
  } else if (!phoneRegex.test(phoneNumber)) {
      phoneNumberError.removeClass("hidden").text("Phone Number must be 10-15 digits");
      isValid = false;
  }

  if (!password) {
      passwordError.removeClass("hidden").text("Password is required");
      isValid = false;
  } else if (password.length < 8) {
      passwordError.removeClass("hidden").text("Password must be at least 8 characters");
      isValid = false;
  }

  if (isValid) {
      submitBtn.attr("disabled", "disabled").html(`
          <div role="status">
              <svg aria-hidden="true" class="w-6 h-6 text-white animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908Z" fill="currentColor"/>
              </svg>
              <span class="sr-only">Loading...</span>
          </div>
      `);

      $.ajax({
        url: `${API_URL}/Account/register`, // API URL
        type: "POST",
          contentType: "application/json",
          data: JSON.stringify({
              displayName: displayName,
              email: email,
              phoneNumber: phoneNumber,
              password: password
          }),
          success: function (response) {
            if (response.token) {
              console.log("success");
              
              localStorage.setItem("token", response.token);
              localStorage.setItem("userEmail", response.email);
              localStorage.setItem("displayName", response.displayName);
              localStorage.setItem("userRole", response.role); // Example: "admin" or "user"

              window.location.href = "CustomerOrder.html"; // Redirect on success
              } else {
                  errorMessage.text(response.message).removeClass("hidden");
              }
          },
          error: function (xhr) {
            let errorText = "An error occurred. Please try again.";
        
            if (xhr.responseJSON) {
              if (xhr.responseJSON.errors && Array.isArray(xhr.responseJSON.errors)) {
                // Display validation errors as a list
                errorText = xhr.responseJSON.errors.join("<br>");
              } else if (xhr.responseJSON.message) {
                errorText = xhr.responseJSON.message;
              }
            }
        
            errorMessage.html(errorText).removeClass("hidden");
          },
          complete: function () {
              submitBtn.removeAttr("disabled").html("Register");
          },
      });
  }
});
