# Obtención del nombre del script.
$scriptName = [System.IO.Path]::GetFileName($PSCommandPath)

Write-Output "`n${scriptName} -> Eliminando el volumen de Docker 'data_burst-BD_volume'."

# Definición del nombre del volumen.
$volumeName = "data_burst-BD_volume"

# Verificar si el volumen existe.
$volumeExists = docker volume ls --filter "name=$volumeName" --format "{{.Name}}" | Select-String -Pattern "^$volumeName$"
if ($volumeExists) {
    Write-Output "`n${scriptName} -> El volumen '$volumeName' existe. Eliminándolo."
    docker volume rm $volumeName
    Write-Output "`n${scriptName} -> Volumen '$volumeName' eliminado correctamente."
} else {
    Write-Output "`n${scriptName} -> El volumen '$volumeName' no existe."
}

Write-Output "`n${scriptName} -> Operación completada."