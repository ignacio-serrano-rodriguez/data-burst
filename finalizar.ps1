# Obtención del nombre del script.
$scriptName = [System.IO.Path]::GetFileName($PSCommandPath)

Write-Output "`n${scriptName} -> Finalizando la aplicación web."

# Eliminar el proceso de Angular.
$angularProcess = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($angularProcess) {
    Write-Output "${scriptName} -> Deteniendo el proceso de Angular."
    Stop-Process -Id $angularProcess.Id -Force
}

# Eliminar el proceso de Symfony.
$symfonyProcess = Get-Process -Name "symfony" -ErrorAction SilentlyContinue
if ($symfonyProcess) {
    Write-Output "${scriptName} -> Deteniendo el proceso de Symfony."
    Set-Location -Path "./api"
    symfony server:stop
    Stop-Process -Id $symfonyProcess.Id -Force
    Set-Location -Path "../"
}

# Nota sobre MariaDB
Write-Output "${scriptName} -> La base de datos MariaDB local permanece en ejecución."
Write-Output "${scriptName} -> Si deseas detener el servicio de MariaDB, puedes hacerlo manualmente desde Servicios de Windows."

# Eliminar directorio de migraciones.
Write-Output "${scriptName} -> Eliminando directorio de migraciones."
Remove-Item -Recurse -Force -Path "./api/migrations"

Write-Output "`n${scriptName} -> Aplicación web finalizada."

# Esperar a que el usuario pulse ENTER para cerrar el terminal
Write-Output "`n${scriptName} -> Pulse ENTER para cerrar este terminal."
Read-Host