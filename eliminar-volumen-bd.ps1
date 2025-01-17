# Obtención del nombre del script.
$scriptName = [System.IO.Path]::GetFileName($PSCommandPath)

Write-Output "`n${scriptName} -> Eliminando el volumen de Docker 'data_burst-BD_volume'."

# Definición del nombre del volumen.
$volumeName = "data_burst-BD_volume"

# Verificar si el volumen existe.
$volumeExists = docker volume ls --filter "name=$volumeName" --format "{{.Name}}" | Select-String -Pattern "^$volumeName$"
if ($volumeExists) {
    # Verificar si el volumen está siendo usado por algún contenedor.
    $volumeInUse = docker ps -a --filter "volume=$volumeName" --format "{{.Names}}"
    if (-not $volumeInUse) {
        Write-Output "`n${scriptName} -> El volumen '$volumeName' no está siendo usado. Eliminándolo."
        docker volume rm $volumeName
        Write-Output "`n${scriptName} -> Volumen '$volumeName' eliminado correctamente."
    } else {
        Write-Output "`n${scriptName} -> El volumen '$volumeName' está siendo usado por los siguientes contenedores: $volumeInUse. No se puede eliminar."
    }
} else {
    Write-Output "`n${scriptName} -> El volumen '$volumeName' no existe."
}

Write-Output "`n${scriptName} -> Operación completada."

# Esperar a que el usuario pulse ENTER para cerrar el terminal
Write-Output "`n${scriptName} -> Pulse ENTER para cerrar este terminal."
Read-Host