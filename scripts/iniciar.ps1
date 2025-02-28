# Obtención del nombre del script.
$scriptName = [System.IO.Path]::GetFileName($PSCommandPath)

# Obtener la ruta raíz del proyecto (un nivel arriba de scripts)
$proyectoRaiz = Split-Path -Parent (Split-Path -Parent $PSCommandPath)

Write-Output "`n${scriptName} -> Iniciando la aplicación web."

# Comprobar si MariaDB está instalado y en ejecución
$mariaDBService = Get-Service -Name "MariaDB" -ErrorAction SilentlyContinue

if ($mariaDBService) {
    if ($mariaDBService.Status -ne "Running") {
        Write-Output "`n${scriptName} -> ERROR: El servicio de MariaDB no está en ejecución."
        Write-Output "Para que la aplicación funcione correctamente, debes iniciar el servicio MariaDB manualmente:"
        Write-Output "1. Abre el Panel de Control > Herramientas administrativas > Servicios"
        Write-Output "2. Busca el servicio 'MariaDB'"
        Write-Output "3. Haz clic derecho y selecciona 'Iniciar'"
        Write-Output "4. Vuelve a ejecutar este script cuando el servicio esté iniciado."
        
        Write-Output "`n${scriptName} -> Operación cancelada. El servicio MariaDB debe estar en ejecución."
        Read-Host "Presiona Enter para salir"
        exit 1
    } else {
        Write-Output "`n${scriptName} -> El servicio de MariaDB ya está en ejecución."
    }
}
else {
    Write-Output "`n${scriptName} -> ERROR: El servicio de MariaDB no está instalado como servicio de Windows."
    Write-Output "Para que la aplicación funcione correctamente, necesitas:"
    Write-Output "1. Instalar MariaDB como servicio de Windows"
    Write-Output "2. Iniciar el servicio"
    Write-Output "3. Volver a ejecutar este script"
    
    Write-Output "`n${scriptName} -> Operación cancelada. MariaDB debe estar instalado e iniciado como servicio."
    Read-Host "Presiona Enter para salir"
    exit 1
}

# Verificar conectividad a la base de datos
Write-Output "`n${scriptName} -> Verificando conectividad a MariaDB..."
$mysqlCheck = $null
try {
    # Buscar mysql.exe en ubicaciones comunes
    $mysqlPaths = @(
        "C:\Program Files\MariaDB*\bin\mysql.exe",
        "C:\Program Files (x86)\MariaDB*\bin\mysql.exe",
        "C:\MariaDB*\bin\mysql.exe"
    )
    
    $mysqlExe = $null
    foreach ($path in $mysqlPaths) {
        $found = Get-Item -Path $path -ErrorAction SilentlyContinue
        if ($found) {
            $mysqlExe = $found.FullName
            break
        }
    }
    
    if ($mysqlExe) {
        $mysqlCheck = & $mysqlExe -u root -proot -e "SELECT 'Connection test';" 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Output "`n${scriptName} -> Conexión a MariaDB establecida correctamente."
        } else {
            throw "Error al conectar a MariaDB: $mysqlCheck"
        }
    } else {
        Write-Output "`n${scriptName} -> ERROR: No se encontró el ejecutable mysql.exe."
        Write-Output "`n${scriptName} -> Verifica que MariaDB esté correctamente instalado."
        Read-Host "Presiona Enter para salir"
        exit 1
    }
} catch {
    Write-Output "`n${scriptName} -> ERROR: No se pudo conectar a MariaDB."
    Write-Output "Verifica que MariaDB está ejecutándose y que las credenciales son correctas."
    Write-Output "El error fue: $_"
    
    Write-Output "`n${scriptName} -> Operación cancelada. Se requiere una conexión funcional a MariaDB."
    Read-Host "Presiona Enter para salir"
    exit 1
}

# El resto del script continúa igual...
# Verificar y eliminar el directorio de migraciones si existe.
$migrationsPath = "$proyectoRaiz/api/migrations"
if (Test-Path -Path $migrationsPath) {
    Write-Output "`n${scriptName} -> El directorio de migraciones existe. Eliminándolo."
    Remove-Item -Recurse -Force -Path $migrationsPath
}

# Inicio del servicio de Symfony en segundo plano.
Set-Location -Path "$proyectoRaiz/api"
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
Set-Location -Path "$proyectoRaiz/frontend"
npm ci
Start-Process powershell -ArgumentList "cd `"$PWD`"; Write-Output 'Esta es la terminal de Angular'; ng serve 2>&1"

# Volver al directorio de trabajo original
Set-Location -Path "$proyectoRaiz/scripts"

# Llamar al script obtener-esquema-sql.ps1 para obtener el esquema de la base de datos
Write-Output "`n${scriptName} -> Ejecutando el script obtener-esquema-sql.ps1 para obtener el esquema de la base de datos local.`n"
& "$proyectoRaiz\scripts\obtener-esquema-sql.ps1"

# Aplicación web inicializada correctamente.
Write-Output "`n${scriptName} -> Aplicación web inicializada."
Write-Output "${scriptName} -> Backend (Symfony) en http://localhost:8000/api"
Write-Output "${scriptName} -> Frontend (Angular) en http://localhost:4200"

# Esperar a que el usuario pulse ENTER para cerrar el terminal
Write-Output "`n${scriptName} -> Pulse ENTER para cerrar este terminal."
Read-Host