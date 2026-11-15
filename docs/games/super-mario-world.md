# Super Mario World

| Field | Value |
| ----- | ----- |
| Slug / prefix | `super-mario-world` / `smw-` |
| Edition | Original SNES release (also on Nintendo Switch Online). **Not** the GBA remake, which adds Dragon Coins to many levels. |
| Theme | `nintendo`, header red `#D3202A` + blue stripe (from the skin) |
| Skin | `smw-save-file` (see `themes.md`) |
| Mockup | `docs/design/super-mario-world.*` |
| Data | `data/games/super-mario-world/index.ts` |
| Build phase | 0.3 (first game; uses `check` and `pips` only — no meters, an agreed exception) |

## Structure

9 sections, `rows` layout (via the skin), in this order: Yoshi's Island, Donut Plains, Vanilla Dome, Twin Bridges, Forest of Illusion, Chocolate Island, Valley of Bowser, Star World, Special Zone. Levels within a world follow the mockup's order.

Entry kinds: `course`, `ghost-house`, `ghost-ship` (Sunken Ghost Ship), `switch-palace`, `fortress` (Reznor), `castle` (Koopaling), `bowser`.

| Trackable | Kind | Icon | ID | Where |
| --------- | ---- | ---- | -- | ----- |
| Normal exit | `check` | `exit` | `<level>-exit` | every level; castles/fortresses "Beat <boss>" (icon `castle`); switch palaces "Press the <color> switch" (icon `switch-<color>`) |
| Secret exit | `check` | `key` | `<level>-secret-exit` | the 24 levels with two exits |
| Dragon Coins | `pips` | `dragon-coin` | `<level>-dragon-coins` | levels with a confirmed count (see below); Chocolate Secret is `count: 1` with `singlePip: true` |
| 3-Up Moon | `check` | `moon` | `<level>-moon` | 7 levels |
| Bowser | `check` ×2 | `bowser-door` | `smw-bowsers-castle-front-door`, `-back-door` | Bowser's Castle, in Valley of Bowser. **Not exits** (not in the 96). |

Whole-game goals: Find all 96 exits; Press all four switches; Clear the Special Zone.

Stats: Exits (IDs ending `-exit`, 96), Dragon Coins (pip units), Coin sets (completed pips trackables), 3-Up Moons, Koopalings (castle exits only — Roy's and Larry's castles also have coins), Worlds (completed sections).

> ID gotcha: Chocolate Secret's normal exit is `smw-chocolate-secret-exit`, which also ends in `-secret-exit`. Don't find secret exits by ID suffix; use the `key` icon.

## Counts

| World | Levels | Exits | Secret exits | Dragon Coins | Coin sets | 3-Up Moons |
| ----- | ------ | ----- | ------------ | ------------ | --------- | ---------- |
| Yoshi's Island | 6 | 6 | 0 | 20 | 4 | 1 |
| Donut Plains | 10 | 15 | 5 | 31 | 6 | 1 |
| Vanilla Dome | 11 | 14 | 3 | 41 | 8 | 1 |
| Twin Bridges | 6 | 7 | 1 | 25 | 5 | 1 |
| Forest of Illusion | 9 | 14 | 5 | 30 | 6 | 1 |
| Chocolate Island | 9 | 11 | 2 | 28 | 6 | 1 |
| Valley of Bowser | 8 + Bowser | 11 | 3 | 26 | 5 | 1 |
| Star World | 5 | 10 | 5 | 5 | 1 | 0 |
| Special Zone | 8 | 8 | 0 | 44 | 8 | 0 |
| **Total** | **72** | **96** | **24** | **250** | **49** | **7** |

Total tickable units: 96 exits + 2 Bowser doors + 250 Dragon Coins + 7 moons + 3 goals = **358**. `tests/unit/data/super-mario-world.test.ts` checks every number in this table.

### Dragon Coins per level

Not every course has 5. Non-zero counts other than 5: Donut Secret 1 **6**, Vanilla Dome 3 **6**, Valley Ghost House **6**, Tubular **6**, Chocolate Island 5 **7**, Way Cool **8**, Chocolate Secret **1**.

Ghost houses and castles are not all coin-free on SNES: Vanilla, Forest and Valley Ghost Houses, the Sunken Ghost Ship, Roy's Castle and Larry's Castle have 5 or 6. Coin-free: the four switch palaces, the four fortresses, Donut Ghost House, Donut Secret House, Choco-Ghost House, Iggy's, Morton's, Lemmy's, Ludwig's and Wendy's Castles, Star World 2–5, and Bowser's Castle.

