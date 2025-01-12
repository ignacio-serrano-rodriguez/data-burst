# Obtención del nombre del script.
$scriptName = [System.IO.Path]::GetFileName($PSCommandPath)

Write-Output "`n${scriptName} -> Iniciando la aplicación web."

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

# Inicio del servicio de Symfony en segundo plano.
Set-Location -Path "./api"
Write-Output ""
Write-Output "${scriptName} -> Generando directorio de migraciones."
New-Item -ItemType Directory -Path "./migrations" -Force
Write-Output "`n${scriptName} -> Iniciando el proceso de Symfony en segundo plano.`n"
Start-Sleep -Seconds 3
symfony server:stop
composer update --lock
php bin/console doctrine:database:create
php bin/console make:migration

# Crear un archivo temporal con la respuesta "yes"
$tempFile = [System.IO.Path]::GetTempFileName()
Set-Content -Path $tempFile -Value "yes"

# Ejecutar las migraciones y redirigir la entrada desde el archivo temporal
Write-Output "`n${scriptName} -> Ejecutando las migraciones.`n"
Start-Process -FilePath "php" -ArgumentList "bin/console doctrine:migrations:migrate --no-interaction" -RedirectStandardInput $tempFile -Wait

# Eliminar el archivo temporal
Remove-Item -Path $tempFile

php bin/console doctrine:migrations:sync-metadata-storage

# Iniciar el servidor Symfony en una nueva terminal
Write-Output "${scriptName} -> Iniciando el servidor Symfony en una nueva terminal.`n"
Start-Process powershell -ArgumentList "cd `"$PWD`"; symfony server:start --no-tls"

# Inicio del servicio de Angular en una nueva terminal y redirigir la salida de error a este terminal
Write-Output "${scriptName} -> Iniciando el proceso de Angular en una nueva terminal.`n"
Set-Location -Path "../frontend"
npm ci
Start-Process powershell -ArgumentList "cd `"$PWD`"; ng serve 2>&1"

# Volver al directorio de trabajo original
Set-Location -Path "../"

# Aplicación web inicializada correctamente.
Write-Output "${scriptName} -> Aplicación web inicializada."
Write-Output "${scriptName} -> Backend (Symfony) en http://localhost:8000/api"
Write-Output "${scriptName} -> Frontend (Angular) en http://localhost:4200"