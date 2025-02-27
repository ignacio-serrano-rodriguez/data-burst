# Obtención del nombre del script.
$scriptName = [System.IO.Path]::GetFileName($PSCommandPath)

Write-Output "`n${scriptName} -> Iniciando la aplicación web."

# Comprobar si MariaDB está en ejecución en Windows
$mariaDBService = Get-Service -Name "MariaDB" -ErrorAction SilentlyContinue
if ($mariaDBService -and $mariaDBService.Status -ne "Running") {
    Write-Output "`n${scriptName} -> El servicio de MariaDB no está en ejecución. Iniciándolo."
    Start-Service -Name "MariaDB"
    # Esperar a que MariaDB se inicie completamente
    Write-Output "`n${scriptName} -> Esperando a que MariaDB se inicie completamente."
    Start-Sleep -Seconds 5
} elseif (-not $mariaDBService) {
    Write-Output "`n${scriptName} -> El servicio de MariaDB no está instalado como servicio de Windows. Asegúrate de que esté en ejecución manualmente."
} else {
    Write-Output "`n${scriptName} -> El servicio de MariaDB ya está en ejecución."
}

# Verificar y eliminar el directorio de migraciones si existe.
$migrationsPath = "./api/migrations"
if (Test-Path -Path $migrationsPath) {
    Write-Output "`n${scriptName} -> El directorio de migraciones existe. Eliminándolo."
    Remove-Item -Recurse -Force -Path $migrationsPath
}

# Inicio del servicio de Symfony en segundo plano.
Set-Location -Path "./api"
Write-Output ""
Write-Output "${scriptName} -> Generando directorio de migraciones."
New-Item -ItemType Directory -Path "./migrations" -Force
Write-Output "`n${scriptName} -> Iniciando el proceso de Symfony en segundo plano.`n"
Start-Sleep -Seconds 3
symfony server:stop
composer install

# Intentar crear la base de datos si no existe
Write-Output "`n${scriptName} -> Intentando crear la base de datos si no existe.`n"
php bin/console doctrine:database:create --if-not-exists

# Crear migraciones
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
Start-Process powershell -ArgumentList "cd `"$PWD`"; Write-Output 'Esta es la terminal de Symfony'; symfony server:start --no-tls"

# Inicio del servicio de Angular en una nueva terminal y redirigir la salida de error a este terminal
Write-Output "${scriptName} -> Iniciando el proceso de Angular en una nueva terminal.`n"
Set-Location -Path "../frontend"
npm ci
Start-Process powershell -ArgumentList "cd `"$PWD`"; Write-Output 'Esta es la terminal de Angular'; ng serve 2>&1"

# Volver al directorio de trabajo original
Set-Location -Path "../"

# Llamar al script obtener-esquema-sql.ps1 para obtener el esquema de la base de datos
Write-Output "`n${scriptName} -> Ejecutando el script obtener-esquema-sql.ps1 para obtener el esquema de la base de datos local.`n"
.\obtener-esquema-sql.ps1

# Aplicación web inicializada correctamente.
Write-Output "`n${scriptName} -> Aplicación web inicializada."
Write-Output "${scriptName} -> Backend (Symfony) en http://localhost:8000/api"
Write-Output "${scriptName} -> Frontend (Angular) en http://localhost:4200"

# Esperar a que el usuario pulse ENTER para cerrar el terminal
Write-Output "`n${scriptName} -> Pulse ENTER para cerrar este terminal."
Read-Host