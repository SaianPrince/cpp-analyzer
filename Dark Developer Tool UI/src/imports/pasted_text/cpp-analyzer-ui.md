Design a professional C++ code performance analyzer web application UI with the following exact specifications:

═══════════════════════════════════════
VISUAL IDENTITY & DESIGN SYSTEM
═══════════════════════════════════════

Color Palette:
- Primary Background: #0D1117 (GitHub dark, near black)
- Secondary Background: #161B22 (dark navy)
- Card/Panel Background: #1C2128 (slightly lighter dark)
- Border Color: #30363D (subtle dark border)
- Primary Accent: #2563EB (electric blue)
- Accent Hover: #1D4ED8
- Success Green: #16A34A
- Warning Amber: #D97706
- Error Red: #DC2626
- Primary Text: #E6EDF3 (near white)
- Secondary Text: #8B949E (muted gray)
- Code Text: #79C0FF (light blue for code)
- Highlight: #388BFD20 (blue with transparency)

Typography:
- UI Font: "Inter" — headings, labels, buttons
- Code Font: "JetBrains Mono" — all code-related text
- Base size: 14px, Line height: 1.6

Border Radius: 8px cards, 6px buttons, 4px inputs
Spacing unit: 8px grid system
Shadows: Subtle dark shadows: 0 1px 3px rgba(0,0,0,0.4)

═══════════════════════════════════════
PAGE 1 — MAIN ANALYSIS PAGE (Desktop 1440px)
═══════════════════════════════════════

