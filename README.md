# Czujnikownia
Zestaw aplikacji probot do zbierania informacji o zdarzeniach na żądaniach ściągnięcia

## Użycie
1. instalacja [aplikacji](https://github.com/apps/czujnikownia) wewnątrz organizacji
2. sklonowanie repozytorium
3. [skonfigurowanie](#konfiguracja) ustawień w razie potrzeby
4. użycie poleceń wewnątrz folderu z repozytorium:
```
npm install
npm run build
npm start
```

Uwaga: każda zmiana uprawnień aplikacji przez autora będzie wymagała potwierdzenia mailowego przez osoby z aktywną instalacją aplikacji.

Chcąc wykorzystać projekt w nowej aplikacji, wystarczy przed uruchomieniem usunąć plik `.env`, a następnie podążać za instrukcjami zawartymi w [dokumentacji probot](https://probot.github.io/docs/development/#configuring-a-github-app).

## Konfiguracja
Konfiguracja aplikacji możliwa jest poprzez dodanie pliku `.github/sensor-room.yml` do repozytorium `.github-private` wewnątrz organizacji.

Przykładowa konfiguracja `sensor-room.yml`:
```yml
teamNameKeywordTrigger: "20"
projectTitlePrefix: "monitor-"
```
