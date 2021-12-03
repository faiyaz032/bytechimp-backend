"use strict";

const inputEmail = document.querySelector(".email");
const inputPass = document.querySelector(".password");
const signInForm = document.querySelector(".signInForm");
const rememberCheckBox = document.querySelector("#remember");

if (localStorage.getItem("admin") || sessionStorage.getItem("admin")) {
  location.replace("index.html");
}

signInForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const username = inputEmail.value;
  const password = inputPass.value;

  const data = {
    username,
    password,
  };

  fetch("https://bytechimp-api.herokuapp.com/api/user/login", {
    headers: {
      "content-type": "application/json",
    },
    method: "post",
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.status === "success") {
        if (rememberCheckBox.checked) {
          localStorage.setItem("admin", "remembered");
        } else {
          sessionStorage.setItem("admin", "remembered");
        }

        location.href = "index.html";
      }
    });
});
