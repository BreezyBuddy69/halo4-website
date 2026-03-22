# HaloVision AI — Complete Site Reference

---

## COMPANY & BRAND

- **Brand name:** `HALOVISION AI`
- **Font:** `Anurati` — loaded from `https://fonts.cdnfonts.com/css/anurati`
- **Founder:** Jayden Mikus – AI Automation Architect
- **Call type:** "Free Automation Audit" — 30 minutes
- **Domain:** `halovisionai.cloud` (inferred from webhook URLs)
- **Target market:** Healthcare practices (doctors, dentists, chiropractors) + general businesses
- **Languages:** EN, DE, FR (default: EN)

---

## EXTERNAL URLS & CDN SCRIPTS

### Webhooks (hardcoded in components — NOT in .env)

| URL | Component | Method | Content-Type |
|---|---|---|---|
| `https://n8n.halovisionai.cloud/webhook/halovisionchatbot997655` | ChatBot.tsx | POST | `application/json` |
| `https://n8n.halovisionai.cloud/webhook/halovisionschedule880088` | BookingModal.tsx | POST | `application/x-www-form-urlencoded` + `mode: 'no-cors'` |

### CDN Scripts (dynamically injected into `<head>` at runtime by Hero.tsx)

| URL | Purpose | Load Order |
|---|---|---|
| `https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js` | Three.js for Vanta | First |
| `https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.halo.min.js` | Vanta HALO 3D background | After Three.js |
| `https://fonts.cdnfonts.com/css/anurati` | Anurati brand font | `<link>` tag in Header + ChatBot |

---

## APP STATE (App.tsx)

```
isBookingOpen: boolean         — toggles BookingModal
chatContext: string            — message or category key passed to ChatBot
language: 'en' | 'de' | 'fr'  — global language, default 'en'
```

**Context flow:**
1. Hero/Services calls `onAskAIClick(string)`
2. Stored in `chatContext`
3. ChatBot detects change via `useEffect([context])`
4. If value is a known category key → show recommendation buttons
5. Else → send string directly as message after 500ms delay
6. Calls `onContextUsed()` to reset `chatContext` to `''`

