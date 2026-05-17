export type Language = 'en' | 'de' | 'fr'

export interface Translations {
  // Hero
  heroTitle1: string
  heroTitle2: string
  heroSubtitle: string
  letsTalk: string
  startJourney: string
  askAI: string
  askHaloAI: string
  automated: string
  custom: string
  scalable: string
  available: string
  aiSolutions: string
  growth: string
  heroPlaceholder1: string
  heroPlaceholder2: string
  heroPlaceholder3: string
  playIntro: string
  talkToIntegratedAI: string
  nextStep: string
  heroGreeting: string
  processTitle: string
  bookingSent: string
  bookingConfirmationBody: string
  // Chat
  openingChat: string
  askAiAgent: string
  askAiAgentButton: string
  sendingMessage: string
  howCanWeHelp: string
  chatGreeting: string
  chatSub: string
  chatInputPlaceholder: string
  suggestions: string
  chatRecommendations: {
    general: string[]
    'lead-generation': string[]
    'custom-solutions': string[]
    'save-time': string[]
    examples: string[]
  }
  thinkingLines: string[]
  // Services
  servicesTitle: string
  servicesSubtitle: string
  aiosTitle: string
  aiosDesc: string
  filterAll: string
  filterAgents: string
  filterFaq: string
  filterRoi: string
  exploreAI: string
  close: string
  impactTime: string
  impactLive: string
  // Service nodes — agents
  node1Title: string; node1Desc: string
  node2Title: string; node2Desc: string
  node3Title: string; node3Desc: string
  node4Title: string; node4Desc: string
  node5Title: string; node5Desc: string
  node6Title: string; node6Desc: string
  nodeA1Title: string; nodeA1Desc: string
  nodeA2Title: string; nodeA2Desc: string
  nodeA3Title: string; nodeA3Desc: string
  nodeA4Title: string; nodeA4Desc: string
  nodeA5Title: string; nodeA5Desc: string
  nodeA6Title: string; nodeA6Desc: string
  node19Title: string; node19Desc: string
  node20Title: string; node20Desc: string
  node21Title: string; node21Desc: string
  // Service nodes — faq
  nodeQ1Title: string; nodeQ1Desc: string
  nodeQ2Title: string; nodeQ2Desc: string
  nodeQ3Title: string; nodeQ3Desc: string
  nodeQ4Title: string; nodeQ4Desc: string
  nodeQ5Title: string; nodeQ5Desc: string
  nodeQ6Title: string; nodeQ6Desc: string
  node22Title: string; node22Desc: string
  node23Title: string; node23Desc: string
  // Service nodes — roi
  nodeR1Title: string; nodeR1Desc: string
  nodeR2Title: string; nodeR2Desc: string
  nodeR3Title: string; nodeR3Desc: string
  nodeR4Title: string; nodeR4Desc: string
  nodeR5Title: string; nodeR5Desc: string
  nodeR6Title: string; nodeR6Desc: string
  node24Title: string; node24Desc: string
  // Results
  testimonialsTitle: string
  testimonialsOpen: string
  goToReview: string
  testimonials: { name: string; role: string; review: string }[]
  whyUsTitle: string
  reasons: string[]
  reasonsDesc: string[]
  integrationsLabel: string
  statHrs: string
  statAvailability: string
  statIntegrations: string
  customBuilt: string
  customBuiltDesc: string
  rapidDeployment: string
  // Process
  workWithUs: string
  workWithUsDesc: string
  bookCall: string
  planStep1: string
  planStep2: string
  planStep3: string
  planStep4: string
  // Booking
  growthMappingCall: string
  growthMappingDesc: string
  duration: string
  locale: string
  analysisStep: string
  auditStep: string
  nextSteps: string
  agencyNote: string
  firstName: string
  lastName: string
  email: string
  phone: string
  revenueRange: string
  selectRevenueRange: string
  website: string
  businessDescription: string
  businessDescriptionPlaceholder: string
  reason: string
  back: string
  submit: string
  submitting: string
  bookingError: string
  // Nav labels
  navHome: string
  navVideo: string
  navWork: string
  navResults: string
  navProcess: string
  navAbout: string
  navBook: string
  // Splash gate
  splashHeadline: string
  splashSub: string
  splashCta: string
}

