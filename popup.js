function updateDisplay() {
    browser.storage.local.get(['exchangeRate', 'lastUpdateTime'])
        .then(result => {
            if (result.exchangeRate) {
                const rate = (1 / result.exchangeRate).toFixed(2);
                document.getElementById('rate').textContent = `${rate} JPY = 1 USD`;
                document.getElementById('updateTime').textContent = result.lastUpdateTime || '-';
            }
        });
}

document.addEventListener('DOMContentLoaded', () => {
    // Restore saved display mode
    browser.storage.sync.get({ displayMode: 'both' })
        .then(result => {
            document.getElementById('displayMode').value = result.displayMode;
        });

    // Update rate display
    updateDisplay();

    // Save when display mode changed
    document.getElementById('displayMode').addEventListener('change', (e) => {
        browser.storage.sync.set({
            displayMode: e.target.value
        });
    });

    // Refresh rate button
    document.getElementById('refreshRate').addEventListener('click', async () => {
        const button = document.getElementById('refreshRate');
        button.disabled = true;
        button.textContent = 'Refreshing...';
        
        try {
            const response = await fetch('https://open.er-api.com/v6/latest/JPY');
            const data = await response.json();
            if (data && data.rates && data.rates.USD) {
                const exchangeRate = data.rates.USD;
                const lastUpdateTime = new Date().toLocaleString();
                await browser.storage.local.set({
                    exchangeRate,
                    lastUpdateTime
                });
                updateDisplay();
            }
        } catch (error) {
            console.error('Error refreshing rate:', error);
        }
        
        button.disabled = false;
        button.textContent = 'Refresh Rate';
    });
});