**Known category keys** (show buttons, don't auto-send):
```
'general' | 'lead-generation' | 'custom-solutions' | 'save-time' | 'examples'
```

---

## CHATBOT FUNCTIONS (ChatBot.tsx)

### `handleSendMessage(text: string)`
```
1. Guards: if empty or isLoading → return
2. Clears recommendations + limitWarning
3. Appends user message to messages[]
4. If text.length > 500 → increments longMessagesSent counter
5. Sets isLoading = true
6. Builds history = last 10 messages (including new user message)
7. POSTs to chatbot webhook:
   Body: { messages: history, language }
8. Parses response: data.response ?? data.message ?? data.output ?? data.text ?? fallback
9. Cleans response: strips HTML tags, **, #, backticks, >
10. Appends cleaned response as { role: 'assistant', isNew: true }
11. isNew=true triggers TypingMessage animation at 9ms per character
12. On complete: sets isNew=false, scrolls to bottom
13. catch: appends 'Error connecting to service.'
14. finally: isLoading = false
```

### `handleInputChange(e)`
```
1. Updates input state
2. Resizes textarea: height = auto → min(scrollHeight, 80px)
3. Limit check:
   - longMessagesSent < 2  → max 2000 chars
   - longMessagesSent >= 2 → max 500 chars
   - If over limit → sets limitWarning (disables send button)
```

### `submitInput()`
```
If input.trim() exists → calls handleSendMessage(input), clears input
```

### Context handler `useEffect([context])`
```
1. If context is truthy:
   a. Opens chat
   b. If context is in validCategories → sets recommendations[] from t.chatRecommendations[context]
   c. Else → sets pendingMsg = context
   d. Calls onContextUsed() to clear context in parent
```

### Pending message `useEffect([pendingMsg, isOpen])`
```
If pendingMsg exists AND chat is open:
  → setTimeout(500ms) → handleSendMessage(pendingMsg), clear pendingMsg
```

### `openChat()` / `closeChat()` / `toggleChat()`
```
openChat:   setIsOpen(true) → setTimeout(10ms) → setAnimateOpen(true)
closeChat:  setAnimateOpen(false) → setTimeout(300ms) → setIsOpen(false)
toggleChat: isOpen ? closeChat() : openChat()
```

### Click-outside close
```
useEffect: if isOpen → addEventListener('mousedown', handleClickOutside)
handleClickOutside: if click target is outside chatRef.current → closeChat()
```

### Attention pulse animation (`runFadeAnimation`)
```
Runs a 2s RAF loop: buttonBrightness animates 0 → 1 → 0
Scheduled at: 27s, 207s, 507s after mount, then every 300s
All timers cancelled when chat is open
```

### `ThinkingProcess` component (shown while waiting for AI response)
```
State: lineIndex (random start), displayedText, phase ('typing'|'pause'|'deleting'), isBouncing

Typing:   +1 char every 48ms
Pause:    3200ms hold
Deleting: -1 char every 28ms → 300ms gap → pick next random line (no repeat)
Bounce:   triggers every 5th complete type cycle (cycleCountRef % 5 === 0)

32 lines per language (EN/DE/FR)
Icons used: Database, Brain, Zap, Search, Cpu, Wand2, Terminal, Sparkles
```

### `TypingMessage` component (renders assistant reply character by character)
```
Speed: 1 char per 9ms via setTimeout
Scrolls scrollAreaRef.current.scrollTop = scrollHeight on each char
Calls onComplete() when done → sets isNew=false on that message
```

### Message length limits
```
First 2 messages over 500 chars: max 2000 chars each
After 2 long messages: max 500 chars per message
Warning shown above input; send button disabled when warning is active
```

---

## TIMEZONE SYSTEM (utils/timezones.ts)

### `parseTimezoneOffset(timezone: string): number`
```
Input:  string like 'UTC+1', 'UTC-5:30', 'UTC'
Regex:  /UTC([+-])?(\d+)(?::(\d+))?/
Output: decimal hours (e.g. UTC+5:30 → 5.5, UTC-3 → -3, UTC → 0)
```

### `convertTimeToTimezone(timeStr, fromTimezone, toTimezone): string`
```
1. Split timeStr into [hours, minutes]
2. Parse both timezone offsets via parseTimezoneOffset()
3. offsetDiff = toOffset - fromOffset
4. totalMinutes = (h * 60 + m) + (offsetDiff * 60)
5. newHours = floor(totalMinutes / 60)
6. Normalize: if >= 24 subtract 24; if < 0 add 24
7. Return 'HH:MM' zero-padded string

NOTE: Day boundary wraps (no date change tracking)
NOTE: No DST — pure static UTC offset math
```

### Timezone list (34 static entries, UTC-12 to UTC+14)
```
{ value: 'UTC-12', label: '(UTC-12:00) International Date Line West' }
{ value: 'UTC-11', label: '(UTC-11:00) Coordinated Universal Time-11' }
{ value: 'UTC-10', label: '(UTC-10:00) Hawaii' }
{ value: 'UTC-9',  label: '(UTC-09:00) Alaska' }
{ value: 'UTC-8',  label: '(UTC-08:00) Pacific Time (US & Canada)' }
{ value: 'UTC-7',  label: '(UTC-07:00) Mountain Time (US & Canada)' }
{ value: 'UTC-6',  label: '(UTC-06:00) Central Time (US & Canada)' }
{ value: 'UTC-5',  label: '(UTC-05:00) Eastern Time (US & Canada)' }
{ value: 'UTC-4',  label: '(UTC-04:00) Atlantic Time (Canada)' }
{ value: 'UTC-3:30', label: '(UTC-03:30) Newfoundland' }
{ value: 'UTC-3',  label: '(UTC-03:00) Brasilia, Buenos Aires' }
{ value: 'UTC-2',  label: '(UTC-02:00) Mid-Atlantic' }
{ value: 'UTC-1',  label: '(UTC-01:00) Azores' }
{ value: 'UTC',    label: '(UTC+00:00) UTC, London, Lisbon' }
{ value: 'UTC+1',  label: '(UTC+01:00) Central European Time' }
{ value: 'UTC+2',  label: '(UTC+02:00) Eastern European Time' }
{ value: 'UTC+3',  label: '(UTC+03:00) Moscow, Istanbul' }
{ value: 'UTC+3:30', label: '(UTC+03:30) Tehran' }
{ value: 'UTC+4',  label: '(UTC+04:00) Dubai, Baku' }
{ value: 'UTC+4:30', label: '(UTC+04:30) Kabul' }
{ value: 'UTC+5',  label: '(UTC+05:00) Pakistan, Tashkent' }
{ value: 'UTC+5:30', label: '(UTC+05:30) India, Sri Lanka' }
{ value: 'UTC+5:45', label: '(UTC+05:45) Kathmandu' }
{ value: 'UTC+6',  label: '(UTC+06:00) Bangladesh, Almaty' }
{ value: 'UTC+6:30', label: '(UTC+06:30) Yangon' }
{ value: 'UTC+7',  label: '(UTC+07:00) Bangkok, Jakarta' }
{ value: 'UTC+8',  label: '(UTC+08:00) Beijing, Singapore' }
{ value: 'UTC+9',  label: '(UTC+09:00) Tokyo, Seoul' }
{ value: 'UTC+9:30', label: '(UTC+09:30) Adelaide' }
{ value: 'UTC+10', label: '(UTC+10:00) Sydney, Melbourne' }
{ value: 'UTC+11', label: '(UTC+11:00) Solomon Islands' }
{ value: 'UTC+12', label: '(UTC+12:00) Fiji, Auckland' }
{ value: 'UTC+13', label: '(UTC+13:00) Samoa' }
{ value: 'UTC+14', label: '(UTC+14:00) Line Islands' }
Default selected: 'UTC+1'
```

---

## BOOKING FLOW (BookingModal.tsx + Calendar.tsx + BookingForm.tsx)

### BookingModal state
```
step:               'calendar' | 'form' | 'confirmation'
selectedDate:       Date | null
selectedTime:       string
selectedTimezone:   string — init from Intl.DateTimeFormat().resolvedOptions().timeZone
submittedFormData:  any
```

### Timezone auto-detect (only used for initial state)
```js
Intl.DateTimeFormat().resolvedOptions().timeZone
// Returns IANA string e.g. 'Europe/Berlin'
// NOTE: Calendar itself uses UTC±X list, not IANA
```

### Modal open/close animation
```
Open:  opacity 0→1, scale 0.95→1, translateY 8→0 (700ms cubic-bezier)
Close: opacity 1→0, scale 1→0.95 (500ms)
Visibility: isOpen=true → setVisible(true) immediately
            isOpen=false → setTimeout(500ms) → setVisible(false)
```

### Step navigation
```
handleDateTimeSelect(date, time, timezone) → step = 'form'
handleFormSubmit(formData)                 → step = 'confirmation'
handleBack():
  confirmation → form
  form         → calendar
handleClose(): reset all state → calls onClose()
```

### `handleConfirm()` — fires booking webhook
```
1. Validate: if !confirmEmail → alert
2. setIsSubmitting(true)
3. Build URLSearchParams from all formData fields
4. Override/add:
   email     = confirmEmail (editable on confirmation step)
   fullPhone = formData.countryCode + formData.phone
   date      = selectedDate.toISOString().split('T')[0]  → 'YYYY-MM-DD'
   time      = selectedTime
   timezone  = selectedTimezone
5. POST to halovisionschedule webhook (mode: 'no-cors')
6. On success: setIsSuccess(true)
7. setTimeout(3500ms) → calls onConfirm() → closes modal
8. catch: alert(t.bookingError)
9. finally: setIsSubmitting(false)
```

### Calendar availability (`getAvailableTimesInUTC1`) — all times in UTC+1
```
Monday    (1): 17:30, then 18:00–23:30 in 30-min steps
Tue/Wed/Thu (2,3,4): 15:30, then 16:00–23:30 in 30-min steps
Friday    (5): 12:30, then 13:00–23:30 in 30-min steps
Saturday  (6): 05:00–23:30 in 30-min steps
Sunday    (0): 05:00–22:30 in 30-min steps
```

### Calendar time conversion on date/timezone select
```
1. getAvailableTimesInUTC1(selectedDate) → raw UTC+1 times
2. .map(time => convertTimeToTimezone(time, 'UTC+1', selectedTimezone))
3. .sort() — alphabetical sort works because HH:MM is zero-padded
4. → setAvailableTimes([])
```

### `isDateAvailable(day)`
```
date = new Date(year, month, day)
today = new Date(); today.setHours(0,0,0,0)
return date >= today  (today and future enabled; past disabled)
```

### BookingForm fields
```
firstName:           text,     required
lastName:            text,     optional
email:               email,    required
countryCode:         select,   default '+423' (LIE / Liechtenstein)
phone:               tel,      optional
revenueRange:        select,   required
website:             url,      required
businessDescription: textarea (4 rows), required
reason:              text,     in state, no visible field
```

### Revenue range options
```
'Less than 10k' | '10k - 50k' | '50k - 100k' | '100k - 250k'
'250k - 500k' | '500k - 1M' | 'More than 1M'
```

---

## SERVICES LOGIC (Services.tsx)

### Filter groups
```
'agents' — 10 nodes (default active)
'faq'    — 7 nodes
'roi'    — 7 nodes
```

### Layout rule
```
filtered.length >= 7 → Marquee (scrolling, 60s linear infinite, pauses on hover)
filtered.length < 7  → Static grid (1 col / 2 col / 3 col responsive)
```

### Marquee details
```
Animation: 'marqueeReverse' — translateX(-50%) → translateX(0)
Duration:  60s linear infinite
Pause:     .pause-marquee:hover stops animation
Data:      infiniteNodes = [...filtered, ...filtered] (doubled for seamless loop)
Activation: hasAnimated=true (IntersectionObserver at 15% threshold) + 400ms delay
```

### IntersectionObserver
```
Threshold: 0.15
On intersect: setHasAnimated(true) → triggers AnimatedTitle, AnimatedSubtitle, marquee
Disconnects after first trigger
```

### Service card → chatbot context mapping
```
id 1  Rocket         filterGroup:'agents'  context:'lead-generation'
id 2  Zap            filterGroup:'agents'  context:'examples'
id 3  Bot            filterGroup:'agents'  context:'examples'
id 4  MessageCircle  filterGroup:'agents'  context:'examples'
id 5  Users          filterGroup:'agents'  context:'save-time'
id 6  RefreshCw      filterGroup:'agents'  context:'save-time'
id 7  Clock          filterGroup:'faq'     context:'save-time'
id 8  Lightbulb      filterGroup:'faq'     context:'examples'
id 9  CheckCircle    filterGroup:'faq'     context:'save-time'
id 10 Shield         filterGroup:'faq'     context:'custom-solutions'
id 11 Cpu            filterGroup:'faq'     context:'custom-solutions'
id 12 Link           filterGroup:'faq'     context:'custom-solutions'
id 13 BarChart       filterGroup:'roi'     context:'examples'
id 14 DollarSign     filterGroup:'roi'     context:'save-time'
id 15 Activity       filterGroup:'roi'     context:'examples'
id 16 Target         filterGroup:'roi'     context:'lead-generation'
id 17 TrendingUp     filterGroup:'roi'     context:'lead-generation'
id 18 CheckCircle    filterGroup:'roi'     context:'save-time'
id 19 Wrench         filterGroup:'agents'  context:'custom-solutions'
id 20 GitMerge       filterGroup:'agents'  context:'custom-solutions'
id 21 Database       filterGroup:'agents'  context:'custom-solutions'
id 22 TrendingUp     filterGroup:'faq'     context:'examples'
id 23 Lightbulb      filterGroup:'faq'     context:'examples'
id 24 BarChart       filterGroup:'roi'     context:'examples'
```

### GlowCard pointer tracking
```
On pointermove: set --lx, --ly (cursor position relative to card)
               set --inside: 1 (activates glow highlight)
On pointerleave: set --inside: 0
Idle animation: rotating conic-gradient border, 5–8.5s cycle per card
cardIndex stagger: --idle-delay = -(cardIndex * 0.35) % 8 seconds
```

---

## HERO FUNCTIONS (Hero.tsx)

### `useVantaHalo(ref)` — custom hook
```
Load sequence:
1. Check window.THREE:
   - Missing → inject <script> Three.js r121 from cdnjs → onload: loadVantaScript
   - Present  → loadVantaScript immediately
2. loadVantaScript:
   - window.VANTA.HALO already loaded → initEffect immediately
   - Missing → inject <script> vanta.halo.min.js from jsdelivr → onload: initEffect
3. initEffect: VANTA.HALO({ el, THREE, ...config })
4. Cleanup: vantaEffect.destroy()

VANTA.HALO config:
  backgroundColor: 0x131a43  (deep navy)
  baseColor:       0x001a59  (rich dark blue)
  amplitudeFactor: 2.1
  size:            3.0
  mouseControls:   true
  touchControls:   true
  gyroControls:    false
  minHeight:       200
  minWidth:        200
```

### Hero input → chatbot context
```
User types in Hero input field → clicks send
  onAskAIClick(inputValue || 'general')
  → empty input → 'general' (shows general recommendation buttons)
  → has text    → raw string (auto-sent as message after 500ms)
```

### Rotating hero input placeholders
```
3 strings cycling via interval:
  heroPlaceholder1, heroPlaceholder2, heroPlaceholder3
  (from translations, all 3 languages)
```

---

## HEADER FUNCTIONS (Header.tsx)

### `RandomLetterSwapForward` — logo hover animation
```
On hover (debounced 100ms, leading+trailing):
  Pre-shuffle letter indices randomly
  For each letter (in shuffled order):
    Primary layer:   y: 0 → '100%' (exits down), then instantly reset to y:0
    Secondary layer: top: '-100%' → '0%' (enters from above), then reset to '-100%'
  Stagger: 0.015s per letter
  Spring config: { type:'spring', duration: 0.8 }
  Blocked flag prevents re-trigger while animation runs
```

### `NeonButton` — CTA button cycling border
```
4-color cycle every 1800ms (idle, pauses on hover):
  blue:        rgba(96,165,250,0.55)   via: #93c5fd
  light-blue:  rgba(125,211,252,0.50)  via: #7dd3fc
  purple:      rgba(167,139,250,0.50)  via: #c4b5fd
  blue-purple: rgba(129,140,248,0.50)  via: #a5b4fc

boxShadow: 0 0 18px {color}, 0 0 48px {color at 0.15 opacity}, inset 0 1px 0 rgba(255,255,255,0.18)
Top shimmer + bottom neon line both follow active color
Transition: 1.2s ease for shadow/border, 0.3s for background
```

### `GlowingEffect` — CTA button spotlight border
```
Tracks pointermove on document.body (passive listener)
Calculates angle from cursor to element center using Math.atan2
Uses framer-motion animate() to smoothly rotate CSS var '--start'
Easing: [0.16, 1, 0.3, 1] cubic-bezier, movementDuration: 2s
Dead zone: radius = 0.7 * min(width,height) — no glow when cursor is centered
Proximity: 55px — activates when cursor is within 55px of element edges
Uses: conic-gradient mask rotating from --start angle, spread=35deg
```

### Language switcher
```
3 options: EN | DE | FR
Dropdown: absolute positioned, z-50, rounded-xl, backdrop-blur-xl
Close: overlay div (fixed inset-0 z-40) catches outside clicks
Active lang: bg-white/10 highlight
```

---

## TRANSLATIONS (translations.ts) — Full Content

### Language type
```ts
export type Language = 'en' | 'de' | 'fr'
```

---

### ENGLISH (en)

```
heroTitle1:    "Your Practice."
heroTitle2:    "Fully Automated."
heroSubtitle:  "Reclaim 20 Hours a Week with Custom AI Automations."
letsTalk:      "Let's Talk"
startJourney:  "Book Your Free Automation Audit"
askAI:         "Test Our AI Agent"
askHaloAI:     "Ask Halo AI"
automated:     "Autonomous"
custom:        "Custom-Built"
scalable:      "Scalable"
available:     "24/7"
aiSolutions:   "Revenue-Driven AI Systems"
growth:        "Measurable Growth"

openingChat:       "Opening Chat Panel..."
askAiAgent:        "Test our AI Agent"
askAiAgentButton:  "Test Support AI"
sendingMessage:    "Sending message..."
howCanWeHelp:      "How can we help you?"

heroPlaceholder1:  "Type your vision..."
heroPlaceholder2:  "Ask about our process..."
heroPlaceholder3:  "Start a conversation..."
playIntro:         "Play intro"
videoAmbientTitle: "Ambient Background"
videoFullTitle:    "Full Video"

servicesTitle:    "What AI Automation Does For You"
servicesSubtitle: "We design and deploy AI agents tailored to your workflows to eliminate manual work, unlock efficiency, and drive predictable growth."

filterAll:    "All"
filterAgents: "Examples"
filterFaq:    "Q & A"
filterRoi:    "ROI & Value"

catEfficiency: "Efficiency"
catGrowth:     "Growth"
catTech:       "Tech"
catSupport:    "Support"
catInfra:      "Infrastructure"
catData:       "Data"
catOps:        "Operations"
catQuality:    "Quality"
catConsulting: "Strategy"
catAgents:     "AI Agent"
catFaq:        "FAQ"
catRoi:        "ROI"

exploreAI:  "Explore with AI"
close:      "Close"
impactTime: "-20hrs/week"
impactLive: "24/7 Live"

node1Title: "Save 20+ Hours"
node1Desc:  "Stop doing the same tasks over and over. We automate your repetitive work so your team can focus on things that actually grow your business."
node2Title: "Lead Acquisition"
node2Desc:  "An AI system runs around the clock to find people interested in what you sell — and reaches out before your competitors do."
node3Title: "Custom Workflows"
node3Desc:  "We make all your apps work together automatically. No more copy-pasting between tools or doing things by hand."
node4Title: "Instant Response"
node4Desc:  "Your customers get a helpful reply within seconds — day or night. No waiting, no missed messages, no lost sales."
node5Title: "AI Integration"
node5Desc:  "Deep integration of GPT-4o, Claude, and Llama into your private business data for intelligent decision making."
node6Title: "ROI Dashboards"
node6Desc:  "A live dashboard shows you exactly how many hours and how much money your automations are saving — updated every day."
node7Title: "Auto-Onboarding"
node7Desc:  "When a new client signs up, everything happens automatically — contract sent, folder created, welcome email done. Zero manual work."
node8Title: "Error Reduction"
node8Desc:  "AI doesn't get tired. Eliminate human data-entry errors through structured, automated validation flows."
node9Title: "App Connectivity"
node9Desc:  "We bridge the gap between tools that don't talk to each other, creating a unified flow of information."
node10Title: "Sales Follow-Up"
node10Desc:  "AI sends the right message to the right lead at the right time. Meetings get booked and deals move forward while you sleep."
node11Title: "Task Automation"
node11Desc:  "Reports, summaries, documents — all created automatically in the background. Your team stops wasting time on busywork."
node12Title: "Agent Strategy"
node12Desc:  "Consulting on the 'Automation First' mindset. We help you identify where AI yields the highest ROI."

nodeA1Title: "The All-In-One Agent"
nodeA1Desc:  "One agent that reads your emails, manages your calendar, searches the web, and handles daily tasks — like a digital employee that never sleeps, never calls in sick, and works 24 hours a day."
nodeA2Title: "The Secretary Agent"
nodeA2Desc:  "Every morning it reads all your emails, summarizes what's important, checks your calendar, and sends you a clean daily briefing — so you always know what needs your attention without drowning in your inbox."
nodeA3Title: "The Medical Practice Agent"
nodeA3Desc:  "Built for doctors, dentists, and chiropractors. It handles appointment bookings, sends patients automatic reminders, answers common questions, and manages cancellations — completely on its own."
nodeA4Title: "The New Client Agent"
nodeA4Desc:  "The moment someone fills out your contact form, this agent sends a welcome email, adds them to your system, and schedules an intro call — all within seconds, without you lifting a finger."
nodeA5Title: "The Online Shop Agent"
nodeA5Desc:  "A customer asks where their order is, how to return something, or about a product — and they get an instant, helpful answer. No waiting, no support pile-up, no extra staff needed."
nodeA6Title: "The Appointment Agent"
nodeA6Desc:  "It handles all your bookings automatically — sends confirmations, reminds clients before their appointment, and fills empty slots when someone cancels. Your calendar runs itself."

nodeQ1Title: "How Long Does Setup Take?"
nodeQ1Desc:  "Most automation systems go live within 1–2 weeks. Complex multi-agent builds typically take 3–4 weeks depending on integrations."
nodeQ2Title: "Is My Data Secure?"
nodeQ2Desc:  "Yes. Everything runs on your own systems. We never store, read, or share your business data — ever."
nodeQ3Title: "Which AI Models Do You Use?"
nodeQ3Desc:  "We work with GPT-4o, Claude, and open-source models like Llama — choosing the right model based on your use case and budget."
nodeQ4Title: "What Tools Can You Connect?"
nodeQ4Desc:  "Any tool with an API: HubSpot, Salesforce, Notion, Slack, Gmail, Airtable, Stripe, and hundreds more."
nodeQ5Title: "Do I Need a Tech Team?"
nodeQ5Desc:  "No. We build everything and hand it over ready to use. You get clear documentation and a walkthrough — no tech skills needed."
nodeQ6Title: "What's Included After Launch?"
nodeQ6Desc:  "Every project includes testing, documentation, and a handover call. Ongoing support and maintenance plans are available."

nodeR1Title: "Cost Savings Breakdown"
nodeR1Desc:  "Saving 20+ hours of manual work per week adds up to thousands saved every month. We show you the exact numbers before we start."
nodeR2Title: "Live Performance Tracking"
nodeR2Desc:  "Custom dashboards show automation runs, time saved, errors caught, and revenue influenced — updated in real time."
nodeR3Title: "Pipeline Revenue Impact"
nodeR3Desc:  "Faster replies and round-the-clock lead qualification mean more deals closed. Most clients see pipeline growth within the first 30 days."
nodeR4Title: "Efficiency Gains Report"
nodeR4Desc:  "After go-live, we provide a detailed report showing productivity improvements, cost reduction, and workflow throughput gains."
nodeR5Title: "Scale Without Hiring"
nodeR5Desc:  "AI handles the work of 2–3 full-time employees at a fraction of the cost. Grow your output without hiring more people."
nodeR6Title: "Error Cost Elimination"
nodeR6Desc:  "Manual mistakes in data entry cost businesses thousands every year. Automation catches errors before they cause any damage."

leadGeneration:     "AI-Powered Lead Acquisition"
leadGenerationDesc: "Deploy autonomous systems that identify, qualify, and nurture leads 24/7. No missed opportunities. No manual tracking. Just a continuously optimized pipeline that turns traffic into revenue."
customSolutions:    "Deep Workflow Automation"
customSolutionsDesc:"We analyze your internal processes and remove bottlenecks using advanced AI integrations and intelligent automation flows. From CRM to operations — fully connected, fully optimized."
saveTime:           "Eliminate 20+ Hours Per Week"
saveTimeDesc:       "Manual data entry, follow-ups, internal coordination — automated. Free your team from repetitive work and redirect that energy toward sales, strategy, and growth."
exampleAgents:      "Example Automation Systems"
exampleAgentsDesc:  "We build intelligent systems across departments:"
exampleAgentsList: [
  "Autonomous inbound & outbound lead qualification",
  "AI customer support agents integrated with your knowledge base",
  "Sales follow-up & proposal automation",
  "Operations dashboards pulling live performance data",
  "Client onboarding & retention automation flows",
]

testimonials.title: "What People Say"
testimonials.open:  "Open"
testimonials.reviews: [
  { name: "@sarah_tech",  role: "CEO, TechStart",      review: "HaloVision transformed our customer service with their AI agents. Response times dropped by 80% and satisfaction is at an all-time high." }
  { name: "@mike_growth", role: "Founder, GrowthLab",  review: "The automation solutions they built for us freed up our team to focus on strategic work. ROI was evident within the first month." }
  { name: "@emma_sales",  role: "Director, SalesForce", review: "Their lead generation AI is incredible. We're now capturing and qualifying leads 24/7 without effort. Conversion is way up." }
  { name: "@david_cloud", role: "Manager, CloudSync",   review: "Working with HaloVision was seamless. They delivered a custom solution that exceeded expectations. Highly responsive team." }
  { name: "@lisa_ops",    role: "COO, ScaleUp",         review: "The workflow automation cut our manual processing by 70%. The team was professional, fast, and incredibly responsive throughout." }
]

whyUsTitle: "Why Work With Us"
reasons: [
  "AI & Automation Architecture Expertise",
  "ROI-First Implementation",
  "Full Technical Control (No Template Limitations)",
  "Custom Performance Dashboards",
]
reasonsDesc: [
  "We specialize in advanced AI integrations, prompt engineering, and scalable automation architectures.",
  "Every system is built around measurable business impact — revenue growth, time savings, and cost reduction.",
  "Unlike template-based agencies, we build flexible backend logic that scales with your company.",
  "Track productivity gains, cost savings, and automation performance in real time.",
]

integrationsLabel: "250+ integrations"
customBuilt:       "Jayden Mikus – AI Automation Architect"
customBuiltDesc:   "I specialize in transforming manual business operations into autonomous revenue engines. By architecting scalable backend systems with advanced AI, I help companies eliminate bottlenecks and reclaim 20+ hours per week. My focus is on building intelligent, production-ready AI solutions that don't just 'work'—they scale your growth and deliver measurable ROI."
rapidDeployment:   "Focus on scaling your company while intelligent systems handle the operational workload."

workWithUs:     "Ready to Automate?"
workWithUsDesc: "Follow our 4-step process to transform your business operations with custom AI agents."
bookCall:       "Book Your Free Automation Audit"

planStep1: "1. Audit: 30-min call to find your top workflows."
planStep2: "2. Strategy: Map your custom AI architecture."
planStep3: "3. Build: Agents built & connected to your tools."
planStep4: "4. Go Live: Launch and start scaling."

growthMappingCall: "Free Automation Audit"
growthMappingDesc: "30-minute strategy session. Includes:"
duration:          "30 Min"
locale:            "en-US"
analysisStep:      "Availability: Timezone, Date & Time"
auditStep:         "Audit Details: Business Info & Objectives"
nextSteps:         "Confirmation: Review & Secure your Session"
agencyNote:        "For serious businesses ready to scale with AI."

firstName:                   "First Name"
lastName:                    "Last Name"
email:                       "Email Address"
phone:                       "Phone Number"
revenueRange:                "Monthly Revenue"
selectRevenueRange:          "Select revenue range"
website:                     "Business Website"
businessDescription:         "Describe your current workflows & biggest bottlenecks"
businessDescriptionPlaceholder: "Explain your manual processes, tools used, and growth goals..."
reason:                      "Primary Goal With AI?"
back:                        "Back"
submit:                      "Schedule Audit"
submitting:                  "Submitting..."
bookingError:                "There was an error submitting your booking. Please try again."

chatGreeting:        "Hi, I'm your automation assistant. Ask me how AI can optimize your business."
chatSub:             "Automation Support"
chatInputPlaceholder:"Ask about automations..."
suggestions:         "Suggested questions"

chatRecommendations:
  general:          ["Where can AI save me the most time?", "How do I automate my lead generation?", "What workflows should I automate first?"]
  lead-generation:  ["How can AI qualify leads automatically?", "Can I automate outbound prospecting?", "How do I connect AI to my CRM?"]
  custom-solutions: ["Can you integrate AI into my existing tools?", "How do AI-based systems work in operations?", "What backend automation do you build?"]
  save-time:        ["Which manual tasks should I eliminate first?", "How many hours can automation realistically save?", "How do I measure ROI from AI automation?"]
  examples:         ["What real automation systems have you built?", "Can you automate my onboarding process?", "How does the Secretary Agent work?"]
```

---

### GERMAN (de)

```
heroTitle1:    "Ihre Praxis."
heroTitle2:    "Vollständig automatisiert."
heroSubtitle:  "Individuelle KI-Automatisierung für Ihr Unternehmen."
letsTalk:      "Kontakt"
startJourney:  "Kostenlosen KI-Audit buchen"
askAI:         "KI-Agenten testen"
askHaloAI:     "Halo KI fragen"
automated:     "Autonom"
custom:        "Maßgeschneidert"
scalable:      "Skalierbar"
available:     "24/7"
aiSolutions:   "KI-Systeme für mehr Umsatz"
growth:        "Messbares Wachstum"

openingChat:       "Chat wird geöffnet..."
askAiAgent:        "KI-Agenten testen"
askAiAgentButton:  "KI-Assistenten fragen"
sendingMessage:    "Nachricht wird gesendet..."
howCanWeHelp:      "Wie können wir helfen?"

heroPlaceholder1:  "Ihre Vision eingeben..."
heroPlaceholder2:  "Fragen Sie nach unserem Vorgehen..."
heroPlaceholder3:  "Gespräch beginnen..."
playIntro:         "Intro abspielen"

servicesTitle:    "Was KI-Automatisierung für Sie leistet"
servicesSubtitle: "Wir entwickeln maßgeschneiderte KI-Agenten, die manuelle Arbeit übernehmen, Abläufe vereinfachen und planbares Wachstum ermöglichen."

filterAll:    "Alle"
filterAgents: "Beispiele"
filterFaq:    "Häufige Fragen"
filterRoi:    "Ergebnisse & Gewinn"

catEfficiency: "Effizienz"
catGrowth:     "Wachstum"
catTech:       "Technik"
catSupport:    "Support"
catInfra:      "Infrastruktur"
catData:       "Daten"
catOps:        "Betrieb"
catConsulting: "Strategie"
catAgents:     "KI-Agent"
catFaq:        "FAQ"
catRoi:        "Ergebnisse"

exploreAI:  "Mit KI erkunden"
close:      "Schließen"
impactTime: "-20 Std/Woche"
impactLive: "24/7 Live"

node1Title: "20+ Stunden sparen"
node2Title: "Neue Kunden gewinnen"
node3Title: "Automatische Abläufe"
node4Title: "Sofortige Antworten"
node6Title: "Echtzeit-Auswertungen"
node12Title:"KI-Beratung"

nodeA1Title: "Der Alles-Könner-Agent"
nodeA2Title: "Der Sekretär-Agent"
nodeA3Title: "Der Praxis-Assistent"
nodeA4Title: "Der Neukunden-Agent"
nodeA5Title: "Der Online-Shop-Assistent"
nodeA6Title: "Der Termin-Agent"

nodeQ1Title: "Wie lange dauert die Einrichtung?"
nodeQ2Title: "Sind meine Daten sicher?"
nodeQ3Title: "Welche KI-Modelle nutzen Sie?"
nodeQ4Title: "Welche Programme können verbunden werden?"
nodeQ5Title: "Brauche ich technisches Wissen?"
nodeQ6Title: "Was ist nach dem Start enthalten?"

nodeR1Title: "Kosteneinsparungen im Überblick"
nodeR2Title: "Echtzeit-Auswertung"
nodeR3Title: "Mehr Umsatz durch KI"
nodeR4Title: "Auswertungs-Bericht nach dem Start"
nodeR5Title: "Wachsen ohne mehr Personal"
nodeR6Title: "Fehlerkosten eliminieren"

testimonials.title: "Was andere sagen"
testimonials.open:  "Öffnen"
testimonials.reviews: (same 5 people, German translations of reviews)

whyUsTitle: "Warum wir?"
reasons: [
  "Experten für KI & Automatisierung",
  "Fokus auf messbare Ergebnisse",
  "Maßgeschneiderte Lösungen – keine Vorlagen",
  "Individuelle Auswertungs-Dashboards",
]

integrationsLabel: "250+ Integrationen"
customBuilt:       "Jayden Mikus – KI-Automatisierungsexperte"
rapidDeployment:   "Konzentrieren Sie sich auf Ihr Unternehmen, während intelligente Systeme die Arbeit erledigen."

workWithUs:     "Bereit für Automatisierung?"
bookCall:       "Kostenlosen KI-Audit buchen"
planStep1: "1. Analyse: 30-Min-Call zur Identifikation Ihrer Potenziale."
planStep2: "2. Planung: Ihre individuelle KI-Architektur wird entwickelt."
planStep3: "3. Entwicklung: Agenten gebaut & mit Ihren Tools verbunden."
planStep4: "4. Start: Live gehen und Wachstum starten."

growthMappingCall: "Kostenloser KI-Audit"
growthMappingDesc: "30-minütige Strategie-Session. Beinhaltet:"
duration:          "30 Min"
locale:            "de-DE"
analysisStep:      "Verfügbarkeit: Zeitzone, Datum & Uhrzeit"
auditStep:         "Audit-Details: Unternehmensinformationen & Ziele"
nextSteps:         "Bestätigung: Session prüfen & sichern"

back:        "Zurück"
submit:      "Audit planen"
submitting:  "Wird gesendet..."
bookingError:"Fehler beim Senden. Bitte versuchen Sie es erneut."

chatGreeting:        "Hallo, ich bin Ihr Automatisierungs-Assistent. Fragen Sie mich, wie KI Ihr Unternehmen voranbringen kann."
chatSub:             "Automatisierungs-Hilfe"
chatInputPlaceholder:"Frage zu Automatisierungen..."
suggestions:         "Vorgeschlagene Fragen"

chatRecommendations:
  general:          ["Wo spare ich am meisten Zeit?", "Wie gewinne ich automatisch neue Kunden?", "Welche Abläufe sollte ich zuerst automatisieren?"]
  lead-generation:  ["Wie bewertet KI Interessenten automatisch?", "Kann ich Interessenten automatisch ansprechen?", "KI mit meiner Kundenverwaltung verbinden?"]
  custom-solutions: ["KI in meine bestehenden Programme integrieren?", "Wie funktionieren KI-basierte Systeme im Betrieb?", "Welche Automatisierungen baut ihr im Hintergrund?"]
  save-time:        ["Welche Aufgaben sollte ich zuerst eliminieren?", "Wie viel Zeit kann Automatisierung realistisch sparen?", "Wie messe ich den Nutzen von KI-Automatisierung?"]
  examples:         ["Welche echten Systeme habt ihr bereits gebaut?", "Wie funktioniert der Sekretär-Agent?", "Kann man den Praxis-Assistenten für meine Praxis anpassen?"]
```

---

### FRENCH (fr)

```
heroTitle1:    "Votre Cabinet."
heroTitle2:    "Entièrement Automatisé."
heroSubtitle:  "Automatisations IA personnalisées pour votre entreprise."
letsTalk:      "Parlons-en"
startJourney:  "Réserver votre audit d'automatisation gratuit"
askAI:         "Tester notre agent IA"
askHaloAI:     "Demander à Halo IA"
automated:     "Autonome"
custom:        "Sur mesure"
scalable:      "Évolutif"
available:     "24/7"
aiSolutions:   "Systèmes IA orientés revenus"
growth:        "Croissance mesurable"

openingChat:       "Ouverture du chat..."
askAiAgent:        "Tester notre agent IA"
askAiAgentButton:  "Tester l'assistant IA"
sendingMessage:    "Envoi du message..."
howCanWeHelp:      "Comment pouvons-nous vous aider ?"

heroPlaceholder1:  "Écrivez votre vision..."
heroPlaceholder2:  "Interrogez notre processus..."
heroPlaceholder3:  "Démarrer une conversation..."
playIntro:         "Lire l'intro"

servicesTitle:    "Ce que l'automatisation IA fait pour vous"
servicesSubtitle: "Nous concevons des agents IA adaptés à vos flux de travail pour éliminer le travail manuel et stimuler la croissance."

filterAll:    "Tout"
filterAgents: "Exemples"
filterFaq:    "Questions fréquentes"
filterRoi:    "Résultats & Valeur"

catEfficiency: "Efficacité"
catGrowth:     "Croissance"
catTech:       "Tech"
catSupport:    "Support"
catInfra:      "Infrastructure"
catData:       "Données"
catOps:        "Opérations"
catConsulting: "Stratégie"
catAgents:     "Agent IA"
catFaq:        "FAQ"
catRoi:        "Résultats"

exploreAI:  "Explorer avec l'IA"
close:      "Fermer"
impactTime: "-20h/semaine"
impactLive: "24/7 Live"

node1Title: "Gagnez 20+ heures"
node2Title: "Acquisition de clients"
node3Title: "Flux automatisés"
node4Title: "Réponse instantanée"
node6Title: "Tableaux de bord résultats"
node12Title:"Stratégie IA"

nodeA1Title: "L'Agent Tout-en-Un"
nodeA2Title: "L'Agent Secrétaire"
nodeA3Title: "L'Assistant Cabinet Médical"
nodeA4Title: "L'Agent Nouveaux Clients"
nodeA5Title: "L'Assistant Boutique en Ligne"
nodeA6Title: "L'Agent Rendez-vous"

nodeQ1Title: "Combien de temps pour la mise en place ?"
nodeQ2Title: "Données sécurisées ?"
nodeQ3Title: "Quels modèles IA utilisez-vous ?"
nodeQ4Title: "Quels outils peuvent être connectés ?"
nodeQ5Title: "Faut-il des compétences techniques ?"
nodeQ6Title: "Que comprend le support après le lancement ?"

nodeR1Title: "Économies détaillées"
nodeR2Title: "Suivi en temps réel"
nodeR3Title: "Plus de revenus grâce à l'IA"
nodeR4Title: "Rapport d'efficacité post-lancement"
nodeR5Title: "Croître sans recruter"
nodeR6Title: "Zéro erreur manuelle"

testimonials.title: "Ce qu'ils disent"
testimonials.open:  "Ouvrir"
testimonials.reviews: (same 5 people, French translations of reviews)

whyUsTitle: "Pourquoi nous ?"
reasons: [
  "Experts en IA & Automatisation",
  "Approche orientée résultats",
  "Solutions sur mesure (pas de modèles génériques)",
  "Tableaux de bord de performance personnalisés",
]

integrationsLabel: "250+ intégrations"
customBuilt:       "Jayden Mikus – Expert en Automatisation IA"
rapidDeployment:   "Concentrez-vous sur votre croissance pendant que vos systèmes gèrent l'opérationnel."

workWithUs:     "Prêt à automatiser ?"
bookCall:       "Réserver votre audit IA gratuit"
planStep1: "1. Analyse: Appel de 30 min pour cerner vos priorités."
planStep2: "2. Planification: Conception de votre architecture IA."
planStep3: "3. Développement: Agents créés & connectés à vos outils."
planStep4: "4. Lancement: Mise en ligne et début de la croissance."

growthMappingCall: "Audit d'automatisation gratuit"
growthMappingDesc: "Session stratégique de 30 minutes. Inclut :"
duration:          "30 Min"
locale:            "fr-FR"
analysisStep:      "Disponibilité : Fuseau horaire, Date & Heure"
auditStep:         "Détails de l'audit : Informations & Objectifs"
nextSteps:         "Confirmation : Vérifier & Sécuriser votre session"

back:        "Retour"
submit:      "Planifier l'audit"
submitting:  "Envoi en cours..."
bookingError:"Erreur lors de l'envoi. Veuillez réessayer."

chatGreeting:        "Bonjour, je suis votre assistant en automatisation. Demandez-moi comment l'IA peut vous aider."
chatSub:             "Support Automatisation"
chatInputPlaceholder:"Posez votre question..."
suggestions:         "Suggestions"

chatRecommendations:
  general:          ["Où l'IA peut-elle me faire gagner du temps ?", "Comment attirer des clients automatiquement ?", "Quoi automatiser en premier ?"]
  lead-generation:  ["Comment qualifier les prospects automatiquement ?", "Prospecter de façon autonome ?", "Connecter l'IA à ma gestion clients ?"]
  custom-solutions: ["Intégrer l'IA à mes outils existants ?", "Comment fonctionnent les systèmes IA en pratique ?", "Quelle automatisation construisez-vous ?"]
  save-time:        ["Quelles tâches éliminer en premier ?", "Combien d'heures peut-on vraiment gagner ?", "Comment mesurer le retour sur investissement ?"]
  examples:         ["Exemples de systèmes déjà créés ?", "Comment fonctionne l'Agent Secrétaire ?", "L'assistant cabinet médical convient à ma pratique ?"]
```

---

## TECH STACK SUMMARY

```
React 18.3.1 + TypeScript 5.5.3
Vite 5.4.2
Tailwind CSS 3.4.1
Framer Motion 12.34.3
Three.js 0.183.2 + @react-three/fiber 9.5.0 + @react-three/drei 10.7.7
@supabase/supabase-js 2.57.4 (installed, not actively wired)
Lucide React 0.344.0
PostCSS 8.4.35 + Autoprefixer
```
