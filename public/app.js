// Define the generateNews function
async function generateNews() {
    const preference1 = document.getElementById('preference1').value;
    const preference2 = document.getElementById('preference2').value;
    const preference3 = document.getElementById('preference3').value;
    const location = document.getElementById('location').value;

    const userPreferences = { preference1, preference2, preference3, location };

    try {
        const response = await fetch('/generate-news', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userPreferences),
        });

        if (!response.ok) {
            throw new Error('API request failed with status: ' + response.status + ' and statusText: ' + response.statusText);
        }

        const data = await response.json();
        document.getElementById('news-summary').innerHTML = `<p>${data.newsSummary}</p>`;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('news-summary').innerHTML = `<p>Error: ${error.message}</p>`;
    }
}
