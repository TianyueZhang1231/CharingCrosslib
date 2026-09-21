# Charing Cross Library · 查寧閣圖書館

A bilingual redesign microsite for Charing Cross Library, built from the Figma
layouts, the printed poster and the identity system in `图书馆网页/`.

Design and research — -Tianyue Zhang

## Viewing it

The site is static — no build step. Either open `index.html` directly, or serve
the folder:

```
cd charing-cross-library
python3 -m http.server 8123
```

then open <http://127.0.0.1:8123/>.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home — hero, the idea, the six words, the poster, identity, the space, three doors, stories extract, newsletter |
| `visit.html` | Venue notes — opening hours, facilities, getting here, access, materials |
| `whats-on.html` | What's on — featured events, filterable season list, seasonal programme, staff recommendations |
| `stories.html` | Our stories — the three written statements, the site, design method, process note |

## Structure

```
assets/
  css/style.css        — the whole design system (tokens, type, layout, components)
  js/main.js           — header, mobile menu, reveals, ruled-line motif,
                         the words stage, opening hours, event filters, signup
  img/
    logo-lockup.png    — the logo lockup, exported from the designer's artwork
    logo-lockup-sm.png — the same lockup, sized for the header
    favicon.png        — the mark, squared for the browser tab
    wayfinding-icons-1.png — wayfinding icons: lift, toilets
    wayfinding-icons-2.png — wayfinding icons: seating, stairs, refreshments
    poster-poem.jpg    — Gitanjali 35 poster (hero, stories)
    poster-keywords.jpg — detail: the poem's bold words
    poster-wordmark.jpg — detail: the reversed wordmark
    poster-hanging.jpg — poster in situ
    poster-angle.jpg   — poster, raking light
    cards-detail.jpg   — library card collateral
    logo-mark.jpg      — macro of the printed mark
```

每个图片只用一次（wayfinding-icons-1 出现两次：Visit 的无障碍章节和 Stories 的导视章节）。
没有重复图，也没有钢板孔洞的照片。

## Design notes

- **The logo is never re-typeset.** Every appearance of the lockup — header,
  footer, the identity panel on the home page, the browser tab — uses the
  supplied artwork as an image, so the letter spacing and the drawn corners
  stay exactly as designed. On dark surfaces (the footer, the transparent
  header over the dark hero) the image is inverted with `filter: invert(1)`,
  which changes only its colour, never its shape.
- **Palette** — paper `#F2EFE9`, ink `#15171A`, timber `#8A7761`, stone `#C9C8C5`,
  with pure paper `#FBFAF8` for panels. Warm paper and deep ink, no accent colour
  competing with the print work.
- **Type** — Helvetica Neue for English (the grotesque of the poster),
  Noto Sans CJK TC / PingFang TC for Chinese, New York for the Tagore verse.
- **The words stage** (`#words` on the home page) — the six keywords start
  scattered as they are in the Figma home screen and converge into one line,
  in the order of the poem, as the reader scrolls. Hovering a word reveals its
  Chinese gloss. The layout is measured at runtime and re-fitted on resize;
  with reduced motion the aligned state is shown directly.
- **The ruled-line motif** (`.js-rules`) — generated in JS with the same logic as
  the mark: unequal lines that widen as they descend.
- **Vertical rules** — wherever a hairline divides columns, the space either side
  of it is set by one variable (`--pgut` on `.principles`, `--bgut` on
  `.hero__bar`) so text never sits on the line.

## Content sources

- Opening hours, event names and dates, facilities and the four service
  clusters are taken from the Westminster City Council page for Charing Cross
  Library.
- The written statements in "Our stories", the process note in "Design method"
  and the wayfinding text in "Line and plane" are the designer's own words.
- The seasonal programme (bilingual reading circle, calligraphy, listening room,
  translation workshop) and the spatial/access proposals are part of the
  redesign study, and are labelled as such on the pages.

The footer notes that this is a design study and not an official Westminster
City Council website.

## V2 — what changed

- 删掉所有钢板孔洞的照片（poster-metal / wall-set / wall-ephemera），文件和引用一起删。
- 修好页脚被压扁的 logo：`.foot__brand` 是 flex column，默认 `align-items:stretch`
  把图片横向拉宽了；改成 `align-items:flex-start`。
- 修好深色章节里看不见的粗体（`.body strong` 在深底上仍是墨色），
  并把 Stories 那一页空掉的一栏收掉：文字改成单栏，线条图形移到左侧标签下。
- 上楼梯的小人补回被裁掉的半个头（原图已不在，按同一套圆形头像 r=21 重建）。
- 减少图片：Four doors 卡片去掉背景图，"What the room is made of" 不再配三张图，
  Stories 的图片格子取消；空白间距同时收紧。
- 首页第二段标题由 "Six words, one line" 改为 "One poem, six words"，文案重写。
- 手机版：`.col-12` 里写死的 `grid-column:span` 在窄屏挤成两栏，
  改成 `.span-5/.span-7` 工具类，≤1000px 自动堆叠。四个页面都过了一遍。

## Keys

站点是纯静态页面，代码里没有任何密钥，也不需要密钥。
以后若加需要调用 DeepSeek 的功能，密钥从系统环境变量读，不要写进代码：

```python
api_key = os.getenv("DEEPSEEK_API_KEY")
```

`.gitignore` 已排除 `.env`。
