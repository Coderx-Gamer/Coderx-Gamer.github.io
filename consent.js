function acceptCookies() {
    document.getElementById("cookieConsent").style.display = "none";
    localStorage.setItem("cookiesAccepted", "true");
}

if (!localStorage.getItem("cookiesAccepted")) {
    document.getElementById("cookieConsent").style.display = "block";
}