const en: Translations = {
  heroTitle1: 'Your Practice.',
  heroTitle2: 'Fully Automated.',
  heroSubtitle: 'Stop doing the same things every day. We build AI systems that handle it for you — live in 2 weeks.',
  letsTalk: "Let's Talk",
  startJourney: 'Book a Free Strategy Call',
  askAI: 'Test Our AI Agent',
  askHaloAI: 'Ask Halo AI',
  automated: 'Autonomous',
  custom: 'Custom-Built',
  scalable: 'Scalable',
  available: '24/7',
  aiSolutions: 'Revenue-Driven AI Systems',
  growth: 'Measurable Growth',
  heroPlaceholder1: 'Type your vision...',
  heroPlaceholder2: 'Ask about our process...',
  heroPlaceholder3: 'Start a conversation...',
  playIntro: 'Play intro',
  talkToIntegratedAI: 'This agent could be yours',
  nextStep: 'Next step',
  heroGreeting: 'We build **custom AI systems** around your business — handling customer conversations, qualifying leads, and eliminating repetitive work automatically.\n\nWhat does your business do?',
  processTitle: 'Your Plan',
  bookingSent: 'Your booking was sent!',
  bookingConfirmationBody: 'We received your request and our system is processing your booking. You will receive a confirmation email shortly.',
  openingChat: 'Opening Chat Panel...',
  askAiAgent: 'Test our AI Agent',
  askAiAgentButton: 'Test Support AI',
  sendingMessage: 'Sending message...',
  howCanWeHelp: 'How can we help you?',
  chatGreeting: "Hi, I'm Halo — your AI assistant. What's eating up most of your time right now? Tell me and I'll show you how to get it off your plate.",
  chatSub: 'Automation Support',
  chatInputPlaceholder: 'Ask about automations...',
  suggestions: 'Suggested questions',
  chatRecommendations: {
    general: ['Where can AI save me the most time?', 'How do I automate my lead generation?', 'What workflows should I automate first?'],
    'lead-generation': ['How can AI qualify leads automatically?', 'Can I automate outbound prospecting?', 'How do I connect AI to my CRM?'],
    'custom-solutions': ['Can you integrate AI into my existing tools?', 'How do AI-based systems work in operations?', 'What backend automation do you build?'],
    'save-time': ['Which manual tasks should I eliminate first?', 'How many hours can automation realistically save?', 'How do I measure ROI from AI automation?'],
    examples: ['What real automation systems have you built?', 'Can you automate my onboarding process?', 'How does the Secretary Agent work?'],
  },
  thinkingLines: [
    'Rolling out the red carpet...',
    'Spotting the bottlenecks...',
    'Finding quick wins...',
    'Checking your tools...',
    'Running a few scenarios...',
    'Connecting the dots...',
    'Crunching the numbers...',
    'Mapping the best approach...',
    'Almost there...',
    'One last check...',
    'Putting it together...',
    'Here you go...',
  ],
  servicesTitle: 'Explenation',
  servicesSubtitle: 'Real systems for real businesses. Every agent we build is designed around one thing: getting repetitive work off your plate so you can actually grow.',
  aiosTitle: 'AIOS — AI Operating System',
  aiosDesc: 'A layer around your entire business that uses AI and automation to make every process faster, smarter, and more profitable. Not a chatbot. Not a template. A fully custom operating system built for your company.',
  filterAll: 'All',
  filterAgents: 'Explanation',
  filterFaq: 'Q & A',
  filterRoi: 'ROI & Value',
  exploreAI: 'Explore with AI',
  close: 'Close',
  impactTime: '-20hrs/week',
  impactLive: '24/7 Live',
  node1Title: 'Save 20+ Hours',
  node1Desc: 'Every hour spent on repetitive tasks is an hour not spent growing. We automate the routine — and most clients reclaim those hours within the first week.',
  node2Title: 'Lead Acquisition',
  node2Desc: 'While you sleep, AI finds people actively looking for what you offer and reaches out first — so your pipeline fills itself, ahead of the competition.',
  node3Title: 'Custom Workflows',
  node3Desc: 'All your tools talk to each other. Data flows automatically between apps — no copy-paste, no manual hand-offs, no human error.',
  node4Title: 'Instant Response',
  node4Desc: 'Customers get a helpful reply in seconds — at 2am, on weekends, on holidays. Every message answered. Every sale captured.',
  node5Title: 'AI Integration',
  node5Desc: 'GPT-4o, Claude, and Llama integrated directly into your business data — for decisions that reflect your operations, not generic AI guesses.',
  node6Title: 'ROI Dashboards',
  node6Desc: 'A live dashboard updated daily — exact hours saved, costs cut, and revenue attributed to your automations. No guesswork, just numbers.',
  nodeA1Title: 'The Computer-Use Agent',
  nodeA1Desc: 'A fully autonomous agent that operates your computer — browses the web, writes and executes code, manages files, sends emails, and completes complex multi-step tasks end-to-end. Built on Claude\'s agentic workflow. Not a chatbot. A digital operator.',
  nodeA2Title: 'The Secretary Agent',
  nodeA2Desc: 'Every morning it reads your inbox, filters the noise, and sends you a clean briefing with only what needs action — so you start every day with clarity, not chaos.',
  nodeA3Title: 'The Medical Practice Agent',
  nodeA3Desc: 'Built for doctors, dentists, and therapists. Handles bookings, sends reminders, answers FAQs, and manages cancellations automatically — so your staff focuses on patients, not admin.',
  nodeA4Title: 'The New Client Agent',
  nodeA4Desc: 'The moment someone fills out your form, they get a welcome email, are added to your system, and have an intro call scheduled — all within seconds. No lead falls through the cracks.',
  nodeA5Title: 'The Online Shop Agent',
  nodeA5Desc: 'Handles every customer question — order status, returns, product info — with an instant, accurate answer. No wait times, no support tickets piling up.',
  nodeA6Title: 'The Appointment Agent',
  nodeA6Desc: 'Confirms bookings, sends reminders, and fills cancelled slots automatically. Your calendar stays full — without you lifting a finger.',
  node19Title: 'Custom Agent Builds',
  node19Desc: 'Tell us your workflow. We build the agent that handles it — precisely tailored to your business, production-ready from day one.',
  node20Title: 'System Integration',
  node20Desc: 'Connect every tool in your stack into one automated flow. From CRM to ERP — all talking to each other, seamlessly.',
  node21Title: 'Data Pipeline Automation',
  node21Desc: 'Automate data collection, transformation, and routing across your systems. No more manual exports or costly data entry errors.',
  nodeQ1Title: 'How Long Does Setup Take?',
  nodeQ1Desc: 'Most automation systems go live within 1–2 weeks. Complex multi-agent builds typically take 3–4 weeks depending on integrations.',
  nodeQ2Title: 'Is My Data Secure?',
  nodeQ2Desc: 'Yes. Everything runs on your own systems. We never store, read, or share your business data — ever.',
  nodeQ3Title: 'Which AI Models Do You Use?',
  nodeQ3Desc: 'We work with GPT-4o, Claude, and open-source models like Llama — choosing the right model based on your use case and budget.',
  nodeQ4Title: 'What Tools Can You Connect?',
  nodeQ4Desc: 'Any tool with an API: HubSpot, Salesforce, Notion, Slack, Gmail, Airtable, Stripe, and hundreds more.',
  nodeQ5Title: 'Do I Need a Tech Team?',
  nodeQ5Desc: 'No. We handle 100% of the technical work and hand everything over ready to run. You get clear documentation and a personal walkthrough — no tech skills needed, ever.',
  nodeQ6Title: "What's Included After Launch?",
  nodeQ6Desc: 'Every project includes testing, documentation, and a handover call. Ongoing support and maintenance plans are available.',
  node22Title: 'Proven Track Record',
  node22Desc: 'We\'ve deployed automation systems across healthcare, e-commerce, and service industries — with measurable, documented results.',
  node23Title: 'Rapid Deployment',
  node23Desc: 'Our tested frameworks and proven architecture let us ship production-ready automations faster than traditional development — without cutting corners.',
  nodeR1Title: 'Cost Savings Breakdown',
  nodeR1Desc: '20+ hours saved per week = thousands recovered every month. We calculate the exact numbers for your business before we start — so you know the ROI before spending a cent.',
  nodeR2Title: 'Live Performance Tracking',
  nodeR2Desc: 'Custom dashboards show automation runs, time saved, errors caught, and revenue influenced — updated in real time.',
  nodeR3Title: 'Pipeline Revenue Impact',
  nodeR3Desc: 'Faster follow-ups + 24/7 lead qualification = more deals closed. Most clients see measurable pipeline growth within 30 days of going live.',
  nodeR4Title: 'Efficiency Gains Report',
  nodeR4Desc: 'After go-live, we deliver a detailed report showing productivity improvements, cost reduction, and workflow throughput gains.',
  nodeR5Title: 'Scale Without Hiring',
  nodeR5Desc: 'AI handles the output of 2–3 full-time employees — at a fraction of the cost. Zero onboarding, zero sick days, zero turnover.',
  nodeR6Title: 'Error Cost Elimination',
  nodeR6Desc: 'Manual mistakes in data entry cost businesses thousands every year. Automation catches errors before they cause any damage.',
  node24Title: 'Measurable ROI',
  node24Desc: 'Every system we build is tied to clear KPIs. You see the return on investment in the first month of operation — not a quarter later.',
  testimonialsTitle: 'What People Say',
  testimonialsOpen: 'Open',
  goToReview: 'Go to Review',
  testimonials: [
    { name: '@sarah_tech',  role: 'CEO, TechStart',      review: 'HaloVision transformed our customer service with their AI agents. Response times dropped by 80% and satisfaction is at an all-time high.' },
    { name: '@mike_growth', role: 'Founder, GrowthLab',  review: 'The automation solutions they built for us freed up our team to focus on strategic work. ROI was evident within the first month.' },
    { name: '@emma_sales',  role: 'Director, SalesForce', review: 'Their lead generation AI is incredible. We\'re now capturing and qualifying leads 24/7 without effort. Conversion is way up.' },
    { name: '@david_cloud', role: 'Manager, CloudSync',   review: 'Working with HaloVision was seamless. They delivered a custom solution that exceeded expectations. Highly responsive team.' },
    { name: '@lisa_ops',    role: 'COO, ScaleUp',         review: 'The workflow automation cut our manual processing by 70%. The team was professional, fast, and incredibly responsive throughout.' },
  ],
  whyUsTitle: 'Why Work With Us',
  reasons: [
    'AI & Automation Architecture Expertise',
    'ROI-First Implementation',
    'Full Technical Control',
    'Custom Performance Dashboards',
  ],
  reasonsDesc: [
    'We specialize in advanced AI integrations, prompt engineering, and scalable automation architectures.',
    'Every system is built around measurable business impact — revenue growth, time savings, and cost reduction.',
    'Unlike template-based agencies, we build flexible backend logic that grows with your company.',
    'Track productivity gains, cost savings, and automation performance in real time.',
  ],
  integrationsLabel: '250+ integrations',
  statHrs: 'hrs saved / week',
  statAvailability: 'availability',
  statIntegrations: 'integrations',
  customBuilt: 'Jayden Mikus – AI Automation',
  customBuiltDesc: "I help business owners stop doing the same things over and over. Every system I build is done for you — designed, built, and handed over ready to go. Most people I work with get back 20+ hours a week, from the very first week.",
  rapidDeployment: 'You focus on your business. The system handles the rest.',
  workWithUs: 'How It Works',
  workWithUsDesc: 'Four simple steps. We handle all the technical stuff — you just show up for a call and we take it from there.',
  bookCall: 'Book a Free Strategy Call',
  planStep1: '1. Discovery: A 30-min chat to understand your business and where the time is going.',
  planStep2: '2. Plan: We design a system built exactly around how you work.',
  planStep3: '3. Build: We build and connect everything — you don\'t touch a single line of code.',
  planStep4: '4. Live: Your system goes live and starts doing the work for you.',
  growthMappingCall: 'Free Strategy Call',
  growthMappingDesc: 'No sales pitch. No tech talk. Just an honest conversation about where AI can save you real time and money. Includes:',
  duration: '30 Min',
  locale: 'en-US',
  analysisStep: 'Pick a Time: Choose your timezone and slot',
  auditStep: 'About You: Your business and what you want to change',
  nextSteps: 'Confirm: Review and lock in your spot',
  agencyNote: 'For business owners who are tired of doing everything manually.',
  firstName: 'First Name',
  lastName: 'Last Name',
  email: 'Email Address',
  phone: 'Phone Number',
  revenueRange: 'Monthly Revenue',
  selectRevenueRange: 'Select revenue range',
  website: 'Business Website',
  businessDescription: 'Describe your current workflows & biggest bottlenecks',
  businessDescriptionPlaceholder: 'Explain your manual processes, tools used, and growth goals...',
  reason: 'Primary Goal With AI?',
  back: 'Back',
  submit: 'Book My Call',
  submitting: 'Submitting...',
  bookingError: 'There was an error submitting your booking. Please try again.',
  navHome: 'HALOVISION',
  navVideo: 'VIDEO',
  navWork: 'EXAMPLES',
  navResults: 'RESULTS',
  navProcess: 'PLAN',
  navAbout: 'ABOUT',
  navBook: 'BOOK',
  splashHeadline: 'Reclaim hours. Grow revenue.',
  splashSub: 'AI automation that actually delivers.',
  splashCta: 'Enter now',
}

