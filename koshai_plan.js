const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageBreak, LevelFormat,
  TabStopType, TabStopPosition, ExternalHyperlink
} = require('docx');
const fs = require('fs');

const GREEN = "1D6B45";
const LIGHT_GREEN = "E8F5EE";
const DARK = "1A1A1A";
const GRAY = "555555";
const LIGHT_GRAY = "F5F5F5";
const MID_GRAY = "CCCCCC";
const WHITE = "FFFFFF";
const AMBER = "BA7517";
const LIGHT_AMBER = "FFF8E7";
const BLUE = "1A5F9E";
const LIGHT_BLUE = "EBF3FB";
const RED = "A32D2D";
const LIGHT_RED = "FBEAEA";

const border = (color = MID_GRAY) => ({ style: BorderStyle.SINGLE, size: 1, color });
const borders = (color = MID_GRAY) => ({ top: border(color), bottom: border(color), left: border(color), right: border(color) });
const noBorder = () => ({ style: BorderStyle.NONE, size: 0, color: "FFFFFF" });
const noBorders = () => ({ top: noBorder(), bottom: noBorder(), left: noBorder(), right: noBorder() });

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 160 },
    children: [new TextRun({ text, bold: true, size: 36, color: DARK, font: "Arial" })]
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: GREEN, space: 4 } },
    children: [new TextRun({ text, bold: true, size: 28, color: GREEN, font: "Arial" })]
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 80 },
    children: [new TextRun({ text, bold: true, size: 24, color: DARK, font: "Arial" })]
  });
}

function h4(text) {
  return new Paragraph({
    spacing: { before: 160, after: 60 },
    children: [new TextRun({ text, bold: true, size: 22, color: GRAY, font: "Arial" })]
  });
}

function para(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 60, after: 100 },
    children: [new TextRun({ text, size: 22, color: DARK, font: "Arial", ...opts })]
  });
}

function code(text) {
  return new Paragraph({
    spacing: { before: 40, after: 40 },
    shading: { fill: "1E1E1E", type: ShadingType.CLEAR },
    border: { left: { style: BorderStyle.SINGLE, size: 12, color: GREEN, space: 6 } },
    indent: { left: 360 },
    children: [new TextRun({ text, size: 18, color: "D4D4D4", font: "Courier New" })]
  });
}

function codeBlock(lines) {
  return lines.map(l => code(l));
}

function bullet(text, level = 0) {
  return new Paragraph({
    numbering: { reference: "bullets", level },
    spacing: { before: 40, after: 40 },
    children: [new TextRun({ text, size: 22, color: DARK, font: "Arial" })]
  });
}

function numbered(text, level = 0) {
  return new Paragraph({
    numbering: { reference: "numbers", level },
    spacing: { before: 40, after: 40 },
    children: [new TextRun({ text, size: 22, color: DARK, font: "Arial" })]
  });
}

function spacer(n = 1) {
  return Array.from({ length: n }, () => new Paragraph({ children: [new TextRun("")] }));
}

function colorBox(text, fillColor, textColor = DARK) {
  return new Paragraph({
    spacing: { before: 120, after: 120 },
    shading: { fill: fillColor, type: ShadingType.CLEAR },
    border: { left: { style: BorderStyle.SINGLE, size: 16, color: GREEN, space: 6 } },
    indent: { left: 200, right: 200 },
    children: [new TextRun({ text, size: 22, color: textColor, bold: true, font: "Arial" })]
  });
}

