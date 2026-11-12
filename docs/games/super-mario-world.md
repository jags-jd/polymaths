# Super Mario World

| Field | Value |
| ----- | ----- |
| Slug / prefix | `super-mario-world` / `smw-` |
| Platform | SNES (also on Nintendo Switch Online) |
| Theme | `nintendo`, header red `#D3202A` + blue stripe |
| Skin | `smw-save-file` (see `themes.md`) |
| Mockup | `docs/design/super-mario-world.*` |
| Build phase | 0.3 (first game — exercises all three trackable kinds) |

## Structure

9 sections, `rows` layout (via the skin), in this order: Yoshi's Island, Donut Plains, Vanilla Dome, Twin Bridges, Forest of Illusion, Chocolate Island, Valley of Bowser, Star World, Special Zone.

Per level:

| Trackable | Kind | Icon | Where |
| --------- | ---- | ---- | ----- |
| Normal exit | `check` | `exit` | every level (castles/fortresses: "Beat <boss>", icon `castle`; switch palaces: "Press the <color> switch", icon `switch`) |
| Secret exit | `check` | `key` | levels with two exits |
| Dragon Coins | `pips` (count 5) | `dragon-coin` | regular courses (Chocolate Secret: 1 — see open questions) |
| 3-Up Moon | `check` | `moon` | 7 levels |
| Bowser | `check` ×2 | `bowser-door` | Front Door, Back Door |

Whole-game goals: all 96 exits (title-screen star); clear the Special Zone (map turns autumn); press all four switches.

Stats: Exits, Dragon Coins, Coin sets, 3-Up Moons, Koopalings, Worlds.

## Counts (from the mockup)

- Exits: **96** — Yoshi's Island 6, Donut Plains 15, Vanilla Dome 14, Twin Bridges 7, Forest of Illusion 14, Chocolate Island 11, Valley of Bowser 11, Star World 10, Special Zone 8.
- Levels with secret exits: Donut Plains 1, Donut Plains 2, Donut Ghost House, Donut Secret 1, Donut Secret House, Vanilla Dome 1, Vanilla Secret 1, Vanilla Dome 2, Cheese Bridge Area, Forest of Illusion 1–4, Forest Ghost House, Chocolate Island 2, Chocolate Island 3, Valley of Bowser 2, Valley Ghost House, Valley of Bowser 4, Star World 1–5.
- 3-Up Moons: Yoshi's Island 1, Donut Plains 4, Vanilla Dome 3, Cheese Bridge Area, Forest Ghost House, Chocolate Island 1, Valley of Bowser 1.
- Total tickable units in the mockup: 354.

## Sources

- [List of All Exits and Secret Exits (Thonky)](https://www.thonky.com/super-mario-world/list-of-exits) — exit counts per world (sum to 96)
- [SMW Levels template (Super Mario Wiki)](https://www.mariowiki.com/Template:SMW%20Levels) — level list
- [3-Up Moon (Super Mario Wiki)](https://mariowiki.com/3-Up_Moon) — moon locations
- [Dragon Coin (Super Mario Wiki)](https://www.mariowiki.com/Dragon_Coin)
- [Super Mario World guide (The Mushroom Kingdom)](https://themushroomkingdom.net/smw_guide.shtml) — per-level secret exits and bosses

## Single-source items

- 3-Up Moon locations (Super Mario Wiki only).

## Open questions

1. **Dragon Coins per level:** the mockup assumes 5 on every regular course and 1 in Chocolate Secret. Sources say some courses have more and castles/ghost houses/fortresses have none, but no per-level list was confirmed. Verify level by level before phase 0.3.
2. **Top Secret Area and Yoshi's House** don't count as exits and are left out. Confirm.
3. **Colored Yoshis** (Star World) aren't tracked. Add as checks?
4. **Bowser door icons** not designed yet.
