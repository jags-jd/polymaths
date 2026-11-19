# Stellar Blade

| Field | Value |
| ----- | ----- |
| Slug / prefix | `stellar-blade` / `sb-` |
| Platforms | PS5, PC |
| Theme | `default` (mint accent `#7CE0C3`) |
| Skin | none |
| Mockup | `docs/design/stellar-blade.*` |
| Legacy data | `docs/games/stellar-blade.legacy.json` (old flat format, 104 items; every ID kept) |
| Build phase | 0.4 (step 3) |

## Scope (Jan, 2026-11-19)

- **Base game + free updates and collabs.** Separate modes such as Boss Challenge are out, except Mann and Scarlet (below).
- **Side quests and Bulletin Board requests: one entry each**, grouped by hub. The two legacy "complete every…" items become automatic goals.
- **Collectibles individual where sources list them:** each can and each fish is its own entry, grouped by area or bait.
- **Combat feats stay `check`** (one tick when the trophy pops; the game doesn't show the counts).
- Every legacy ID is kept.

After research (Jan, 2026-11-19):

- **Brute:** `sb-boss-brute` is the optional Wasteland Brute (side quest Life of the Scavengers, the "Brute" trophy). The prologue Brute in Eidos 7 is `sb-boss-brute-eidos-7`.
- **Bosses added:** second Maelstrom (Abyss Levoire), Demogorgon, Royal Guard Quiel, Shael.
- **Mann and Scarlet stay** in Extra Bosses, an agreed exception to "no Boss Challenge" (Scarlet needs the paid NIKKE DLC; noted on the entry).
- **Nano Suits: base + free updates + New Game+ variants.** Paid DLC suits are out.
- **Requests: base game + 4 photo requests + Strange Signal + the 5 Scarlet & Volt requests.** The two requests EVE refuses are left out.
- **Camps: a meter per area, 89 in all** (camp names don't reconcile across sources).
- **Box Hunter (200 boxes) and Records Collector (200 Data Bank entries) stay checks**, not meters.
- **Grouping:** a new optional `Entry.group` gives sections sub-headings (hubs, areas, bait).

## Counts

Data: `data/games/stellar-blade/index.ts`, generated from the research tables. Checked by `tests/unit/data/stellar-blade.test.ts`.

| Section | Layout | Entries | Units | Notes |
| ------- | ------ | ------- | ----- | ----- |
| Main Missions | `rows` | 15 | 15 | 9–15 are spoilers; Secret Garden is optional |
| Bosses | `gallery` | 21 | 21 | 19 fights + 2 route-dependent final bosses; 7 spoilers |
| Endings | `rows` | 3 | 3 | all spoilers |
| Side Stories | `rows` | 4 | 4 | Enya & Su, Kaya, D1G-g2r (trophies), Lily's bar |
| Side Quests | `rows` | 35 | 35 | Xion 26, Wasteland 4, Great Desert 3, Eidos 7 2 |
| Requests | `rows` | 35 | 35 | Bulletin Board 25 (Xion 5, Wasteland 11, Great Desert 5, Eidos 7 4) + photo 4 + Strange Signal 1 (spoiler) + Scarlet & Volt 5 |
| Collectibles | `rows` | 15 | 15 | 6 trophy checks + 9 camp meters (Eidos 7 14, Wasteland 11, Altess Levoire 5, Matrix 11 11, Great Desert 20, Abyss Levoire 7, Eidos 9 6, Spire 4 13, The Nest 2 = 89) |
| Cans | `rows` | 49 | 49 | Eidos 7 3, Xion 8, Wasteland 15, Matrix 11 3, Great Desert 16, Spire 4 4 |
| Fish | `rows` | 25 | 25 | grouped by bait |
| Nano Suits | `gallery` | 115 | 115 | 37 base + 34 New Game+ + 44 from free updates |
| Upgrades | `rows` | 6 | 6 | |
| Combat Feats | `rows` | 8 | 8 | |
| New Game Plus and Completion | `rows` | 3 | 3 | |
| Extra Bosses | `gallery` | 2 | 2 | Mann, Scarlet (Boss Challenge only) |
| Goals | — | 4 | 4 | automatic: every side quest (35), every Bulletin Board request (30), all cans (49), every camp (9 meters) |
| **Total** | | | **340** | 336 in sections + 4 goals |

Stat tiles: Missions 15, Bosses 21, Side quests 35, Requests 30 (board requests only), Cans 49, Nano Suits 115.

**IDs:** trackable `sb-<category>-<thing>`, entry `sb-<thing>` (e.g. entry `sb-abaddon`, trackable `sb-boss-abaddon`). All 104 legacy IDs are kept as trackable IDs (a unit test checks). The two legacy "complete every…" items, `sb-collect-all-cans` and `sb-collect-all-camps` are now automatic goals.

**Left out:** the two requests EVE refuses (Secret Request, The Diary's Revenge); Skin Suit and the starting Planet Diving Suit (7th) (owned from the start); paid suits (Stargazer, Planet Diving Suit (Captain), 4 NieR:Automata, 6 NIKKE); Boss Challenge mode itself; open-world repeat bosses (see open questions); the three 1.014.001 epilogues (cutscenes, not quests).

**Point of no return:** leaving for the Orbital Elevator after Abyss Levoire fails every unfinished side quest and request and locks Xion; finishing Spire 4 locks everything else. Collectibles can still be finished in New Game+.

## Sources

Research 2026-11-19; every list was read from these pages, not written from memory.

- **Trophies:** [PowerPyx trophy list](https://www.powerpyx.com/stellar-blade-trophy-list-revealed/), [PowerPyx trophy guide](https://www.powerpyx.com/stellar-blade-trophy-guide-roadmap/), [Gamepressure trophies](https://www.gamepressure.com/stellar-blade/trophies-achievements/z3113f8), [GGRecon trophies](https://www.ggrecon.com/guides/stellar-blade-trophies-achiements-unlock-requirements), [Samurai Gamers trophies](https://samurai-gamers.com/stellar-blade/sblade-trophies-and-achievements-list/), [GamerGuides achievements](https://www.gamerguides.com/stellar-blade/achievements)
- **Missions and endings:** [Fextralife walkthrough](https://stellarblade.wiki.fextralife.com/Walkthrough), [GamerGuides main missions](https://www.gamerguides.com/stellar-blade/database/missions/main-missions), [PowerPyx endings](https://www.powerpyx.com/stellar-blade-all-endings-guide/), [Gamepressure endings](https://www.gamepressure.com/stellar-blade/endings/zf113fd)
- **Bosses:** [Gamepressure all bosses](https://gamepressure.com/stellar-blade/list-of-all-bosses/z9113d0), [Gamepressure Shael](https://www.gamepressure.com/stellar-blade/shael/z1113e7), [Fextralife bosses](https://stellarblade.wiki.fextralife.com/Bosses), [GGRecon boss list](https://www.ggrecon.com/guides/stellar-blade-boss-list/), [Dexerto](https://www.dexerto.com/gaming/all-stellar-blade-bosses-2530115)
- **Side quests:** [PowerPyx side quests](https://www.powerpyx.com/stellar-blade-all-side-quests-walkthrough/), [GGRecon mission list](https://www.ggrecon.com/guides/stellar-blade-mission-list/), [GamerGuides sub missions](https://www.gamerguides.com/stellar-blade/database/missions/sub-missions), [Selphie1999](https://selphie1999gaming.com/game-guides/stellar-blade/stellar-blade-all-side-quests-and-trophies-list/), [Samurai Gamers](https://samurai-gamers.com/stellar-blade/sblade-sidequests-list/), [Gamepressure point of no return](https://www.gamepressure.com/stellar-blade/is-there-a-point-of-no-return/zc113f1)
- **Requests:** [PowerPyx requests](https://www.powerpyx.com/stellar-blade-bulletin-board-requests-guide/), [Samurai Gamers requests](https://samurai-gamers.com/stellar-blade/sblade-requests-list/), [GamerGuides requests](https://www.gamerguides.com/stellar-blade/database/missions/requests), [Siliconera photo requests](https://www.siliconera.com/how-to-complete-the-photo-requests-for-new-outfits-in-stellar-blade/), [GameRant Strange Signal](https://gamerant.com/stellar-blade-ocean-string-outfit-dev-room-strrange-signal/), [UpdateCrazy 1.014.001](https://updatecrazy.com/stellar-blade-update-1-014-001-patch-notes-v1-4-1-on-sept-30-2025/), [Nightly Gaming Binge NIKKE requests](https://nightlygamingbinge.com/stellar-blade-nikke-dlc-requests-guide/)
- **Cans, camps, fish, totals:** [PowerPyx all cans](https://www.powerpyx.com/stellar-blade-all-can-locations/), [GGRecon cans](https://ggrecon.com/guides/stellar-blade-all-can-locations-rewards/), [PowerPyx collectibles hub and area pages](https://www.powerpyx.com/stellar-blade-all-collectible-locations/), [MapMaster camps](https://mapmaster.io/games/stellar-blade/guides/Camp), [PowerPyx fish](https://www.powerpyx.com/stellar-blade-all-fish-locations/), [MapMaster fishing spots](https://mapmaster.io/games/stellar-blade/guides/Fishing%20Spot)
- **Nano Suits:** [PowerPyx Nano Suits](https://www.powerpyx.com/stellar-blade-all-nano-suits-outfits-costumes/), [GamerGuides Nano Suit database](https://www.gamerguides.com/stellar-blade/database/exterior/nano-suits), [Selphie1999 74 suits](https://selphie1999gaming.com/game-guides/stellar-blade/all-74-nano-suit-locations-stellar-blade/), [RPG Site outfit guide](https://www.rpgsite.net/guide/15766-stellar-blade-outfit-guide-where-to-find-and-how-to-earn-every-nano-suit-costume-in-the-game), [GGRecon outfits](https://ggrecon.com/guides/stellar-blade-outfits-nano-suits-locations), [MapMaster Nano Suits](https://mapmaster.io/games/stellar-blade/guides/Nano%20Suit), [GamesFuze 1.011 suits](https://gamesfuze.com/locations/stellar-blade-all-25-new-nano-suits-locations-guide/)
- **Updates:** [PlayStation Blog, Boss Challenge](https://blog.playstation.com/2024/05/23/stellar-blade-adds-new-boss-challenge-mode-on-may-24/), [TheSixthAxis 1.003](https://www.thesixthaxis.com/2024/05/24/stellar-blade-update-1003-boss-challenge-patch-notes/), [PSU 1.004](https://www.psu.com/news/stellar-blade-update-1-004-patch-notes-revealed-for-new-outfits-bug-fixes/), [mp1st 1.006](https://mp1st.com/news/stellar-blade-update-1-006-slices-out-for-summer-patch-and-heres-whats-new), [PSU 1.009](https://www.psu.com/news/stellar-blade-update-1-009-out-now-brings-photo-mode-new-outfits/), [mp1st 1.011](https://mp1st.com/title-updates-and-patches/stellar-blade-update-1-011-002-adds-content), [Noobfeed, Mann and NIKKE](https://www.noobfeed.com/news/stellar-blade-new-update-rewards-boss-outfits), [UpdateCrazy 1.015 (Bayonetta)](https://updatecrazy.com/stellar-blade-update-1-015-patch-notes-update-1-5-adds-bayonetta-content/)

## Single-source items

- **Shael** as a fight: Gamepressure only (Fextralife confirms she guards the Abyss Levoire entrance; Dexerto calls it "Quiel (Second Battle)").
- **Strange Signal**'s unlock condition (GameRant vs a Steam guide snippet); the request itself is in three sources.
- **Scarlet & Volt collab being free:** one source (Sortiraparis); others say it's the paid NIKKE DLC.
- **1.011 New Game+ suit locations** (GamesFuze only; names in two sources). Cyber Bunny, Royal Guard Suit and Crimson Wings are confirmed by two.
- **Tidal Maid** (MapMaster only), **Cyber Illusionist**'s patch (1.004) and **Santa Dress**'s patch (1.010): one source each.
- **Wave Diver Bikini / Wave Oblique Monokini** names: one source; mp1st confirms two suits from Clyde.
- **Midsummer Alice / Midsummer Redhood** being from 1.003: one search snippet.
- **Box total** (299) and per-area box counts: PowerPyx only (the checklist only uses the trophy's 200).

## Open questions

1. **In-game spellings:** "Madame Machine" vs "Madama Machine", "Reboot" vs "Reboot!", "An Unforgettable Fish Dish" vs "Unforgettable Fish Dish". Picked the first of each.
2. **EVE Protocol:** is it only on the take-Adam's-hand route (like Secret Garden on Lily's)? One source suggests so. If yes, its note should say so.
3. **Open-world repeat bosses** (Gigas in the Wasteland, Stalker / Abaddon / Corrupter in the Great Desert): only the Wasteland Gigas has two sources and its quest isn't named. Left out.
4. **Suit count:** GamerGuides lists 125 suits before the Bayonetta update; our free-update breakdown gives 40 before Bayonetta, which makes 124 with the base, New Game+ and paid suits. One free suit may be missing.
5. **Nano Suit Collector (30):** no source says which suits count. "Any 30" (PowerPyx).
6. **Camps:** Spire 4 is 13 (PowerPyx) or 14 (MapMaster); Presence Chamber and Xion Helipad camps each appear in one source and aren't in the 89.
7. **Moonwell can:** filed under Spire 4 (also fishable at the Oasis); PowerPyx says "Spire 4 / Great Desert".
8. **Spoilers:** only Strange Signal is blurred among quests and requests. Lost Ark (Mann) and Let There Be Light Again were suggested as possible spoilers; not blurred.
9. **Scarlet & Volt requests:** free or paid NIKKE DLC? Sources disagree; the group is titled "NIKKE collab".
10. **Platinum:** probably doesn't need the two New Game+ trophies (separate group), but no source says so.
