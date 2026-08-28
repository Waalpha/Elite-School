import type { SoftwarePackageInfo, PosDemoProduct, PlatformPlan } from "../types";

export const DAVETECH_PACKAGES: SoftwarePackageInfo[] = [
  {
    id: "school_erp",
    name: "School ERP & Multi-Tenant Educational Cloud",
    tagline: "The all-in-one operating system for Pre-Primary, Primary CBC, Junior Secondary, TVET colleges & Universities.",
    description:
      "A battle-tested, cloud-native educational management system designed specifically for Kenyan and African institutions. Manage everything from CBC formative & summative assessments to multi-votehead fee collections with automated M-Pesa reconciliation, QR attendance tracking, and multi-campus branches.",
    badge: "Flagship OS",
    accentColor: "indigo",
    heroImage: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1000&auto=format&fit=crop&q=80",
    pricingStarting: "KES 18,500 / term",
    targetAudience: [
      "CBC Primary & Junior Schools",
      "Senior High Schools (8-4-4 & CBC)",
      "TVET & Technical Colleges",
      "Multi-Campus Universities & Academies",
    ],
    highlightMetrics: [
      { label: "Assessment Time Saved", value: "85%" },
      { label: "Fee Collection Efficiency", value: "99.4%" },
      { label: "Tenant Isolation Security", value: "100%" },
      { label: "Active Student Profiles", value: "12,800+" },
    ],
    capabilities: [
      "CBC Rubrics & Formative Assessment (EE, ME, AE, BE) + KNEC & TVET Modular Grading",
      "Multi-Votehead Fee Management, Invoicing, Receipts & M-Pesa STK Automated Reconciliation",
      "Smart QR-Code Student ID Generation & Mobile Attendance Gate Verification",
      "AI-Optimized Multi-Stream Timetable Scheduling with Zero Room & Teacher Conflicts",
      "Multi-Campus & Branch Synchronization with Consolidated Executive Financials",
      "Instant Self-Updating Public School Website & Online Admissions Application Portal",
      "Custom Subdomain (e.g. staustin.davetecherp.com) & Custom Domain Support",
      "Role-Based Access for Administrators, Educators, Bursars, Students & Parents",
    ],
    features: [
      {
        title: "CBC & TVET Grading Engines",
        description:
          "Pre-configured with Kenya National Curriculum competencies, strand-based scoring, and automated printable report cards.",
        icon: "GraduationCap",
      },
      {
        title: "Fee Accounting & M-Pesa Daraja",
        description:
          "Real-time tuition fee tracking, payment receipts, balance statements, and automatic SMS notifications to parents.",
        icon: "CreditCard",
      },
      {
        title: "QR Code Attendance & ID Cards",
        description:
          "Instant gate scanning with student photo verification, automated parent arrival alerts, and staff attendance logs.",
        icon: "QrCode",
      },
      {
        title: "Multi-Campus Cloud Architecture",
        description:
          "Effortlessly manage main campuses, constituent colleges, and regional branches from a single unified super-admin dashboard.",
        icon: "Building2",
      },
    ],
  },
  {
    id: "pos_system",
    name: "Point of Sale (POS) & Retail Inventory Cloud",
    tagline: "High-speed checkout, barcode scanning, M-Pesa STK push, and real-time multi-branch stock control.",
    description:
      "Engineered for modern retail, wholesale, supermarkets, pharmacies, hardware shops, and restaurants. Accelerate cashier speed with lightning-fast barcode processing, multi-register support, automated M-Pesa payment validation, thermal receipt printing, and comprehensive stock replenishment alerts.",
    badge: "High Velocity",
    accentColor: "emerald",
    heroImage: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1000&auto=format&fit=crop&q=80",
    pricingStarting: "KES 14,000 / one-time + KES 1,500/mo cloud",
    targetAudience: [
      "Supermarkets & Minimarts",
      "Pharmacies & Chemists",
      "Hardware & Electrical Stores",
      "Boutiques & Apparel Shops",
      "Restaurants, Cafes & Bars",
      "Wholesale Distributors",
    ],
    highlightMetrics: [
      { label: "Checkout Speed", value: "< 3.2 sec" },
      { label: "Inventory Accuracy", value: "99.9%" },
      { label: "M-Pesa STK Confirmation", value: "Instant" },
      { label: "Supported POS Hardware", value: "Universal" },
    ],
    capabilities: [
      "Ultra-Fast Barcode Scanning & Touchscreen POS Register Interface",
      "Integrated M-Pesa STK Push, Cash, Card, and Split Payment Checkout",
      "Automated Thermal Receipt Printing (58mm & 80mm ESC/POS) with QR Verification",
      "Real-time Multi-Warehouse Stock Tracking with Batch, Serial & Expiry Date Alerts",
      "Automated End-of-Day (Z-Report) Cashier Reconciliation & Shift Auditing",
      "Low Stock Re-order Triggers & Supplier Purchase Order Generation",
      "Customer Loyalty Points, Discount Rules & Gift Voucher Management",
      "Works on Windows, Android POS (Sunmi), Tablets, iPads & Standard Laptops",
    ],
    features: [
      {
        title: "Touch & Barcode Quick Checkout",
        description:
          "Designed for fast cashier throughput with hotkey categories, instant barcode matching, and split-second item lookups.",
        icon: "Zap",
      },
      {
        title: "Automated M-Pesa STK Push",
        description:
          "No manual reference typing. The register sends an instant prompt to the customer's phone and automatically closes the bill upon PIN entry.",
        icon: "Smartphone",
      },
      {
        title: "Stock & Expiry Management",
        description:
          "Track unit costs, profit margins, FIFO inventory valuation, stock transfers between stores, and expiry date warnings.",
        icon: "PackageCheck",
      },
      {
        title: "Z-Reports & Financial Analytics",
        description:
          "End-of-day revenue reconciliation, top-selling product reports, profit margin analysis, and cashier cash drawer balancing.",
        icon: "BarChart3",
      },
    ],
  },
  {
    id: "business_website",
    name: "High-Converting Business Websites & CMS",
    tagline: "Stunning, ultra-fast corporate websites with custom domains, automated SSL, and built-in lead generation.",
    description:
      "Transform your business online presence with an elite, responsive corporate website. Built on modern Jamstack and React frameworks for 99+ Google Lighthouse performance, local SEO dominance, built-in blog & news management, appointment scheduling, and automated WhatsApp & email inquiry funnels.",
    badge: "Digital Growth",
    accentColor: "sky",
    heroImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1000&auto=format&fit=crop&q=80",
    pricingStarting: "KES 24,500 / complete setup",
    targetAudience: [
      "Corporate Enterprises & Law Firms",
      "Hospitals, Clinics & Healthcare Providers",
      "Real Estate & Property Developers",
      "Hotels, Resorts & Tour Companies",
      "Tech Startups & SaaS Companies",
      "Consulting & Professional Services",
    ],
    highlightMetrics: [
      { label: "Google PageSpeed Score", value: "98+" },
      { label: "Lead Conversion Increase", value: "+140%" },
      { label: "Automated SSL Uptime", value: "100%" },
      { label: "Average Launch Time", value: "3-5 Days" },
    ],
    capabilities: [
      "Custom Brand Identity, Typographic Systems & Responsive UI Architecture",
      "Custom Domain Binding (e.g. www.yourcompany.co.ke) with Automated Free SSL",
      "Zero-Code Content Management System (CMS) for Updating News, Team, Services & Blogs",
      "Integrated Lead Capture Forms, Inquiry Inboxes & Instant Email/SMS Notifications",
      "Direct WhatsApp Business Live Chat Widget with Pre-filled Lead Context",
      "Search Engine Optimization (SEO) Metadata, OpenGraph & Schema.org Structured Data",
      "Google Analytics 4 & Meta Pixel Integration for Accurate Conversion Tracking",
      "Interactive Product / Service Showcases with Filterable Portfolios & Media Galleries",
    ],
    features: [
      {
        title: "Ultra-Fast PageSpeed Performance",
        description:
          "Engineered for sub-second loading speeds on mobile and desktop networks, directly boosting your Google search ranking.",
        icon: "Gauge",
      },
      {
        title: "Visual CMS & Content Editor",
        description:
          "Update your company announcements, staff profiles, services, and photo galleries without writing a single line of code.",
        icon: "LayoutTemplate",
      },
      {
        title: "Lead Capture & WhatsApp Integration",
        description:
          "Turn visitors into paying customers with optimized contact funnels, instant WhatsApp buttons, and CRM inquiry sync.",
        icon: "MessageSquare",
      },
      {
        title: "Custom Domain & Enterprise Hosting",
        description:
          "Hosted on global high-availability cloud infrastructure with DDOS protection, automated SSL certificates, and 99.99% uptime.",
        icon: "Globe",
      },
    ],
  },
  {
    id: "custom_software",
    name: "Custom Software & Cloud Engineering",
    tagline: "Tailor-made web applications, mobile apps (iOS & Android), FinTech APIs, and enterprise cloud migrations.",
    description:
      "When off-the-shelf software doesn't fit your exact business workflows, Davetech engineers bespoke, mission-critical digital systems. From custom mobile applications with M-Pesa Daraja and banking APIs to enterprise workflow automation and scalable cloud microservices, we build reliable software that scales.",
    badge: "Bespoke Engineering",
    accentColor: "purple",
    heroImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=80",
    pricingStarting: "Custom Scope & Milestone Tiers",
    targetAudience: [
      "Fast-Growing Scale-ups & Enterprises",
      "Financial Services & Micro-lenders (SACCOs, MFI)",
      "Logistics, Fleet & Supply Chain Operators",
      "Healthcare & Diagnostic Laboratories",
      "Government & NGO Digital Transformation",
      "Bespoke SaaS Startups",
    ],
    highlightMetrics: [
      { label: "Deployment Success Rate", value: "100%" },
      { label: "API Response Latency", value: "< 80ms" },
      { label: "Code Test Coverage", value: "95%+" },
      { label: "Ongoing Cloud SLA", value: "99.98%" },
    ],
    capabilities: [
      "Cross-Platform Mobile Application Development (Flutter, React Native for iOS & Android)",
      "Bespoke Web Applications & Real-time Collaborative Portals with Role-Based Access",
      "FinTech Integrations: M-Pesa Daraja 3.0 (C2B, B2C, STK, Reversals), Banks & Cards",
      "USSD, Bulk SMS Gateways & WhatsApp Business API Automations",
      "Cloud Infrastructure Architecture (Google Cloud Platform, Docker, Kubernetes, PostgreSQL)",
      "Legacy Database & Excel Spreadsheet Modernization into Secure Cloud Platforms",
      "AI & Machine Learning Workflow Automation (Document Processing, OCR, Natural Language)",
      "Full Source Code Ownership, Comprehensive Documentation & Dedicated SLA Support",
    ],
    features: [
      {
        title: "Mobile App Development",
        description:
          "Sleek, fluid iOS and Android mobile apps with offline persistence, push notifications, and biometric authentication.",
        icon: "Smartphone",
      },
      {
        title: "FinTech & API Ecosystems",
        description:
          "Robust M-Pesa Daraja, bank API, and payment gateway connectors with cryptographic validation and audit safety.",
        icon: "ShieldAlert",
      },
      {
        title: "Cloud Native & Microservices",
        description:
          "Elastic serverless backends and distributed PostgreSQL/NoSQL databases that effortlessly handle millions of requests.",
        icon: "Cloud",
      },
      {
        title: "Workflow & Data Automation",
        description:
          "Eliminate manual paperwork with automated report generators, scheduled payroll triggers, and customized analytics.",
        icon: "Cpu",
      },
    ],
  },
];

