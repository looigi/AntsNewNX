# AngularSolution — starter Nx per Angular 18

Questa cartella è uno **starter di configurazione**, non contiene il codice sorgente dei tuoi progetti.
È predisposta per:
- Angular 18.2.x
- Nx 22.2.x
- librerie Angular compilate con ng-packagr
- due applicazioni standalone: FleetManager e HomePage
- librerie: DataDictionaries, Mappe, Login, System, Utility

## Prima di iniziare

1. Usa Node.js `20.19.x` (intersezione compatibile con Nx 22 e Angular 18.2).
2. Fai una copia/backup delle repository attuali.
3. Verifica che i progetti siano tutti su Angular 18.2.x e che TypeScript sia `>=5.4 <5.6`.
4. Copia qui il contenuto di ciascun progetto, mantenendo le directory `src` e i file Angular CLI/ng-packagr.
5. Non sovrascrivere alla cieca i `package.json`, `tsconfig` o le configurazioni esistenti: unisci dipendenze e opzioni specifiche (Material, mappe, assets, styles, schematics, test, ecc.).

## Struttura attesa

- `apps/fleet-manager` e `apps/home-page`: applicazioni Angular.
- `libs/*`: librerie Angular.
- `dist/libs/*`: output ng-packagr.
- `artifacts/`: pacchetti `.tgz` generati per distribuzione esterna.

Se FleetManager o HomePage non sono applicazioni, spostale sotto `libs`.
Se uno degli altri progetti è un'applicazione, spostalo sotto `apps` e crea per esso un `project.json` applicativo basato su quello di `apps/fleet-manager`.

## Installazione

Dalla root:

```bash
npm install
```

Poi verifica i progetti riconosciuti:

```bash
npx nx show projects
npx nx graph
```

## Build

```bash
# tutte le librerie e applicazioni che hanno un target build
npx nx run-many -t build

# una singola applicazione
npx nx build fleet-manager

# una singola libreria
npx nx build data-dictionaries

# build dei progetti interessati rispetto al branch base
npx nx affected -t build --base=main --head=HEAD
```

`dependsOn: ["^build"]` ordina i target in base alle dipendenze rilevate dal project graph.
Le dipendenze vengono rilevate dagli import TypeScript che usano gli alias definiti in `tsconfig.base.json`.

## Collegare le librerie alle applicazioni

Gli alias sono già predisposti in `tsconfig.base.json`, ad esempio:

```ts
import { SomeService } from '@azienda/system';
import { SomeMapComponent } from '@azienda/mappe';
```

Sostituisci `@azienda` con lo scope/naming effettivamente desiderato. Gli alias devono corrispondere agli `importPath`/nomi pubblici delle librerie.

Per gli import tra librerie usa gli stessi alias, non percorsi relativi che attraversano cartelle di progetto.

## Librerie ng-packagr

Ogni libreria ha:
- `project.json`: target Nx `@nx/angular:package`
- `ng-package.json`: configurazione ng-packagr
- `tsconfig.lib.json`
- `src/public-api.ts`

Il `dest` di `ng-package.json` e `outputs` di `project.json` devono restare sincronizzati.

L'executor `@nx/angular:package` genera l'Angular Package Format. Per librerie che servono solo allo sviluppo interno si può valutare `@nx/angular:ng-packagr-lite`; per mantenere la distribuzione npm/TGZ usa `package`.

## Generare TGZ per distribuzione esterna

Dopo aver compilato una libreria:

```bash
npm run pack:data-dictionaries
```

I pacchetti finiscono in `artifacts/`. Aggiungi uno script analogo per ogni libreria da distribuire.
Non installare i TGZ nelle applicazioni interne della stessa workspace: usa gli alias locali.

## Configurare le applicazioni

I `project.json` applicativi sono esempi per il builder Angular `application`.
Confrontali con i vecchi `angular.json`: conserva esattamente `assets`, `styles`, `scripts`, `budgets`, `fileReplacements`, `baseHref`, `deployUrl`, configurazioni di produzione, service worker, proxy e ogni altra opzione presente.
Se il progetto usa ancora il builder `@angular-devkit/build-angular:browser`, mantieni quello durante la prima migrazione: non è necessario cambiare builder per adottare Nx.

## Nota sulle dipendenze

In un monorepo npm, Angular e le dipendenze comuni vanno installate una sola volta alla root.
Le `peerDependencies` delle librerie vanno mantenute nei `package.json` delle librerie quando si producono pacchetti distribuibili. Evita di includere copie multiple di `@angular/core` nei pacchetti.

## Migrazione consigliata

1. Migra una libreria semplice e verifica `nx build <nome>`.
2. Aggiungi le altre librerie e gli alias.
3. Migra una prima applicazione e verifica `nx build` e `nx serve`.
4. Ripeti per la seconda applicazione.
5. Verifica `nx graph`, `nx run-many -t build` e la generazione TGZ.
6. Solo dopo la migrazione valuta l'aggiornamento da Angular 18 a una versione Angular supportata.

## Importante

Questa configurazione è un punto di partenza coerente, ma non può essere considerata pronta alla compilazione senza i file reali dei progetti: non sono ancora noti entry point, builder effettivi, assets, styles, dipendenze npm, configurazioni di test e dipendenze tra le sette codebase.
