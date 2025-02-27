-- Desactivar restricciones de clave foránea temporalmente para facilitar la carga
SET FOREIGN_KEY_CHECKS = 0;

-- Limpiar tablas existentes
TRUNCATE TABLE usuario_reporta_elemento;
TRUNCATE TABLE usuario_elemento_comentario;
TRUNCATE TABLE usuario_elemento_positivo;
TRUNCATE TABLE usuario_gestiona_elemento;
TRUNCATE TABLE usuario_gestiona_usuario;
TRUNCATE TABLE usuario_manipula_lista;
TRUNCATE TABLE usuario_agrega_usuario;
TRUNCATE TABLE lista_contiene_elemento;
TRUNCATE TABLE invitacion;
TRUNCATE TABLE elemento;
TRUNCATE TABLE lista;
TRUNCATE TABLE usuario;

-- Reactivar restricciones de clave foránea
SET FOREIGN_KEY_CHECKS = 1;