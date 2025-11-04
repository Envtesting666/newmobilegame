# 🚀 KOLAY KURULUM - TEK KOMUT

## Windows için:

```cmd
cd C:\game
git clone https://github.com/Envtesting666/newmobilegame.git
cd newmobilegame
git checkout claude/football-manager-game-build-011CUoHP58QWdaLmxYZF9zrQ
npm install --legacy-peer-deps --force
npm start
```

## Sorun Yaşarsan:

### Çözüm 1: Cache temizle
```cmd
cd C:\game\newmobilegame
npm cache clean --force
rmdir /s /q node_modules
del package-lock.json
npm install --legacy-peer-deps --force
npm start
```

### Çözüm 2: Yarn kullan (Daha güvenilir)
```cmd
npm install -g yarn
cd C:\game\newmobilegame
yarn install
yarn start
```

### Çözüm 3: Farklı Node versiyonu
Node.js v18 veya v20 kullan: https://nodejs.org/

---

## ✅ Başarılı Olunca:

Tarayıcıda otomatik açılır: **http://localhost:3000**

Göreceksin:
- ⚽ Football Manager AI logosu
- 📝 İsim giriş ekranı
- 🎨 Apple-tarzı dark mode tasarım

---

## 🎮 Oyun Akışı:

1. Adını gir
2. Lig seç (La Liga / Süper Lig)
3. Takım seç
4. Oyna!

---

## 📞 Yardım:

Sorun yaşarsan:
1. Hata mesajının ekran görüntüsünü al
2. GitHub Issues'a yaz
3. Veya bana ulaş

**Keyifli oyunlar! 🚀⚽**
