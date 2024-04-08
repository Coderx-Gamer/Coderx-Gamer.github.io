document.addEventListener('DOMContentLoaded', () => {
    fetch('https://api.github.com/repos/coderx-gamer/ui-utils/releases/latest')
        .then(response => response.json())
        .then(data => {
            const release = data;
            const version = release.tag_name;
            fetchTotalDownloads(version);

            const asset = release.assets[0];
            const fileSize = (asset.size / 1000000).toFixed(2) + " MB";
            const releaseDate = new Date(release.published_at);
            const daysOld = Math.ceil((new Date() - releaseDate) / (1000 * 60 * 60 * 24));
            const downloadIcon = '<img src="/content/download.svg" width="16" alt="Download Icon" style="vertical-align: middle; margin-right: 5px;">';
            document.querySelector('.download').innerHTML = `${downloadIcon} UI-Utils: ${asset.name} (${fileSize})`;
            document.querySelector('.release-info').innerHTML = `Version: ${release.tag_name}<br>\n${release.body}\n<br>Released ${daysOld} days ago<br>`;
            document.querySelector('.download').onclick = () => {
                logDownload(version);
                const totalDownloadsElement = document.querySelector('.total-downloads');
                const currentCount = parseInt(totalDownloadsElement.dataset.count) + 1;
                totalDownloadsElement.innerHTML = `UI-Utils has been downloaded from this page ${currentCount} times!`;
                totalDownloadsElement.dataset.count = currentCount;
                window.location.href = asset.browser_download_url;
            };
        })
        .catch(error => console.error('Error fetching latest release:', error));

    function fetchTotalDownloads(version) {
        fetch(`https://script.google.com/macros/s/AKfycbxzE2THSYV6FFh11a6FJSedyxtkL_L56NzWHfY6Ahzi8z8xL0fhuhNEv5Sep2buu-7vIA/exec?callback=handleResponse&jsonData={"action":"get_downloads","version":"${version}"}`)
            .then(response => response.text())
            .then(data => {
                const totalDownloads = JSON.parse(data.match(/handleResponse\((.*)\)/)[1]).total_downloads;
                const totalVisits = JSON.parse(data.match(/handleResponse\((.*)\)/)[1]).page_visits;
                const totalDownloadsElement = document.querySelector('.total-downloads');
                const totalVisitsElement = document.querySelector('.total-visits');

                totalDownloadsElement.innerHTML = `UI-Utils has been downloaded from this page <b></b><u>${totalDownloads}</u></b> times`;
                totalVisitsElement.innerHTML = `This page has been visited <b><u>${totalVisits}</u></b> times.`
                totalVisits.style = "color: #ff00fa"

                totalDownloadsElement.dataset.count = totalDownloads;

            })
            .catch(error => console.error('Error fetching total downloads:', error));
    }

    // Log download function
    function logDownload(version) {
        fetch(`https://script.google.com/macros/s/AKfycbxzE2THSYV6FFh11a6FJSedyxtkL_L56NzWHfY6Ahzi8z8xL0fhuhNEv5Sep2buu-7vIA/exec?jsonData={"action":"log_download","version":"${version}"}`)
            .then(response => response.text())
            .then(data => console.log('Download logged:', data))
            .catch(error => console.error('Error logging download:', error));
    }
});