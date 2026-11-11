# Aggiorna info.json della login pubblicata: compilation_date = adesso, version = versione precedente + 1 (ultima cifra).
# Usato da Compila.bat.
#   -Info        file da scrivere (es. C:\GeoAnts\login\assets\info.json)
#   -Precedente  copia di info.json salvata prima di cancellare la vecchia login (da cui prendere la versione)
param(
  [Parameter(Mandatory = $true)][string]$Info,
  [string]$Precedente = ''
)
$ErrorActionPreference = 'Stop'

if (-not (Test-Path $Info)) {
  throw "File non trovato: $Info"
}
$dati = Get-Content -Raw $Info | ConvertFrom-Json

# Versione di partenza: quella pubblicata prima della copia; se manca, quella del file appena copiato
$versione = $dati.version
if ($Precedente -and (Test-Path $Precedente)) {
  $vecchio = Get-Content -Raw $Precedente | ConvertFrom-Json
  if ($vecchio.version) { $versione = $vecchio.version }
}
if (-not $versione) { $versione = '0.0.0' }

# Incrementa l'ultima parte numerica: 4.2.0 -> 4.2.1
$parti = "$versione".Split('.')
$ultima = 0
if (-not [int]::TryParse($parti[$parti.Length - 1], [ref]$ultima)) {
  throw "Versione non numerica: $versione"
}
$parti[$parti.Length - 1] = ($ultima + 1).ToString()
$nuovaVersione = $parti -join '.'
$data = Get-Date -Format 'dd/MM/yyyy HH:mm'

$dati | Add-Member -NotePropertyName compilation_date -NotePropertyValue $data -Force
$dati | Add-Member -NotePropertyName version -NotePropertyValue $nuovaVersione -Force

# Stesso formato del file originale (2 spazi, CRLF) e UTF-8 senza BOM: con il BOM il JSON non si legge nel browser
$righe = @()
$proprieta = @($dati.PSObject.Properties)
for ($i = 0; $i -lt $proprieta.Count; $i++) {
  $valore = $proprieta[$i].Value | ConvertTo-Json -Compress
  $virgola = if ($i -lt $proprieta.Count - 1) { ',' } else { '' }
  $righe += '  "' + $proprieta[$i].Name + '": ' + $valore + $virgola
}
$testo = "{`r`n" + ($righe -join "`r`n") + "`r`n}`r`n"
[IO.File]::WriteAllText($Info, $testo, (New-Object System.Text.UTF8Encoding($false)))

Write-Host "  info.json: versione $versione -> $nuovaVersione, compilation_date $data"
