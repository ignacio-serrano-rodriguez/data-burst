$scriptName = [System.IO.Path]::GetFileName($PSCommandPath)
Write-Output "`n${scriptName} -> Iniciando la aplicación web."

# Definición del contenedor y su volumen.
$containerName = "data_burst-BD"
$volumeContainerName = "data_burst-BD_volume"

# Función que elimina el contenedor y el volumen de la BD.
function limpiezaContenedor {
    Write-Output "${scriptName} -> Limpiando el contenedor de la BD existente."
    docker rm -f $containerName
    # docker volume rm $volumeContainerName
}

# Comprueba si el contenedor ya existe.
$containerExists = docker ps -a --filter "name=$containerName" --format "{{.Names}}" | Select-String -Pattern "^$containerName$"

if ($containerExists) {
    Write-Output "`n${scriptName} -> El contenedor de la BD existe.`n"
    limpiezaContenedor
}

# Crea e inicia el contenedor.
Write-Output "`n${scriptName} -> Creando el contenedor de la BD.`n"
docker run --name ${containerName} -d -p 3306:3306 -e MARIADB_ROOT_PASSWORD=root -v ${volumeContainerName}:/var/lib/mysql mariadb

# Inicia el servicio de Symfony en segundo plano.
Set-Location -Path "./api"
Write-Output ""
Write-Output "${scriptName} -> Generando directorio de migraciones."
New-Item -ItemType Directory -Path "./migrations"
Write-Output "`n${scriptName} -> Iniciando el proceso de Symfony.`n"
Start-Sleep -Seconds 3
composer update
php bin/console doctrine:database:create
php bin/console make:migration
php bin/console doctrine:migrations:migrate --no-interaction
php bin/console doctrine:migrations:sync-metadata-storage
Start-Process -FilePath "powershell" -ArgumentList "symfony server:start" -PassThru -NoNewWindow

# Inicia el servicio de Angular en segundo plano.
Write-Output "${scriptName} -> Iniciando el proceso de Angular.`n"
Set-Location -Path "../frontend"
npm install
Start-Process -FilePath "powershell" -ArgumentList "ng serve" -PassThru -NoNewWindow

# Finalizar la aplicación web.
Write-Output "${scriptName} -> Aplicación web inicializada."
Write-Output "${scriptName} -> Backend (Symfony) http://localhost:8000/api"
Write-Output "${scriptName} -> Frontend (Angular) http://localhost:4200"
Write-Output "${scriptName} -> Pulsa ENTER para finalizar la aplicación web.`n"
Set-Location -Path "../"
$host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") | Out-Null
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
        Stop-Process -Id $symfonyProcess.Id -Force
    }

    # Llamada a la limpieza del contenedor.
    limpiezaContenedor

    # Eliminar directorio de migraciones.
    Write-Output "${scriptName} -> Eliminando directorio de migraciones."
    Remove-Item -Recurse -Force -Path "./api/migrations"

    Write-Output "`n${scriptName} -> Aplicación web finalizada."