const de: Translations = {
  ...en,
  heroTitle1: 'Ihre Praxis.',
  heroTitle2: 'Voll automatisiert.',
  heroSubtitle: 'Hören Sie auf, dieselben Dinge jeden Tag manuell zu erledigen. Wir bauen KI-Systeme, die das für Sie übernehmen — in 2 Wochen live.',
  letsTalk: 'Kontakt',
  startJourney: 'Kostenloses Erstgespräch buchen',
  askAI: 'KI-Agenten testen',
  askHaloAI: 'Halo KI fragen',
  automated: 'Autonom',
  custom: 'Maßgeschneidert',
  scalable: 'Skalierbar',
  available: '24/7',
  aiSolutions: 'KI-Systeme mit Wirkung',
  growth: 'Messbares Wachstum',
  heroPlaceholder1: 'Ihre Vision eingeben...',
  heroPlaceholder2: 'Fragen Sie nach unserem Vorgehen...',
  heroPlaceholder3: 'Gespräch beginnen...',
  playIntro: 'Intro abspielen',
  talkToIntegratedAI: 'Dieser Agent könnte deiner sein',
  nextStep: 'Nächster Schritt',
  heroGreeting: 'Wir bauen **maßgeschneiderte KI-Systeme** für dein Unternehmen — Kundengespräche, Lead-Qualifizierung und Routineaufgaben vollautomatisch.\n\nWas macht dein Unternehmen?',
  processTitle: 'Was tun?',
  bookingSent: 'Ihre Buchung wurde gesendet!',
  bookingConfirmationBody: 'Wir haben Ihre Anfrage erhalten. Eine Bestätigung wird in Kürze an Ihre E-Mail-Adresse gesendet.',
  openingChat: 'Chat wird geöffnet...',
  askAiAgent: 'KI-Agenten testen',
  askAiAgentButton: 'KI-Assistenten fragen',
  sendingMessage: 'Nachricht wird gesendet...',
  howCanWeHelp: 'Wie können wir helfen?',
  chatGreeting: 'Hallo, ich bin Halo — Ihr KI-Assistent. Was kostet Sie gerade am meisten Zeit? Sagen Sie es mir, und ich zeige Ihnen, wie Sie es loswerden.',
  chatSub: 'Automatisierungs-Hilfe',
  chatInputPlaceholder: 'Frage zu Automatisierungen...',
  suggestions: 'Vorgeschlagene Fragen',
  chatRecommendations: {
    general: ['Wo spare ich am meisten Zeit?', 'Wie gewinne ich automatisch neue Kunden?', 'Welche Abläufe sollte ich zuerst automatisieren?'],
    'lead-generation': ['Wie bewertet KI Interessenten automatisch?', 'Kann ich Interessenten automatisch ansprechen?', 'KI mit meiner Kundenverwaltung verbinden?'],
    'custom-solutions': ['KI in meine bestehenden Programme integrieren?', 'Wie funktionieren KI-basierte Systeme im Betrieb?', 'Welche Automatisierungen baut ihr im Hintergrund?'],
    'save-time': ['Welche Aufgaben sollte ich zuerst eliminieren?', 'Wie viel Zeit kann Automatisierung realistisch sparen?', 'Wie messe ich den Nutzen von KI-Automatisierung?'],
    examples: ['Welche echten Systeme habt ihr bereits gebaut?', 'Wie funktioniert der Sekretär-Agent?', 'Kann man den Praxis-Assistenten anpassen?'],
  },
  thinkingLines: [
    'Den roten Teppich ausrollen...',
    'Zeitfresser aufspüren...',
    'Schnelle Gewinne finden...',
    'Tools prüfen...',
    'Szenarien durchspielen...',
    'Punkte verbinden...',
    'Zahlen prüfen...',
    'Besten Ansatz herausarbeiten...',
    'Fast fertig...',
    'Noch eine Sache...',
    'Alles zusammensetzen...',
    'Gleich da...',
  ],
  servicesTitle: 'Explenation',
  servicesSubtitle: 'Echte Systeme für echte Unternehmen. Jedes System, das wir bauen, hat ein Ziel: wiederkehrende Arbeit von Ihrem Schreibtisch nehmen, damit Sie sich auf das Wachstum konzentrieren können.',
  aiosTitle: 'AIOS — AI Operating System',
  aiosDesc: 'Eine Schicht rund um Ihre gesamte Unternehmung, die KI und Automatisierung nutzt, um jeden Prozess schneller, klüger und profitabler zu machen. Kein Chatbot. Keine Vorlage. Ein vollständig individuell entwickeltes Betriebssystem für Ihr Unternehmen.',
  filterAll: 'Alle',
  filterAgents: 'Beispiele',
  filterFaq: 'Häufige Fragen',
  filterRoi: 'Ergebnisse & Gewinn',
  exploreAI: 'Mit KI erkunden',
  close: 'Schließen',
  impactTime: '-20 Std/Woche',
  impactLive: '24/7 Live',
  node1Title: '20+ Stunden sparen',
  node1Desc: 'Jede Stunde mit Routineaufgaben ist eine Stunde, die nicht Ihrem Wachstum gehört. Wir automatisieren die Routine — und die meisten Kunden gewinnen diese Stunden bereits in der ersten Woche zurück.',
  node2Title: 'Lead-Gewinnung',
  node2Desc: 'Während Sie schlafen, findet eine KI Menschen, die aktiv nach Ihrem Angebot suchen, und spricht diese zuerst an — Ihre Pipeline füllt sich von selbst, vor der Konkurrenz.',
  node3Title: 'Individuelle Workflows',
  node3Desc: 'Alle Ihre Tools kommunizieren miteinander. Daten fließen automatisch zwischen Anwendungen — kein Copy-Paste, keine manuellen Übergaben, keine menschlichen Fehler.',
  node4Title: 'Sofortreaktion',
  node4Desc: 'Kunden erhalten in Sekunden eine hilfreiche Antwort — um 2 Uhr nachts, am Wochenende, an Feiertagen. Jede Nachricht beantwortet. Jeder Umsatz gesichert.',
  node5Title: 'KI-Integration',
  node5Desc: 'GPT-4o, Claude und Llama direkt in Ihre Unternehmensdaten integriert — für Entscheidungen, die wirklich Ihren Betrieb widerspiegeln, keine generischen KI-Antworten.',
  node6Title: 'ROI-Dashboards',
  node6Desc: 'Ein täglich aktualisiertes Live-Dashboard — genaue Stunden gespart, Kosten gesenkt und Umsatz durch Ihre Automatisierungen. Keine Schätzungen, nur Zahlen.',
  nodeA1Title: 'Der Computer-Operator-Agent',
  nodeA1Desc: 'Ein vollautonomer Agent, der Ihren Computer eigenständig bedient — surft im Web, schreibt und führt Code aus, verwaltet Dateien, sendet E-Mails und erledigt komplexe Aufgaben von A bis Z. Aufgebaut auf Claude\'s Agentic Workflow. Kein Chatbot — ein digitaler Operator.',
  nodeA2Title: 'Der Sekretär-Agent',
  nodeA2Desc: 'Jeden Morgen liest er Ihren Posteingang, filtert das Unwichtige und sendet Ihnen ein klares Briefing mit genau dem, was Ihre Aufmerksamkeit braucht — damit Sie jeden Tag mit Klarheit starten, nicht mit Chaos.',
  nodeA3Title: 'Der Praxis-Assistent',
  nodeA3Desc: 'Für Ärzte, Zahnärzte und Therapeuten. Übernimmt Buchungen, sendet Erinnerungen, beantwortet häufige Fragen und verwaltet Absagen automatisch — damit sich Ihr Team auf Patienten konzentriert, nicht auf Papierkram.',
  nodeA4Title: 'Der Neukunden-Agent',
  nodeA4Desc: 'Sobald jemand Ihr Formular ausfüllt, erhält er eine Willkommens-E-Mail, wird ins System eingetragen und ein Erstgespräch geplant — alles in Sekunden. Kein Lead geht mehr verloren.',
  nodeA5Title: 'Der Online-Shop-Assistent',
  nodeA5Desc: 'Beantwortet jede Kundenanfrage — Bestellstatus, Rücksendungen, Produktinfos — sofort und präzise. Keine Wartezeiten, keine wachsenden Support-Tickets.',
  nodeA6Title: 'Der Termin-Agent',
  nodeA6Desc: 'Bestätigt Buchungen, sendet Erinnerungen und füllt abgesagte Termine automatisch. Ihr Kalender bleibt voll — ohne dass Sie einen Finger rühren müssen.',
  node19Title: 'Individuelle Agenten',
  node19Desc: 'Beschreiben Sie Ihren Ablauf. Wir bauen den Agenten, der ihn übernimmt — präzise auf Ihr Unternehmen zugeschnitten, vom ersten Tag produktionsbereit.',
  node20Title: 'System-Integration',
  node20Desc: 'Alle Tools Ihres Unternehmens werden zu einem einheitlichen automatisierten Ablauf verbunden — vom CRM bis zum ERP, nahtlos vernetzt.',
  node21Title: 'Datenpipeline-Automatisierung',
  node21Desc: 'Automatisieren Sie die Erfassung, Transformation und Weiterleitung von Daten. Keine manuellen Exporte, keine kostspieligen Dateneingabefehler mehr.',
  nodeQ1Title: 'Wie lange dauert die Einrichtung?',
  nodeQ1Desc: 'Die meisten Automatisierungssysteme gehen innerhalb von 1–2 Wochen live. Komplexe Multi-Agenten-Lösungen dauern in der Regel 3–4 Wochen, je nach Integrationen.',
  nodeQ2Title: 'Sind meine Daten sicher?',
  nodeQ2Desc: 'Ja. Alles läuft auf Ihren eigenen Systemen. Wir speichern, lesen oder teilen Ihre Unternehmensdaten zu keinem Zeitpunkt — niemals.',
  nodeQ3Title: 'Welche KI-Modelle nutzen Sie?',
  nodeQ3Desc: 'Wir arbeiten mit GPT-4o, Claude und Open-Source-Modellen wie Llama — und wählen das passende Modell je nach Anwendungsfall und Budget.',
  nodeQ4Title: 'Welche Programme können verbunden werden?',
  nodeQ4Desc: 'Jedes Tool mit einer API: HubSpot, Salesforce, Notion, Slack, Gmail, Airtable, Stripe und Hunderte weitere.',
  nodeQ5Title: 'Brauche ich technisches Wissen?',
  nodeQ5Desc: 'Nein. Wir übernehmen 100 % der technischen Arbeit und übergeben alles betriebsbereit. Sie erhalten eine klare Dokumentation und eine persönliche Einführung — ohne technische Vorkenntnisse, jetzt und in Zukunft.',
  nodeQ6Title: 'Was ist nach dem Start enthalten?',
  nodeQ6Desc: 'Jedes Projekt beinhaltet Tests, Dokumentation und einen Übergabe-Call. Laufende Support- und Wartungspläne sind verfügbar.',
  node22Title: 'Bewährte Ergebnisse',
  node22Desc: 'Wir haben Automatisierungssysteme in der Gesundheitsbranche, im E-Commerce und in Dienstleistungsunternehmen eingesetzt — mit messbaren, dokumentierten Ergebnissen.',
  node23Title: 'Schnelle Umsetzung',
  node23Desc: 'Unsere erprobten Frameworks und bewährte Architektur ermöglichen es, produktionsreife Automatisierungen schneller zu liefern als klassische Entwicklung — ohne Abstriche.',
  nodeR1Title: 'Kosteneinsparungen im Überblick',
  nodeR1Desc: '20+ Stunden gespart pro Woche = Tausende zurückgewonnen jeden Monat. Wir berechnen die genauen Zahlen für Ihr Unternehmen, bevor wir starten — damit Sie den ROI kennen, bevor Sie einen Cent ausgeben.',
  nodeR2Title: 'Echtzeit-Auswertung',
  nodeR2Desc: 'Individuelle Dashboards zeigen Automatisierungsläufe, eingesparte Zeit, erkannte Fehler und beeinflusste Umsätze — in Echtzeit aktualisiert.',
  nodeR3Title: 'Mehr Umsatz durch KI',
  nodeR3Desc: 'Schnellere Nachverfolgung + 24/7 Lead-Qualifizierung = mehr Abschlüsse. Die meisten Kunden sehen messbares Pipeline-Wachstum innerhalb von 30 Tagen nach dem Live-Gang.',
  nodeR4Title: 'Auswertungs-Bericht nach dem Start',
  nodeR4Desc: 'Nach dem Start liefern wir einen detaillierten Bericht mit Produktivitätssteigerungen, Kosteneinsparungen und verbesserten Workflow-Durchsätzen.',
  nodeR5Title: 'Wachsen ohne mehr Personal',
  nodeR5Desc: 'KI erbringt die Leistung von 2–3 Vollzeitkräften — zu einem Bruchteil der Kosten. Keine Einarbeitung, keine Krankentage, keine Fluktuation.',
  nodeR6Title: 'Fehlerkosten eliminieren',
  nodeR6Desc: 'Fehler bei der manuellen Dateneingabe kosten Unternehmen jährlich Tausende. Automatisierung erkennt Fehler, bevor sie Schaden anrichten.',
  node24Title: 'Messbarer ROI',
  node24Desc: 'Jedes System, das wir bauen, wird an klaren KPIs gemessen. Sie sehen den Return on Investment bereits im ersten Monat — nicht erst ein Quartal später.',
  testimonialsTitle: 'Was andere sagen',
  testimonialsOpen: 'Öffnen',
  goToReview: 'Zur Bewertung',
  whyUsTitle: 'Warum wir?',
  reasons: [
    'Experten für KI & Automatisierung',
    'Fokus auf messbare Ergebnisse',
    'Maßgeschneiderte Lösungen',
    'Individuelle Auswertungs-Dashboards',
  ],
  reasonsDesc: [
    'Wir sind spezialisiert auf fortgeschrittene KI-Integrationen, Prompt Engineering und skalierbare Automatisierungsarchitekturen.',
    'Jedes System ist auf messbaren Unternehmenserfolg ausgerichtet — Umsatzwachstum, Zeitersparnis und Kostensenkung.',
    'Anders als Template-basierte Agenturen bauen wir flexible Backend-Logik, die mit Ihrem Unternehmen wächst.',
    'Verfolgen Sie Produktivitätsgewinne, Kosteneinsparungen und Automatisierungsleistung in Echtzeit.',
  ],
  integrationsLabel: '250+ Integrationen',
  statHrs: 'Std. gespart / Woche',
  statAvailability: 'Verfügbarkeit',
  statIntegrations: 'Integrationen',
  customBuilt: 'Jayden Mikus – KI-Automatisierung',
  customBuiltDesc: 'Ich helfe Unternehmern dabei, aufzuhören, täglich dieselben Dinge manuell zu erledigen. Alles, was ich baue, wird komplett für Sie umgesetzt — konzipiert, gebaut und betriebsbereit übergeben. Die meisten, mit denen ich zusammenarbeite, gewinnen ab der ersten Woche 20+ Stunden zurück.',
  rapidDeployment: 'Sie kümmern sich um Ihr Unternehmen. Das System erledigt den Rest.',
  workWithUs: 'So läuft es ab',
  workWithUsDesc: 'Vier einfache Schritte. Wir kümmern uns um die technische Seite — Sie müssen nur zum Gespräch erscheinen und wir übernehmen den Rest.',
  bookCall: 'Kostenloses Erstgespräch buchen',
  planStep1: '1. Gespräch: 30 Min, um Ihr Business zu verstehen und herauszufinden, wo die Zeit verloren geht.',
  planStep2: '2. Plan: Wir entwickeln ein System, das genau auf Ihre Arbeitsweise zugeschnitten ist.',
  planStep3: '3. Umsetzung: Wir bauen alles und verbinden es — Sie berühren keine einzige Zeile Code.',
  planStep4: '4. Live: Ihr System geht live und übernimmt die Arbeit für Sie.',
  growthMappingCall: 'Kostenloses Erstgespräch',
  growthMappingDesc: 'Wir starten klein — mit einer einzigen Automatisierung. Und während die Ergebnisse wachsen, bauen wir Schritt für Schritt mehr auf.',
  duration: '30 Min',
  locale: 'de-DE',
  analysisStep: 'Termin wählen: Zeitzone und Uhrzeit aussuchen',
  auditStep: 'Über Sie: Ihr Unternehmen und was Sie ändern möchten',
  nextSteps: 'Bestätigen: Ihren Termin absichern',
  agencyNote: 'Für Unternehmer, die genug davon haben, alles manuell zu erledigen.',
  firstName: 'Vorname',
  lastName: 'Nachname',
  email: 'E-Mail-Adresse',
  phone: 'Telefonnummer',
  revenueRange: 'Monatlicher Umsatz',
  selectRevenueRange: 'Umsatzbereich wählen',
  website: 'Unternehmenswebsite',
  businessDescription: 'Beschreiben Sie Ihre aktuellen Abläufe & größten Engpässe',
  businessDescriptionPlaceholder: 'Erläutern Sie Ihre manuellen Prozesse, eingesetzten Tools und Wachstumsziele...',
  reason: 'Hauptziel mit KI?',
  back: 'Zurück',
  submit: 'Gespräch buchen',
  submitting: 'Wird gesendet...',
  bookingError: 'Fehler beim Senden. Bitte versuchen Sie es erneut.',
  navHome: 'HALOVISION',
  navVideo: 'VIDEO',
  navWork: 'ERKLÄRUNG',
  navResults: 'ERGEBNISSE',
  navProcess: 'PLAN',
  navAbout: 'ÜBER UNS',
  navBook: 'BUCHEN',
  splashHeadline: 'Stunden zurückgewinnen. Umsatz steigern.',
  splashSub: 'KI-Automatisierung, die wirklich liefert.',
  splashCta: 'Jetzt eintreten',
}

