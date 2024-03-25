document.addEventListener('DOMContentLoaded', () => {
    fetch('https://api.github.com/repos/coderx-gamer/ui-utils/releases/latest')
        .then(response => response.json())
        .then(data => {
            const release = data;
            const asset = release.assets[0];
            const fileSize = (asset.size / 1000000).toFixed(2) + " MB";
            const releaseDate = new Date(release.published_at);
            const daysOld = Math.ceil((new Date() - releaseDate) / (1000 * 60 * 60 * 24));

            const downloadIcon = '<img src="content/download.svg" width="16" alt="Download Icon" style="vertical-align: middle; margin-right: 5px;">';
            document.querySelector('.download').innerHTML = `${downloadIcon} UI-Utils: ${asset.name} (${fileSize})`;
            document.querySelector('.release-info').innerHTML = `Version: ${release.tag_name}<br>\n${release.body}\n<br>Released ${daysOld} days ago<br>`;
            document.querySelector('.download').onclick = () => window.location.href = asset.browser_download_url;
        })
        .catch(error => console.error('Error fetching latest release:', error));

    fetch('https://api.github.com/repos/FabricMC/fabric/releases/latest')
        .then(response => response.json())
        .then(data => {
            const asset = data.assets[0];
            const fileSize = (asset.size / 1000000).toFixed(2) + " MB";

            const downloadIcon = '<img src="content/download.svg" width="16" alt="Download Icon" style="vertical-align: middle; margin-right: 5px;">';
            document.querySelector('.download-fabric').innerHTML = `${downloadIcon} Fabric API: ${data.name} (${fileSize})`;
            document.querySelector('.download-fabric').onclick = () => window.location.href = asset.browser_download_url;
        })
        .catch(error => console.error('Error fetching Fabric API latest release:', error));
});
