param(
    [Parameter(Mandatory = $true)]
    [string]$Destination
)

$ErrorActionPreference = 'Stop'
$repo = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$destination = [IO.Path]::GetFullPath($Destination)
$repoPrefix = $repo + [IO.Path]::DirectorySeparatorChar
if ($destination -eq $repo -or $destination.StartsWith($repoPrefix, [StringComparison]::OrdinalIgnoreCase)) {
    throw 'El destino del kit debe estar fuera del checkout.'
}
if (Test-Path -LiteralPath $destination) {
    throw 'El destino del kit debe ser una carpeta nueva.'
}

New-Item -ItemType Directory -Path $destination | Out-Null
$contents = Join-Path $destination 'kit'
node (Join-Path $repo 'scripts/prepare-pack-preview.mjs') $contents | Out-Null
if ($LASTEXITCODE -ne 0) {
    throw 'No se pudo preparar el contenido sintético.'
}
Copy-Item -LiteralPath (Join-Path $repo 'docs/KRONFORGE_EXTERNAL_TRIAL.md') -Destination (Join-Path $contents 'README.md')
Copy-Item -LiteralPath (Join-Path $repo 'docs/KRONFORGE_EXTERNAL_TRIAL_EVIDENCE.md') -Destination $contents
'{"roots":[],"packs":[]}' | Set-Content -LiteralPath (Join-Path $contents 'retire.json') -Encoding ascii

Add-Type -AssemblyName System.IO.Compression.FileSystem
$archiveName = 'kronforge-external-trial-v2.zip'
$archive = Join-Path $destination $archiveName
[IO.Compression.ZipFile]::CreateFromDirectory($contents, $archive)
$digest = (Get-FileHash -LiteralPath $archive -Algorithm SHA256).Hash.ToLowerInvariant()
Set-Content -LiteralPath (Join-Path $destination 'SHA256SUMS.txt') -Value "$digest  $archiveName" -Encoding ascii
[pscustomobject]@{Archive = $archive; SHA256 = $digest}
