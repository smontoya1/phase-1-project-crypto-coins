const state = {
    view: "mcap",
    direction: "gainers",
    search: "",
    data: []
};

const Formatters = {
    number: new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }),
    
    compact: new Intl.NumberFormat('en-US', {
        notation: 'compact',
        compactDisplay: 'long',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }),

    date: new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
    })
}

const UserInputs = {
    getTopMarketCap: function(list) {
        return [...list].sort((a, b) => b.marketCap - a.marketCap)
        .slice(0, 25);
    },       

    getTopMovers: function(list, direction) {
        const sorted = [...list].sort((a, b) => b.change - a.change)
        if (direction === "gainers") {
            return sorted.slice(0, 25)
        } else {
            return sorted.reverse().slice(0, 25);
        }
    },

    applySearch: function(list, term) {
        const input = term.trim().toLowerCase();
        if (!input) {
            return list; // if input is empty, just return list   
        } else {
            return list.filter(coin => 
                coin.name.toLowerCase().includes(input) || 
                coin.symbol.toLowerCase().includes(input)
            )
        }
    }
}

const CoinMethods = {
    getCoins: function() {
        fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false")
        .then(res => res.json())
        .then(coins => {
            state.data = coins
            .filter(coin => coin.name && coin.symbol)
            .map(coin => ({ 
                image: coin.image,
                id: coin.id,
                name: coin.name,
                symbol: coin.symbol.toUpperCase(),
                price: Formatters.number.format(coin.current_price),
                change: coin.price_change_percentage_24h,
                marketCap: Formatters.compact.format(coin.market_cap),
                ath: Formatters.number.format(coin.ath),
                athChange: coin.ath_change_percentage,
                athDate: Formatters.date.format(new Date(coin.ath_date))
            }));
            console.log("Coins have been successfully fetched!")
            CoinMethods.update(); 
        });
    },

    render: function(list) {
        const container = document.querySelector("#crypto-list");
        container.innerHTML = "";

        // Iterate through coins & Append to DOM
        list.forEach((coin, idx) => {
            const div = document.createElement("div");

            function getChangeClass(value) {
                if (value >= 0) {
                    return "pos";
                } else {
                    return "neg";
                }
            }

            div.innerHTML = `
                <div class="coin-card">
                    <div class="coin-rank">${idx + 1}.</div>
                    <img class="coin-image" src="${coin.image}" alt="${coin.name} logo"/>
                    <div class="coin-details">
                        <h3 class="coin-title">${coin.name} <span class="coin-symbol">(${coin.symbol})</span></h3>
                        <p class="coin-price">
                            <strong>Price:</strong> <span class="price">$${coin.price}</span> 
                            <span class="change ${getChangeClass(coin.change)}">(${coin.change?.toFixed(2)}%)</span>
                        </p>
                        <p class="coin-ath">
                            <strong>All Time High:</strong> <span>$${coin.ath}</span> 
                            <span class="change ${getChangeClass(coin.athChange)}">(${coin.athChange.toFixed(2)}%)</span> 
                            <span>on ${coin.athDate}</span>
                        </p>
                        <p class="coin-mcap">
                            <strong>Market Cap:</strong> <span>$${coin.marketCap}</span></p>
                    </div>
                </div>
            `;

            container.appendChild(div);
        });
    },

    update: function() {
        let base;

        if (state.view === "mcap") {
            base = UserInputs.getTopMarketCap(state.data)
        } else {
            base = UserInputs.getTopMovers(state.data, state.direction);
        }

        const filtered = UserInputs.applySearch(base, state.search);
        CoinMethods.render(filtered);
        console.log("View has been successfully updated!")
    }
};

// Event Listeners

// view toggle
document.querySelector("#view-controls").addEventListener("change", (e) => {
    console.log("User has selected the '"+e.target.value+"' view...")
    state.view = e.target.value;
    CoinMethods.update();
});

// direction select
document.querySelector("#direction-select").addEventListener("change", (e) => {
    console.log("User has selected the '"+e.target.value+"' view...")
    state.direction = e.target.value;
    CoinMethods.update();
});

// search input
document.querySelector("#search").addEventListener("input", (e) => {
    console.log("User is searching for '"+e.target.value+"'...")
    state.search = e.target.value;
    CoinMethods.update();
});

// initial fetch
CoinMethods.getCoins();
