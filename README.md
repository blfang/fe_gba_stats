# Fire Emblem GBA Stat Distributions

**Try it at https://fe-gba-stats.vercel.app.**

Compute and compare stat distributions for any two characters from the Game Boy Advance Fire Emblem games (FE6: The Binding Blade, FE7: The Blazing Blade, and FE8: The Sacred Stones).

## Features

- Compute stats for any playable character from FE6, FE7, or FE8, and configure level, promotions, hard mode bonuses, etc.
- Compare two units side-by-side with detailed stat cards and an overlaid radar plot.
- For each stat, see the median as well as the 10th and 90th percentiles to understand variance due to RNG.
- Share specific comparisons via URL
- FAQ section explaining growth calculation methodology

## Calculation details

Web scraping from Serenes Forest and other sources was done in `notebooks/fe_parser.ipynb` and saved in `public/final_flat.csv`. PMF convolution calculations to compute the final stat distributions can be found in `src/utils/statMath.js`.