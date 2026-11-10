# Campus reference pass

The campus layout retains the existing terraced grid and building style. The supplied evacuation plan, democratic-spaces illustration, and block diagram guide relative positions. HKP is the northwestern building; Himnasyo occupies the former biodiversity building. No dormitory buildings are present.

Species and location source: [user-supplied plant document](https://docs.google.com/document/d/1jr3woTjHPaf3rVsDAOiAfoDL_8mhO8x5at2e9FuQplk/edit?tab=t.5iw7x6gq5y8l). Its exported text is in `plant-reference.txt`. Its seven species replace the earlier nine-species quest roster. The north staircase represents the document's locally named stairs between KA and HKP.

The document spells Moclame's scientific name `Ficus microcapra`. The game uses `Ficus microcarpa`, the spelling in the [NParks flora list](https://www.nparks.gov.sg/nature/species-list/flora). The [NParks fishtail fern description](https://www.nparks.gov.sg/florafaunaweb/flora/5/9/5933) supports simple leathery fronds and scattered round sori. Plant sprites are stylized field-game illustrations, not identification photographs.

Traditional medicinal uses are attributed to the supplied notes. The game does not present their clinical effectiveness as established or give remedy recipes. All seven quests use photographic collection, without labeling all seven species legally protected.

The revised story uses a separate v2 save key. Existing v1 progress remains stored and is not overwritten, because the plant roster and quest IDs changed.

Validation: `npm test`, `npm run build`, and `node scripts/smoke.mjs`. The browser test checks reachability, screenshots, asset loading, identification, and photograph collection for every species. Playwright must have a browser installed; `PLAYWRIGHT_BROWSERS_PATH` can point to an existing installation.
