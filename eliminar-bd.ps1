# Obtención del nombre del script.
$scriptName = [System.IO.Path]::GetFileName($PSCommandPath)

Write-Output "`n${scriptName} -> Eliminando la base de datos 'data_burst' de MariaDB local."

# Definición de credenciales y nombre de la base de datos
$dbUser = "root"
$dbPassword = "root"
$dbName = "data_burst"

# Buscar el ejecutable mysql.exe en ubicaciones comunes
$mysqlPaths = @(
    "C:\Program Files\MariaDB*\bin\mysql.exe",
    "C:\Program Files (x86)\MariaDB*\bin\mysql.exe",
    "C:\MariaDB*\bin\mysql.exe",
    "C:\xampp\mysql\bin\mysql.exe"
)

$mysqlExe = $null
foreach ($path in $mysqlPaths) {
    $found = Get-Item -Path $path -ErrorAction SilentlyContinue
    if ($found) {
        $mysqlExe = $found.FullName
        break
    }
}

# Si no se encontró en ubicaciones comunes, pedir al usuario
if (-not $mysqlExe) {
    Write-Output "`n${scriptName} -> No se pudo encontrar mysql.exe en las ubicaciones comunes."
    $customPath = Read-Host "Por favor, introduce la ruta completa a mysql.exe (por ejemplo, C:\ruta\a\mysql.exe)"
    
    if (Test-Path $customPath) {
        $mysqlExe = $customPath
    } else {
        Write-Output "`n${scriptName} -> Ruta no válida. No se puede continuar."
        Write-Output "`n${scriptName} -> Pulse ENTER para cerrar este terminal."
        Read-Host
        exit 1
    }
}

Write-Output "`n${scriptName} -> Usando MySQL cliente desde: $mysqlExe"

# Verificar si MySQL/MariaDB está disponible
try {
    # Comprobar si existe la base de datos
    $checkDbCommand = "& '$mysqlExe' -u$dbUser -p$dbPassword -e ""SHOW DATABASES LIKE '$dbName';"" 2>&1"
    $checkResult = Invoke-Expression $checkDbCommand
    
    if ($checkResult -match $dbName) {
        # La base de datos existe, procedemos a eliminarla
        Write-Output "`n${scriptName} -> La base de datos '$dbName' existe. Eliminándola..."
        
        $dropCommand = "& '$mysqlExe' -u$dbUser -p$dbPassword -e ""DROP DATABASE $dbName;"" 2>&1"
        $dropResult = Invoke-Expression $dropCommand
        
        if ($LASTEXITCODE -eq 0 -or $null -eq $LASTEXITCODE) {
            Write-Output "`n${scriptName} -> Base de datos '$dbName' eliminada correctamente."
        } else {
            Write-Output "`n${scriptName} -> Error al eliminar la base de datos: $dropResult"
        }
    } else {
        Write-Output "`n${scriptName} -> La base de datos '$dbName' no existe."
    }
} catch {
    Write-Output "`n${scriptName} -> Error al conectar con MariaDB: $_"
    Write-Output "`n${scriptName} -> Asegúrate de que MariaDB está instalado y en ejecución."
}

Write-Output "`n${scriptName} -> Operación completada."

# Esperar a que el usuario pulse ENTER para cerrar el terminal
Write-Output "`n${scriptName} -> Pulse ENTER para cerrar este terminal."
Read-Host