# Obtención del nombre del script.
$scriptName = [System.IO.Path]::GetFileName($PSCommandPath)

Write-Output "`n${scriptName} -> Iniciando el proceso para obtener el esquema de la base de datos."

# Definición del nombre del contenedor y los archivos
$containerName = "data_burst-BD"
$localScript = "obtener-esquema.sh"
$containerScript = "/tmp/obtener-esquema.sh"
$outputFile = "data_burst_schema.sql"
$containerOutputFile = "/tmp/data_burst_schema.sql"

# Copiar el script al contenedor
Write-Output "`n${scriptName} -> Copiando el script al contenedor."
docker cp ${localScript} ${containerName}:${containerScript}

# Ejecutar el script en el contenedor
Write-Output "`n${scriptName} -> Ejecutando el script en el contenedor."
docker exec ${containerName} sh ${containerScript}

# Copiar el archivo SQL desde el contenedor al host
Write-Output "`n${scriptName} -> Copiando el archivo SQL desde el contenedor al host."
docker cp ${containerName}:${containerOutputFile} ./${outputFile}

# Formatear el archivo SQL para eliminar cualquier referencia a '-e'
Write-Output "`n${scriptName} -> Formateando el archivo SQL para eliminar cualquier referencia a '-e'."
(Get-Content ./${outputFile}) -replace '-e', '' | Set-Content ./${outputFile}

# Esquema de la base de datos obtenido y guardado en el archivo de salida
Write-Output "`n${scriptName} -> Esquema de la base de datos obtenido y guardado en '${outputFile}'."