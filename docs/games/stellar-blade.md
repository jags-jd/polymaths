# Stellar Blade

| Field | Value |
| ----- | ----- |
| Slug / prefix | `stellar-blade` / `sb-` |
| Platforms | PS5, PC |
| Theme | `default` (mint accent `#7CE0C3`) |
| Skin | none |
| Mockup | `docs/design/stellar-blade.*` |
| Legacy data | `docs/games/stellar-blade.legacy.json` (old flat format, 104 items) |
| Build phase | 0.4 |

## Structure (from the mockup / legacy data)

| Section | Layout | Items |
| ------- | ------ | ----- |
| Main Missions | `rows` | 15 |
| Bosses | `gallery` | 16 |
| Endings | `rows` | 3 (spoiler) |
| Side Stories and Requests | `rows` | 6 |
| Collectibles | `rows` | 8 |
| Costumes (Nano Suits) | `gallery` | 37 |
| Upgrades | `rows` | 6 |
| Combat Feats | `rows` | 8 |
| New Game Plus and Completion | `rows` | 3 |
| Extra Bosses (Updates and DLC) | `gallery` | 2 |

All `check`. Convert the legacy JSON to the new format in phase 0.4, **keeping every existing ID**.

## Sources

- [Stellar Blade Trophy List (PowerPyx)](https://www.powerpyx.com/stellar-blade-trophy-list-revealed/)
- [All Collectible Locations (PowerPyx)](https://www.powerpyx.com/stellar-blade-all-collectible-locations/)
- [All Nano Suits (PowerPyx)](https://www.powerpyx.com/stellar-blade-all-nano-suits-outfits-costumes/)
- [All Stellar Blade bosses (Dexerto)](https://dexerto.com/gaming/all-stellar-blade-bosses-2530115)
- [Trophies and trophy guide (Gamepressure)](https://www.gamepressure.com/stellar-blade/trophies-achievements/z3113f8)
- [All Main Missions and Side Quests (The Game Crater)](https://www.thegamecrater.com/?p=63609)
- [All Endings (Push Square)](https://www.pushsquare.com/guides/stellar-blade-all-endings-and-how-to-unlock-them)
- [Bosses and enemies list (Game8)](https://game8.co/games/Stellar-Blade/archives/451180)
- [All can locations (Deltia's Gaming)](https://deltiasgaming.com/stellar-blade-all-can-locations)

## Single-source items

- Nano Suit list and locations (PowerPyx only).
- Extra bosses Mann and Scarlet (one source).

## Open questions

1. **Side quests and Bulletin Board requests** are grouped as one item each; sources disagree on the count (33–35). List individually?
2. **Bosses:** Quiel and repeat fights (second Belial, second Maelstrom) left out — only one source.
3. **Excluded suits:** Skin Suit and the starting Planet Diving Suit (owned from the start), Stargazer (paid edition bonus). Confirm.
4. **Collectible sets** (49 cans, Data Bank entries) could become `meter`s or individual `pips`/entries.
