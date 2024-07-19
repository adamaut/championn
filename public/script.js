document.getElementById('url-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const longUrl = document.getElementById('long-url').value;
    const response = await fetch('/shorten', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ longUrl }),
    });
    const data = await response.json();
    document.getElementById('result').textContent = `Short URL: ${data.shortUrl}`;
});

document.getElementById('privacy-policy').addEventListener('click', () => {
    alert('This is a simple URL shortener. We do not store any personal information.');
});