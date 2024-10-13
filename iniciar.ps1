# Función para limpiar las migraciones previas.
function limpiarMigracionesPrevias {
    Write-Output "${scriptName} -> Limpiando las migraciones previas."
    if (-Not (Test-Path -Path "./migrations")) {
        New-Item -ItemType Directory -Path "./migrations"
    }
    Set-Location -Path "./migrations"
    Get-ChildItem -Path . -Filter *.php -Recurse | Remove-Item -Force
    Set-Location -Path ".."
}

$scriptName = [System.IO.Path]::GetFileName($PSCommandPath)
Write-Output "`n${scriptName} -> Iniciando la aplicación web."

# Definición del contenedor y su volumen.
$containerName = "data_burst-BD"
$volumeContainerName = "data_burst-BD_volume"

# Función que detiene y elimina el contenedor y su volumen.
function limpiezaContenedor {
    Write-Output "${scriptName} -> Limpiando el contenedor de la BD existente."
    docker stop $containerName
    docker rm -v $containerName
    docker volume rm $volumeContainerName
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
limpiarMigracionesPrevias
Write-Output "`n${scriptName} -> Iniciando el proceso de Symfony.`n"
Start-Sleep -Seconds 3
composer update
php bin/console doctrine:database:create
php bin/console make:migration
php bin/console doctrine:migrations:migrate --no-interaction
Start-Process -FilePath "powershell" -ArgumentList "symfony server:start" -PassThru -NoNewWindow

# Inicia el servicio de Angular en segundo plano.
Write-Output "`n${scriptName} -> Iniciando el proceso de Angular.`n"
Set-Location -Path "../frontend"
npm install
Start-Process -FilePath "powershell" -ArgumentList "ng serve" -PassThru -NoNewWindow

# Finalizar la aplicación web.
Write-Output "`n${scriptName} -> Pulsa ENTER para finalizar la aplicación web.`n"
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

    # Eliminar contenedor de la BD.
    limpiezaContenedor

    # Eliminar migraciones previas.
    Set-Location -Path "./api"
    limpiarMigracionesPrevias

    Set-Location -Path "../"
    Write-Output "`n${scriptName} -> Aplicación web finalizada."