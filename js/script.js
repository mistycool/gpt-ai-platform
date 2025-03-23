// script.js

// Side Menu Toggle
document.getElementById('menu-button').addEventListener('click', () => {
    const sideMenu = document.getElementById('side-menu');
    sideMenu.classList.toggle('open');
});

// Text-to-Image Functionality
async function generateImage() {
    const prompt = document.getElementById('prompt').value;
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = '<p>Loading...</p>';

    try {
        const response = await fetch('https://gpt-ai-platform.onrender.com/text-to-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });

        if (response.ok) {
            const blob = await response.blob();
            const img = document.createElement('img');
            img.src = URL.createObjectURL(blob);
            outputDiv.innerHTML = '';
            outputDiv.appendChild(img);
        } else {
            outputDiv.innerHTML = `<p>Error: ${response.statusText}</p>`;
        }
    } catch (error) {
        outputDiv.innerHTML = `<p>Error: ${error.message}</p>`;
    }
}
