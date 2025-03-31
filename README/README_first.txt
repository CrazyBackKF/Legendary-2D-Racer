Przesyłamy nasze zgłoszenie na konkurs Motorola Science Cup, o temacie "gra wyścigowa".

Gra została stworzona w języku JavaScript na canvas.

Dokumentację w formie dziennika, źródła assetów i autorów można znaleźć w tym samym folderze.
W grze znajduje się 5 map (1 łatwa - uliczna, 2 średnie - piaskowe, 2 trudne - śnieżne), które sami robiliśmy w programie Tiled z gotowych Tilesetów (kafelków).

Dla pomocy w testowaniu dodaliśmy "cheat cody":
- alt + m - dodanie dużej ilości pieniędzy (10000000000),
- alt + z - ulepszenie samochodu na maksa,
- alt + q - wyświetlanie hitboxów i kolizji w grze

W grze znajdują się cztery boty, które powinny odpowiednio:
- jechać stabilnie ze średnią prędkością przez cały wyścig
- przyspieszać na prostej i zwalniać na zakręcie
- próbować wjechać w gracza
- próbować zajechać drogę graczowi; zwalnia on gdy jest przed graczem i mocno przyspiesza, gdy jest za graczem; gdy gracz się bardzo oddali od niego to mocno zwalnia

Dzięki robieniu gry nauczyliśmy się:
- w lepszym stopniu programować w JavaScript i rysować na canvas
- programowania obiektowego
- funkcji trygonometrycznych, żeby móc obracać auto (sinus, cosinus) i liczyć jaki kąt mają mieć boty, żeby pojechali do następnego checkpointa (arcus tangens)

W grze znaduje się audio, ale w związku z polityką CORS nie odtwarza się ona po włączeniu gry lokalnie, z pliku. Trzeba stworzyć serwer, albo można również wejść na link:
https://legendary-2d-racer.netlify.app , na którym hostowana jest strona.

W grze znajdują się 4 przeszkody:
- olej - zmniejsza prędkość gracza i botów i bardzo zmienia ich kąt
- dziura - troche zmniejsza prędkość i kąt
- słupek - bardzo zmniejsza prędkość
- kolce - zmniejszają prędkość do zera

W grze można kupić nowe auta i ulepszenia w zakładce tuning. Sterowanie znajduje się w zakładce menu pomocy.
Wszystkie menu zostały robione przez nas w programie GIMP, a logo strony w programie INKSCAPE (jesteśmy dumni z menu startowego :) ).

Obsługa kolizji została zrobiona algorytmem SAT (Separating Axis Theorem) (użyta była przy tym pomoc ChatuGPT).

