# Data Burst

## Descripción

Red social de creación de listas donde se contienen elementos valorables.

## Algunas características

- Los elementos y sus características asociadas son creados por los propios usuarios.
- Las listas públicas o privadas creadas por los usuarios pueden contener cualquier elemento.
- Las contenciones de elementos son valorables con 3 estados distintos y están asociadas a cada usuario.
- Los usuarios pueden modificar su información, agregar a otros usuarios, ver perfiles de usuarios agregados y reportar elementos con características erróneas y hacer listas colaborativas con amigos.
- Los administradores pueden modificar las características de los elementos en función de los reportes de los usuarios y suspender cuentas de usuario.
- Estadísticas son generadas en función de los elementos, las contenciones de elementos, los usuarios y los nombres de las listas.
- Las contraseñas están hasheadas en la base de datos.

## Tecnologías

- **MariaDB** como base de datos.
- **Symfony** como API de Backend.
- **Angular** como Frontend.
- **Powershell** para los scripts de arranque de la aplicación en desarrollo local (Windows 11 pro).
- **Docker** como infraestructura de despliegue.

## Requisitos para el arranque de la aplicación en desarrollo local (Windows 11 pro)

- **PowerShell 7.4.6**.
- **MariaDB Server 11.4.5**.
- **angular-cli para Angular 17**.
- **php 8.3.17 y composer**
- **Symfony Console 7.1**.
- Han de estar descomentadas las lineas de '**extension=pdo_mysql**' y '**extension=sodium**' en **php.ini**.
- **Generar las claves pública y privada con OpenSSL y JWT_PASSPHRASE**.
  - **privada** openssl genpkey -algorithm RSA -out config/jwt/private.pem -aes256 -pass pass:'JWT_PASSPHRASE'
  - **pública** openssl pkey -in config/jwt/private.pem -out config/jwt/public.pem -pubout -passin pass:'JWT_PASSPHRASE'
- [JWT para api platform](https://api-platform.com/docs/core/jwt/)

## Scripts de arranque de la aplicación en desarrollo local (Windows 11 pro)

#### [iniciar.ps1](https://github.com/ignacioserranorodriguez/DataBurst/blob/main/iniciar.ps1)

Inicia la aplicación web comprobando y gestionando el servicio MariaDB, regenerando las migraciones de base de datos necesarias. Lanza los servicios de Symfony y Angular en terminales independientes, actualiza el esquema de la base de datos y muestra información de acceso.

#### [finalizar.ps1](https://github.com/ignacioserranorodriguez/DataBurst/blob/main/finalizar.ps1)

Finaliza la aplicación web. Detiene los procesos de Angular y Symfony, elimina el directorio de migraciones y deja una nota informando que la base de datos MariaDB local permanece en ejecución.

#### [obtener-esquema-sql.ps1](https://github.com/ignacioserranorodriguez/DataBurst/blob/main/obtener-esquema-sql.ps1)

Extrae automáticamente el esquema de la base de datos local (sin datos) utilizando mysqldump y lo guarda en 'data_burst_schema.sql'. Incluye detección automática del ejecutable MySQL/MariaDB, pruebas de conexión y manejo de errores con sugerencias de solución.

#### [eliminar-bd.ps1](https://github.com/ignacioserranorodriguez/DataBurst/blob/main/eliminar-bd.ps1)

Elimina la base de datos 'data_burst' de MariaDB local mediante detección automática del ejecutable mysql.exe. Verifica la existencia de la base de datos antes de eliminarla, utiliza credenciales predeterminadas (root/root) y proporciona retroalimentación sobre el resultado.

## Funcionalidades del desarrollo

Para aplicar cambios en la BD desde el ORM, es necesario [finalizar.ps1](https://github.com/ignacioserranorodriguez/DataBurst/blob/main/finalizar.ps1), [eliminar-bd.ps1](https://github.com/ignacioserranorodriguez/DataBurst/blob/main/eliminar-bd.ps1) e [iniciar.ps1](https://github.com/ignacioserranorodriguez/DataBurst/blob/main/iniciar.ps1) de nuevo.
