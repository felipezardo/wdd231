document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  document.getElementById("firstName").textContent = params.get("firstName") || "";
  document.getElementById("lastName").textContent = params.get("lastName") || "";
  document.getElementById("email").textContent = params.get("email") || "";
  document.getElementById("phone").textContent = params.get("phone") || "";
  document.getElementById("organization").textContent = params.get("organization") || "";
  document.getElementById("timestamp").textContent = params.get("timestamp") || "";

  const year = document.getElementById("year");
  const lastModified = document.getElementById("lastModified");
  if (year) year.textContent = new Date().getFullYear();
  if (lastModified) lastModified.textContent = `Last Modified: ${document.lastModified}`;
});
