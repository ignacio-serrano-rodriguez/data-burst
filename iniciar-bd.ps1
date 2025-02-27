# Comprobar si Docker Desktop se está ejecutando
$dockerProcess = Get-Process -Name "Docker Desktop" -ErrorAction SilentlyContinue
if (-not $dockerProcess) {
    Write-Output "`n${scriptName} -> Docker Desktop no se está ejecutando. Iniciándolo."
    Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    # Esperar a que Docker Desktop se inicie completamente
    Write-Output "`n${scriptName} -> Esperando a que Docker Desktop se inicie completamente."
    Start-Sleep -Seconds 30
} else {
    Write-Output "`n${scriptName} -> Docker Desktop ya se está ejecutando."
}

# Definición del nombre del contenedor y su volumen.
$containerName = "data_burst-BD"
$volumeContainerName = "data_burst-BD_volume"

# Verificar y eliminar el directorio de migraciones si existe.
$migrationsPath = "./api/migrations"
if (Test-Path -Path $migrationsPath) {
    Write-Output "`n${scriptName} -> El directorio de migraciones existe. Eliminándolo."
    Remove-Item -Recurse -Force -Path $migrationsPath
}

# Comprueba si el contenedor ya existe, en caso afirmativo lo elimina.
$containerExists = docker ps -a --filter "name=$containerName" --format "{{.Names}}" | Select-String -Pattern "^$containerName$"
if ($containerExists) {
    Write-Output "`n${scriptName} -> El contenedor de la BD existe.`n"
    Write-Output "${scriptName} -> Eliminando el contenedor de la BD."
    docker rm -f $containerName
}

# Crea e inicia el contenedor.
Write-Output "`n${scriptName} -> Creando el contenedor de la BD.`n"
docker run --name ${containerName} -d -p 3306:3306 -e MARIADB_ROOT_PASSWORD=root -v ${volumeContainerName}:/var/lib/mysql mariadb