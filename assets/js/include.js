document.addEventListener("DOMContentLoaded", () => {
    fetch("../components/header.html")
      .then(res => res.text())
      .then(data => document.getElementById("header-placeholder").innerHTML = data);
  
    fetch("../components/footer.html")
      .then(res => res.text())
      .then(data => document.getElementById("footer-placeholder").innerHTML = data);
  });
  
  
  