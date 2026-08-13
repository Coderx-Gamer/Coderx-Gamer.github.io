// landing page only: pings the visit counter.
// Nothing here reads GitHub — every "latest" number on this page comes from the
// Breakery mods manifest (inline script in index.html), which is the source of truth
// for the public and early access builds.
document.addEventListener('DOMContentLoaded', () => {
    fetchVisits("modrinth");
});

function fetchVisits(version) {
    // collect referral parameters
    const urlParams = new URLSearchParams(window.location.search);
    let urlParamsString = '';

    urlParams.forEach((value, key) => {
        urlParamsString += `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    });

    // imagine paying for a server instead of using google scripts
    const requestUrl = `https://script.google.com/macros/s/AKfycbxzE2THSYV6FFh11a6FJSedyxtkL_L56NzWHfY6Ahzi8z8xL0fhuhNEv5Sep2buu-7vIA/exec?callback=handleResponse&jsonData={"action":"get_downloads","version":"${version}"}${urlParamsString}`;

    fetch(requestUrl)
        .then(response => response.text())
        .then(data => {
            const totalVisitsElement = document.querySelector('.total-visits');
            if (!totalVisitsElement) return;

            const totalVisits = JSON.parse(data.match(/handleResponse\((.*)\)/)[1]).page_visits;
            totalVisitsElement.innerHTML = `This page has been visited <b><u>${totalVisits}</u></b> times.`;
        })
        .catch(error => console.error('Error fetching total visits:', error));
}
