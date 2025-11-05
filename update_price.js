import fs from "fs";
import fetch from "node-fetch";

const API = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin-gold&price_change_percentage=1h";

function svgTemplate(price, pct, up) {
  const color = up ? "#39ff88" : "#ff4b4b";
  const arrow = up
    ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v16"/><path d="M6 10l6-6 6 6"/></svg>`
    : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V4"/><path d="M18 14l-6 6-6-6"/></svg>`;

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="120">
  <rect width="100%" height="100%" rx="12" fill="url(#bg)" />
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#000"/>
      <stop offset="100%" stop-color="#0b0b0b"/>
    </linearGradient>
  </defs>
  <text x="30" y="45" font-size="20" font-family="Poppins" fill="#f5c542" font-weight="bold">BTG Openverse</text>
  <text x="30" y="80" font-size="32" font-family="Poppins" fill="#f5c542" font-weight="bold">$${price}</text>
  <g transform="translate(270, 55)">
    ${arrow}
    <text x="25" y="7" font-size="18" fill="${color}" font-family="Poppins" font-weight="600">${pct}%</text>
  </g>
</svg>`;
}

async function main() {
  try {
    const res = await fetch(API);
    const data = await res.json();
    const p = data[0].current_price;
    const pct = (data[0].price_change_percentage_1h_in_currency || 0).toFixed(2);
    const up = parseFloat(pct) >= 0;
    const formatted = p >= 1 ? p.toFixed(3) : p.toFixed(6);

    const svg = svgTemplate(formatted, pct, up);
    fs.writeFileSync("./Price/live.svg", svg);
    console.log("✅ live.svg updated:", formatted, pct + "%");
  } catch (e) {
    console.error("❌ Error updating price:", e);
  }
}

main();