const fr: Translations = {
  ...en,
  heroTitle1: 'Votre Cabinet.',
  heroTitle2: 'Tout automatisé.',
  heroSubtitle: 'Arrêtez de faire les mêmes choses manuellement chaque jour. On construit des systèmes IA qui s\'en chargent — opérationnels en 2 semaines.',
  letsTalk: 'Parlons-en',
  startJourney: 'Réserver un appel gratuit',
  askAI: 'Tester notre agent IA',
  askHaloAI: 'Demander à Halo IA',
  automated: 'Autonome',
  custom: 'Sur mesure',
  scalable: 'Évolutif',
  available: '24/7',
  aiSolutions: 'Systèmes IA à impact',
  growth: 'Croissance mesurable',
  heroPlaceholder1: 'Écrivez votre vision...',
  heroPlaceholder2: 'Interrogez notre processus...',
  heroPlaceholder3: 'Démarrer une conversation...',
  playIntro: "Lire l'intro",
  talkToIntegratedAI: 'Cet agent pourrait être le vôtre',
  nextStep: 'Étape suivante',
  heroGreeting: 'Nous construisons des **systèmes IA sur mesure** pour votre entreprise — conversations clients, qualification de leads et tâches répétitives, gérés automatiquement.\n\nQue fait votre entreprise ?',
  processTitle: 'Votre Plan',
  bookingSent: 'Votre réservation a été envoyée !',
  bookingConfirmationBody: 'Nous avons reçu votre demande. Une confirmation vous sera envoyée par e-mail sous peu.',
  openingChat: 'Ouverture du chat...',
  askAiAgent: 'Tester notre agent IA',
  askAiAgentButton: "Tester l'assistant IA",
  sendingMessage: 'Envoi du message...',
  howCanWeHelp: 'Comment pouvons-nous vous aider ?',
  chatGreeting: "Bonjour, je suis votre assistant en automatisation. Quelle est votre plus grande perte de temps en ce moment ? Je vous montre exactement comment l'automatiser.",
  chatSub: 'Support Automatisation',
  chatInputPlaceholder: 'Posez votre question...',
  suggestions: 'Suggestions',
  chatRecommendations: {
    general: ["Où l'IA peut-elle me faire gagner du temps ?", 'Comment attirer des clients automatiquement ?', 'Quoi automatiser en premier ?'],
    'lead-generation': ['Comment qualifier les prospects automatiquement ?', 'Prospecter de façon autonome ?', "Connecter l'IA à ma gestion clients ?"],
    'custom-solutions': ["Intégrer l'IA à mes outils existants ?", "Comment fonctionnent les systèmes IA en pratique ?", 'Quelle automatisation construisez-vous ?'],
    'save-time': ['Quelles tâches éliminer en premier ?', "Combien d'heures peut-on vraiment gagner ?", 'Comment mesurer le retour sur investissement ?'],
    examples: ['Exemples de systèmes déjà créés ?', "Comment fonctionne l'Agent Secrétaire ?", "L'assistant cabinet médical convient à ma pratique ?"],
  },
  thinkingLines: [
    'Déroulons le tapis rouge...',
    'Repérage des goulots...',
    'Identification des gains rapides...',
    'Vérification des outils...',
    'Simulation de scénarios...',
    'Connexion des données...',
    'Calcul du potentiel...',
    'Élaboration de la meilleure approche...',
    'Presque prêt...',
    'Dernière vérification...',
    'Assemblage de la réponse...',
    'Voilà...',
  ],
  servicesTitle: 'Explenation',
  servicesSubtitle: "Nous construisons des agents IA adaptés à vos processus exacts — pour éliminer le travail manuel, libérer vos capacités et générer une croissance que vous pouvez mesurer.",
  aiosTitle: 'AIOS — AI Operating System',
  aiosDesc: "Une couche autour de toute votre entreprise qui utilise l'IA et l'automatisation pour rendre chaque processus plus rapide, plus intelligent et plus rentable. Pas un chatbot. Pas un modèle. Un système d'exploitation entièrement personnalisé pour votre entreprise.",
  filterAll: 'Tout',
  filterAgents: 'Explication',
  filterFaq: 'Questions fréquentes',
  filterRoi: 'Résultats & Valeur',
  exploreAI: "Explorer avec l'IA",
  close: 'Fermer',
  impactTime: '-20h/semaine',
  impactLive: '24/7 En direct',
  node1Title: 'Gagnez 20+ heures',
  node1Desc: "Chaque heure passée sur des tâches répétitives est une heure qui n'appartient pas à votre croissance. Nous automatisons la routine pour que votre équipe se concentre sur ce qui compte vraiment.",
  node2Title: 'Acquisition de leads',
  node2Desc: "Pendant que vous dormez, une IA trouve des personnes qui cherchent activement ce que vous proposez et les contacte en premier — votre pipeline se remplit tout seul, avant la concurrence.",
  node3Title: 'Workflows personnalisés',
  node3Desc: "Tous vos outils se parlent. Les données circulent automatiquement entre les applications — plus de copier-coller, plus de transferts manuels, plus d'erreurs humaines.",
  node4Title: 'Réponse instantanée',
  node4Desc: "Les clients reçoivent une réponse utile en secondes — à 2h du matin, le week-end, les jours fériés. Chaque message répondu. Chaque vente captée.",
  node5Title: 'Intégration IA',
  node5Desc: "GPT-4o, Claude et Llama intégrés directement dans vos données — pour des décisions qui reflètent vraiment votre activité, pas des suppositions génériques.",
  node6Title: 'Tableaux de bord ROI',
  node6Desc: "Un tableau de bord mis à jour quotidiennement — heures économisées, coûts réduits et revenus attribués à vos automatisations. Pas de suppositions, juste des chiffres.",
  nodeA1Title: "L'Agent Opérateur Informatique",
  nodeA1Desc: "Un agent entièrement autonome qui opère votre ordinateur — navigue sur le web, écrit et exécute du code, gère fichiers et e-mails, et accomplit des tâches complexes de bout en bout. Construit sur le workflow agentique de Claude. Pas un chatbot — un opérateur numérique.",
  nodeA2Title: "L'Agent Secrétaire",
  nodeA2Desc: "Chaque matin, il lit votre boîte mail, filtre le bruit et vous envoie un briefing clair avec seulement ce qui nécessite une action — pour commencer chaque journée avec clarté, pas avec du chaos.",
  nodeA3Title: "L'Assistant Cabinet Médical",
  nodeA3Desc: "Pour médecins, dentistes et thérapeutes. Gère les rendez-vous, envoie des rappels, répond aux questions et traite les annulations automatiquement — pour que votre équipe se concentre sur les patients, pas les papiers.",
  nodeA4Title: "L'Agent Nouveaux Clients",
  nodeA4Desc: "Dès qu'un prospect remplit votre formulaire, il reçoit un e-mail de bienvenue, est ajouté à votre système et un appel est planifié — tout en quelques secondes. Aucun lead ne passe entre les mailles.",
  nodeA5Title: "L'Assistant Boutique en Ligne",
  nodeA5Desc: "Répond à chaque question client — statut de commande, retours, info produit — avec une réponse instantanée et précise. Plus d'attente, plus de tickets qui s'accumulent.",
  nodeA6Title: "L'Agent Rendez-vous",
  nodeA6Desc: "Confirme les réservations, envoie des rappels et comble les créneaux annulés automatiquement. Votre agenda reste plein — sans que vous leviez le petit doigt.",
  node19Title: 'Agents sur mesure',
  node19Desc: 'Décrivez-nous votre flux de travail. Nous construisons l\'agent qui le gère — précisément adapté à votre activité, prêt pour la production dès le premier jour.',
  node20Title: 'Intégration système',
  node20Desc: "Connectez tous vos outils en un flux automatisé unifié. Du CRM à l'ERP — tout communique de manière transparente.",
  node21Title: 'Automatisation des données',
  node21Desc: 'Automatisez la collecte, la transformation et le routage des données. Fini les exports manuels et les erreurs de saisie coûteuses.',
  nodeQ1Title: 'Combien de temps pour la mise en place ?',
  nodeQ1Desc: "La plupart des systèmes d'automatisation sont opérationnels en 1 à 2 semaines. Les solutions multi-agents complexes prennent généralement 3 à 4 semaines selon les intégrations.",
  nodeQ2Title: 'Données sécurisées ?',
  nodeQ2Desc: 'Oui. Tout fonctionne sur vos propres systèmes. Nous ne stockons, ne lisons ni ne partageons jamais vos données professionnelles — jamais.',
  nodeQ3Title: 'Quels modèles IA utilisez-vous ?',
  nodeQ3Desc: "Nous travaillons avec GPT-4o, Claude et des modèles open source comme Llama — en choisissant le modèle adapté à votre cas d'usage et budget.",
  nodeQ4Title: 'Quels outils peuvent être connectés ?',
  nodeQ4Desc: "Tout outil avec une API : HubSpot, Salesforce, Notion, Slack, Gmail, Airtable, Stripe, et des centaines d'autres.",
  nodeQ5Title: 'Faut-il des compétences techniques ?',
  nodeQ5Desc: 'Non. Nous gérons 100 % du travail technique et vous livrons tout clé en main, prêt à fonctionner. Vous recevez une documentation claire et une démonstration personnelle — aucune compétence technique requise, jamais.',
  nodeQ6Title: 'Que comprend le support après le lancement ?',
  nodeQ6Desc: 'Chaque projet inclut des tests, une documentation et un appel de passation. Des plans de support et maintenance sont disponibles.',
  node22Title: 'Résultats prouvés',
  node22Desc: "Nous avons déployé des systèmes d'automatisation dans la santé, le e-commerce et les services — avec des résultats mesurables et documentés.",
  node23Title: 'Déploiement rapide',
  node23Desc: "Nos frameworks éprouvés et notre architecture solide nous permettent de livrer des automatisations prêtes pour la production plus vite que le développement traditionnel — sans compromis.",
  nodeR1Title: 'Économies détaillées',
  nodeR1Desc: "20+ heures économisées par semaine = des milliers récupérés chaque mois. Nous calculons les chiffres exacts pour votre entreprise avant de commencer — pour que vous connaissiez le ROI avant de dépenser un centime.",
  nodeR2Title: 'Suivi en temps réel',
  nodeR2Desc: "Des tableaux de bord personnalisés affichent les exécutions d'automatisation, le temps gagné, les erreurs détectées et les revenus générés — en temps réel.",
  nodeR3Title: "Plus de revenus grâce à l'IA",
  nodeR3Desc: "Suivi plus rapide + qualification des leads 24/7 = plus de deals conclus. La plupart des clients constatent une croissance mesurable du pipeline dans les 30 jours suivant le lancement.",
  nodeR4Title: "Rapport d'efficacité post-lancement",
  nodeR4Desc: 'Après le lancement, nous fournissons un rapport détaillé montrant les gains de productivité, les réductions de coûts et les améliorations de flux de travail.',
  nodeR5Title: 'Croître sans recruter',
  nodeR5Desc: "L'IA produit le travail de 2 à 3 employés à temps plein — à une fraction du coût. Zéro onboarding, zéro arrêt maladie, zéro turnover.",
  nodeR6Title: 'Zéro erreur manuelle',
  nodeR6Desc: "Les erreurs manuelles de saisie coûtent des milliers aux entreprises chaque année. L'automatisation détecte les erreurs avant qu'elles ne causent des dommages.",
  node24Title: 'ROI mesurable',
  node24Desc: "Chaque système que nous construisons est mesuré selon des KPIs clairs. Vous voyez le retour sur investissement dès le premier mois — pas un trimestre plus tard.",
  testimonialsTitle: "Ce qu'ils disent",
  testimonialsOpen: 'Ouvrir',
  goToReview: "Voir l'avis",
  whyUsTitle: 'Pourquoi nous ?',
  reasons: [
    'Experts en IA & Automatisation',
    'Approche orientée résultats',
    'Solutions sur mesure',
    'Tableaux de bord personnalisés',
  ],
  reasonsDesc: [
    "Nous sommes spécialisés dans les intégrations IA avancées, le prompt engineering et les architectures d'automatisation évolutives.",
    "Chaque système est construit autour d'un impact métier mesurable — croissance des revenus, gain de temps et réduction des coûts.",
    "Contrairement aux agences basées sur des templates, nous construisons une logique backend flexible qui évolue avec votre entreprise.",
    'Suivez les gains de productivité, les économies et les performances d\'automatisation en temps réel.',
  ],
  integrationsLabel: '250+ intégrations',
  statHrs: 'h économisées / semaine',
  statAvailability: 'disponibilité',
  statIntegrations: 'intégrations',
  customBuilt: 'Jayden Mikus – Expert en Automatisation IA',
  customBuiltDesc: "Je suis spécialisé dans la transformation des opérations manuelles en moteurs de revenus autonomes. Chaque système est entièrement fait pour vous — conçu, construit, connecté et livré prêt à fonctionner. Les entreprises avec lesquelles je travaille récupèrent 20+ heures par semaine, dès la première semaine.",
  rapidDeployment: "Concentrez-vous sur votre croissance pendant que vos systèmes gèrent l'opérationnel.",
  workWithUs: 'Comment ça marche',
  workWithUsDesc: 'Quatre étapes simples. On gère toute la partie technique — vous avez juste besoin d\'être là pour l\'appel, on s\'occupe du reste.',
  bookCall: 'Réserver un appel gratuit',
  planStep1: '1. Appel : 30 min pour comprendre votre activité et où le temps se perd.',
  planStep2: '2. Plan : On conçoit un système fait exactement pour votre façon de travailler.',
  planStep3: '3. Construction : On construit et connecte tout — vous ne touchez pas une ligne de code.',
  planStep4: '4. Live : Votre système se met en route et commence à travailler pour vous.',
  growthMappingCall: 'Appel stratégique gratuit',
  growthMappingDesc: 'Pas de discours de vente. Pas de jargon technique. Juste une conversation honnête sur là où l\'IA peut vraiment vous faire gagner du temps et de l\'argent. Comprend :',
  duration: '30 Min',
  locale: 'fr-FR',
  analysisStep: 'Choisir un créneau : Fuseau horaire et heure',
  auditStep: 'Sur vous : Votre activité et ce que vous voulez changer',
  nextSteps: 'Confirmer : Réserver votre place',
  agencyNote: "Pour les entrepreneurs qui en ont assez de tout faire manuellement.",
  firstName: 'Prénom',
  lastName: 'Nom',
  email: 'Adresse e-mail',
  phone: 'Numéro de téléphone',
  revenueRange: 'Revenu mensuel',
  selectRevenueRange: 'Sélectionner une plage',
  website: "Site web de l'entreprise",
  businessDescription: 'Décrivez vos processus actuels et vos principaux obstacles',
  businessDescriptionPlaceholder: 'Expliquez vos processus manuels, outils utilisés et objectifs de croissance...',
  reason: "Objectif principal avec l'IA ?",
  back: 'Retour',
  submit: 'Réserver mon appel',
  submitting: 'Envoi en cours...',
  bookingError: 'Erreur lors de l\'envoi. Veuillez réessayer.',
  navHome: 'HALOVISION',
  navVideo: 'VIDEO',
  navWork: 'EXEMPLES',
  navResults: 'RÉSULTATS',
  navProcess: 'PLAN',
  navAbout: 'À PROPOS',
  navBook: 'RÉSERVER',
  splashHeadline: 'Récupérez des heures. Augmentez votre chiffre.',
  splashSub: "L'automatisation IA qui tient vraiment ses promesses.",
  splashCta: 'Entrer maintenant',
}

