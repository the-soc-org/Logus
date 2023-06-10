# Czujnikownia
Zestaw aplikacji probot do zbierania informacji o zdarzeniach na żądaniach ściągnięcia.

## Użycie
- instalacja [aplikacji GitHub](https://github.com/apps/czujnikownia) wewnątrz organizacji
- sklonowanie repozytorium
- [skonfigurowanie](#konfiguracja) ustawień w razie potrzeby
- użycie poleceń wewnątrz folderu z repozytorium:
  - `npm install` - [instalacja wszystkich niezbędnych pakietów](https://docs.npmjs.com/cli/v8/commands/npm-install#description)
  - `npm run build` - transpilacja kodu TypeScript do JavaScript
  - `npm start` - uruchamienie serwera obsługującego aplikację GitHub

**Uwaga**: każda [zmiana uprawnień aplikacji GitHub przez autora](https://docs.github.com/en/apps/maintaining-github-apps/modifying-a-github-app#changing-the-permissions-of-a-github-app) będzie wymagała potwierdzenia mailowego przez osoby z aktywną instalacją aplikacji.

Chcąc wykorzystać kod źródłowy zawarty w tym repozytorium w nowej aplikacji GitHub, wystarczy przed uruchomieniem usunąć plik `.env`, a następnie podążać za instrukcjami w [dokumentacji probot](https://probot.github.io/docs/development/#configuring-a-github-app).

## Konfiguracja
Konfiguracja aplikacji na poziomie organizacji możliwa jest poprzez dodanie pliku `.github/sensor-room.yml` do repozytorium `.github-private` lub `.github` wewnątrz organizacji.

Przykładowa konfiguracja `sensor-room.yml`:
```yml
keywordSettings:
  - teamNameTrigger: "20"
    projectTitlePrefix: "monitor-"
    projectTemplateNumber: 6
    openPullRequestDateProjectFieldName: "Open Date"
    lastReviewSubmitDateProjectFieldName: "Last Review Date"
    reviewIterationNumberFieldName: "Review Iteration"
  - teamNameTrigger: "24"
    projectTitlePrefix: "sensor-"
```

- `keywordSettings` - zbiór ustawień dla poszczególnych słów kluczowych
- `teamNameTrigger` - słowo kluczowe wyszukiwane w nazwie utworzonego zespołu, które wyzwala tworzenie nowego projektu w organizacji
- `projectTitlePrefix` - przedrostek tytułu tworzonego projektu
- `projectTemplateNumber` - numer istniejącego projektu w organizacji, który wykorzystywany zostanie jako wzór dla nowo tworzonego projektu. Jeżeli nie ustawiono, to nowo tworzony projekt będzie pusty.
- `openPullRequestDateProjectFieldName` - nazwa kolumny pola, do którego zostanie wpisana data utworzenia *żądania ściągnięcia* przez użytkownika, który jest członkiem zespołu o nazwie zawierającej słowo kluczowe. Repozytorium, w którym utworzono żądanie, musi być powiązane z zespołem. Parametr opcjonalny.
- `lastReviewSubmitDateProjectFieldName` - nazwa kolumny pola, do którego zostanie wpisana data przesłania ostatniej recenzji *żądania ściągnięcia* przez użytkownika, który jest członkiem zespołu o nazwie zawierającej słowo kluczowe. Parametr opcjonalny.
- `reviewIterationNumberProjectFieldName` - nazwa kolumny pola, do którego zostanie wpisana ilość obecnie wykonanych recenzji *żądania ściągnięcia*. Parametr opcjonalny.