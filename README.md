# Data Burst

## Description

Data Burst is a social platform for collaborative list creation, where users can create, share, and rate items within customizable lists.

## Key Features

- Users create items and define their associated properties.
- Lists can be public or private and can contain any items defined by users.
- Item ratings have three distinct states and are user-specific.
- Users can:
  - Modify their profile information
  - Add other users as friends
  - View profiles of added friends
  - Report items with incorrect properties
  - Create collaborative lists with friends
- Administrators can:
  - Edit item properties based on user reports
  - Suspend user accounts
- Statistics are generated based on items, item ratings, users, and list names.
- Passwords are securely hashed in the database.

## Technologies

- **MariaDB** as the database
- **Symfony** for the backend API
- **Angular** for the frontend
- **PowerShell** for local development startup scripts (Windows 11 Pro)
- **Docker** for deployment infrastructure

## Local Development Requirements (Windows 11 Pro)

- **MariaDB Server 11.4.5 running**
- **PowerShell 7.4.6**
- **angular-cli for Angular 17**
- **PHP 8.3.17 and Composer**
- **Symfony Console 7.1**
- Ensure the following lines are uncommented in **php.ini**:  
  - `extension=pdo_mysql`  
  - `extension=sodium`
- Generate public/private keys with OpenSSL and set `JWT_PASSPHRASE`:
  - Private key:  
    `openssl genpkey -algorithm RSA -out config/jwt/private.pem -aes256 -pass pass:'JWT_PASSPHRASE'`
  - Public key:  
    `openssl pkey -in config/jwt/private.pem -out config/jwt/public.pem -pubout -passin pass:'JWT_PASSPHRASE'`
- [Learn more about JWT for API Platform](https://api-platform.com/docs/core/jwt/)

## Local Development Startup Scripts (Windows 11 Pro)

- [`iniciar.ps1`](https://github.com/ignacioserranorodriguez/DataBurst/blob/main/scripts/iniciar.ps1):  
  Starts the web application, checks the MariaDB service, regenerates necessary database migrations, launches Symfony and Angular services in separate terminals, updates the database schema, and displays access information.

- [`finalizar.ps1`](https://github.com/ignacioserranorodriguez/DataBurst/blob/main/scripts/finalizar.ps1):  
  Stops the web application, terminates Angular and Symfony processes, deletes the migrations directory, and notes that the local MariaDB database remains running.

- [`obtener-esquema-sql.ps1`](https://github.com/ignacioserranorodriguez/DataBurst/blob/main/scripts/obtener-esquema-sql.ps1):  
  Automatically extracts the local database schema (excluding data) using mysqldump, saves it to `data_burst_schema.sql`, detects the MySQL/MariaDB executable, tests connections, and provides error handling with troubleshooting suggestions.

- [`eliminar-bd.ps1`](https://github.com/ignacioserranorodriguez/DataBurst/blob/main/scripts/eliminar-bd.ps1):  
  Deletes the local MariaDB `data_burst` database, automatically detects `mysql.exe`, verifies the database exists before deleting, uses default credentials (root/root), and provides feedback on the operation.

## Development Workflow

To apply changes to the database from the ORM, run [`finalizar.ps1`](https://github.com/ignacioserranorodriguez/DataBurst/blob/main/scripts/finalizar.ps1), [`eliminar-bd.ps1`](https://github.com/ignacioserranorodriguez/DataBurst/blob/main/scripts/eliminar-bd.ps1), and then [`iniciar.ps1`](https://github.com/ignacioserranorodriguez/DataBurst/blob/main/scripts/iniciar.ps1) again.
