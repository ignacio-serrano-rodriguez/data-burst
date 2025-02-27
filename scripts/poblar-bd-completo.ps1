# Obtención del nombre del script.
$scriptName = [System.IO.Path]::GetFileName($PSCommandPath)

Write-Output "`n${scriptName} -> Iniciando el proceso para insertar datos de prueba en la base de datos (completo)."

# Definición de credenciales y nombre de la base de datos
$dbUser = "root"
$dbPassword = "root"
$dbName = "data_burst"
$inputFile = (Get-Item "poblar-bd-completo.sql").FullName  # Ruta absoluta

# Verificar que el archivo SQL existe
if (-not (Test-Path -Path $inputFile)) {
    Write-Output "`n${scriptName} -> ERROR: El archivo '$inputFile' no existe en el directorio actual."
    Write-Output "`n${scriptName} -> Pulse ENTER para cerrar este terminal."
    Read-Host
    exit 1
}

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

try {
    # Probar la conexión primero
    Write-Output "`n${scriptName} -> Probando conexión a la base de datos..."
    $testCmd = "& `"$mysqlExe`" -u$dbUser -p$dbPassword -e `"SELECT 'Conexión exitosa';`""
    $testResult = Invoke-Expression $testCmd 2>&1
    
    if ($testResult -match "ERROR") {
        throw "Error de conexión: $testResult"
    }
    
    # Comprobar si la base de datos existe
    Write-Output "`n${scriptName} -> Verificando existencia de la base de datos '$dbName'..."
    $checkDbCmd = "& `"$mysqlExe`" -u$dbUser -p$dbPassword -e `"SHOW DATABASES LIKE '$dbName';`""
    $checkResult = Invoke-Expression $checkDbCmd 2>&1
    
    if (-not ($checkResult -match $dbName)) {
        throw "La base de datos '$dbName' no existe. Por favor, créala primero."
    }
    
    # Importar datos usando el archivo SQL directamente con la opción -f
    Write-Output "`n${scriptName} -> Importando datos de prueba desde '$inputFile'..."
    
    # Usamos --database para seleccionar la base de datos
    $importCmd = "& `"$mysqlExe`" --user=$dbUser --password=$dbPassword --database=$dbName --execute=`"source $inputFile`""
    $importResult = Invoke-Expression $importCmd 2>&1
    
    if ($LASTEXITCODE -ne 0) {
        throw "Error al importar datos: $importResult"
    }
    
    Write-Output "`n${scriptName} -> ¡Datos importados con éxito a la base de datos '$dbName'!"
}
catch {
    Write-Output "`n${scriptName} -> Error al insertar datos de prueba: $_"
    
    # Sugerencias para solucionar problemas comunes
    Write-Output "`n${scriptName} -> Sugerencias para solucionar el problema:"
    Write-Output "1. Verifica que el servicio MariaDB esté en ejecución."
    Write-Output "2. Confirma que las credenciales de usuario y contraseña son correctas."
    Write-Output "3. Verifica que la base de datos '$dbName' exista."
    Write-Output "4. Verifica que el archivo '$inputFile' exista y tenga el formato correcto."
    Write-Output "5. Intenta ejecutar este comando manualmente para verificar:"
    Write-Output "   $mysqlExe --user=$dbUser --password=$dbPassword --database=$dbName < $inputFile"
}

# Finalizar
Write-Output "`n${scriptName} -> Proceso completado."
Write-Output "`n${scriptName} -> Pulse ENTER para cerrar este terminal."
Read-Host