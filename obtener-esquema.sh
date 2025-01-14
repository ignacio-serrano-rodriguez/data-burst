#!/bin/bash

# Definición del nombre de la base de datos y los archivos temporales
DATABASE_NAME="data_burst"
TABLES_FILE="/tmp/tables.txt"
SCHEMA_FILE="/tmp/data_burst_schema.sql"

# Obtener la lista de tablas y guardarla en un archivo
mariadb -u root -proot -e "SELECT table_name FROM information_schema.tables WHERE table_schema = '${DATABASE_NAME}';" -s --skip-column-names > ${TABLES_FILE}

# Crear un archivo para el esquema
echo "" > ${SCHEMA_FILE}

# Para cada tabla, obtener la estructura y agregarla al archivo del esquema
while read -r table; do
    echo -e "\n\n-- Table structure for table \`${table}\` --\n" >> ${SCHEMA_FILE}
    mariadb -u root -proot -e "SHOW CREATE TABLE ${DATABASE_NAME}.\`${table}\`;" -s --skip-column-names | sed 's/\\n/\n/g' | sed 's/-e//g' >> ${SCHEMA_FILE}
    echo -e ";\n" >> ${SCHEMA_FILE}
done < ${TABLES_FILE}