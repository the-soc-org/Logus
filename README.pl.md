# Czujnikownia
[![en](https://img.shields.io/badge/lang-en-blue.svg)](https://github.com/IS-UMK/Czujnikownia/blob/master/README.md)
[![pl](https://img.shields.io/badge/lang-pl-red.svg)](https://github.com/IS-UMK/Czujnikownia/blob/master/README.pl.md)

Aplikacja GitHub oparta na bibliotece [Probot](https://github.com/probot/probot) służąca do automatyzacji zbierania informacji w *projektach* o zdarzeniach dotyczących żądań ściągnięć. Przeznaczona do instalowania wewnątrz organizacji.

## Użycie

### Tworzenie i uruchamianie nowej instancji
- instalacja środowiska [Node](https://nodejs.org/download/release/v18.19.0/)
- wykonanie poleceń wewnątrz folderu z kodem źródłowym:
  - `npm install` - [instalacja wszystkich niezbędnych pakietów](https://docs.npmjs.com/cli/v8/commands/npm-install#description)
  - `npm run build` - transpilacja kodu TypeScript do JavaScript
  - `npm start` - uruchamienie serwera obsługującego aplikację GitHub
- [rejestracja aplikacji GitHub](https://probot.github.io/docs/development/#configuring-a-github-app)
- instalacja wewnątrz wybranej organizacji
- ponowne uruchomienie przy pomocy polecenia `npm start`

### Wykorzystanie działającej instancji
- instalacja [aplikacji GitHub](https://github.com/apps/czujnikownia) wewnątrz organizacji
- [skonfigurowanie](#konfiguracja) ustawień

## Konfiguracja
Konfiguracja aplikacji na poziomie organizacji możliwa jest poprzez dodanie pliku `.github/czujnikownia-org.yml` do repozytorium `.github-private` lub `.github` wewnątrz organizacji.

Przechowywanie pliku konfiguracyjnego w repozytorium `.github-private` wymaga udzielenia aplikacji dostępu do tego repozytorium w ustawieniach organizacji – https://github.com/organizations/TWOJA-ORGANIZACJA/settings/installations 

Przykładowa konfiguracja `czujnikownia-org.yml`:
```yml
keywordConfigs:
  - teamNameTrigger: "20"
    projectTitlePrefix: "monitor-"
    projectTemplateNumber: 6
    openPullRequestDateProjectFieldName: "Open Date"
    firstReviewSubmitDateProjectFieldName: "First Review Date"
    lastReviewSubmitDateProjectFieldName: "Last Review Date"
    lastApprovedReviewSubmitDateProjectFieldName: "Last Approve Review Date"
    reviewIterationNumberProjectFieldName : "Review Iteration"
  - teamNameTrigger: "24"
    projectTitlePrefix: "sensor-"
```

- `keywordConfigs` - zbiór ustawień dla poszczególnych słów kluczowych
- `teamNameTrigger` - słowo kluczowe wyszukiwane w nazwie utworzonego zespołu, które wyzwala tworzenie nowego projektu w organizacji
- `projectTitlePrefix` - przedrostek tytułu tworzonego projektu
- `projectTemplateNumber` - numer istniejącego projektu w organizacji, który wykorzystywany zostanie jako wzór dla nowo tworzonego projektu. Jeżeli nie ustawiono, to nowo tworzony projekt będzie pusty.
- `openPullRequestDateProjectFieldName` - nazwa kolumny pola, do którego zostanie wpisana data utworzenia *żądania ściągnięcia* przez użytkownika, który jest członkiem zespołu o nazwie zawierającej słowo kluczowe. Repozytorium, w którym utworzono żądanie, musi być powiązane z zespołem. Parametr opcjonalny.
- `lastReviewSubmitDateProjectFieldName` - nazwa kolumny pola, do którego zostanie wpisana data przesłania ostatniej recenzji *żądania ściągnięcia* przez użytkownika, który jest członkiem zespołu o nazwie zawierającej słowo kluczowe. Parametr opcjonalny.
- `firstReviewSubmitDateProjectFieldName` - nazwa kolumny pola, do którego zostanie wpisana data przesłania pierwszej recenzji *żądania ściągnięcia* przez użytkownika, który jest członkiem zespołu o nazwie zawierającej słowo kluczowe. Parametr opcjonalny.
- `lastApprovedReviewSubmitDateProjectFieldName` - nazwa kolumny pola, do którego zostanie wpisana data przesłania ostatniej pozytywnej recenzji *żądania ściągnięcia* przez użytkownika, który jest członkiem zespołu o nazwie zawierającej słowo kluczowe. Parametr opcjonalny.
- `reviewIterationNumberProjectFieldName` - nazwa kolumny pola, do którego zostanie wpisana ilość obecnie wykonanych recenzji *żądania ściągnięcia*. Parametr opcjonalny.