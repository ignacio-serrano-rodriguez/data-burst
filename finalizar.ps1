# Obtención del nombre del script.
$scriptName = [System.IO.Path]::GetFileName($PSCommandPath)

Write-Output "`n${scriptName} -> Finalizando la aplicación web."

# Definición del nombre del contenedor y su volumen.
$containerName = "data_burst-BD"
$volumeContainerName = "data_burst-BD_volume"

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

# Eliminar el contenedor de la BD.
Write-Output "${scriptName} -> Eliminando el contenedor de la BD."
docker rm -f $containerName
Write-Output "${scriptName} -> No se ha eliminado el volumen del contenedor."

# Eliminar directorio de migraciones.
Write-Output "${scriptName} -> Eliminando directorio de migraciones."
Remove-Item -Recurse -Force -Path "./api/migrations"

Write-Output "`n${scriptName} -> Aplicación web finalizada."

# Esperar a que el usuario pulse ENTER para cerrar el terminal
Write-Output "`n${scriptName} -> Pulse ENTER para cerrar este terminal."
Read-Host