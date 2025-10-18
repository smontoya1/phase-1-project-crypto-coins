Crypto Top 10 Screener

A simple web app that displays the **Top 10 cryptocurrencies** using live data from the **CoinGecko API**.  
Users can switch views between **Top Market Cap** and **Top Gainers/Losers**, search for specific coins, and see each coin’s price, market cap, daily change, and all-time high.

---

Features

- **Top 10 by Market Cap** – Shows the largest coins globally.
- **Top Gainers / Losers** – Displays the biggest movers in the past 24 hours.
- **Live Data** – Fetched directly from the public CoinGecko API.
- **Search Filter** – Instantly find a coin by name or symbol.
- **Color Indicators** – Positive % changes are green, negative are red.
- **Formatted Values** – Prices and market caps are displayed in USD with commas.
- **Responsive Layout** – Clean card layout that adapts to different screen sizes.

---

How It Works

The app uses:
- `fetch()` to retrieve live crypto data.
- `.map()`, `.filter()`, and `.forEach()` for processing and rendering data.
- `Intl.NumberFormat` and `Intl.DateTimeFormat` for clean currency and date formatting.
- Event listeners (`change`, `input`, `click`) to update the view dynamically.

The core function:
```js
function update() {
  let base = state.view === "mcap"
    ? getTopMarketCap(state.data)
    : getTopMovers(state.data, state.direction);

  const filtered = applySearch(base, state.search);
  render(filtered);
}
