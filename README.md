# Proyecto de Página Web Data Burst
# Descripción Este proyecto consiste en una página web desarrollada con
Symfony (backend), Angular (frontend) y Docker para Fedora 39
# Requisitos - Docker y Docker Compose instalados en el sistema.
# Instrucciones de Instalación
- Tener instalado en local: angular-cli para Angular 17, php y composer para symfony 7 y docker engine.
- Descargar el repositorio de github. 
- Crear un contenedor con el comando ‘docker run --name data_burst-BD -d -p 3306:3306 -e MARIADB_ROOT_PASSWORD=root mariadb’
- Acceder mediante un gestor de base de datos como Dbeaver al puerto indicado y con las credenciales del root. 
- Ir a la ruta de /api del repositorio
- En .env añadir escribir la línea: ‘DATABASE_URL="mysql://root:root@127.0.0.1:3306/data_burst?serverVersion=1:11.3.2+maria~ubu2204"
- Lanzar los comandos de php en el terminal para dicha ruta:
--‘php bin/console doctrine:database:create’
--‘php bin/console make:migration’
--‘php bin/console doctrine:migrations:migrate	’
--‘symfony server:start’
- Abrir un nuevo terminal e ir a la ruta /frontend
- Lanzar el comando de angular: ‘ng serve’
- Acceder a la dirección ‘http://localhost:4200/