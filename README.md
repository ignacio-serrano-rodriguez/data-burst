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
- **OpenSSL**.
- [JWT para api platform](https://api-platform.com/docs/core/jwt/)
- **Docker engine** en ejecución.


## Arranque de la aplicación en local
Ejecutar el script [iniciar.ps1](https://github.com/ignacioserranorodriguez/DataBurst/blob/main/iniciar.ps1).
- El volumen generado por el contenedor no es borrado automaticamente, de esta forma existe persistencia de datos entre los difrerentes arranques.
- Para finalizar la ejecución, se ha de pulsar ENTER en el terminal donde está el script en ejecución.

## Funcionalidades del desarrollo
- Para aplicar cambios en la BD desde el ORM, es necesario eliminar el volumen tras finalizar la ejecución. Al ejecutar de nuevo el script [iniciar.ps1](https://github.com/ignacioserranorodriguez/DataBurst/blob/main/iniciar.ps1), se habrán aplicado los cambios en la BD.