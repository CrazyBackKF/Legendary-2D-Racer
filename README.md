# 🏎️ Gra Wyścigowa 2D (JavaScript Canvas)

Gra wyścigowa 2D stworzona przy użyciu **JavaScript** oraz **HTML5 Canvas**.  
Projekt skupia się na fizyce ruchu pojazdu, sztucznej inteligencji przeciwników, systemie kolizji oraz własnoręcznie przygotowanych mapach.

Można zagrać w wersję online tutaj:  
👉 https://legendary-2d-racer.netlify.app

---

## 🎮 Rozgrywka

Gra przedstawia wyścigi z widokiem z góry, w których gracz rywalizuje z botami sterowanymi przez sztuczną inteligencję.  
Podczas gry można kupować nowe samochody oraz ulepszać je w zakładce **tuning**. Sterowanie zostało opisane w **menu pomocy** znajdującym się w grze.

---

## 🗺️ Mapy

W grze znajduje się **5 map**, które zostały stworzone w programie **Tiled** z wykorzystaniem gotowych tilesetów:

- **1 mapa łatwa** – miejska (uliczna)
- **2 mapy średnie** – pustynne / piaskowe
- **2 mapy trudne** – śnieżne

---

## 🤖 Boty (AI)

W grze znajdują się cztery boty z różnymi zachowaniami:

1. **Stabilny bot** – jedzie ze średnią, stałą prędkością przez cały wyścig.  
2. **Bot strategiczny** – przyspiesza na prostych odcinkach i zwalnia na zakrętach.  
3. **Agresywny bot** – próbuje wjechać w gracza.  
4. **Taktyczny bot** – próbuje zajechać drogę graczowi:
   - zwalnia gdy jest przed graczem,
   - przyspiesza gdy jest za graczem,
   - zwalnia gdy gracz oddali się od niego zbyt daleko.

---

## 🧱 Przeszkody na torze

Na mapach znajdują się cztery typy przeszkód:

- **Olej** – zmniejsza prędkość pojazdu i mocno zmienia jego kąt skrętu.  
- **Dziura** – lekko zmniejsza prędkość i wpływa na kąt pojazdu.  
- **Słupek** – znacząco zmniejsza prędkość pojazdu.  
- **Kolce** – zatrzymują pojazd (prędkość spada do zera).

---

## 🎨 Grafika i interfejs

- Mapy zostały stworzone w **Tiled**.  
- Menu gry zostało zaprojektowane w **GIMP**.  
- Logo gry zostało wykonane w **Inkscape**.

---

## 🔊 Audio

Gra zawiera efekty dźwiękowe.  
Ze względu na politykę **CORS**, dźwięk może nie działać przy uruchamianiu gry lokalnie bez serwera. W takiej sytuacji należy uruchomić prosty serwer lokalny lub skorzystać z wersji online.

---

## 🧠 Zastosowane techniki programistyczne

Podczas tworzenia gry wykorzystano m.in.:

- rysowanie grafiki w **HTML5 Canvas**
- **programowanie obiektowe (OOP)** w JavaScript
- **SAT (Separating Axis Theorem)** do obsługi kolizji między obiektami.

---
