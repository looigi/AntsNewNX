@echo off
rem ============================================================================
rem  Compila.bat - compila per produzione tutto il progetto e pubblica in C:\GeoAnts
rem
rem   1. build di produzione di librerie e app (si ferma se ci sono errori)
rem   2. cancella da C:\GeoAnts SOLO le cartelle che esistono in dist\apps
rem      (assets, aiProject, CheckUser, VECCHI, web.config... restano)
rem   3. copia le nuove versioni da dist\apps in C:\GeoAnts
rem   4. aggiorna C:\GeoAnts\login\assets\info.json: compilation_date = adesso,
rem      version = versione pubblicata prima + 1, e lo stesso file nei sorgenti
rem      (apps\login\src\assets\info.json)
rem ============================================================================
setlocal EnableExtensions
cd /d "%~dp0"

set "DEST=C:\GeoAnts"
set "DIST=%~dp0dist\apps"
set "INFO=%DEST%\login\assets\info.json"
set "INFO_PRECEDENTE=%TEMP%\GeoAnts_info_precedente.json"
set "INFO_SORGENTI=%~dp0apps\login\src\assets\info.json"

if not exist "%DEST%\" (
  echo ERRORE: la cartella %DEST% non esiste.
  pause
  exit /b 1
)

echo.
echo === 1/4  Compilazione di produzione ===
call node tools\build-report.mjs
if errorlevel 1 (
  echo.
  echo Compilazione fallita: %DEST% NON e' stato modificato.
  pause
  exit /b 1
)

rem Ogni app compilata deve avere index.html, altrimenti non si cancella niente
for /d %%D in ("%DIST%\*") do (
  if not exist "%%D\index.html" (
    echo ERRORE: %%D\index.html mancante, pubblicazione annullata.
    pause
    exit /b 1
  )
)

rem Versione pubblicata attuale: info.json sta dentro la cartella login, che sta per essere cancellata
if exist "%INFO_PRECEDENTE%" del /q "%INFO_PRECEDENTE%"
if exist "%INFO%" copy /y "%INFO%" "%INFO_PRECEDENTE%" >nul

echo.
echo === 2/4  Cancellazione delle vecchie versioni in %DEST% ===
for /d %%D in ("%DIST%\*") do (
  if exist "%DEST%\%%~nxD\" (
    echo   - %%~nxD
    rd /s /q "%DEST%\%%~nxD"
    if exist "%DEST%\%%~nxD\" (
      echo ERRORE: impossibile cancellare %DEST%\%%~nxD ^(file in uso? IIS da fermare?^)
      pause
      exit /b 1
    )
  )
)

echo.
echo === 3/4  Copia delle nuove versioni da dist\apps ===
for /d %%D in ("%DIST%\*") do (
  echo   + %%~nxD
  robocopy "%%D" "%DEST%\%%~nxD" /E /NFL /NDL /NJH /NJS /NP >nul
  if errorlevel 8 (
    echo ERRORE: copia di %%~nxD non riuscita.
    pause
    exit /b 1
  )
)

echo.
echo === 4/4  Aggiornamento di info.json ===
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\aggiorna-info.ps1" -Info "%INFO%" -Precedente "%INFO_PRECEDENTE%"
if errorlevel 1 (
  echo ERRORE: aggiornamento di %INFO% non riuscito.
  pause
  exit /b 1
)
if exist "%INFO_PRECEDENTE%" del /q "%INFO_PRECEDENTE%"

rem Stessa versione e data anche nei sorgenti, cosi' la prossima build parte gia' aggiornata
copy /y "%INFO%" "%INFO_SORGENTI%" >nul
if errorlevel 1 (
  echo ERRORE: aggiornamento di %INFO_SORGENTI% non riuscito.
  pause
  exit /b 1
)
echo   info.json aggiornato anche nei sorgenti: apps\login\src\assets\info.json

echo.
echo Pubblicazione completata in %DEST%.
pause
exit /b 0
