# Obtención del nombre del script.
$scriptName = [System.IO.Path]::GetFileName($PSCommandPath)

# Obtener la ruta raíz del proyecto (un nivel arriba de scripts)
$proyectoRaiz = Split-Path -Parent (Split-Path -Parent $PSCommandPath)

Write-Output "`n${scriptName} -> Iniciando el proceso para obtener el esquema de la base de datos local."

# Definición de credenciales y nombre de la base de datos
$dbUser = "root"
$dbPassword = "root"
$dbName = "data_burst"
# Guardar el archivo en la raíz del proyecto, no en la carpeta scripts
$outputFile = "$proyectoRaiz/data_burst_schema.sql"

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

# Obtener la ruta del directorio de MariaDB para mysqldump.exe
$mysqlDir = [System.IO.Path]::GetDirectoryName($mysqlExe)
$mysqldumpExe = Join-Path $mysqlDir "mysqldump.exe"

if (-not (Test-Path $mysqldumpExe)) {
    Write-Output "`n${scriptName} -> No se pudo encontrar mysqldump.exe en $mysqlDir"
    exit 1
}

Write-Output "`n${scriptName} -> Usando MySQL cliente desde: $mysqlExe"
Write-Output "`n${scriptName} -> Usando MySQLDump desde: $mysqldumpExe"

# Crear archivo de salida y limpiarlo si existe
"" | Set-Content -Path $outputFile

try {
    # Probar la conexión primero
    Write-Output "`n${scriptName} -> Probando conexión a la base de datos..."
    $testCmd = "& `"$mysqlExe`" -u `"$dbUser`" -p`"$dbPassword`" -e `"SELECT 'Conexión exitosa';`""
    $testResult = Invoke-Expression $testCmd 2>&1
    
    if ($testResult -match "ERROR") {
        throw "Error de conexión: $testResult"
    }
    
    # Usar mysqldump para obtener la estructura completa de la base de datos
    Write-Output "`n${scriptName} -> Obteniendo estructura de la base de datos usando mysqldump..."
    
    $dumpCommand = "& `"$mysqldumpExe`" --no-data --skip-triggers --skip-comments --compact -u `"$dbUser`" -p`"$dbPassword`" `"$dbName`" > `"$outputFile`""
    
    # Usar Invoke-Expression para ejecutar el comando y redirigir la salida al archivo
    $null = Invoke-Expression $dumpCommand
    
    # Verificar si el archivo tiene contenido
    $fileSize = (Get-Item -Path $outputFile).Length
    
    if ($fileSize -eq 0) {
        throw "El archivo de salida está vacío. Algo falló durante el volcado de la base de datos."
    }
    
    Write-Output "`n${scriptName} -> Esquema de la base de datos obtenido y guardado en '$outputFile'."
    Write-Output "`n${scriptName} -> Tamaño del archivo: $([Math]::Round($fileSize/1KB, 2)) KB"
}
catch {
    Write-Output "`n${scriptName} -> Error al obtener el esquema de la base de datos: $_"
    
    # Sugerencias para solucionar problemas comunes
    Write-Output "`n${scriptName} -> Sugerencias para solucionar el problema:"
    Write-Output "1. Verifica que el servicio MariaDB esté en ejecución."
    Write-Output "2. Confirma que las credenciales de usuario y contraseña son correctas."
    Write-Output "3. Verifica que la base de datos '$dbName' exista."
    Write-Output "4. Intenta ejecutar este comando manualmente para verificar:"
    Write-Output "   mysqldump --no-data -u root -proot $dbName > $outputFile"
}