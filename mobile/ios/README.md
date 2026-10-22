# Malta Payslips (iOS)

Çalışanların bordrolarını gördüğü native SwiftUI uygulaması. Backend:
`/api/mobile/v1` (kontrat: `docs/api/mobile-v1.yaml`).

- iOS 17+, SwiftUI, Swift Concurrency, Observation
- Giriş: Clerk, e-posta kodu (şifresiz). Davet edilen e-postayla giriş yapan
  çalışanın hesabı `GET /me` çağrısında otomatik bağlanır.
- Push: Firebase Cloud Messaging (APNs üzerinden)
- Bordro PDF'i cihazda üretilir (`PayslipPDF`), sunucu PDF tutmaz.
- Face ID kilidi varsayılan açık; bordro listesi önbelleği
  `completeFileProtection` ile yazılır ve çıkışta silinir.

## Kurulum

1. Araçlar: Xcode 16+, `brew install xcodegen`
2. `cp Config/Secrets.example.xcconfig Config/Secrets.xcconfig` ve
   `CLERK_PUBLISHABLE_KEY` değerini web uygulamasındaki
   `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` ile aynı yap.
3. Firebase Console → iOS uygulaması ekle (bundle id
   `com.maltacalculator.employee`) → `GoogleService-Info.plist` dosyasını
   `MaltaPayslips/Resources/` içine koy. Dosya yoksa uygulama push olmadan
   çalışır.
4. `xcodegen generate && open MaltaPayslips.xcodeproj`
5. Signing & Capabilities: kendi takımını seç. Push Notifications yetkisi
   entitlements dosyasında hazır.

## Backend tarafında gerekenler

- Clerk Dashboard → Native applications: iOS uygulamasını (Team ID + bundle
  id) ekle, Email code girişini aç.
- Firebase → Project settings → Cloud Messaging: APNs Authentication Key
  (.p8) yükle.
- Firebase → Service accounts → yeni anahtar → JSON'u Vercel'de
  `FCM_SERVICE_ACCOUNT_JSON` olarak tanımla.
- Davet e-postaları için `RESEND_API_KEY`, `EMAIL_FROM`; App Store linki
  hazır olunca `EMPLOYEE_APP_URL`.

## Yapı

```
MaltaPayslips/
  App/        giriş noktası, oturum (AppSession), yönlendirme, push
  Auth/       Clerk sarmalayıcı (AuthService) ve giriş ekranı
  Core/       API istemcisi, modeller, biçimlendirme, kilit, önbellek
  Features/   Home, Payslips (liste + detay + PDF), Notifications, Settings
MaltaPayslipsTests/  API modeli çözümleme testleri
```

Clerk SDK'sına yalnızca `Auth/AuthService.swift` dokunur. SDK sürümü
değişirse sadece bu dosya güncellenir.
