# Design mockups

The visual reference for every game page. **Match these.** Sizes, spacing, colors and icon proportions are deliberate (see `docs/themes.md` for the rules behind them).

| Game | Static page | Screenshots | Theme / skin |
| ---- | ----------- | ----------- | ------------ |
| Stellar Blade | `stellar-blade.html` | `stellar-blade-desktop.png`, `-phone.png` | `default` |
| Elden Ring | `elden-ring.html` | `elden-ring-desktop.png`, `-phone.png` | `souls` |
| Yoshi's Crafted World | `yoshis-crafted-world.html` | `yoshis-crafted-world-desktop.png`, `-phone.png` | `nintendo` + Yoshi accent |
| Super Mario World | `super-mario-world.html` | `super-mario-world-desktop.png`, `-phone.png` | `nintendo` + `smw-save-file` skin |
| FF7 Remake Intergrade | `final-fantasy-vii-remake-intergrade.html` | `final-fantasy-vii-remake-intergrade-desktop.png`, `-phone.png` | `square` |

Notes:

- The `.html` files are **static snapshots** (open them in a browser to inspect sizes and colors). Ticking doesn't work in them.
- The screenshots were taken offline, so they show **fallback fonts**. The real fonts are listed in `themes.md` and load from Google Fonts in the `.html` files.
- `source/*.dc.html` are the original interactive mockups, including their sample data and progress logic. Useful reference for the pixel icon maps (SVG `<rect>` runs) and the tick/meter behaviors — but the real code must follow `docs/data-model.md`, not these files.
- Some mockup details are superseded by the docs (for example, the docs use `pips` and `meter` kinds explicitly). When they disagree, **the docs win**.
