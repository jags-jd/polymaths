# Yoshi's Crafted World

| Field | Value |
| ----- | ----- |
| Slug / prefix | `yoshis-crafted-world` / `ycw-` |
| Platform | Nintendo Switch (2019) |
| Theme | `nintendo`, accent `#1F7F2D` (Yoshi green, egg-spot header, red stripe) |
| Skin | none: shared `cards` layout (one card per course) plus a costume `gallery` per world |
| Mockup | `docs/design/yoshis-crafted-world.*` |
| Data | `data/games/yoshis-crafted-world/index.ts` |
| Build phase | 0.4 (first game with real `meter`s) |

## Scope (Jan, 2026-11-18)

- **Every Smiley Flower is trackable**, including the score/race flowers, so the Sundream Stone goal counts exactly the game's **693** flowers.
- **Amiibo costumes (12) are left out.**
- **Spoilers:** the final story world (Shadowville, which contains the final boss *The Great King Bowser*) is blurred. So is the Hidden Hills costume named after that boss.
- **World order:** the mockup's route. Super Mario Wiki orders Sky-High Heights and Acorn Forest before Pastel Pathway and Cardstock Carnival; the map branches.

## Structure

17 sections (worlds), layout `cards`. Each has course entries, a boss entry where the world has one, and an extras `gallery` of its 10 capsule costumes.

Per course (front side → crafts → Flip Side → after the story):

| Trackable | Kind | Icon | ID | Flowers |
| --------- | ---- | ---- | -- | ------- |
| Cleared | `check` | `tick` | `<course>-cleared` | — |
| 100 coins | `check` | `coins` | `<course>-100-coins` | 1 |
| Red Coins | `meter`, max 20 | `red-coin` | `<course>-red-coins` | 1 at 20 |
| Hearts at the goal | `meter`, max 20 | `heart` | `<course>-hearts` | 1 at 20 |
| Hidden Smiley Flowers | `pips` (2–8) | `flower` | `<course>-flowers` | 1 per pip |
| Score/race flowers (6 courses) | `pips`, 3 | `score` | `<course>-score-flowers` | 1 per pip |
| Each craft request | `check`, group "Craft requests" | `craft` | `<course>-craft-<craft>` | 1 |
| Poochy Pups (40 main courses) | `pips`, 3, group "Flip Side" | `pup` | `<course>-pups` | 1 per pip |
| All pups within the time limit | `check`, group "Flip Side" | `stopwatch` | `<course>-pups-in-time` | 1 |
| Found Sprout | `check`, group "After the story" | `sprout` | `<course>-sprout` | — |

**Bosses** (6 boss levels): "Beaten (\<color\> Dream Gem)" `check` (`<boss>-cleared`, icon `tick`), plus "Boss challenges" `pips` ×3 (`<boss>-challenges`, icon `challenge`, 1 flower each). The challenges are listed in the entry's note. Mini-bosses fought inside courses (Yarrctopus, Shogun of Skewers, Mr. Geary) give nothing and aren't separate levels, so they aren't entries.

**Shared craft requests:** Caramel Billboard, Zebra and Can Robot each ask for 3 copies, one in each course of their world. Each is **one** request with one tick, ID `ycw-<world>-craft-<craft>`, shown on the last of the three courses.

**Costumes:** entry `ycw-costume-<name>`, `check` "Owned" (`-owned`, icon `costume`).

**Whole-game goals** (automatic, see `docs/decisions/2026-11-15-automatic-goals.md`):

| Goal | Condition | Counts |
| ---- | --------- | ------ |
| Kamek costume | every level cleared (`-cleared`: 43 courses + 6 bosses) | 49 levels |
| Blockafeller costume | Sprout found in every course | 43 Sprouts |
| Sundream Stone costume | every Smiley Flower (icons `flower`, `coins`, `red-coin`, `heart`, `pup`, `stopwatch`, `craft`, `score`, `challenge`; counted in units) | 693 flowers |

Stats: Courses (43), Bosses (6), Hidden flowers (247), Crafts (121), Costumes (170), Worlds (17).

## Counts

