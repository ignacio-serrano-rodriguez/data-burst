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
- **Docker** como infraestructura.
- **MariaDB** como base de datos.
- **Symfony** como API de Backend.
- **Angular** como Frontend.
- **Powershell** para los scripts de arranque de la aplicación.

## Requisitos para el arranque de la aplicación en local
- **PowerShell 7.4.6**.
- **angular-cli para Angular 17**.
- **php** y **composer** **para Symfony 7**.
- Han de estar descomentadas las lineas de '**extension=pdo_mysql**' y '**extension=sodium**' en **php.ini**.
- **Generar las claves pública y privada con OpenSSL y JWT_PASSPHRASE**.
    - **privada** openssl genpkey -algorithm RSA -out config/jwt/private.pem -aes256 -pass pass:'JWT_PASSPHRASE'
    - **pública** openssl pkey -in config/jwt/private.pem -out config/jwt/public.pem -pubout -passin pass:'JWT_PASSPHRASE'
- [JWT para api platform](https://api-platform.com/docs/core/jwt/)
- **Docker engine** en ejecución.

## Scripts de arranque de la aplicación

#### [iniciar.ps1](https://github.com/ignacioserranorodriguez/DataBurst/blob/main/iniciar.ps1)
Inicia la aplicación web. Comprueba si Docker Desktop está en ejecución, crea e inicia el contenedor de la base de datos, realiza las migraciones necesarias y luego inicia los servicios de Symfony y Angular.

#### [finalizar.ps1](https://github.com/ignacioserranorodriguez/DataBurst/blob/main/finalizar.ps1)
Finaliza la aplicación web. Detiene los procesos de Angular y Symfony, elimina el contenedor de la base de datos y el directorio de migraciones.

#### [obtener-esquema-sql.ps1](https://github.com/ignacioserranorodriguez/DataBurst/blob/main/obtener-esquema-sql.ps1)
Obtiene el esquema de la base de datos y lo guarda en un archivo SQL. Copia un script de shell al contenedor de Docker, lo ejecuta para generar el esquema y luego copia el archivo generado al host.

#### [eliminar-volumen-bd.ps1](https://github.com/ignacioserranorodriguez/DataBurst/blob/main/eliminar-volumen-bd.ps1)
Elimina el volumen de la BD Docker solo si no está siendo usado por algún contenedor. Verifica si el volumen existe y si no está en uso, lo elimina.

## Funcionalidades del desarrollo
Para aplicar cambios en la BD desde el ORM, es necesario [finalizar.ps1](https://github.com/ignacioserranorodriguez/DataBurst/blob/main/finalizar.ps1), [eliminar-volumen-bd.ps1](https://github.com/ignacioserranorodriguez/DataBurst/blob/main/eliminar-volumen-bd.ps1) e [iniciar.ps1](https://github.com/ignacioserranorodriguez/DataBurst/blob/main/iniciar.ps1) de nuevo.