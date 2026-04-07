# Task 16 — App Store Release & ASO

> **Faz**: M9
> **Ön koşul**: M1-M8 tamamlandı, app TestFlight beta geçti
> **Çıktı**: App Store'da canlı `1.0.0`

---

## 1. Apple Developer Hesabı & ASC Setup

### 1.1 Pre-requisites

- [ ] Apple Developer Program (individual veya organization, $99/year)
- [ ] App Store Connect erişim
- [ ] Bank info + Tax forms tamamlanmış (Paid Apps Agreement, gerekmese de)
- [ ] App-specific password oluşturulmuş (Fastlane için)
- [ ] D-U-N-S Number (organization ise)

### 1.2 App Kaydı (App Store Connect)

- [ ] **My Apps → +**
- [ ] Platform: **iOS**
- [ ] Name: **Malta Calculator**
- [ ] Primary language: **English (UK)** veya **English (US)**
- [ ] Bundle ID: `com.maltacalculator.app` (Xcode'dan match)
- [ ] SKU: `maltacalc-ios-001`
- [ ] User Access: Full Access

### 1.3 App Information

- [ ] **Subtitle** (30 char): `Salary, Tax & Finance Tools`
- [ ] **Category Primary**: Finance
- [ ] **Category Secondary**: Utilities
- [ ] **Content Rights**: Does not contain third-party content
- [ ] **Age Rating**: 4+ (no objectionable content)
- [ ] **Pricing**: Free
- [ ] **Availability**: Worldwide (or Malta + EU only initially)

---

## 2. Privacy Setup

### 2.1 Privacy Nutrition Label

App Privacy → "Get Started" → answer questions:

- [ ] **Data Collection**: No data collected (v1)
- [ ] **Tracking**: No tracking
- [ ] **Data Linked to User**: None
- [ ] **Data Used to Track**: None

### 2.2 ATT (App Tracking Transparency)

v1'de **gerekli değil** (no tracking).

### 2.3 Privacy Manifest

`PrivacyInfo.xcprivacy` (iOS 17+):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>NSPrivacyTracking</key>
    <false/>
    <key>NSPrivacyTrackingDomains</key>
    <array/>
    <key>NSPrivacyCollectedDataTypes</key>
    <array/>
    <key>NSPrivacyAccessedAPITypes</key>
    <array>
        <dict>
            <key>NSPrivacyAccessedAPIType</key>
            <string>NSPrivacyAccessedAPICategoryUserDefaults</string>
            <key>NSPrivacyAccessedAPITypeReasons</key>
            <array>
                <string>CA92.1</string>
            </array>
        </dict>
        <dict>
            <key>NSPrivacyAccessedAPIType</key>
            <string>NSPrivacyAccessedAPICategoryFileTimestamp</string>
            <key>NSPrivacyAccessedAPITypeReasons</key>
            <array>
                <string>C617.1</string>
            </array>
        </dict>
    </array>
</dict>
</plist>
```

---

## 3. Store Listing — Tam Metin

### 3.1 App Name

`Malta Calculator`

### 3.2 Subtitle (30 char)

`Salary, Tax & Finance Tools`

### 3.3 Promotional Text (170 char)

`All Malta financial calculators in one app. Salary, mortgage, stamp duty, pension, vehicle costs and more — accurate, offline, updated for 2026.`

### 3.4 Description (4000 char)

```text
Malta Calculator is the most comprehensive financial toolkit for anyone living, working, or moving to Malta. From your monthly net salary to mortgage payments, pension projections to vehicle import costs — every calculation you need, in one beautiful, offline-first app.

— WHAT'S INSIDE —

EMPLOYMENT & SALARY
• Net Salary Calculator with full tax, SSC and COLA
• Notice Period Calculator
• Overtime Calculator (1.5x and 2x rates)

PROPERTY & HOUSING
• Mortgage Calculator with full amortization schedule
• Stamp Duty Calculator with first-time buyer exemption

BANKING & LOANS
• Personal Loan Calculator
• Savings Interest Calculator (with 15% withholding tax)

RETIREMENT & SAVINGS
• Pension Calculator (two-thirds + private pension credits)
• Retirement Age Calculator

FAMILY & CHILDREN
• Children's Allowance Calculator

LEAVE & TIME OFF
• Vacation Leave Entitlement Calculator (with public holiday adjustments)

TRANSPORT & VEHICLES
• Vehicle Registration Fee
• Vehicle Registration Tax (CO2 based)
• Road License Calculator
• Driver's License Fees
• VRT (MOT) Calculator
• Import Vehicle Total Cost Calculator

IMMIGRATION & VISA
• Family Reunification Salary Requirements

— FEATURES —

✦ Liquid Glass Design — Built natively for iOS 26 with the new Liquid Glass design language. Beautiful, fluid, modern.

✦ 100% Offline — Every calculation runs on-device. No internet required, no data leaves your phone.

✦ Accurate for 2026 — All tax brackets, SSC contributions and COLA values updated for 2026 from official Malta CFR and Social Security sources.

✦ 10+ In-Depth Guides — Read comprehensive Malta finance guides offline: tax rates, mortgage requirements, pension system, public holidays, and more.

✦ Save & Sync — Save your calculations and access them across all your Apple devices via iCloud (optional, opt-in).

✦ Beautiful Share Cards — Share your salary breakdown, mortgage payment, or any calculation as a beautiful image or PDF.

✦ Privacy First — No tracking. No analytics. No ads. Your data stays yours.

✦ Accessible — Full VoiceOver support, Dynamic Type up to AX5, Reduce Motion friendly.

✦ iPhone & iPad — Designed for both, with native iPad layouts.

— ACCURACY DISCLAIMER —

Malta Calculator provides estimates for informational purposes only. While we keep tax data current with official Malta CFR (cfr.gov.mt) and Social Security Department (socialsecurity.gov.mt) sources, individual circumstances may affect actual amounts. Always consult a licensed Maltese accountant for binding advice.

— MADE IN MALTA —

Built with care for Malta's vibrant community of residents, expats, and professionals.

Questions? Feature requests? Reach us at support@maltacalculator.com
```

### 3.5 Keywords (100 char total, comma-separated)

```text
malta,salary,tax,calculator,mortgage,stamp duty,ssc,pension,finance,2026,vrt,payroll,cola
```

### 3.6 Support URL

`https://maltacalculator.com/support`

### 3.7 Marketing URL

`https://maltacalculator.com`

### 3.8 Privacy Policy URL

`https://maltacalculator.com/privacy`

### 3.9 Copyright

`© 2026 Malta Calculator`

---

## 4. Screenshots

### 4.1 Required Sizes

| Device                           | Size        | Required                         |
| -------------------------------- | ----------- | -------------------------------- |
| iPhone 6.9" (15/16 Pro Max)      | 1320 × 2868 | ✓ (used as fallback for smaller) |
| iPhone 6.5" (XS Max, 11 Pro Max) | 1242 × 2688 | optional                         |
| iPhone 6.7" (15/16 Plus)         | 1290 × 2796 | optional                         |
| iPhone 5.5" (8 Plus)             | 1242 × 2208 | not needed if 6.9 provided       |
| iPad 13" (Pro 12.9")             | 2064 × 2752 | ✓                                |
| iPad 12.9"                       | 2048 × 2732 | optional                         |