| World | Courses | Boss | Hidden flowers | Crafts | Costumes |
| ----- | ------- | ---- | -------------- | ------ | -------- |
| Sunshine Station | 1 | — | 5 | 4 | 10 |
| Yarrctopus Docks | 2 | — | 11 | 7 | 10 |
| Go-Go Land | 2 | — | 10 | 4 | 10 |
| Big Paper Peak | 3 | The Tin-Can Condor (Blue) | 21 | 10 | 10 |
| Origami Gardens | 2 | — | 11 | 6 | 10 |
| Dino Desert | 2 | — | 12 | 6 | 10 |
| Pastel Pathway | 3 | — | 19 | 9 | 10 |
| Sky-High Heights | 3 | — | 15 | 7 | 10 |
| Cardstock Carnival | 3 | — | 16 | 8 | 10 |
| Acorn Forest | 2 | Spike the Piranha (Red) | 15 | 6 | 10 |
| Chilly-Hot Isles | 2 | Burt's Bouncy Battle (Yellow) | 12 | 6 | 10 |
| Ninjarama | 3 | — | 17 | 9 | 10 |
| Rumble Jungle | 3 | Gator Train Attacks! (Magenta) | 16 | 10 | 10 |
| Outer Orbit | 3 | — | 19 | 9 | 10 |
| Cheery Valley | 3 | — | 15 | 7 | 10 |
| Shadowville (spoiler) | 3 | The Great King Bowser (Green) | 17 | 10 | 10 |
| Hidden Hills (post-game) | 3 (no Flip Side) | Kamek Kerfuffle | 16 | 3 | 10 |
| **Total** | **43** | **6** | **247** | **121** | **170** |

**Smiley Flowers: 693.** The arithmetic matches the total quoted by the Yoshi fan wiki:

| Source | Flowers |
| ------ | ------- |
| Hidden: 231 on the 40 main courses + 16 in Hidden Hills | 247 |
| Score/race: 6 courses × 3 | 18 |
| 100 coins + 20 Red Coins + 20 hearts: 43 × 3 | 129 |
| Flip Side, 3 pups + 1 for the time limit: 40 × 4 | 160 |
| Boss challenges: 6 × 3 | 18 |
| Craft requests | 121 |
| **Total** | **693** |

The Sundream Stone's "317 flowers" is what's left after unlocking: gates spend 376 flowers (136 world gates + 100 boss gates + 140 in Hidden Hills), and 693 − 376 = 317. So it means every flower.

