# Data Burst

## Descripción
Aplicación web que consiste en una serie de usuarios que crean listas multi-genéricas donde se almacenan contenciones valorables de elementos. Estos elementos son creados por los usuarios en el caso de que no existan, si existen; se tomarán aquellos creados por otros usuarios. De esta forma, se consigue que la base de datos se pueble dinámicamente conforme al uso de la aplicación por parte de los usuarios. También existen usuarios con privilegios denominados administradores que gestionan a otros usuarios y a los elementos creados por ellos, modificando su información. En función de las contenciones y los nombres de listas, se generan estadísticas.

## Tecnologías
- **Docker** y **MariaDB** para la base de datos.
- **Symfony** como **API de Backend**.
- **Angular** como **Frontend**.
- **Powershell** para los scripts de arranque de la aplicación.

## Requisitos
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