if (!localStorage.getItem("admin") && !sessionStorage.getItem("admin")) {
  location.replace("login.html");
}
