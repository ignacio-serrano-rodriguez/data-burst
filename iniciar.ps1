# Obtención del nombre del script.
$scriptName = [System.IO.Path]::GetFileName($PSCommandPath)

Write-Output "`n${scriptName} -> Iniciando la aplicación web."

# Definición del nombre del contenedor y su volumen.
$containerName = "data_burst-BD"
$volumeContainerName = "data_burst-BD_volume"

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
New-Item -ItemType Directory -Path "./migrations"
Write-Output "`n${scriptName} -> Iniciando el proceso de Symfony en segundo plano.`n"
Start-Sleep -Seconds 3
composer update
php bin/console doctrine:database:create
php bin/console make:migration
php bin/console doctrine:migrations:migrate --no-interaction
php bin/console doctrine:migrations:sync-metadata-storage
symfony server:stop
Start-Process -FilePath "powershell" -ArgumentList "symfony server:start" -PassThru -NoNewWindow

# Inicio del servicio de Angular en segundo plano.
Write-Output "${scriptName} -> Iniciando el proceso de Angular en segundo plano.`n"
Set-Location -Path "../frontend"
npm install
Start-Process -FilePath "powershell" -ArgumentList "ng serve" -PassThru -NoNewWindow

# Aplicación web inicializada correctamente.
Write-Output "${scriptName} -> Aplicación web inicializada."
Write-Output "${scriptName} -> Backend (Symfony) en http://localhost:8000/api"
Write-Output "${scriptName} -> Frontend (Angular) en http://localhost:4200"

# Instrucciones de finalización de la aplicación web.
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