**Left out until verified** (no `dragon-coins` trackable yet): Forest of Illusion 1, Valley of Bowser 2, Valley of Bowser 4. Adding them later is a new ID, so nothing breaks.

## Sources

Researched 2026-11-14, every value from a fetched page:

- Super Mario Wiki — level pages (`https://www.mariowiki.com/<Level_Name>`, e.g. [Chocolate Secret](https://www.mariowiki.com/Chocolate_Secret), [Vanilla Dome 3](https://www.mariowiki.com/Vanilla_Dome_3), [Chocolate Island 5](https://www.mariowiki.com/Chocolate_Island_5), [Roy's Castle](https://www.mariowiki.com/Roy's_Castle), [Larry's Castle](https://www.mariowiki.com/Larry's_Castle), [Front Door](https://www.mariowiki.com/Front_Door), [Back Door](https://www.mariowiki.com/Back_Door), [Gnarly](https://www.mariowiki.com/Gnarly), [Way Cool](https://www.mariowiki.com/Way_Cool)); [Dragon Coin](https://www.mariowiki.com/Dragon_Coin); [3-Up Moon](https://mariowiki.com/3-Up_Moon); [SMW Levels template](https://www.mariowiki.com/Template:SMW%20Levels)
- Thonky — [List of All Exits and Secret Exits](https://www.thonky.com/super-mario-world/list-of-exits) (per-world exit counts summing to 96, without Bowser's doors), [Switch Palace Locations](https://thonky.com/super-mario-world/switch-palace-locations), and per-level walkthroughs ([index](https://www.thonky.com/super-mario-world/))
- ludo.guide — per-level pages and [Dragon Coins](https://www.ludo.guide/guide/super-mario-world/dragon-coins)
- [The Mushroom Kingdom SMW guide](https://themushroomkingdom.net/smw_guide.shtml)
- Couldn't fetch (403): GameFAQs "Dragon Coin Guide" by stromkind and StrategyWiki — probably the best sources to settle the open questions below.

Walkthrough counts are the coins a page *describes*; a walkthrough can skip one, so "describes 4" is weak evidence against 5 unless the page states a total.

## Single-source items

- Chocolate Island 1's 3-Up Moon (Super Mario Wiki only; Thonky and ludo walkthroughs don't mention it).
- Dragon Coins: Sunken Ghost Ship 5 (Thonky), Larry's Castle 5 (ludo), Forest of Illusion 3 5 (Super Mario Wiki).
- Switch palaces have 0 Dragon Coins (no source lists any; none says so outright).

## Calls made where sources disagree (please check)

| Level | Used | Other value | Why |
| ----- | ---- | ----------- | --- |
| Donut Secret 1 | 6 | 7 (MW prose) | Thonky and ludo both describe six ("the sixth Dragon Coin") |
| Vanilla Dome 3 | 6 | 5 (Thonky, ludo "all five") | MW lists six locations one by one and calls it one of the few with more than five |
| Valley Ghost House | 6 | 5 (ludo text) | Thonky says "all six"; ludo's own description has six spots |
| Valley of Bowser 3 | 5 | 4 (Thonky, ludo describe 4) | MW counts five explicitly |
| Gnarly | 5 | 8 (MW) | The 3 extras only appear if you haven't already got 5 (MW talk page), so 5 is what "all collected" means |
| Way Cool | 8 | 5 + "four more" (Thonky) | MW states eight (four in the Yoshi area, four in the main area) |

## Open questions

1. **Dragon Coins in Forest of Illusion 1, Valley of Bowser 2 (3?) and Valley of Bowser 4 (1 or 0?)** — left out. If Valley of Bowser 4 has 1, it would be the second `singlePip`.
2. **The six calls above** — confirm or correct.
3. **Cheese Bridge Area's Coin Heaven** (Yoshi's Wings) has 5 extra Dragon Coins (MW). Not tracked; it's an optional bonus area. Track it?
4. **Bowser's doors** count toward neither the 96 exits (Thonky, ludo, MW Back Door) — MW's Front Door page says both doors count as one exit. Tracked as two checks outside the 96.
5. **Top Secret Area and Yoshi's House** aren't exits and have no Dragon Coins; left out.
6. **Colored Yoshis** (Star World) aren't tracked. Add as checks?
7. **Spoilers:** nothing is marked as a spoiler (the mockup blurs nothing). Should the Special Zone be?
8. **Sunken Ghost Ship's world:** in Valley of Bowser (Thonky; needed for the 11 exits). MW notes a Shogakukan guide puts it in Chocolate Island.
