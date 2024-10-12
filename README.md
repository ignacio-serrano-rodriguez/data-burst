# Proyecto de Página Web Data Burst
# Descripción Este proyecto consiste en una página web desarrollada con
Symfony (backend), Angular (frontend) y Docker para Fedora 39
# Requisitos - Docker y Docker Compose instalados en el sistema.
# Instrucciones de Instalación
- Tener instalado en local: angular-cli para Angular 17, php y composer para symfony 7 y docker engine.
- Descargar el repositorio de github. 
- Crear un contenedor con el comando ‘docker run --name data_burst-BD -d -p 3306:3306 -e MARIADB_ROOT_PASSWORD=root mariadb’
- Acceder mediante un gestor de base de datos como Dbeaver al puerto usado y con las credenciales del root. 
- Ir al php.ini y comprobar que están descomentados 'extension=pdo_mysql' y 'extension=sodium'
- Ir a la ruta de /api del repositorio
- Lanzar los comandos de php en el terminal para dicha ruta:
--‘composer update’
--‘php bin/console doctrine:database:create’
--‘php bin/console make:migration’
--‘php bin/console doctrine:migrations:migrate’
--‘symfony server:start’
- Acceder a api platform de symfony 7 (backend api) ‘http://127.0.0.1:8000/api’
- Abrir un nuevo terminal e ir a la ruta /frontend
- Lanzar los comandos: 
--‘npm install’
--‘ng serve’
- Acceder a angular 17 (frontend) ‘http://localhost:4200/’