### 4.2 Screenshot Set (6 per size)

1. **Hero — Home with Liquid Glass**
   - Title overlay: "Malta's #1 Finance Toolkit" (use careful with #1 → ASC may reject; alternative: "All your Malta calculators")
   - Background: home screen with floating cards
2. **Salary Calculator**
   - Title: "Calculate your net salary in seconds"
   - Show: input form + floating net card + monthly breakdown
3. **Mortgage Calculator + Chart**
   - Title: "Mortgage with full amortization"
   - Show: input + result + line chart
4. **Calculators Grid**
   - Title: "16+ calculators, all in one app"
   - Show: grid hub with category sections
5. **Guides Reader**
   - Title: "10+ Malta finance guides offline"
   - Show: guide reader with markdown
6. **Share Card / Settings**
   - Title: "Share, save, sync with iCloud"
   - Show: share sheet or settings

### 4.3 Asset Pipeline

- [ ] Figma file ile screenshot template oluştur
- [ ] Fastlane Snapshot ile XCUITest'ten otomatik üret (`fastlane snapshot`)
- [ ] Manual: Sketch/Figma'da background + device frame + caption + screenshot

---

## 5. App Preview Video (Optional)

15-30 saniye, sessiz, autoplay-friendly:

1. App icon morph → home screen (2s)
2. Salary input → result animation (5s)
3. Calculator grid scroll (3s)
4. Mortgage chart (3s)
5. Share sheet (2s)
6. Logo + tagline (2s)

Format: H.264, 1920×1080 (landscape) veya 1080×1920 (portrait), 30 fps.

---

## 6. TestFlight Beta

### 6.1 Internal Testing

- [ ] Apple Developer hesabındaki ekip üyeleri eklenir
- [ ] Build TestFlight'a yüklenir (Fastlane `lane :beta`)
- [ ] Internal group: hızlı feedback (1-3 gün)

### 6.2 External Testing

- [ ] **Beta App Information**:
  - Beta description: "Malta Calculator beta — please report any calculation errors or UI issues."
  - Feedback email: `beta@maltacalculator.com`
- [ ] **Beta App Review**: Apple kontrol eder (~24 saat)
- [ ] **Public Link**: paylaşılabilir (Reddit r/malta, Twitter, LinkedIn)
- [ ] Maksimum 10,000 external tester
- [ ] Build geçerlilik: 90 gün

### 6.3 Beta Hedefleri

- [ ] En az **50 external tester**
- [ ] **2 hafta** beta süresi
- [ ] Crash-free users > 99.5%
- [ ] At least 5 different device models tested
- [ ] At least 3 substantive feedback notes

### 6.4 Beta Feedback Yönetimi

- [ ] Feedback formu (Google Forms veya Linear)
- [ ] Bug tracker (GitHub Issues)
- [ ] TestFlight'tan gelen feedback ekran görüntüleri inceleme

---

## 7. ASO (App Store Optimization)

### 7.1 Keyword Research

| Tip                                    | Anahtar Kelimeler                                                                    |
| -------------------------------------- | ------------------------------------------------------------------------------------ |
| **High volume / High competition**     | malta, calculator, finance, tax                                                      |
| **Medium volume / Medium competition** | malta tax, malta salary, mortgage calculator                                         |
| **Long tail / Low competition**        | malta net salary 2026, malta ssc 2026, malta payroll calculator, malta stamp duty 5% |
| **Brand defense**                      | malta calculator, maltacalculator                                                    |

### 7.2 Tools

- App Store Connect Search Ads (free keyword popularity)
- AppFollow (paid)
- Sensor Tower (paid)
- Apple's free "Search Ads" attribution

### 7.3 Localized Keywords (v1.1)

- **MT**: kalkulatur maltin, salarju malta, taxxa, ipoteka
- **TR**: malta maaş hesaplama, malta vergi, malta kredi
- **IT**: calcolatore stipendio malta, tasse malta, mutuo malta

### 7.4 Title & Subtitle Keyword Density

- **App name**: Malta Calculator (brand only, 16 char)
- **Subtitle**: "Salary, Tax & Finance Tools" (3 keywords, 30 char)
- **Keywords field**: Use unique words, not repeats from name/subtitle (Apple counts them combined)

---

## 8. App Review Hazırlığı

### 8.1 Review Guidelines Compliance

Apple App Review Guidelines kontrol:

- [ ] **2.1 App Completeness** — Crash-free, all advertised features work
- [ ] **2.3 Accurate Metadata** — Screenshots match actual UI, no misleading claims
- [ ] **3.1.1 In-App Purchase** — IAP yok, free
- [ ] **4.0 Design** — Native iOS UI, follows HIG
- [ ] **5.1.1 Privacy** — Data collection accurate disclosure
- [ ] **5.1.2 Privacy Policy** — Live and accessible

### 8.2 Demo Account

In-app sign-in yok → demo account gerekmez. Notes alanına yaz:

> "No account required. All features available offline. App is a finance calculator for Malta residents."

### 8.3 Notes for Review

```text
Malta Calculator is a financial calculation tool for Malta residents.

— No account or sign-up required
— No in-app purchases
— No subscriptions
— No third-party tracking or analytics
— Works fully offline

The tax data is sourced from official Malta CFR (https://cfr.gov.mt) and Social Security Department (https://socialsecurity.gov.mt).

If you have any questions during review, contact:
review@maltacalculator.com
```

### 8.4 Rejection Risk Mitigation

| Risk                        | Mitigation                                                         |
| --------------------------- | ------------------------------------------------------------------ |
| "Misleading marketing"      | No "#1", "Best", "Free forever" without disclaimer                 |
| "Inaccurate financial info" | Disclaimer screen + Settings disclosure                            |
| "Incomplete app"            | All 17 calculators must be functional, not "coming soon" prominent |
| "Privacy mismatch"          | Privacy nutrition label matches code reality                       |
| "Crash on launch"           | Test on 5+ device models before submission                         |

---

## 9. Build Submission Checklist

- [ ] Version number: `1.0.0`
- [ ] Build number: incremental (Fastlane handles)
- [ ] Code signed with Distribution cert
- [ ] Bitcode: disabled (Apple deprecated)
- [ ] Symbols stripped
- [ ] Archive uploaded to App Store Connect
- [ ] Build processed (15-60 min)
- [ ] Build selected for release
- [ ] All required metadata filled
- [ ] All screenshots uploaded
- [ ] Privacy questions answered
- [ ] Age rating answered
- [ ] App Review notes added
- [ ] Pricing & availability set
- [ ] Submit for Review

---

## 10. Release Plan

### 10.1 Release Type

- [ ] **Manual Release** — control launch day timing
- [ ] **Phased Release** — 1%, 2%, 5%, 10%, 20%, 50%, 100% over 7 days (recommended for v1)

### 10.2 Launch Day Checklist

- [ ] Marketing site updated (`https://maltacalculator.com`)
- [ ] "Get on App Store" badge on web home page
- [ ] Press kit ready (screenshots, logo, description)
- [ ] Social media posts scheduled:
  - [ ] Twitter/X
  - [ ] LinkedIn
  - [ ] Facebook (Malta groups)
  - [ ] Reddit r/malta
- [ ] Mailing list announcement (if any)
- [ ] Product Hunt submission planned
- [ ] Screenshots on web blog posts
- [ ] App Store badge SVG
- [ ] Universal link (`maltacalculator.com/app/...`) ready
- [ ] Domain redirect: `maltacalculator.com/ios` → App Store URL

### 10.3 Post-Launch (First 7 Days)

- [ ] Daily check: crash reports, reviews, ratings
- [ ] Daily check: ASC analytics (impressions, downloads)
- [ ] Respond to reviews (positive AND negative)
- [ ] Update FAQ based on user questions
- [ ] Bug hotfix if any critical (1.0.1)

### 10.4 Post-Launch (First 30 Days)

- [ ] ASO keyword performance review
- [ ] User feedback synthesis → v1.1 backlog
- [ ] Press outreach (Maltese tech blogs, news)
- [ ] Community engagement
- [ ] First minor update (bug fixes + small improvements)

---

## 11. Fastlane Release Lane

```ruby
desc "Release to App Store"
lane :release do
  ensure_git_status_clean
  ensure_git_branch(branch: 'main')

  match(type: 'appstore', readonly: true)

  increment_build_number(xcodeproj: 'MaltaCalculator.xcodeproj')

  # Run tests one more time
  run_tests(
    workspace: 'MaltaCalculator.xcworkspace',
    scheme: 'MaltaCalculator',
    devices: ['iPhone 16 Pro']
  )

  build_app(
    workspace: 'MaltaCalculator.xcworkspace',
    scheme: 'MaltaCalculator',
    export_method: 'app-store'
  )

  upload_to_app_store(
    submit_for_review: true,
    automatic_release: false,  # manual launch
    force: true,
    skip_screenshots: false,
    skip_metadata: false,
    submission_information: {
      add_id_info_uses_idfa: false,
      export_compliance_uses_encryption: false,
      content_rights_contains_third_party_content: false,
    }
  )

  add_git_tag(tag: "v#{get_version_number}")
  push_git_tags

  slack(
    message: "🚀 Malta Calculator v#{get_version_number} submitted for review!",
    success: true
  )
end
```

---

## 12. v1 → v1.1 Roadmap

| Feature                                                 | Hedef Sürüm |
| ------------------------------------------------------- | ----------- |
| Coming soon 12 hesaplayıcı (Bonus Tax, Maternity, etc)  | v1.1        |
| Lokalizasyon: MT, TR, IT                                | v1.1        |
| Remote tax config update                                | v1.1        |
| Home Screen Widget                                      | v1.2        |
| iCloud sync default on                                  | v1.2        |
| Apple Watch companion (small calc)                      | v1.2        |
| Mac Catalyst                                            | v1.3        |
| Subscription PRO (advanced features, payslip generator) | v2.0        |

---

## 13. Acceptance Criteria

- [ ] App approve edildi ve App Store'da canlı
- [ ] `1.0.0` indirilebilir
- [ ] TestFlight beta crash-free > 99.5%
- [ ] Store listing tüm alanlar dolu
- [ ] Screenshots tüm gerekli boyutlarda
- [ ] Privacy nutrition label doğru
- [ ] Privacy manifest dosyası bundled
- [ ] Marketing site canlı
- [ ] Universal link hazır (v1.1)
- [ ] Launch duyurusu yayınlandı (en az 3 kanal)
- [ ] İlk 24 saat: 0 crash report
- [ ] Tag `v1.0.0` push edildi

---

## 14. Plan Sonu

Plan burada kapanıyor. v1.1 için yeni roadmap hazırlanacak.

Referans: [`17-calculator-mapping.md`](17-calculator-mapping.md)