function phaseTable(rows) {
  const totalWidth = 9360;
  const col1 = 2200, col2 = 4360, col3 = 1400, col4 = 1400;
  return new Table({
    width: { size: totalWidth, type: WidthType.DXA },
    columnWidths: [col1, col2, col3, col4],
    rows: rows.map((r, i) => new TableRow({
      children: r.map((cell, j) => {
        const isHeader = i === 0;
        const widths = [col1, col2, col3, col4];
        return new TableCell({
          borders: borders(isHeader ? GREEN : MID_GRAY),
          width: { size: widths[j], type: WidthType.DXA },
          shading: { fill: isHeader ? GREEN : (i % 2 === 0 ? LIGHT_GRAY : WHITE), type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [new Paragraph({
            children: [new TextRun({
              text: cell,
              size: isHeader ? 20 : 19,
              bold: isHeader,
              color: isHeader ? WHITE : DARK,
              font: "Arial"
            })]
          })]
        });
      })
    }))
  });
}

function simpleTable(headers, rows, colWidths) {
  const totalWidth = 9360;
  const cols = colWidths || Array(headers.length).fill(Math.floor(totalWidth / headers.length));
  const allRows = [headers, ...rows];
  return new Table({
    width: { size: totalWidth, type: WidthType.DXA },
    columnWidths: cols,
    rows: allRows.map((r, i) => new TableRow({
      children: r.map((cell, j) => {
        const isHeader = i === 0;
        return new TableCell({
          borders: borders(isHeader ? GREEN : MID_GRAY),
          width: { size: cols[j], type: WidthType.DXA },
          shading: { fill: isHeader ? GREEN : (i % 2 === 0 ? LIGHT_GRAY : WHITE), type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [new Paragraph({
            children: [new TextRun({
              text: String(cell),
              size: isHeader ? 20 : 19,
              bold: isHeader,
              color: isHeader ? WHITE : DARK,
              font: "Arial"
            })]
          })]
        });
      })
    }))
  });
}

const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }, {
          level: 1, format: LevelFormat.BULLET, text: "\u25E6", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 1080, hanging: 360 } } }
        }]
      },
      {
        reference: "numbers",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }, {
          level: 1, format: LevelFormat.DECIMAL, text: "%1.%2.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 1080, hanging: 360 } } }
        }]
      }
    ]
  },
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: DARK },
        paragraph: { spacing: { before: 360, after: 160 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: GREEN },
        paragraph: { spacing: { before: 280, after: 120 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: DARK },
        paragraph: { spacing: { before: 200, after: 80 }, outlineLevel: 2 } },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    headers: {
      default: new Header({
        children: [
          new Paragraph({
            border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: GREEN, space: 6 } },
            spacing: { after: 120 },
            children: [
              new TextRun({ text: "Koshai Finder Bangladesh  —  Complete Development Plan", size: 18, color: GRAY, font: "Arial" }),
              new TextRun({ text: "\t", size: 18 }),
              new TextRun({ text: "Confidential", size: 18, color: GREEN, font: "Arial", bold: true })
            ],
            tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }]
          })
        ]
      })
    },
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            border: { top: { style: BorderStyle.SINGLE, size: 4, color: GREEN, space: 6 } },
            spacing: { before: 120 },
            children: [
              new TextRun({ text: "Koshai Finder  |  Android (Kotlin) + Firebase  |  Bangladesh", size: 16, color: GRAY, font: "Arial" })
            ],
            tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }]
          })
        ]
      })
    },
    children: [

      // ── COVER ──────────────────────────────────────────────────────────────
      new Paragraph({
        spacing: { before: 1440, after: 240 },
        shading: { fill: GREEN, type: ShadingType.CLEAR },
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: " ", size: 4 })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 0 },
        shading: { fill: GREEN, type: ShadingType.CLEAR },
        children: [new TextRun({ text: "Koshai Finder", size: 72, bold: true, color: WHITE, font: "Arial" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 80, after: 0 },
        shading: { fill: GREEN, type: ShadingType.CLEAR },
        children: [new TextRun({ text: "কোশাই ফাইন্ডার বাংলাদেশ", size: 36, color: "C8F0DC", font: "Arial" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 120, after: 80 },
        shading: { fill: GREEN, type: ShadingType.CLEAR },
        children: [new TextRun({ text: "Complete Product, Technical & Pipeline Document", size: 26, color: "A8DCC0", font: "Arial" })]
      }),
      new Paragraph({
        spacing: { before: 0, after: 1440 },
        shading: { fill: GREEN, type: ShadingType.CLEAR },
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: " ", size: 4 })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 80 },
        children: [new TextRun({ text: "Android Studio  |  Kotlin  |  Firebase  |  Google Maps SDK", size: 22, color: GRAY, font: "Arial" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 80 },
        children: [new TextRun({ text: "Target Market: Bangladesh  |  Peak Use Case: Eid ul-Adha", size: 22, color: GRAY, font: "Arial" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 80 },
        children: [new TextRun({ text: "Total Features: 18  |  Phases: 4  |  Estimated Timeline: 24 Weeks", size: 22, color: GRAY, font: "Arial" })]
      }),
      new Paragraph({ children: [new PageBreak()] }),

      // ── 1. EXECUTIVE SUMMARY ───────────────────────────────────────────────
      h1("1. Executive Summary"),
      para("During Eid ul-Adha, millions of Bangladeshi families sacrifice animals (cows, goats, sheep) as part of religious observance. Finding a skilled and available koshai (animal slaughterer) becomes extremely difficult — demand spikes in a window of just 24–48 hours, communication is entirely word-of-mouth, and no-shows are common. Families waste hours searching, and skilled koshais lose potential income due to poor scheduling."),
      para("Koshai Finder solves this with a two-sided marketplace app: users find, book, and pay verified koshais near them; koshais manage their schedule, availability, and earnings — all from a smartphone. Built on Android (Kotlin) with Firebase as the backend, the app targets the 170+ million population of Bangladesh, with peak use during the three-day Eid period."),
      ...spacer(1),

      simpleTable(
        ["Metric", "Value"],
        [
          ["Platform", "Android (minSDK 21 — covers 98% of Bangladeshi devices)"],
          ["Language", "Kotlin"],
          ["Backend", "Firebase (Auth, Firestore, Realtime DB, FCM, Storage)"],
          ["Maps", "Google Maps SDK + Google Places API"],
          ["Payment", "bKash & Nagad payment gateway (Phase 3)"],
          ["Total screens", "~22 screens (user side: 12, koshai side: 10)"],
          ["Total features", "18 features across 4 release phases"],
          ["Timeline", "24 weeks (6 weeks per phase)"],
          ["Primary language", "Bangla (বাংলা) UI with English admin panel"],
        ],
        [3000, 6360]
      ),
      new Paragraph({ children: [new PageBreak()] }),

      // ── 2. PROBLEM & SOLUTION ──────────────────────────────────────────────
      h1("2. Problem Statement & Solution"),
      h2("2.1 The Problem"),
      bullet("Demand for koshais spikes to 10–50x normal in a 24-hour window during Eid ul-Adha"),
      bullet("No centralized platform to find, verify, or book koshais in Bangladesh"),
      bullet("Word-of-mouth only — families rely on neighbors or mosque connections"),
      bullet("Double bookings and no-shows are widespread, leaving families stranded on Eid morning"),
      bullet("Koshais cannot manage multiple bookings efficiently — no scheduling tools"),
      bullet("No price transparency — users often overpay or get quoted unfair rates last minute"),
      bullet("No trust mechanism — users cannot verify a koshai's skill, hygiene, or legitimacy"),
      ...spacer(1),
      h2("2.2 The Solution"),
      bullet("Two-sided marketplace: users book, koshais accept — all inside one app"),
      bullet("Slot-based scheduling prevents double booking and manages Eid-morning rush"),
      bullet("Verified badge system (NID + trade certificate) builds trust"),
      bullet("In-app payment with bKash/Nagad eliminates cash ambiguity and reduces no-shows"),
      bullet("Ratings and reviews create accountability and surface top performers"),
      bullet("Real-time availability and live tracking give users confidence on the day"),
      new Paragraph({ children: [new PageBreak()] }),

      // ── 3. TECH STACK ──────────────────────────────────────────────────────
      h1("3. Full Technology Stack"),
      simpleTable(
        ["Layer", "Technology", "Purpose"],
        [
          ["IDE", "Android Studio Hedgehog+", "Project scaffolding, debugging, emulator"],
          ["Language", "Kotlin 1.9+", "All Android app code"],
          ["UI framework", "Material Design 3 + ViewBinding", "Screens, components, navigation"],
          ["Navigation", "Jetpack Navigation Component", "Fragment-based screen routing"],
          ["Architecture", "MVVM + Repository pattern", "Separation of concerns, testability"],
          ["Auth", "Firebase Authentication (Phone OTP)", "Login for both users and koshais"],
          ["Database", "Cloud Firestore", "Users, koshais, bookings, reviews"],
          ["Realtime", "Firebase Realtime Database", "Live location, booking status, chat"],
          ["Push alerts", "Firebase Cloud Messaging (FCM)", "Booking confirmations, reminders"],
          ["File storage", "Firebase Storage", "Profile photos, NID scans"],
          ["Backend logic", "Firebase Cloud Functions (Node.js)", "Notifications, fraud detection, reminders"],
          ["Maps", "Google Maps SDK for Android", "Koshai pins, live tracking"],
          ["Location", "Google Play Services Location API", "User + koshai GPS coordinates"],
          ["Payment", "bKash PGW API + Nagad API", "Booking deposits, fee collection"],
          ["Image loading", "Glide 4.x", "Profile photos, review images"],
          ["HTTP", "Retrofit 2 + OkHttp", "bKash/Nagad API calls"],
          ["DI", "Hilt (Dagger)", "Dependency injection"],
          ["Async", "Kotlin Coroutines + Flow", "Background tasks, reactive UI"],
          ["Testing", "JUnit 4 + Espresso + MockK", "Unit and UI tests"],
          ["CI/CD", "GitHub Actions", "Automated APK builds + Play Store upload"],
        ],
        [2400, 3000, 3960]
      ),
      new Paragraph({ children: [new PageBreak()] }),

      // ── 4. FIRESTORE SCHEMA ────────────────────────────────────────────────
      h1("4. Complete Firebase Data Architecture"),
      h2("4.1 Firestore Collections Schema"),

      h3("Collection: users"),
      ...codeBlock([
        "users/{uid}",
        "{",
        "  uid: String,               // Firebase Auth UID",
        "  name: String,              // Full name",
        "  phone: String,             // +8801XXXXXXXXX",
        "  photoUrl: String,          // Firebase Storage URL",
        "  district: String,          // e.g. Narayanganj",
        "  upazila: String,           // Sub-district",
        "  fcmToken: String,          // For push notifications",
        "  createdAt: Timestamp,",
        "  referralCode: String,      // Unique invite code",
        "  referredBy: String,        // UID of referrer",
        "  credits: Number            // Discount credits in BDT",
        "}",
      ]),
      ...spacer(1),

      h3("Collection: koshais"),
      ...codeBlock([
        "koshais/{uid}",
        "{",
        "  uid: String,               // Firebase Auth UID",
        "  name: String,",
        "  phone: String,",
        "  photoUrl: String,",
        "  nidUrl: String,            // Firebase Storage: NID scan",
        "  tradeCertUrl: String,      // Firebase Storage: certificate (optional)",
        "  district: String,          // Primary coverage district",
        "  upazila: String,",
        "  coverageAreas: [String],   // List of additional upazilas covered",
        "  ratePerCow: Number,        // BDT",
        "  ratePerGoat: Number,       // BDT",
        "  ratePerSheep: Number,      // BDT",
        "  surgeMultiplier: Number,   // Default 1.0; up to 2.0 during Eid",
        "  status: String,            // available | busy | offline",
        "  isVerified: Boolean,       // Set by admin only",
        "  isEidMode: Boolean,        // Surge pricing active",
        "  rating: Number,            // Running average (0.0–5.0)",
        "  totalRatings: Number,      // Count of ratings received",
        "  totalJobs: Number,         // Completed bookings",
        "  lat: Number,               // Last known latitude",
        "  lng: Number,               // Last known longitude",
        "  locationUpdatedAt: Timestamp,",
        "  fcmToken: String,",
        "  earnings: Number,          // Lifetime BDT received",
        "  createdAt: Timestamp,",
        "  approvedAt: Timestamp,     // When admin verified",
        "  approvedBy: String         // Admin UID",
        "}",
      ]),
      ...spacer(1),

      h3("Collection: bookings"),
      ...codeBlock([
        "bookings/{bookingId}",
        "{",
        "  id: String,                // Auto-generated Firestore ID",
        "  userId: String,            // Booker UID",
        "  userName: String,",
        "  userPhone: String,",
        "  koshaiId: String,",
        "  koshaiName: String,",
        "  koshaiPhone: String,",
        "  district: String,",
        "  upazila: String,",
        "  address: String,           // Full delivery address",
        "  lat: Number,               // Booking location",
        "  lng: Number,",
        "  date: Timestamp,           // Scheduled Eid day",
        "  slot: String,              // e.g. 07:00-09:00",
        "  animalTypes: {",
        "    cow: Number,",
        "    goat: Number,",
        "    sheep: Number",
        "  },",
        "  estimatedDurationMins: Number,",
        "  rateBreakdown: {",
        "    perCow: Number,  perGoat: Number,  perSheep: Number,",
        "    surgeMultiplier: Number,  total: Number",
        "  },",
        "  depositPaid: Number,       // BDT paid upfront",
        "  paymentRef: String,        // bKash/Nagad transaction ID",
        "  status: String,            // pending|confirmed|en_route|arrived|completed|cancelled",
        "  cancelReason: String,",
        "  cancelledBy: String,       // user | koshai | admin",
        "  isGroupBooking: Boolean,",
        "  groupSessionId: String,    // Links to groupSessions collection",
        "  isTeamBooking: Boolean,",
        "  teamKoshaiIds: [String],",
        "  createdAt: Timestamp,",
        "  confirmedAt: Timestamp,",
        "  completedAt: Timestamp,",
        "  reminder24Sent: Boolean,",
        "  reminder2Sent: Boolean",
        "}",
      ]),
      ...spacer(1),

      h3("Collection: reviews"),
      ...codeBlock([
        "reviews/{reviewId}",
        "{",
        "  bookingId: String,",
        "  userId: String,",
        "  koshaiId: String,",
        "  rating: Number,            // 1–5",
        "  comment: String,",
        "  photoUrls: [String],       // Optional review photos",
        "  createdAt: Timestamp",
        "}",
      ]),
      ...spacer(1),

      h3("Collection: chats"),
      ...codeBlock([
        "chats/{bookingId}/messages/{messageId}    (Realtime Database)",
        "{",
        "  senderId: String,",
        "  senderName: String,",
        "  text: String,",
        "  timestamp: Long            // Unix millis",
        "}",
      ]),
      ...spacer(1),

      h3("Collection: groupSessions"),
      ...codeBlock([
        "groupSessions/{sessionId}",
        "{",
        "  organizerUid: String,",
        "  koshaiId: String,",
        "  sessionCode: String,       // 6-char join code",
        "  district: String,",
        "  slot: String,",
        "  date: Timestamp,",
        "  maxFamilies: Number,",
        "  joinedFamilies: [",
        "    { uid, name, animalTypes, contribution }",
        "  ],",
        "  travelFeeSplit: Number,    // Per-family share of travel cost",
        "  status: String,            // open | full | confirmed | completed",
        "  createdAt: Timestamp",
        "}",
      ]),
      ...spacer(1),

      h3("Collection: waitlists"),
      ...codeBlock([
        "waitlists/{koshaiId}/entries/{userId}",
        "{",
        "  userId: String,",
        "  userName: String,",
        "  userPhone: String,",
        "  preferredSlot: String,",
        "  joinedAt: Timestamp",
        "}",
      ]),
      ...spacer(1),

      h3("Realtime Database — live locations & koshai status"),
      ...codeBlock([
        "realtime_db/",
        "  locations/",
        "    {koshaiId}/",
        "      lat: Double",
        "      lng: Double",
        "      updatedAt: Long",
        "  bookingStatus/",
        "    {bookingId}: String      // pending|confirmed|en_route|arrived|completed",
      ]),

      h2("4.2 Firestore Security Rules"),
      ...codeBlock([
        "rules_version = '2';",
        "service cloud.firestore {",
        "  match /databases/{database}/documents {",
        "",
        "    // Users: read own, write own only",
        "    match /users/{uid} {",
        "      allow read: if request.auth.uid == uid;",
        "      allow write: if request.auth.uid == uid;",
        "    }",
        "",
        "    // Koshais: anyone can read, only owner writes (except isVerified)",
        "    match /koshais/{uid} {",
        "      allow read: if request.auth != null;",
        "      allow write: if request.auth.uid == uid",
        "                   && !request.resource.data.keys().hasAny(['isVerified','approvedBy']);",
        "    }",
        "",
        "    // Bookings: user or koshai of that booking can read/write",
        "    match /bookings/{bookingId} {",
        "      allow read, write: if request.auth.uid == resource.data.userId",
        "                         || request.auth.uid == resource.data.koshaiId;",
        "      allow create: if request.auth != null;",
        "    }",
        "",
        "    // Reviews: user who booked can create, anyone can read",
        "    match /reviews/{reviewId} {",
        "      allow read: if request.auth != null;",
        "      allow create: if request.auth.uid == request.resource.data.userId;",
        "    }",
        "  }",
        "}",
      ]),
      new Paragraph({ children: [new PageBreak()] }),

      // ── 5. COMPLETE SCREEN LIST ────────────────────────────────────────────
      h1("5. Complete Screen & Navigation Plan"),
      h2("5.1 User Screens (12 screens)"),
      simpleTable(
        ["Screen", "Fragment/Activity", "Description"],
        [
          ["Splash", "SplashActivity", "Logo, check auth state, route to Auth or Home"],
          ["Role select", "RoleSelectFragment", "Are you a User or a Koshai? Two big buttons"],
          ["Phone input", "PhoneInputFragment", "Enter +88 number, send OTP"],
          ["OTP verify", "OtpVerifyFragment", "6-digit OTP input, resend timer"],
          ["Home (map)", "HomeFragment", "Google Map with koshai pins, search bar, filter FAB"],
          ["Search/Filter", "SearchFilterFragment", "Filter by district, upazila, animal, price, availability"],
          ["Koshai profile", "KoshaiProfileFragment", "Photo, rating, rates, slots, reviews, Book button"],
          ["Booking form", "BookingFormFragment", "Date, slot, address, animal count, price estimate"],
          ["Payment", "PaymentFragment", "bKash/Nagad SDK, deposit confirmation"],
          ["Live tracker", "BookingTrackerFragment", "Real-time status bar + koshai location on mini-map"],
          ["My bookings", "MyBookingsFragment", "List of all bookings with status badges"],
          ["Write review", "WriteReviewFragment", "Stars, comment, optional photo upload"],
        ],
        [2200, 2800, 4360]
      ),
      ...spacer(1),
      h2("5.2 Koshai Screens (10 screens)"),
      simpleTable(
        ["Screen", "Fragment/Activity", "Description"],
        [
          ["Registration", "KoshaiRegisterFragment", "Name, NID upload, photo, district, rates per animal"],
          ["Pending approval", "PendingApprovalFragment", "Show waiting state until admin verifies NID"],
          ["Dashboard", "KoshaiDashboardFragment", "Incoming requests count, today's schedule, toggle status"],
          ["Availability toggle", "AvailabilityFragment", "Open / Busy / Offline switch, Eid mode & surge rate"],
          ["Booking manager", "BookingManagerFragment", "List of pending/confirmed bookings, Accept/Decline"],
          ["Booking detail", "BookingDetailFragment", "Full booking info, chat button, complete/cancel action"],
          ["In-app chat", "ChatFragment", "Message thread for a specific booking"],
          ["Earnings", "EarningsFragment", "Total earned, per-booking history, monthly breakdown"],
          ["Leaderboard", "LeaderboardFragment", "District ranking, own position highlight"],
          ["My profile", "KoshaiProfileEditFragment", "Edit rates, coverage area, photo, toggle Eid mode"],
        ],
        [2200, 2800, 4360]
      ),
      new Paragraph({ children: [new PageBreak()] }),

      // ── 6. FULL KOTLIN CODE ────────────────────────────────────────────────
      h1("6. Key Kotlin Implementation Code"),

      h2("6.1 Gradle Dependencies (app/build.gradle)"),
      ...codeBlock([
        "dependencies {",
        "  // Firebase BOM — manages all Firebase versions",
        "  implementation(platform('com.google.firebase:firebase-bom:32.7.0'))",
        "  implementation('com.google.firebase:firebase-auth-ktx')",
        "  implementation('com.google.firebase:firebase-firestore-ktx')",
        "  implementation('com.google.firebase:firebase-database-ktx')",
        "  implementation('com.google.firebase:firebase-messaging-ktx')",
        "  implementation('com.google.firebase:firebase-storage-ktx')",
        "  implementation('com.google.firebase:firebase-functions-ktx')",
        "",
        "  // Google Maps & Location",
        "  implementation('com.google.android.gms:play-services-maps:18.2.0')",
        "  implementation('com.google.android.gms:play-services-location:21.0.1')",
        "",
        "  // Jetpack",
        "  implementation('androidx.navigation:navigation-fragment-ktx:2.7.6')",
        "  implementation('androidx.navigation:navigation-ui-ktx:2.7.6')",
        "  implementation('androidx.lifecycle:lifecycle-viewmodel-ktx:2.7.0')",
        "  implementation('androidx.lifecycle:lifecycle-runtime-ktx:2.7.0')",
        "  implementation('androidx.hilt:hilt-navigation-fragment:1.1.0')",
        "",
        "  // Hilt DI",
        "  implementation('com.google.dagger:hilt-android:2.50')",
        "  kapt('com.google.dagger:hilt-compiler:2.50')",
        "",
        "  // Networking",
        "  implementation('com.squareup.retrofit2:retrofit:2.9.0')",
        "  implementation('com.squareup.retrofit2:converter-gson:2.9.0')",
        "  implementation('com.squareup.okhttp3:logging-interceptor:4.12.0')",
        "",
        "  // Image loading",
        "  implementation('com.github.bumptech.glide:glide:4.16.0')",
        "",
        "  // Material Design 3",
        "  implementation('com.google.android.material:material:1.11.0')",
        "",
        "  // Coroutines",
        "  implementation('org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3')",
        "  implementation('org.jetbrains.kotlinx:kotlinx-coroutines-play-services:1.7.3')",
        "}",
      ]),
      ...spacer(1),

      h2("6.2 Data Models (Kotlin Data Classes)"),
      ...codeBlock([
        "// Koshai.kt",
        "data class Koshai(",
        "  val uid: String = \"\",",
        "  val name: String = \"\",",
        "  val phone: String = \"\",",
        "  val photoUrl: String = \"\",",
        "  val district: String = \"\",",
        "  val upazila: String = \"\",",
        "  val ratePerCow: Int = 0,",
        "  val ratePerGoat: Int = 0,",
        "  val status: String = \"offline\",  // available|busy|offline",
        "  val isVerified: Boolean = false,",
        "  val rating: Double = 0.0,",
        "  val totalJobs: Int = 0,",
        "  val lat: Double = 0.0,",
        "  val lng: Double = 0.0,",
        "  val surgeMultiplier: Double = 1.0,",
        "  val isEidMode: Boolean = false",
        ")",
        "",
        "// Booking.kt",
        "data class Booking(",
        "  val id: String = \"\",",
        "  val userId: String = \"\",",
        "  val koshaiId: String = \"\",",
        "  val address: String = \"\",",
        "  val lat: Double = 0.0,",
        "  val lng: Double = 0.0,",
        "  val date: com.google.firebase.Timestamp? = null,",
        "  val slot: String = \"\",",
        "  val cowCount: Int = 0,",
        "  val goatCount: Int = 0,",
        "  val totalFee: Int = 0,",
        "  val depositPaid: Int = 0,",
        "  val paymentRef: String = \"\",",
        "  val status: String = \"pending\",",
        "  val isGroupBooking: Boolean = false",
        ")",
      ]),
      ...spacer(1),

      h2("6.3 HomeViewModel — Fetch & Filter Koshais"),
      ...codeBlock([
        "@HiltViewModel",
        "class HomeViewModel @Inject constructor(",
        "  private val repo: KoshaiRepository",
        ") : ViewModel() {",
        "",
        "  private val _koshais = MutableStateFlow<List<Koshai>>(emptyList())",
        "  val koshais: StateFlow<List<Koshai>> = _koshais",
        "",
        "  fun loadKoshais(district: String, animalType: String? = null) {",
        "    viewModelScope.launch {",
        "      repo.getAvailableKoshais(district, animalType).collect {",
        "        _koshais.value = it",
        "      }",
        "    }",
        "  }",
        "}",
        "",
        "// KoshaiRepository.kt",
        "class KoshaiRepository @Inject constructor(",
        "  private val db: FirebaseFirestore",
        ") {",
        "  fun getAvailableKoshais(district: String, animal: String?) =",
        "    callbackFlow {",
        "      var query: Query = db.collection(\"koshais\")",
        "        .whereEqualTo(\"district\", district)",
        "        .whereEqualTo(\"status\", \"available\")",
        "      if (animal == \"cow\") query = query.whereGreaterThan(\"ratePerCow\", 0)",
        "      if (animal == \"goat\") query = query.whereGreaterThan(\"ratePerGoat\", 0)",
        "      val listener = query.addSnapshotListener { snap, _ ->",
        "        trySend(snap?.toObjects(Koshai::class.java) ?: emptyList())",
        "      }",
        "      awaitClose { listener.remove() }",
        "    }",
        "}",
      ]),
      ...spacer(1),

      h2("6.4 HomeFragment — Google Maps Integration"),
      ...codeBlock([
        "class HomeFragment : Fragment(), OnMapReadyCallback {",
        "  private lateinit var map: GoogleMap",
        "  private val vm: HomeViewModel by viewModels()",
        "  private val markerMap = mutableMapOf<Marker, Koshai>()",
        "",
        "  override fun onMapReady(googleMap: GoogleMap) {",
        "    map = googleMap",
        "    map.setOnMarkerClickListener { marker ->",
        "      val koshai = markerMap[marker] ?: return@setOnMarkerClickListener false",
        "      findNavController().navigate(",
        "        HomeFragmentDirections.toKoshaiProfile(koshaiId = koshai.uid)",
        "      )",
        "      true",
        "    }",
        "    observeKoshais()",
        "  }",
        "",
        "  private fun observeKoshais() {",
        "    viewLifecycleOwner.lifecycleScope.launch {",
        "      repeatOnLifecycle(Lifecycle.State.STARTED) {",
        "        vm.koshais.collect { list ->",
        "          map.clear(); markerMap.clear()",
        "          list.forEach { koshai ->",
        "            val color = if (koshai.isVerified)",
        "              BitmapDescriptorFactory.HUE_GREEN",
        "            else BitmapDescriptorFactory.HUE_ORANGE",
        "            val marker = map.addMarker(MarkerOptions()",
        "              .position(LatLng(koshai.lat, koshai.lng))",
        "              .title(koshai.name)",
        "              .snippet(\"Cow: \u09f3\${koshai.ratePerCow} | Goat: \u09f3\${koshai.ratePerGoat}\")",
        "              .icon(BitmapDescriptorFactory.defaultMarker(color)))",
        "            marker?.let { markerMap[it] = koshai }",
        "          }",
        "        }",
        "      }",
        "    }",
        "  }",
        "}",
      ]),
      ...spacer(1),

      h2("6.5 Booking Flow with Cost Estimator"),
      ...codeBlock([
        "class BookingViewModel @Inject constructor(",
        "  private val db: FirebaseFirestore,",
        "  private val auth: FirebaseAuth",
        ") : ViewModel() {",
        "",
        "  fun estimateCost(koshai: Koshai, cows: Int, goats: Int): Int {",
        "    val base = (cows * koshai.ratePerCow) + (goats * koshai.ratePerGoat)",
        "    return (base * koshai.surgeMultiplier).toInt()",
        "  }",
        "",
        "  fun estimateDuration(cows: Int, goats: Int): Int {",
        "    return (cows * 45) + (goats * 25)  // minutes per animal",
        "  }",
        "",
        "  fun createBooking(booking: Booking, onSuccess: (String) -> Unit) {",
        "    viewModelScope.launch {",
        "      try {",
        "        val ref = db.collection(\"bookings\").document()",
        "        val withId = booking.copy(id = ref.id)",
        "        ref.set(withId).await()",
        "        // Mark koshai busy for that slot",
        "        db.collection(\"koshais\").document(booking.koshaiId)",
        "          .update(\"status\", \"busy\").await()",
        "        onSuccess(ref.id)",
        "      } catch (e: Exception) {",
        "        // Handle error",
        "      }",
        "    }",
        "  }",
        "}",
      ]),
      ...spacer(1),

      h2("6.6 Real-Time Chat (Firebase Realtime Database)"),
      ...codeBlock([
        "class ChatViewModel @Inject constructor(",
        "  private val rtdb: FirebaseDatabase,",
        "  private val auth: FirebaseAuth",
        ") : ViewModel() {",
        "",
        "  private val _messages = MutableStateFlow<List<ChatMessage>>(emptyList())",
        "  val messages: StateFlow<List<ChatMessage>> = _messages",
        "",
        "  fun observeChat(bookingId: String) {",
        "    rtdb.getReference(\"chats/\$bookingId/messages\")",
        "      .orderByChild(\"timestamp\")",
        "      .addValueEventListener(object : ValueEventListener {",
        "        override fun onDataChange(snap: DataSnapshot) {",
        "          _messages.value = snap.children.mapNotNull {",
        "            it.getValue(ChatMessage::class.java)",
        "          }",
        "        }",
        "        override fun onCancelled(e: DatabaseError) {}",
        "      })",
        "  }",
        "",
        "  fun sendMessage(bookingId: String, text: String) {",
        "    val msg = ChatMessage(",
        "      senderId = auth.currentUser?.uid ?: return,",
        "      text = text,",
        "      timestamp = System.currentTimeMillis()",
        "    )",
        "    rtdb.getReference(\"chats/\$bookingId/messages\").push().setValue(msg)",
        "  }",
        "}",
      ]),
      ...spacer(1),

      h2("6.7 Live Koshai Location Tracking"),
      ...codeBlock([
        "// KoshaiLocationService.kt — runs as foreground service on koshai's device",
        "class KoshaiLocationService : Service() {",
        "  private lateinit var fusedClient: FusedLocationProviderClient",
        "  private val rtdb = Firebase.database",
        "  private val koshaiId = Firebase.auth.currentUser?.uid ?: \"\"",
        "",
        "  private val locationCallback = object : LocationCallback() {",
        "    override fun onLocationResult(result: LocationResult) {",
        "      result.lastLocation?.let { loc ->",
        "        rtdb.getReference(\"locations/\$koshaiId\").setValue(",
        "          mapOf(\"lat\" to loc.latitude, \"lng\" to loc.longitude,",
        "                \"updatedAt\" to System.currentTimeMillis())",
        "        )",
        "      }",
        "    }",
        "  }",
        "",
        "  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {",
        "    val req = LocationRequest.Builder(Priority.PRIORITY_HIGH_ACCURACY, 10_000).build()",
        "    fusedClient.requestLocationUpdates(req, locationCallback, Looper.getMainLooper())",
        "    return START_STICKY",
        "  }",
        "",
        "  override fun onBind(intent: Intent?) = null",
        "}",
      ]),
      new Paragraph({ children: [new PageBreak()] }),

      // ── 7. CLOUD FUNCTIONS ─────────────────────────────────────────────────
      h1("7. Firebase Cloud Functions (Node.js)"),
      h2("7.1 Booking Reminder Function"),
      ...codeBlock([
        "// functions/src/reminders.ts",
        "export const sendBookingReminders = functions.pubsub",
        "  .schedule('every 30 minutes')",
        "  .onRun(async () => {",
        "    const now = admin.firestore.Timestamp.now();",
        "    const in24h = new Date(Date.now() + 24 * 60 * 60 * 1000);",
        "    const in2h  = new Date(Date.now() +  2 * 60 * 60 * 1000);",
        "",
        "    const snap24 = await db.collection('bookings')",
        "      .where('status', 'in', ['confirmed'])",
        "      .where('reminder24Sent', '==', false)",
        "      .where('date', '<=', admin.firestore.Timestamp.fromDate(in24h))",
        "      .get();",
        "",
        "    for (const doc of snap24.docs) {",
        "      const b = doc.data();",
        "      await sendFCM(b.userFcmToken, '24-hour reminder', `Your koshai \${b.koshaiName} arrives tomorrow.`);",
        "      await sendFCM(b.koshaiToken,  '24-hour reminder', `Booking tomorrow at \${b.slot} in \${b.upazila}.`);",
        "      await doc.ref.update({ reminder24Sent: true });",
        "    }",
        "  });",
      ]),
      ...spacer(1),
      h2("7.2 Fraud Detection Function"),
      ...codeBlock([
        "// Fires on every booking creation",
        "export const detectFraud = functions.firestore",
        "  .document('bookings/{bookingId}')",
        "  .onCreate(async (snap) => {",
        "    const b = snap.data();",
        "    const todayStart = new Date(); todayStart.setHours(0,0,0,0);",
        "",
        "    const todaySnap = await db.collection('bookings')",
        "      .where('koshaiId', '==', b.koshaiId)",
        "      .where('status', 'in', ['pending','confirmed'])",
        "      .where('date', '>=', admin.firestore.Timestamp.fromDate(todayStart))",
        "      .get();",
        "",
        "    if (todaySnap.size > 25) {",
        "      // Flag the koshai account for review",
        "      await db.collection('koshais').doc(b.koshaiId)",
        "        .update({ status: 'offline', flaggedForReview: true });",
        "      await db.collection('adminAlerts').add({",
        "        type: 'fraud_suspected', koshaiId: b.koshaiId,",
        "        bookingCount: todaySnap.size, createdAt: admin.firestore.FieldValue.serverTimestamp()",
        "      });",
        "    }",
        "  });",
      ]),
      ...spacer(1),
      h2("7.3 Rating Average Update Function"),
      ...codeBlock([
        "export const updateKoshaiRating = functions.firestore",
        "  .document('reviews/{reviewId}')",
        "  .onCreate(async (snap) => {",
        "    const review = snap.data();",
        "    const koshaiRef = db.collection('koshais').doc(review.koshaiId);",
        "",
        "    await db.runTransaction(async (tx) => {",
        "      const kDoc = await tx.get(koshaiRef);",
        "      const current = kDoc.data()?.rating ?? 0;",
        "      const count   = kDoc.data()?.totalRatings ?? 0;",
        "      const newAvg  = ((current * count) + review.rating) / (count + 1);",
        "      tx.update(koshaiRef, {",
        "        rating: Math.round(newAvg * 10) / 10,",
        "        totalRatings: count + 1",
        "      });",
        "    });",
        "  });",
      ]),
      new Paragraph({ children: [new PageBreak()] }),

      // ── 8. ALL 18 FEATURES ─────────────────────────────────────────────────
      h1("8. All 18 Features — Detailed Specification"),

      h2("Phase 1 — MVP (Weeks 1–6)"),
      simpleTable(
        ["#", "Feature", "Implementation", "Firebase Service"],
        [
          ["1", "Phone OTP auth", "PhoneAuthProvider with +88 prefix, role selection post-auth", "Firebase Auth"],
          ["2", "Koshai registration", "NID photo upload to Storage, Firestore write, pending state", "Auth, Storage, Firestore"],
          ["3", "Home map view", "Google Maps with real-time Firestore listener for pins", "Firestore, Maps SDK"],
          ["4", "Slot-based booking", "Time slots per koshai day, conflict check before write", "Firestore"],
          ["5", "Push notifications", "FCM tokens stored per user/koshai, Cloud Functions trigger", "FCM, Cloud Functions"],
        ],
        [400, 2400, 3800, 2760]
      ),
      ...spacer(1),
      h2("Phase 2 — Trust (Weeks 7–12)"),
      simpleTable(
        ["#", "Feature", "Implementation", "Firebase Service"],
        [
          ["6", "Verified badge system", "Admin sets isVerified=true in Firestore, badge shown in UI", "Firestore (admin write)"],
          ["7", "Live booking tracker", "Realtime DB status updates + koshai GPS on mini-map", "Realtime DB, Maps SDK"],
          ["8", "In-app chat", "Realtime DB chat per bookingId, no phone number sharing", "Realtime Database"],
          ["9", "Ratings & photo reviews", "Post-completion form, Cloud Function updates rating average", "Firestore, Storage, Functions"],
          ["10", "Animal count estimator", "Local Kotlin calculation: count × rate × surgeMultiplier", "None (local logic)"],
        ],
        [400, 2400, 3800, 2760]
      ),
      ...spacer(1),
      h2("Phase 3 — Growth (Weeks 13–18)"),
      simpleTable(
        ["#", "Feature", "Implementation", "Firebase Service"],
        [
          ["11", "bKash / Nagad payment", "Retrofit call to bKash PGW API, store txn ref in Firestore", "Firestore, Functions"],
          ["12", "Surge pricing (Eid mode)", "koshai.surgeMultiplier field, date-range Cloud Function activator", "Firestore, Functions"],
          ["13", "Waitlist system", "Ordered subcollection per koshai, trigger on booking cancel", "Firestore, FCM"],
          ["14", "Group / neighborhood booking", "groupSessions collection, join code, shared koshai slot", "Firestore"],
          ["15", "Smart reminders", "Scheduled Cloud Function checks bookings every 30 mins", "Cloud Functions, FCM"],
        ],
        [400, 2400, 3800, 2760]
      ),
      ...spacer(1),
      h2("Phase 4 — Scale (Weeks 19–24)"),
      simpleTable(
        ["#", "Feature", "Implementation", "Firebase Service"],
        [
          ["16", "Demand heatmap", "Aggregate Firestore data by upazila, Maps JS API heatmap layer", "Firestore, Maps SDK"],
          ["17", "Koshai leaderboard", "Nightly Cloud Function ranks koshais by rating+jobs per district", "Firestore, Functions"],
          ["18", "Admin web dashboard", "React + Firebase web app: verify koshais, analytics, bans", "Firestore, Auth, Functions"],
        ],
        [400, 2400, 3800, 2760]
      ),
      new Paragraph({ children: [new PageBreak()] }),

      // ── 9. 24-WEEK PIPELINE ────────────────────────────────────────────────
      h1("9. 24-Week Development Pipeline"),

      h2("Phase 1 — Foundation & MVP (Weeks 1–6)"),
      phaseTable([
        ["Week", "Task", "Deliverable", "Owner"],
        ["1", "Firebase project setup, google-services.json, project scaffold in Android Studio with MVVM + Hilt + Navigation", "Buildable empty app with Firebase connected", "Dev"],
        ["2", "Auth flow: phone input, OTP verify, role selection (User vs Koshai), Firestore user/koshai document creation", "Working login + role routing", "Dev"],
        ["3", "Koshai registration: NID + photo upload to Storage, coverage area, rates, pending state screen", "Koshais can register and wait for approval", "Dev"],
        ["4", "Google Maps integration: fetch available koshais from Firestore, plot pins by status color, tap-to-profile", "Live map showing koshais", "Dev"],
        ["5", "Slot booking flow: profile screen, slot picker, booking form, Firestore write, koshai dashboard with accept/decline", "End-to-end booking can be made and accepted", "Dev"],
        ["6", "FCM push notifications on booking events, availability toggle on koshai side, QA + bug fixes, internal TestFlight APK", "Phase 1 APK for internal testing", "Dev + QA"],
      ]),
      ...spacer(1),

      h2("Phase 2 — Trust Layer (Weeks 7–12)"),
      phaseTable([
        ["Week", "Task", "Deliverable", "Owner"],
        ["7", "Admin Firestore flag for isVerified, badge shown on koshai cards and profile, admin web page (basic Firebase console rules)", "Verified badge visible in app", "Dev"],
        ["8", "Live booking tracker: Realtime DB status updates (confirmed → en_route → arrived → done), mini-map on tracker screen", "Users can track koshai in real-time", "Dev"],
        ["9", "In-app chat: Realtime DB messages per booking, ChatFragment with RecyclerView and send input", "Chat works between user and koshai", "Dev"],
        ["10", "Post-job review screen: star rating, text comment, optional photo upload, Cloud Function updates koshai.rating average", "Reviews can be submitted and displayed", "Dev"],
        ["11", "Animal count estimator with auto cost + duration calc, koshai profile shows full breakdown with surge indicator", "Cost estimator working on booking form", "Dev"],
        ["12", "Full Phase 2 QA, fix edge cases (chat load order, rating decimal precision), release Phase 2 APK to beta testers", "Phase 2 beta APK", "Dev + QA"],
      ]),
      ...spacer(1),

      h2("Phase 3 — Growth Features (Weeks 13–18)"),
      phaseTable([
        ["Week", "Task", "Deliverable", "Owner"],
        ["13", "bKash payment gateway integration: sandbox setup, PaymentFragment with Retrofit call, store txn ref in booking document", "Deposit payment works in sandbox", "Dev"],
        ["14", "Nagad payment integration, production bKash credentials, payment failure/retry handling, refund flow documentation", "Both payment gateways in production mode", "Dev"],
        ["15", "Eid mode: koshai surge multiplier UI, date-range detection Cloud Function, user-facing pricing banner during Eid days", "Surge pricing active during Eid window", "Dev"],
        ["16", "Waitlist system: join queue on fully booked koshai, Firestore subcollection, Cloud Function triggers FCM on cancellation", "Waitlist FCM notification works end-to-end", "Dev"],
        ["17", "Group / neighborhood booking: session creation, 6-char join code, travel fee split calculator, family list UI", "Group booking flow complete", "Dev"],
        ["18", "Smart reminder Cloud Functions (24h + 2h), Phase 3 full QA, performance testing under load, Play Store submission", "App live on Google Play Store", "Dev + QA"],
      ]),
      ...spacer(1),

      h2("Phase 4 — Scale & Admin (Weeks 19–24)"),
      phaseTable([
        ["Week", "Task", "Deliverable", "Owner"],
        ["19", "Demand heatmap: aggregate Firestore bookings by upazila, Maps SDK HeatmapTileProvider, color scale legend", "Heatmap visible on home screen", "Dev"],
        ["20", "Koshai leaderboard: nightly Cloud Function ranks by rating+jobs per district, leaderboard screen with own position", "Leaderboard updates nightly", "Dev"],
        ["21", "Admin web dashboard (React + Firebase Hosting): koshai verification queue, dispute log, ban/unban, analytics charts", "Admin dashboard live at admin.koshaiapp.com", "Dev"],
        ["22", "Referral system: unique codes, credit ledger in Firestore, commission tracking for koshai referrals", "Referral codes generate and apply discounts", "Dev"],
        ["23", "Fraud detection Cloud Function, account flagging, admin alert collection, anti-abuse rate limiting on booking creation", "Fraud alerts appear in admin dashboard", "Dev"],
        ["24", "CI/CD with GitHub Actions (automated APK build + Play Store upload), full regression QA, app store optimization, v2.0 release", "v2.0 shipped with full feature set", "Dev + QA"],
      ]),
      new Paragraph({ children: [new PageBreak()] }),

      // ── 10. FOLDER STRUCTURE ──────────────────────────────────────────────
      h1("10. Project Folder Structure"),
      ...codeBlock([
        "app/src/main/",
        "  java/com/koshaiapp/",
        "    di/                     // Hilt modules (FirebaseModule, etc.)",
        "    data/",
        "      model/                // Koshai.kt, Booking.kt, Review.kt, ChatMessage.kt",
        "      repository/           // KoshaiRepository.kt, BookingRepository.kt",
        "      remote/               // BkashApiService.kt (Retrofit)",
        "    domain/",
        "      usecase/              // GetKoshaisUseCase.kt, CreateBookingUseCase.kt",
        "    ui/",
        "      auth/                 // PhoneInputFragment, OtpVerifyFragment",
        "      home/                 // HomeFragment, HomeViewModel, SearchFilterFragment",
        "      koshai/               // KoshaiProfileFragment, KoshaiProfileViewModel",
        "      booking/              // BookingFormFragment, BookingViewModel, PaymentFragment",
        "      tracker/              // BookingTrackerFragment, BookingTrackerViewModel",
        "      chat/                 // ChatFragment, ChatViewModel",
        "      mybookings/           // MyBookingsFragment",
        "      review/               // WriteReviewFragment",
        "      koshaidashboard/      // KoshaiDashboardFragment, AvailabilityFragment",
        "      bookingmgr/           // BookingManagerFragment, BookingDetailFragment",
        "      earnings/             // EarningsFragment",
        "      leaderboard/          // LeaderboardFragment",
        "      admin/                // (Web only — separate React project)",
        "    service/",
        "      KoshaiLocationService.kt   // Foreground location service",
        "      FirebaseMessagingService.kt",
        "    util/                   // Extensions, Constants, DateUtils",
        "  res/",
        "    layout/                 // All XML layouts",
        "    navigation/             // nav_graph.xml",
        "    values/                 // strings.xml (English)",
        "    values-b+bn/            // strings.xml (Bangla)",
        "    drawable/               // Icons, backgrounds",
        "",
        "functions/                  // Firebase Cloud Functions (Node.js/TypeScript)",
        "  src/",
        "    reminders.ts",
        "    fraud.ts",
        "    ratings.ts",
        "    waitlist.ts",
        "    eidMode.ts",
        "",
        "admin-dashboard/            // React web app",
        "  src/",
        "    pages/                  // VerifyKoshais, Disputes, Analytics",
        "    components/             // KoshaiCard, BookingTable",
      ]),
      new Paragraph({ children: [new PageBreak()] }),

      // ── 11. PLAY STORE & CI/CD ────────────────────────────────────────────
      h1("11. Play Store Submission & CI/CD"),
      h2("11.1 Google Play Store Checklist"),
      numbered("Create Google Play Console account (one-time $25 USD fee)"),
      numbered("App signing: generate release keystore with keytool, store in GitHub Secrets"),
      numbered("App bundle: build release AAB (not APK) — smaller size, better Play optimization"),
      numbered("Store listing: Bangla + English description, screenshots from all key screens"),
      numbered("Content rating: complete IARC questionnaire (expected: Everyone)"),
      numbered("Privacy policy: host at koshaiapp.com/privacy — required for payment apps"),
      numbered("Data safety form: declare Firebase Analytics, phone number collection"),
      numbered("Target SDK: API 34 (required by Play Store from August 2024 onwards)"),
      ...spacer(1),
      h2("11.2 GitHub Actions CI/CD Pipeline"),
      ...codeBlock([
        "# .github/workflows/release.yml",
        "name: Build & Deploy Release APK",
        "on:",
        "  push:",
        "    branches: [ main ]",
        "    tags: [ 'v*' ]",
        "",
        "jobs:",
        "  build:",
        "    runs-on: ubuntu-latest",
        "    steps:",
        "      - uses: actions/checkout@v4",
        "      - uses: actions/setup-java@v4",
        "        with: { java-version: '17', distribution: 'temurin' }",
        "      - name: Decode google-services.json",
        "        run: echo \${{ secrets.GOOGLE_SERVICES_JSON }} | base64 -d > app/google-services.json",
        "      - name: Build Release AAB",
        "        run: ./gradlew bundleRelease",
        "        env:",
        "          KEYSTORE_FILE: \${{ secrets.KEYSTORE_B64 }}",
        "          KEY_ALIAS:     \${{ secrets.KEY_ALIAS }}",
        "          KEY_PASSWORD:  \${{ secrets.KEY_PASSWORD }}",
        "      - name: Upload to Play Store",
        "        uses: r0adkll/upload-google-play@v1",
        "        with:",
        "          serviceAccountJsonPlainText: \${{ secrets.PLAY_SA_JSON }}",
        "          packageName: com.koshaiapp",
        "          releaseFiles: app/build/outputs/bundle/release/*.aab",
        "          track: internal",
      ]),
      new Paragraph({ children: [new PageBreak()] }),

      // ── 12. MONETIZATION ──────────────────────────────────────────────────
      h1("12. Monetization Strategy"),
      simpleTable(
        ["Revenue Stream", "Model", "Estimated Revenue"],
        [
          ["Booking deposit", "User pays 5-10% deposit via bKash/Nagad at booking time", "Core revenue from day 1"],
          ["Platform commission", "5% commission deducted from each completed booking payment", "Scales with transaction volume"],
          ["Featured listings", "Koshais pay BDT 200–500 to appear at top of search results during Eid", "High demand period upsell"],
          ["Premium koshai", "Verified Pro tier for BDT 500/year — priority support, analytics dashboard", "Recurring annual revenue"],
          ["Group booking fee", "BDT 50 organizer fee per group session created", "Low friction, high volume"],
          ["Referral commissions", "2% of first 5 bookings made by referred koshais", "Growth flywheel incentive"],
        ],
        [2800, 3600, 2960]
      ),
      new Paragraph({ children: [new PageBreak()] }),

      // ── 13. RISK & MITIGATIONS ─────────────────────────────────────────────
      h1("13. Risks & Mitigations"),
      simpleTable(
        ["Risk", "Likelihood", "Mitigation"],
        [
          ["Koshais don't own smartphones", "Medium", "Partner with local mosque committees and butcher associations for group onboarding; offer feature phones SMS fallback for confirmations"],
          ["bKash API approval delays", "Medium", "Start with cash-on-delivery option; bKash integration added in Phase 3 only after approval"],
          ["Low supply at launch", "High", "Pre-register koshais before app launch via Facebook/WhatsApp outreach in major districts"],
          ["No-shows despite deposit", "Low", "Deposit is non-refundable if cancelled within 12h of slot; penalize repeat no-shows with account suspension"],
          ["Firebase costs scaling", "Low", "Firebase free tier handles ~50k reads/day; add Firestore index budgets and listener cleanup to control costs"],
          ["Google Play rejection", "Low", "Follow all data safety requirements, privacy policy, and avoid sensitive permissions without justification"],
          ["Competitor copies the idea", "Medium", "Move fast, build community trust, lock in verified koshai supply side before competitors"],
        ],
        [2800, 1400, 5160]
      ),
      new Paragraph({ children: [new PageBreak()] }),

      // ── 14. APPENDIX ──────────────────────────────────────────────────────
      h1("14. Appendix — Quick Reference"),
      h2("14.1 Districts to Support at Launch"),
      bullet("Dhaka (highest density, largest Eid demand)"),
      bullet("Narayanganj (app founder's base)"),
      bullet("Chattogram (second largest city)"),
      bullet("Sylhet (diaspora remittance, high purchasing power)"),
      bullet("Rajshahi (cattle-producing region, strong koshai supply)"),
      bullet("Khulna, Cumilla, Gazipur (Phase 2 expansion)"),
      ...spacer(1),
      h2("14.2 Key API Credentials Needed"),
      bullet("Firebase: google-services.json from Firebase Console"),
      bullet("Google Maps: Maps SDK API key with Maps, Places, Directions enabled"),
      bullet("bKash PGW: Merchant account from bKash merchant portal"),
      bullet("Nagad: Merchant account from Nagad merchant portal"),
      ...spacer(1),
      h2("14.3 Useful Firebase Console Links"),
      bullet("Firebase Console: console.firebase.google.com"),
      bullet("Google Play Console: play.google.com/console"),
      bullet("Google Maps Platform: console.cloud.google.com/google/maps-apis"),
      bullet("bKash Merchant: merchant.bkash.com"),
      ...spacer(1),
      colorBox("This document covers the complete Koshai Finder app — 18 features, 4 phases, 24 weeks, full Kotlin + Firebase implementation. Build Phase 1 first, get real users, then expand.", LIGHT_GREEN, "1D6B45"),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('koshai_finder_complete_plan.docx', buffer);
  console.log('Done!');
});