export const POS_DEMO_PRODUCTS: PosDemoProduct[] = [
  {
    id: "pos_prod_1",
    name: "Fresh Whole Milk 500ml",
    category: "Dairy & Beverage",
    price: 65,
    barcode: "616110001234",
    stock: 48,
    taxRate: 0.16,
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "pos_prod_2",
    name: "Premium Sliced White Bread 400g",
    category: "Bakery",
    price: 70,
    barcode: "616110005678",
    stock: 32,
    taxRate: 0.16,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "pos_prod_3",
    name: "Pure Natural Honey 500g Jar",
    category: "Groceries",
    price: 450,
    barcode: "616110009912",
    stock: 15,
    taxRate: 0.16,
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "pos_prod_4",
    name: "Instant Roasted Coffee 200g",
    category: "Beverage",
    price: 380,
    barcode: "616110004455",
    stock: 24,
    taxRate: 0.16,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "pos_prod_5",
    name: "Organic Basmati Rice 2kg",
    category: "Groceries",
    price: 420,
    barcode: "616110007788",
    stock: 60,
    taxRate: 0,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "pos_prod_6",
    name: "Mineral Drinking Water 1 Litre",
    category: "Dairy & Beverage",
    price: 50,
    barcode: "616110003322",
    stock: 120,
    taxRate: 0.16,
    image: "https://images.unsplash.com/photo-1560023907-5f339617ea30?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "pos_prod_7",
    name: "USB-C Fast Charging Cable 1.5m",
    category: "Electronics",
    price: 350,
    barcode: "616110006611",
    stock: 18,
    taxRate: 0.16,
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "pos_prod_8",
    name: "Antibacterial Hand Soap 250ml",
    category: "Health & Household",
    price: 180,
    barcode: "616110008899",
    stock: 45,
    taxRate: 0.16,
    image: "https://images.unsplash.com/photo-1608248597359-bb4f60f6db9c?w=200&auto=format&fit=crop&q=80",
  },
];