**Tickable units: 958** = 693 flowers + 49 levels cleared + 43 Sprouts + 170 costumes + 3 goals. A finished save is about 955 `progress` rows (goals aren't saved), close to Supabase's 1,000-row limit per request. `getProgressRows` must be paged before this game goes live (planned for the shared-layouts PR).

`tests/unit/data/yoshis-crafted-world.test.ts` checks every number in these tables.

## Sources

Researched 2026-11-18. Every value comes from a fetched page; the full per-course tables with URLs are in the PR description.

- Super Mario Wiki: [Yoshi's Crafted World](https://www.mariowiki.com/Yoshi's_Crafted_World) (worlds, courses, gates, boss levels), [Smiley Flower](https://www.mariowiki.com/Smiley_Flower), [Dream Gem](https://mariowiki.com/Dream_Gem), [Hidden Hills](https://www.mariowiki.com/Hidden_Hills), [Blockafeller](https://www.mariowiki.com/Blockafeller), [List of crafts](https://www.mariowiki.com/List_of_crafts_in_Yoshi%27s_Crafted_World) (121 requests), [List of costumes](https://www.mariowiki.com/List_of_costumes_in_Yoshi%27s_Crafted_World), and the page of every course and boss level (`https://www.mariowiki.com/<Course_Name>`)
- GamesRadar, [How to find every Smiley Flower](https://www.gamesradar.com/yoshi-crafted-world-smiley-flowers-all-locations/), pages 1–4: hidden flowers on the 40 main courses
- Hey Poor Player, [per-course collectible guides](https://www.heypoorplayer.com/2019/03/29/yoshis-crafted-world-guide/) (craft requests) and the [Sprout guide](https://www.heypoorplayer.com/2019/05/20/sprout-yoshis-crafted-world-guide/)
- [joshuaw.xyz playing log](https://joshuaw.xyz/games/playinglog/yoshiscraftedworld/): a 100% checklist with costumes per world
- [Wikipedia](https://en.wikipedia.org/wiki/Yoshi%27s_Crafted_World), [iMore costumes](https://www.imore.com/how-collect-all-costumes-yoshis-crafted-world), [iMore Hidden Hills](https://www.imore.com/how-unlock-hidden-hills-and-secret-final-boss-yoshis-crafted-world), [GamesHedge costumes](https://www.gameshedge.com/yoshis-crafted-world-costumes/), [Miketendo64 (317)](https://miketendo64.com/2019/03/30/spoilers-yoshis-crafted-world-all-smiley-flowers-reward/)
- 693 total: [Yoshi fan wiki](https://yoshi.fandom.com/wiki/Smiley_Flower) (search snippet; the page itself was blocked) and a 100%-completion video title
- Blocked (403/402): Neoseeker, GameFAQs, GameSpot, Nintendo Life, Fandom. These are probably the best sources to settle the single-source items below.

## Single-source items

- Hidden flowers in Hidden Hills (5 / 6 / 5): Super Mario Wiki only.
- Score/race flower thresholds (Go-Go Yoshi 7,000/8,000/9,000; Monty-Mole-B-Gone 45/60/75 moles; Altitude Adjustment 20/30/40 balloons; Hoop-Jump Hop 8,000/12,000/15,000; Jungle Tour Challenge 4,000/6,000/8,000; Solar Zoom 3rd/2nd/1st): Super Mario Wiki only.
- Boss challenges (6 × 3) and every Flip Side time limit: Super Mario Wiki only.
- Craft requests Clothesline, Crown and Flutter Sign: Hey Poor Player leaves them out. Neoseeker/GameFAQs search snippets agree, but those pages couldn't be fetched.
- That each shared craft is one request: Super Mario Wiki (Hey Poor Player is consistent).
- Dried Fish count (1).
- Costumes: Shadowville (all 10), Hidden Hills (all 10) and Big Paper Peak's Mine Cart (Super Mario Wiki only).

## Calls made where sources disagree (please check)

| Item | Used | Other value | Why |
| ---- | ---- | ----------- | --- |
| Weighing Acorns hidden flowers | 7 | 6 (GamesRadar, mockup) | Super Mario Wiki describes the 7th (bus ride, the middle Flutter's coin trail), and 693 only adds up with 7 |
| Tyrannosaurus craft count (Poochy's Magma Run) | 4 | 3 (Hey Poor Player) | The wiki lists four locations. Only the label changes; it's one tick either way |
| "Happy Gear" (Mr. Geary's Factory) | Happy Gear | Smiley Gear (Hey Poor Player) | Super Mario Wiki uses the in-game names |
| Green Dream Gem | The Great King Bowser level | Mr. Geary (one low-quality list) | Two Super Mario Wiki pages agree |
| Kamek costume condition | All 49 levels cleared | "after the final level" (another wiki page) | Clearing every level includes the final one, so both readings are satisfied |
| Boss level names | Burt's Bouncy Battle, Gator Train Attacks!, Kamek Kerfuffle | The mockup uses the bosses' names | Official level names |

## Differences from the mockup

- 121 craft requests, not 121 + 6: the six "extras" belong to Rail-Yard Run (Clothesline, Paper Airplane, Milk Bottle) and Poochy's Tape Trail (Derby Sheep, Pumpkin, Tulip).
- Shared crafts are one tick each, not one per course.
- Adds: Hidden Hills courses and their crafts; The Great King Bowser and Kamek Kerfuffle boss levels; the boss challenges; score/race flowers; each Poochy Pup; Sprout per course.
- Mini-bosses aren't entries.
- "Egg Carton" is "Egg Carton Flightless Goonie".

## Open questions

1. **Boss challenges** (18 flowers): included so the flower total is complete. Keep them?
2. **Sprout per course** (43 checks): added so the Blockafeller costume can tick itself. Keep them?
3. **Poochy Pup flowers:** the sources say "three are awarded for bringing all three Poochy Pups to the goal" without saying whether it's one per pup. They're tracked as 3 pips either way.
4. **Hidden Hills** is post-game, but only Shadowville is blurred (Jan: final world + final boss). Blur Hidden Hills too?
5. **Amiibo costumes** (12) are left out. Add them as an optional section later?
6. **Request order within a course** follows the wiki's table; no source gives the in-game order.