export const translations: Record<Language, Translations> = { en, de, fr }

export function t(lang: Language): Translations {
  return translations[lang]
}

export function getNodeContent(id: number, tr: Translations): { title: string; desc: string } {
  const map: Record<number, { title: string; desc: string }> = {
    1:  { title: tr.node1Title,   desc: tr.node1Desc },
    2:  { title: tr.node2Title,   desc: tr.node2Desc },
    3:  { title: tr.node3Title,   desc: tr.node3Desc },
    4:  { title: tr.node4Title,   desc: tr.node4Desc },
    5:  { title: tr.node5Title,   desc: tr.node5Desc },
    6:  { title: tr.node6Title,   desc: tr.node6Desc },
    7:  { title: tr.nodeQ1Title,  desc: tr.nodeQ1Desc },
    8:  { title: tr.nodeQ2Title,  desc: tr.nodeQ2Desc },
    9:  { title: tr.nodeQ3Title,  desc: tr.nodeQ3Desc },
    10: { title: tr.nodeQ4Title,  desc: tr.nodeQ4Desc },
    11: { title: tr.nodeQ5Title,  desc: tr.nodeQ5Desc },
    12: { title: tr.nodeQ6Title,  desc: tr.nodeQ6Desc },
    13: { title: tr.nodeR1Title,  desc: tr.nodeR1Desc },
    14: { title: tr.nodeR2Title,  desc: tr.nodeR2Desc },
    15: { title: tr.nodeR3Title,  desc: tr.nodeR3Desc },
    16: { title: tr.nodeR4Title,  desc: tr.nodeR4Desc },
    17: { title: tr.nodeR5Title,  desc: tr.nodeR5Desc },
    18: { title: tr.nodeR6Title,  desc: tr.nodeR6Desc },
    19: { title: tr.node19Title,  desc: tr.node19Desc },
    20: { title: tr.node20Title,  desc: tr.node20Desc },
    21: { title: tr.node21Title,  desc: tr.node21Desc },
    22: { title: tr.node22Title,  desc: tr.node22Desc },
    23: { title: tr.node23Title,  desc: tr.node23Desc },
    24: { title: tr.node24Title,  desc: tr.node24Desc },
  }
  // agents section: ids 1-6 map to nodeA titles
  const agentMap: Record<number, { title: string; desc: string }> = {
    1: { title: tr.nodeA1Title, desc: tr.nodeA1Desc },
    2: { title: tr.nodeA2Title, desc: tr.nodeA2Desc },
    3: { title: tr.nodeA3Title, desc: tr.nodeA3Desc },
    4: { title: tr.nodeA4Title, desc: tr.nodeA4Desc },
    5: { title: tr.nodeA5Title, desc: tr.nodeA5Desc },
    6: { title: tr.nodeA6Title, desc: tr.nodeA6Desc },
  }
  // Use agent names for ids 1-6 (they are the example agents in the agents filter)
  return agentMap[id] || map[id] || { title: `Node ${id}`, desc: '' }
}
