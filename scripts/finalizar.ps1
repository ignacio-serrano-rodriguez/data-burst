# Obtención del nombre del script.
$scriptName = [System.IO.Path]::GetFileName($PSCommandPath)

# Obtener la ruta del proyecto (un nivel arriba de scripts)
$proyectoRaiz = Split-Path -Parent (Split-Path -Parent $PSCommandPath)

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
    # Cambiar al directorio api desde la raíz del proyecto
    Set-Location -Path "$proyectoRaiz/api"
    symfony server:stop
    Stop-Process -Id $symfonyProcess.Id -Force
    # Volver al directorio scripts
    Set-Location -Path "$proyectoRaiz/scripts"
}

# Nota sobre MariaDB
Write-Output "${scriptName} -> La base de datos MariaDB local permanece en ejecución."
Write-Output "${scriptName} -> Si deseas detener el servicio de MariaDB, puedes hacerlo manualmente desde Servicios de Windows."

# Eliminar directorio de migraciones.
Write-Output "${scriptName} -> Eliminando directorio de migraciones."
# Usar la ruta absoluta para el directorio de migraciones
Remove-Item -Recurse -Force -Path "$proyectoRaiz/api/migrations" -ErrorAction SilentlyContinue

Write-Output "`n${scriptName} -> Aplicación web finalizada."

# Esperar a que el usuario pulse ENTER para cerrar el terminal
Write-Output "`n${scriptName} -> Pulse ENTER para cerrar este terminal."
Read-Host