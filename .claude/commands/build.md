# Build & Verify Workflow

Projeyi build edip doğrulamak için bu workflow'u takip et.

## Adımlar

### 1. Lint Kontrolü

```bash
npm run lint
```

Hata varsa düzelt, sonra devam et.

### 2. TypeScript Build

```bash
npm run build
```

Build başarılı olmalı. Hatalar varsa:

- Type hataları: İlgili interface/type tanımlarını kontrol et
- Import hataları: Dosya yollarını kontrol et (`@/` alias kullanılmalı)
- Missing module: `npm install` çalıştır

### 3. Build Çıktısını Kontrol Et

Build başarılı olduktan sonra:

- Static sayfaların doğru oluşturulduğunu kontrol et
- Route'ların listelendiğini doğrula

### 4. Development Server (Opsiyonel)

```bash
npm run dev
```

Browser'da kontrol et:

- Sayfa doğru yükleniyor mu?
- Console'da hata var mı?
- Responsive tasarım çalışıyor mu?

## Yaygın Hatalar ve Çözümleri

### Type Errors

```
Type 'X' is not assignable to type 'Y'
```

**Çözüm**: Interface tanımlarını kontrol et, gerekirse type assertion kullan

### Missing Exports

```
Module '"@/components/..."' has no exported member 'X'
```

**Çözüm**: Export edilmiş mi kontrol et, import yolunu düzelt

### Hydration Errors

```
Text content does not match server-rendered HTML
```

**Çözüm**: `"use client"` direktifini ekle, dynamic import kullan

### Dynamic Server Usage

```
Dynamic server usage: ...
```

**Çözüm**: `force-static` ayarını ekle veya data fetching'i kontrol et

## Checklist

- [ ] `npm run lint` hatasız
- [ ] `npm run build` başarılı
- [ ] Yeni sayfalar route listesinde görünüyor
- [ ] Development server'da test edildi
