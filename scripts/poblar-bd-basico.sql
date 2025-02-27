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

-- Insertar usuarios de prueba
INSERT INTO usuario (mail, usuario, contrasenia, verificado, permiso, momento_registro, nombre, apellido_1, apellido_2, fecha_nacimiento, pais, profesion, estudios, idioma)
VALUES 
('admin@databurst.com', 'admin', 'contraseña', 1, 3, '2023-01-01 10:00:00', 'Administrador', 'Sistema', NULL, '1980-01-15', 'España', 'Informático', 'Ingeniería Informática', 'es');