# Czujnikownia
Zestaw aplikacji probot do zbierania informacji o zdarzeniach na żądaniach ściągnięcia.

## Użycie
- instalacja [aplikacji GitHub](https://github.com/apps/czujnikownia) wewnątrz organizacji
- sklonowanie repozytorium
- [skonfigurowanie](#konfiguracja) ustawień w razie potrzeby
- użycie poleceń wewnątrz folderu z repozytorium:
  - `npm install` - [instalacja wszystkich niezbędnych pakietów](https://docs.npmjs.com/cli/v8/commands/npm-install#description)
  - `npx patch-package` - instalacja poprawek do pakietów
  - `npm run build` - transpilacja kodu TypeScript do JavaScript
  - `npm start` - uruchamienie serwera obsługującego aplikację GitHub

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
- `lastApprovedReviewSubmitDateProjectFieldName` - nazwa kolumny pola, do którego zostanie wpisana data przesłania ostatniej pozytywnej recenzji *żądania ściągnięcia* przez użytkownika, który jest członkiem zespołu o nazwie zawierającej słowo kluczowe. Parametr opcjonalny.
- `reviewIterationNumberProjectFieldName` - nazwa kolumny pola, do którego zostanie wpisana ilość obecnie wykonanych recenzji *żądania ściągnięcia*. Parametr opcjonalny.

Konfguracje dotyczące repozytorium można umieścić w jego zawartości pod nazwą `.github/czujnikownia-repo.yml` lub wewnątrz repozytorium `.github` jeżeli chcemy nadpisać domyślną konfigurację.

Przykładowa konfiguracja `czujnikownia-repo.yml`:
```yml
maxUTCHourOfDayToSendReminder: 19
minUTCHourOfDayToSendReminder: 8
reviewReminder:
  isEnabled: true
  minimalInactivityHoursToSend: 120
  message: "@reviewer proszę wykonać recenzję pracy @author."
replayToReviewReminder:
  isEnabled: true
  minimalInactivityHoursToSend: 48
  message: "@assignee proszę odnieść się do recenzji lub zamknąć Pull Request #number."
```
- `maxUTCHourOfDayToSendReminder` - najpóźniejsza godzina dnia czasu UTC, o której może zostać zamieszczony komentarz przypominający. Domyślnie 20 - najpóźniejszy komentarz będzie mógł być zamieszczony o 20:59 czasu UTC
- `minUTCHourOfDayToSendReminder` - najwcześniejsza godzina dnia czasu UTC, o które może zostać zamieszczony komentarz przypominający. Domyślnie 9
- `rewiewReminder` - ustawienia dotyczące zamieszczania komentarza przypominającego wyznaczonej osobie o potrzebie wykonania recenzji. Przypomnienie jest wysyłane kiedy jest wyznaczona osoba do recenzji i minęła wyznaczona liczba godzin od ostatniej aktywności w PR
- `replayToReviewReminder` - ustawienia dotyczące zamieszczania komentarza przypominającego o potrzebie odniesienia się do recenzji lub zamknięcia PR. Przypomnienie jest wysyłane kiedy zamieszczona została przynajmniej jedna recenzja, nie ma aktywnej prośby o wykonanie nowej recenzji i minęła wyznaczona liczba godzin od ostatniej aktywności w PR
  - `isEnabled` - określa czy dane przypomnienie ma być wysyłane. Domyślnie `false`
  - `minimalInactivityHoursToSend` - określa minimalną liczbę godzin, która musi upłynąć od ostatniej aktywności w PR, aby przypomnienie zostało wysłane
  - `message` - treść zamieszczanego komentarza w PR. Niektóre wartości zostaną zamienione w zależności od kontekstu
    - `@reviewer` - zostanie zamieniony na wzmiankę pierwszej osoby na liście *Reviewers*, która jest poproszona o wykonanie recenzji w PR
    - `@author` - zostanie zmieniony na wzmiankę autora *Pull Request*
    - `@assignee` - zostanie zmieniony na wzmiankę pierwszej osoby na liście *Assignees* w PR
    - `#number` - zostanie zamieniony na numer PR, w którym zamieszczane jest przypomnienie