export const CASE_STUDIES = [
  {
    id: "case_1",
    client: "St. Austin Pre-Primary & Junior Secondary",
    package: "School ERP",
    location: "Nairobi, Kenya",
    result: "100% automated CBC termly report cards & KES 4.8M fee collections streamlined with instant M-Pesa receipts.",
    quote: "Davetech School ERP eliminated our end-of-term chaos. Teachers submit rubric assessments in minutes and parents receive report cards via WhatsApp and portal.",
    author: "Sister Margaret W.",
    role: "Head of School",
    metrics: ["900+ Students Managed", "Zero Grading Errors", "100% Fee Reconciliation"],
  },
  {
    id: "case_2",
    client: "Apex Mart & Wholesale Distributors",
    package: "POS & Inventory System",
    location: "Eldoret & Kisumu",
    result: "Unified 4 retail supermarket branches with central stock replenishment, cutting checkout queue times by 55%.",
    quote: "Cashiers love the instant M-Pesa STK push. No customer waits for manual receipt confirmation, and end-of-day Z-reports match our bank deposits to the cent.",
    author: "David K. Chemosit",
    role: "Managing Director",
    metrics: ["4 Branches Linked", "12 POS Registers", "< 3s Checkout Time"],
  },
  {
    id: "case_3",
    client: "Meridian Legal & Corporate Advocates",
    package: "Business Website & CMS",
    location: "Upper Hill, Nairobi",
    result: "Generated 340+ qualified corporate legal inquiries within 90 days of launching the new website.",
    quote: "Our new website elevated our prestige with international clients. The automated appointment booking and Google PageSpeed score of 99 is unmatched.",
    author: "Adv. Brian Omondi",
    role: "Senior Partner",
    metrics: ["340+ Direct Inquiries", "99 Lighthouse Score", "3.2x Lead Growth"],
  },
  {
    id: "case_4",
    client: "TransAfriq Logistics & Haulage Ltd",
    package: "Custom Software",
    location: "Mombasa & Kampala",
    result: "Engineered real-time fleet GPS tracking, digital waybill signing, and driver M-Pesa expense disbursements.",
    quote: "Davetech developed our custom cargo logistics app ahead of schedule. Fuel tracking and cargo waybill signing are now 100% paperless.",
    author: "Eng. Fatuma Hassan",
    role: "Chief Technology Officer",
    metrics: ["85 Trucks Connected", "100% Paperless Flow", "KES 1.2M Mo. Fuel Saved"],
  },
];