HEADER (height: 56px, full width, #161B22, border-bottom: #30363D):
- Left: Logo — lightning bolt icon in electric blue + "cpp" in white bold + "analyzer" in #8B949E — same line
- Center: Navigation links — "Analyzer" (active, blue underline) | "Examples" | "Docs" | "Pricing"
- Right: "Sign In" ghost button + "Get Pro" filled blue button (rounded, small)
- Very subtle header shadow

LEFT PANEL (width: 55%, height: calc(100vh - 56px), background: #161B22, border-right: #30363D):

  Top toolbar strip (height: 40px, background: #1C2128, border-bottom: #30363D, horizontal padding 16px):
  - Left side: Small dropdown showing "C++" with a chevron icon (language selector, currently only C++ available)
  - Left side: "Standard:" dropdown showing "C++17"
  - Right side: icon buttons in a row with tooltips — Upload File icon, Copy icon, Clear icon, Settings/gear icon
  - All icons are #8B949E, hover state #E6EDF3

  Monaco-style code editor (fills remaining left panel height):
  - Background: #0D1117
  - Left gutter: line numbers in #4B5563, width 48px, right border #30363D
  - Syntax highlighting:
    * Keywords (int, for, while, return, include): #FF7B72 (red-orange)
    * Strings: #A5D6FF (light blue)
    * Comments: #8B949E italic
    * Numbers: #79C0FF
    * Functions: #D2A8FF (purple)
    * Preprocessor (#include): #FF7B72
    * Operators: #E6EDF3
  - Show realistic C++ code pre-filled:
#include <iostream>
#include <vector>

int counter = 0; // global variable

int main() {
    std::vector<int> nums;
    
    for (int i = 0; i < 1000; i++) {
        nums.push_back(i * 3.14159 * 2);
        std::cout << "Value: " << i << std::endl;
    }
    
    return 0;
}
  - Current line highlight: very subtle blue background #388BFD10
  - Cursor: blinking blue vertical line
  - Active line number: #E6EDF3 (brighter)
  - Scrollbar: dark, thin (6px), #30363D track

  Bottom action bar (height: 56px, background: #1C2128, border-top: #30363D, padding 12px 16px):
  - Left: Character count "247 chars" and line count "16 lines" in #8B949E small text
  - Left: Small warning chip — orange dot + "3 suggestions likely" in amber
  - Right: Large "Analyze Code" button — full electric blue #2563EB, rounded 6px, height 36px, width 160px, white text bold, lightning bolt icon left of text, hover darkens slightly
  - Right of button: small text "~2s estimated" in #8B949E

RIGHT PANEL (width: 45%, height: calc(100vh - 56px), background: #0D1117, overflow-y: auto):

  Empty/waiting state shown in upper portion:
  - Centered placeholder: large faded lightning bolt icon (96px, #30363D)
  - Text: "Run your first analysis" — #8B949E, 16px
  - Subtext: "Paste C++ code on the left and click Analyze" — #4B5563, 13px
  - Below: Three small feature chips in a row: "⚡ O0→O3 comparison" | "🧠 Smart suggestions" | "🔗 Shareable link" — each has #1C2128 background, #30363D border, #8B949E text, 12px

  Below empty state — show a "Recent Analyses" section:
  - Section label: "RECENT" in #4B5563 uppercase tracking-widest 11px, left padding
  - Three recent analysis cards (horizontal list, scrollable):
    Each card (#1C2128 background, #30363D border, 8px radius, padding 12px):
    - Top row: small green dot "Success" badge + timestamp "2 min ago"
    - Code preview: first line of code in JetBrains Mono, truncated, #79C0FF
    - Stats row: "⚡ 45ms" in green | "💾 2.1MB" in blue
    - "View" link in electric blue, right aligned

═══════════════════════════════════════
PAGE 2 — ANALYSIS RESULTS PAGE (Desktop 1440px)
═══════════════════════════════════════

Same header as Page 1.

RESULTS LAYOUT — Two column grid (60% left, 40% right), padding 24px, gap 20px:

TOP BREADCRUMB BAR (full width, below header, height 40px, background #161B22, border-bottom #30363D):
- "← Back to Editor" link in #8B949E with left arrow
- Separator "/"
- "Analysis #a3f9b2" in #E6EDF3
- Right side: "Share" button (ghost, link icon) + "Download JSON" button (ghost, download icon)

LEFT COLUMN:

  PERFORMANCE COMPARISON CARD (background: #1C2128, border: #30363D, radius 8px, padding 20px):
  - Card header: "Performance by Optimization Level" title in white bold + info icon
  - Subtitle: "Lower is faster — wall clock time in milliseconds" in #8B949E 12px
  - Horizontal bar chart (height 200px):
    * Y-axis labels: -O0, -O1, -O2, -O3 (left aligned, JetBrains Mono)
    * Bars: horizontal, rounded right end
      - O0: full width red-orange bar #F97316, label "45.2ms" at end
      - O1: 70% width amber bar #FBBF24, label "31.8ms" at end  
      - O2: 45% width blue bar #2563EB, label "20.4ms" at end
      - O3: 30% width green bar #16A34A, label "14.1ms" at end
    * Background grid lines: #30363D subtle
  - Below chart: summary pill — "O3 is 3.2× faster than O0" — green background #16A34A20, green text, centered

  MEMORY USAGE CARD (below, same styling):
  - Card header: "Memory Usage"
  - Circular gauge (180px diameter):
    * Outer ring: #30363D (track)
    * Filled arc: #2563EB (68% filled)
    * Center: "2.1 MB" in white 20px bold
    * Below center: "Peak RSS" in #8B949E 12px
  - Below gauge — two stat boxes side by side:
    Left box (#0D1117 bg, #30363D border): "Virtual Memory" label + "8.4 MB" value in white
    Right box (same): "Stack Usage" label + "64 KB" value in white

  OUTPUT TERMINAL CARD (below):
  - Card header with tabs: "stdout" (active, white) | "stderr" (inactive, #8B949E) | "compiler" (inactive)
  - Terminal body (#0D1117 bg, border #30363D, radius 6px, padding 16px, font JetBrains Mono 13px):
    * Prompt line: "$ ./output" in #4B5563
    * Output lines in #E6EDF3:
      "Value: 0"
      "Value: 1"
      "Value: 2"
      ... (fades out with gradient)
    * Bottom fade: linear gradient to #0D1117

RIGHT COLUMN:

  OPTIMIZATION SUGGESTIONS CARD (background: #1C2128, border: #30363D):
  - Card header: "Optimization Suggestions" + badge "3" (blue circle)
  - Subtitle: "Rule-based analysis — AI suggestions coming in v2" in #8B949E italic 12px
  
  Three suggestion items stacked:

  Item 1 (HIGH severity):
  - Left accent border: 3px solid #DC2626 (red)
  - Background: #DC262608
  - Top row: red "HIGH" badge (12px, uppercase, red background, red text) + title "Global Variable Detected" bold white
  - Body text: "counter is declared in global scope. Pass it as a function parameter instead for better encapsulation and performance." — #8B949E 13px
  - Bottom row: "Line 4" chip in #30363D + "← See in editor" link blue
  - Expand chevron right side

  Item 2 (MEDIUM severity):
  - Left accent border: 3px solid #D97706 (amber)
  - Background: #D9770608
  - Badge: amber "MEDIUM" + title "Missing vector::reserve()"
  - Body: "push_back is called without reserve(). The vector will reallocate multiple times. Add nums.reserve(1000) before the loop." — #8B949E
  - Code snippet block inside (#0D1117 bg, #30363D border, JetBrains Mono):
    "nums.reserve(1000); // Add this line" in #79C0FF

  Item 3 (LOW severity):
  - Left accent border: 3px solid #2563EB (blue)
  - Background: #2563EB08
  - Badge: blue "LOW" + title "Excessive cout in Loop"
  - Body: "std::cout is called 1000 times. Consider batching output or using printf for better I/O performance."

  SHARE & EXPORT CARD (below, compact):
  - "Share this analysis" label bold
  - URL input field (#0D1117 bg, #30363D border, full width): "https://cppanalyzer.com/r/a3f9b2" with copy icon button right side
  - Two buttons side by side: "Copy Link" (ghost) + "Download JSON" (ghost)
  - Small text: "This link is permanent and publicly accessible" — #4B5563

  COMPILE INFO CARD (below, compact, collapsible, collapsed by default):
  - Header: "Compile Details" + chevron down icon + "g++ 13.2 · 320ms" in #8B949E

═══════════════════════════════════════
PAGE 3 — EXAMPLES PAGE (Desktop 1440px)
═══════════════════════════════════════

Same header.

PAGE HERO (full width, background: linear gradient #161B22 to #0D1117, padding 48px 80px):
- "Example Programs" — H1, white, bold, 32px
- Subtitle: "Ready-to-analyze C++ snippets — click any example to load it in the editor" — #8B949E

FILTER BAR (below hero, padding 0 80px, border-bottom #30363D, height 48px):
- Filter chips in a horizontal row (gap 8px):
  "All" (active — blue bg, white text) | "Algorithms" | "Data Structures" | "STL" | "Sorting" | "Recursion" | "Math"
  Each chip: #1C2128 bg, #30363D border, #8B949E text, 6px radius, 12px 16px padding

EXAMPLES GRID (padding 32px 80px, 3-column grid, gap 20px):

Each example card (#1C2128 bg, #30363D border, 8px radius, overflow hidden):
  - Top section (padding 16px):
    * Top row: Category badge (algorithm/STL/etc in muted color) + difficulty dot (green=easy, amber=medium, red=hard)
    * Title: "Bubble Sort" — white bold 15px
    * Description: "Classic O(n²) sorting algorithm. See how -O2 and -O3 dramatically improve loop performance." — #8B949E 13px, 2 lines max
  - Code preview section (#0D1117 bg, border-top #30363D, padding 12px 16px):
    * 4-5 lines of syntax-highlighted C++ code (same color scheme as editor)
    * Bottom gradient fade
  - Footer (padding 12px 16px, border-top #30363D):
    * Left: "⚡ Avg speedup: 2.8×" in green small text
    * Right: "Analyze →" button — electric blue text, no background, arrow icon

Show 6 example cards in the grid:
1. Bubble Sort (Algorithms, Medium)
2. Binary Search (Algorithms, Easy)  
3. Vector Operations (STL, Easy)
4. Fibonacci Recursive (Recursion, Medium)
5. String Processing (STL, Medium)
6. Prime Sieve (Math, Hard)

═══════════════════════════════════════
PAGE 4 — PRICING PAGE (Desktop 1440px)
═══════════════════════════════════════

Same header.

PAGE HERO (centered, padding 64px 80px 40px):
- "Simple, transparent pricing" — H1 32px white bold
- "Start free. Upgrade when you need more." — #8B949E 16px
- Toggle switch: "Monthly | Annual (Save 20%)" — toggle in blue

PRICING CARDS (centered, 3 cards side by side, max-width 1000px, gap 24px, padding 0 80px 64px):

Card 1 — FREE (#1C2128 bg, #30363D border, 8px radius, padding 28px):
- "Free" — label #8B949E uppercase 12px tracking-wide
- "$0" — price 40px white bold + "/month" #8B949E
- Divider line #30363D
- Features list (checkmarks in green #16A34A):
  ✓ 10 analyses per day
  ✓ All 4 optimization levels
  ✓ Shareable result links
  ✓ 7-day result history
  ✗ AI suggestions (gray, strikethrough)
  ✗ Unlimited analyses (gray, strikethrough)
- "Get Started Free" button — ghost style, #30363D border, white text, full width

Card 2 — PRO (featured, #1C2128 bg, 2px border #2563EB, 8px radius, padding 28px, subtle blue glow shadow):
- Top badge: "MOST POPULAR" — blue bg, white text, small, centered, -margin-top 12px, rounded pill
- "Pro" — label blue uppercase 12px
- "$5" — price 40px white bold + "/month" #8B949E
- Divider line #30363D
- Features list:
  ✓ Unlimited analyses
  ✓ All 4 optimization levels
  ✓ Shareable result links
  ✓ Permanent result history
  ✓ AI-powered suggestions (blue checkmark, blue text — premium feature)
  ✓ Priority processing
  ✓ API access (coming soon — gray pill)
- "Start Pro — $5/mo" button — solid blue #2563EB, white text bold, full width

Card 3 — TEAM (#1C2128 bg, #30363D border):
- "Team" label
- "$12" per seat/month
- Features: Everything in Pro + team dashboard, shared history, SSO (coming soon)
- "Contact Us" button ghost style

BELOW CARDS — FAQ section (centered, max-width 720px, padding 0 80px 64px):
- "Frequently Asked Questions" — H2 white 20px bold, centered
- 4 accordion items (closed state, click to expand):
  * "How does the free tier work?"
  * "What happens when I hit the daily limit?"
  * "Is my code stored on your servers?"
  * "Can I cancel my subscription anytime?"
  Each: #1C2128 bg, #30363D border, padding 16px 20px, chevron right icon, white question text

═══════════════════════════════════════
RESPONSIVE — MOBILE (390px iPhone)
═══════════════════════════════════════

MOBILE HEADER (56px, same colors):
- Left: Logo (icon + "cppanalyzer" text)
- Right: Hamburger menu icon (#8B949E)

MOBILE MAIN PAGE:
- Single column layout
- Tab bar at top below header: "Editor" tab | "Results" tab (pill style tabs, blue active)
- Editor tab shows: Full-width code editor, same styling, with virtual keyboard consideration (editor height: calc(100vh - 56px - 48px - 56px))
- Bottom fixed bar: "Analyze Code" button full width, 56px height

MOBILE RESULTS TAB:
- Stacked cards (full width, 16px margin)
- Bar chart becomes vertical (grouped bars)
- Suggestions stack vertically

═══════════════════════════════════════
MICRO-INTERACTIONS & STATES
═══════════════════════════════════════

Loading State (after clicking Analyze):
- Button transforms: text changes to "Analyzing..." + spinner icon replaces lightning bolt
- Button: blue but 80% opacity, not clickable
- Right panel: show animated progress steps stacked vertically:
  * "Compiling with -O0..." (spinning loader, then green checkmark when done)
  * "Compiling with -O1..." 
  * "Compiling with -O2..."
  * "Compiling with -O3..."
  * "Running performance tests..."
  * "Generating suggestions..."
  Each step: #1C2128 card, left icon (spinner or checkmark), step text, elapsed time right aligned
- Subtle pulsing blue border animation on right panel during loading

Error State:
- Red banner below toolbar: red left border, #DC262615 background, error icon, "Compilation failed" title, error message in JetBrains Mono below
- Analyze button returns to normal state

Hover States:
- Cards: border color lightens to #4B5563 on hover, very subtle lift (transform translateY -1px)
- Buttons: smooth 150ms transition
- Suggestion items: background slightly lighter on hover

Copy Success:
- Copy button shows green checkmark for 2 seconds with "Copied!" tooltip

═══════════════════════════════════════
ADDITIONAL DESIGN NOTES
═══════════════════════════════════════

- Overall aesthetic: GitHub + VS Code inspired dark developer tool
- NO gradients on interactive elements — flat, clean
- Subtle noise texture overlay on main backgrounds (3% opacity)
- All icons: Lucide icon set style (thin, consistent stroke width 1.5px)
- Consistent 8px spacing grid throughout
- Focus states: 2px blue outline offset 2px for accessibility
- Empty states always have helpful guidance text
- Numbers and code always in JetBrains Mono
- Avoid pure white — use #E6EDF3 instead
- Z-index layers: base content, sticky header (10), tooltips (50), modals (100)