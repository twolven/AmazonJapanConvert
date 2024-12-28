# Amazon Japan USD Price Converter

A Firefox extension that automatically converts Japanese Yen prices to USD on Amazon Japan (amazon.co.jp).

## Features

- Real-time currency conversion using current exchange rates
- Toggle between two display modes:
  - Show both currencies (¥1000 ($6.37))
  - Show USD only ($6.37)
- Automatically converts all prices on the page
- Updates dynamically when new content loads
- Simple toolbar popup for easy settings
- Caches exchange rates locally
- Updates exchange rates every 6 hours
- Fallback rate if API is unavailable

## Installation

### From Firefox Add-ons
1. Visit [Amazon Japan USD Converter on Firefox Add-ons](https://addons.mozilla.org/firefox/addon/amazon-japan-usd-converter/)
2. Click "Add to Firefox"

### Manual Installation (Development)
1. Clone this repository
2. Open Firefox and navigate to `about:debugging`
3. Click "This Firefox" on the left sidebar
4. Click "Load Temporary Add-on"
5. Select any file in the extension's directory

## Usage

1. Visit [Amazon Japan](https://www.amazon.co.jp)
2. Prices will automatically convert to USD
3. Click the extension icon in the toolbar to:
   - Switch between display modes
   - See current exchange rate
   - Manually refresh the exchange rate

## Technical Details

- Uses exchangerate-api.com for live currency rates
- Default fallback rate: 157 JPY = 1 USD
- Caches exchange rates in browser storage
- Updates rates every 6 hours
- Uses MutationObserver for dynamic content

## Development

### Files
- `manifest.json`: Extension configuration
- `converter.js`: Main conversion logic
- `popup.html`: Settings UI
- `popup.js`: Settings functionality
- `icon.svg`: Vector icon source
- `icon48.png`, `icon96.png`: Extension icons

### Building
To create the extension package:
1. Select all files
2. Create a ZIP archive
3. Ensure manifest.json is at the root level of the ZIP

## License

MIT License - See LICENSE file for details

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Support

If you encounter any issues or have suggestions, please open an issue on GitHub.