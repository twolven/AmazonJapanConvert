// converter.js
let exchangeRate = 1/157; // Default fallback rate
let displayMode = 'both';    // Default display mode
let lastUpdateTime = null;

async function fetchExchangeRate() {
    try {
        const response = await fetch('https://open.er-api.com/v6/latest/JPY');
        const data = await response.json();
        if (data && data.rates && data.rates.USD) {
            exchangeRate = data.rates.USD;
            lastUpdateTime = new Date().toLocaleString();
            // Store the rate and update time
            browser.storage.local.set({
                exchangeRate: exchangeRate,
                lastUpdateTime: lastUpdateTime
            });
            console.log('Updated exchange rate:', exchangeRate);
        }
    } catch (error) {
        console.error('Error fetching exchange rate:', error);
        // Keep using the default rate
    }
}

function convertPrice(yenPrice) {
    const numberOnly = yenPrice.replace(/[^0-9]/g, '');
    const priceInUSD = (numberOnly * exchangeRate).toFixed(2);
    
    if (displayMode === 'usd') {
        return `$${priceInUSD}`;
    }
    return `${yenPrice} ($${priceInUSD})`;
}

function updatePrices() {
    const priceSelectors = [
        '.a-price-whole',
        '.p13n-sc-price',
        '#priceblock_ourprice',
        '#priceblock_dealprice',
        '.a-color-price'
    ];

    priceSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
            if (!element.dataset.converted) {
                const originalPrice = element.textContent.trim();
                element.textContent = convertPrice(originalPrice);
                element.dataset.converted = 'true';
                element.dataset.originalPrice = originalPrice;
            }
        });
    });
}

// Load settings and start extension
async function initialize() {
    try {
        // Load stored exchange rate and settings
        const stored = await browser.storage.local.get(['exchangeRate', 'lastUpdateTime', 'displayMode']);
        if (stored.exchangeRate) {
            exchangeRate = stored.exchangeRate;
            lastUpdateTime = stored.lastUpdateTime;
        }
        if (stored.displayMode) {
            displayMode = stored.displayMode;
        }

        // Fetch fresh exchange rate
        await fetchExchangeRate();
        
        // Schedule periodic updates (every 6 hours)
        setInterval(fetchExchangeRate, 6 * 60 * 60 * 1000);
        
        // Run initial conversion
        updatePrices();
        
        // Watch for dynamic content changes
        const observer = new MutationObserver(updatePrices);
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Listen for settings changes
        browser.storage.onChanged.addListener((changes) => {
            if (changes.displayMode) {
                displayMode = changes.displayMode.newValue;
                document.querySelectorAll('[data-converted="true"]').forEach(element => {
                    const originalPrice = element.dataset.originalPrice;
                    element.textContent = convertPrice(originalPrice);
                });
            }
        });
        
        console.log('Amazon Japan USD Converter loaded successfully!');
    } catch (error) {
        console.error('Error initializing converter:', error);
    }
}

initialize();