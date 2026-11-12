# Yoshi's Crafted World

| Field | Value |
| ----- | ----- |
| Slug / prefix | `yoshis-crafted-world` / `ycw-` |
| Platform | Nintendo Switch |
| Theme | `nintendo`, accent `#1F7F2D` (Yoshi green, egg-spot header, red stripe) |
| Skin | none — `rows`-style course cards plus a costume `gallery` per world |
| Mockup | `docs/design/yoshis-crafted-world.*` |
| Build phase | 0.4 |

## Structure

17 sections (worlds), each with course entries, boss entries, and an extras group of 10 capsule-machine costumes.

Per course (front side → crafts → Flip Side):

| Trackable | Kind | Icon |
| --------- | ---- | ---- |
| Cleared | `check` | tick |
| 100 Coins | `check` | tick |
| Hidden Smiley Flowers | `pips` (count per course, 2–8) | `flower` |
| Red Coins | `meter` (max 20) | `red-coin` |
| Hearts at the goal | `meter` (max 20) | `heart` |
| Each craft request | `check` | `craft` |
| 3 Poochy Pups | `check` (Flip Side) | tick |
| Pups within the time limit | `check` (Flip Side; limit varies per course) | tick |

Bosses: "Beaten" `check`; the five Dream Gem bosses also have a "<color> Dream Gem" `check`. Hidden Hills courses have no Flip Side.

Whole-game extras: 6 craft requests not tied to a course (Clothesline, Paper Airplane, Milk Bottle, Derby Sheep, Pumpkin, Tulip); special costumes Kamek (clear every course), Blockafeller (find Sprout in every course), Sundream Stone (give all Smiley Flowers).

## Counts (from the mockup)

- Courses: 43 (40 with a Flip Side; Hidden Hills' 3 without)
- Hidden Smiley Flowers per course: see table in the mockup data — 246 total
- Craft requests tied to courses: 121 (+6 not tied to a course)
- Capsule costumes: 170 (10 per world)
- Total tickable units in the mockup: 812

## Sources

- [Yoshi's Crafted World (Super Mario Wiki)](https://www.mariowiki.com/Yoshi's_Crafted_World) — worlds, courses, bosses
- [List of crafts (Super Mario Wiki)](https://www.mariowiki.com/List_of_crafts_in_Yoshi%27s_Crafted_World)
- [List of costumes (Super Mario Wiki)](https://www.mariowiki.com/List_of_costumes_in_Yoshi%27s_Crafted_World)
- [Smiley Flower (Super Mario Wiki)](https://mariowiki.com/Smiley_Flower)
- [Smiley Flower locations, pages 1–4 (GamesRadar)](https://gamesradar.com/yoshi-crafted-world-smiley-flowers-all-locations) — hidden flowers per course
- [Poochy's Tape Trail](https://www.mariowiki.com/Poochy%27s_Tape_Trail), [Solar Zoom](https://www.mariowiki.com/Solar_Zoom), [Hoop-Jump Hop](https://www.mariowiki.com/Hoop-Jump_Hop), [Rough Rolling](https://www.mariowiki.com/Rough_Rolling), [Under Siege](https://www.mariowiki.com/Under_Siege), [Floppin' and Poppin'](https://www.mariowiki.com/Floppin%27_and_Poppin%27) (Super Mario Wiki) — per-course checks

## Single-source items

- Hidden flower counts for the first 40 courses (GamesRadar only).
- Costume list per world (Super Mario Wiki only).

## Open questions

1. **Score/race flowers:** special courses (Hoop-Jump Hop, Solar Zoom, Go-Go Yoshi, Altitude Adjustment, Jungle Tour Challenge) award extra flowers for score or placement. Not tracked yet.
2. **Flower total:** our per-course hidden counts plus bonus flowers don't obviously add up to the 317 needed for the Sundream Stone. Reconcile before phase 0.4.
3. **World order:** the game branches; the mockup uses one route. Decide on a canonical order.
4. **Amiibo costumes** (12) are left out. Add as an optional section?
5. **Shared crafts:** Caramel Billboard, Zebra and Can Robot appear in three courses each — confirm they're three separate requests.
