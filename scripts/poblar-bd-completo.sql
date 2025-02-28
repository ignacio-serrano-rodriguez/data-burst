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
('admin@databurst.com', 'admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 3, '2023-01-01 10:00:00', 'Administrador', 'Sistema', NULL, '1980-01-15', 'España', 'Informático', 'Ingeniería Informática', 'es'),
('moderador@databurst.com', 'moderador', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 2, '2023-01-02 11:30:00', 'Moderador', 'Principal', NULL, '1985-05-20', 'España', 'Moderador', 'Comunicación', 'es'),
('usuario1@databurst.com', 'usuario1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, '2023-01-03 14:20:00', 'Ana', 'García', 'López', '1990-03-12', 'España', 'Profesora', 'Magisterio', 'es'),
('usuario2@databurst.com', 'usuario2', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, '2023-01-04 09:15:00', 'Carlos', 'Martínez', 'Rodríguez', '1988-07-08', 'México', 'Ingeniero', 'Ingeniería Civil', 'es'),
('usuario3@databurst.com', 'usuario3', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, '2023-01-05 16:45:00', 'Laura', 'Fernández', 'Gómez', '1992-11-27', 'Argentina', 'Médica', 'Medicina', 'es'),
('usuario4@databurst.com', 'usuario4', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, '2023-01-06 08:30:00', 'Miguel', 'Sánchez', 'Pérez', '1987-09-03', 'Colombia', 'Abogado', 'Derecho', 'es'),
('usuario5@databurst.com', 'usuario5', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, '2023-01-07 12:10:00', 'Elena', 'López', 'Torres', '1994-05-15', 'Chile', 'Arquitecta', 'Arquitectura', 'es');

-- Insertar elementos
INSERT INTO elemento (usuario_id, nombre, fecha_aparicion, informacion_extra, puntuacion, descripcion, momento_creacion)
VALUES 
(3, 'Breaking Bad', '2008-01-20', 'Serie de TV', 95, 'Un profesor de química con cáncer terminal se asocia con un exalumno para fabricar y vender metanfetamina.', '2023-02-01 15:30:00'),
(3, 'El Padrino', '1972-03-15', 'Película', 98, 'La historia de la familia Corleone, una de las más poderosas familias de la mafia italiana en Nueva York.', '2023-02-02 10:20:00'),
(4, 'Los Simpson', '1989-12-17', 'Serie animada', 90, 'Serie de comedia sobre una familia disfuncional que vive en un pueblo ficticio llamado Springfield.', '2023-02-03 18:45:00'),
(5, '1984', '1949-06-08', 'Libro', 92, 'Novela distópica de George Orwell que presenta una sociedad totalitaria vigilada por el "Gran Hermano".', '2023-02-04 09:15:00'),
(6, 'The Legend of Zelda: Breath of the Wild', '2017-03-03', 'Videojuego', 97, 'Juego de acción-aventura desarrollado por Nintendo para las consolas Switch y Wii U.', '2023-02-05 14:30:00'),
(4, 'Pink Floyd - The Dark Side of the Moon', '1973-03-01', 'Álbum musical', 96, 'Uno de los álbumes más vendidos y aclamados de todos los tiempos, conocido por su innovación musical.', '2023-02-06 11:20:00'),
(7, 'Stranger Things', '2016-07-15', 'Serie de TV', 88, 'Serie de ciencia ficción y terror ambientada en los años 80 que sigue a un grupo de niños en el pueblo de Hawkins.', '2023-02-07 16:40:00'),
(5, 'Harry Potter y la Piedra Filosofal', '1997-06-26', 'Libro', 89, 'Primera novela de la serie Harry Potter que introduce el mundo mágico creado por J.K. Rowling.', '2023-02-08 13:15:00'),
(6, 'El Señor de los Anillos: La Comunidad del Anillo', '2001-12-19', 'Película', 94, 'Adaptación cinematográfica de la primera parte de la trilogía de J.R.R. Tolkien.', '2023-02-09 19:30:00'),
(7, 'Grand Theft Auto V', '2013-09-17', 'Videojuego', 91, 'Videojuego de mundo abierto desarrollado por Rockstar Games ambientado en el ficticio estado de San Andreas.', '2023-02-10 10:45:00');

-- Insertar listas
INSERT INTO lista (nombre)
VALUES 
('Series'),
('Películas'),
('Libros'),
('Videojuegos'),
('Lo mejor del 2023'),
('Para ver este fin de semana'),
('Recomendaciones para principiantes');

-- Insertar relaciones lista_contiene_elemento
INSERT INTO lista_contiene_elemento (lista_id, elemento_id, momento_contencion)
VALUES 
(1, 1, '2023-03-01 10:15:00'),
(1, 3, '2023-03-01 10:16:00'),
(1, 7, '2023-03-01 10:17:00'),
(2, 2, '2023-03-02 15:30:00'),
(2, 9, '2023-03-02 15:31:00'),
(3, 4, '2023-03-03 09:20:00'),
(3, 8, '2023-03-03 09:21:00'),
(4, 5, '2023-03-04 14:10:00'),
(4, 10, '2023-03-04 14:11:00'),
(5, 1, '2023-03-05 11:45:00'),
(5, 5, '2023-03-05 11:46:00'),
(5, 7, '2023-03-05 11:47:00'),
(6, 1, '2023-03-06 18:30:00'),
(6, 2, '2023-03-06 18:31:00'),
(7, 8, '2023-03-07 12:20:00'),
(7, 3, '2023-03-07 12:21:00');

-- Insertar usuario_manipula_lista
INSERT INTO usuario_manipula_lista (usuario_id, lista_id, publica, momento_manipulacion)
VALUES 
(3, 1, 1, '2023-03-10 09:30:00'),
(3, 2, 1, '2023-03-10 09:35:00'),
(4, 3, 1, '2023-03-11 14:20:00'),
(5, 4, 0, '2023-03-12 16:45:00'),
(6, 5, 1, '2023-03-13 11:15:00'),
(7, 6, 0, '2023-03-14 18:30:00'),
(4, 7, 1, '2023-03-15 10:10:00');

-- Insertar usuario_agrega_usuario (amistades)
INSERT INTO usuario_agrega_usuario (usuario_1_id, usuario_2_id, momento_agregacion)
VALUES 
(3, 4, '2023-04-01 14:20:00'),
(3, 5, '2023-04-02 15:30:00'),
(4, 5, '2023-04-03 09:45:00'),
(4, 6, '2023-04-04 11:30:00'),
(5, 7, '2023-04-05 16:20:00'),
(6, 7, '2023-04-06 13:15:00'),
(3, 6, '2023-04-07 10:10:00');

-- Insertar comentarios de usuarios sobre elementos
INSERT INTO usuario_elemento_comentario (usuario_id, elemento_id, comentario, momento_comentario)
VALUES 
(3, 2, '¡Una obra maestra del cine! La actuación de Marlon Brando es insuperable.', '2023-05-01 14:30:00'),
(4, 1, 'La mejor serie que he visto en mi vida. Bryan Cranston merece todos los premios.', '2023-05-02 16:45:00'),
(5, 3, 'Un clásico que nunca pasa de moda, sigo viéndolo después de tantos años.', '2023-05-03 10:20:00'),
(6, 5, 'La libertad y el mundo abierto que ofrece este juego es increíble. Nintendo se superó.', '2023-05-04 19:15:00'),
(7, 4, 'Libro que te hace reflexionar sobre la libertad y el poder. Muy actual a pesar de ser de 1949.', '2023-05-05 12:30:00'),
(3, 7, 'La nostalgia de los 80 está muy bien representada, y la trama es adictiva.', '2023-05-06 15:40:00'),
(4, 9, 'Los efectos especiales siguen siendo impresionantes incluso hoy. Peter Jackson hizo un trabajo excepcional.', '2023-05-07 11:25:00');

-- Insertar valoraciones positivas/negativas
INSERT INTO usuario_elemento_positivo (usuario_id, elemento_id, positivo, momento_positivo)
VALUES 
(3, 1, 1, '2023-06-01 10:15:00'),
(3, 2, 1, '2023-06-01 10:16:00'),
(4, 1, 1, '2023-06-02 14:30:00'),
(4, 3, 1, '2023-06-02 14:31:00'),
(5, 2, 1, '2023-06-03 09:20:00'),
(5, 4, 0, '2023-06-03 09:21:00'),
(6, 5, 1, '2023-06-04 16:40:00'),
(6, 9, 1, '2023-06-04 16:41:00'),
(7, 7, 1, '2023-06-05 12:15:00'),
(7, 10, 0, '2023-06-05 12:16:00');

-- Insertar reportes de elementos
INSERT INTO usuario_reporta_elemento (usuario_id, elemento_id, descripcion, momento_reporte)
VALUES 
(4, 2, 'Contiene información incorrecta sobre el año de estreno.', '2023-07-01 14:20:00'),
(6, 3, 'La descripción tiene errores ortográficos.', '2023-07-02 16:30:00'),
(7, 5, 'Hay un error en el nombre del desarrollador del juego.', '2023-07-03 10:15:00');

-- Insertar gestiones de elementos por administradores
INSERT INTO usuario_gestiona_elemento (usuario_administrador_id, elemento_id, momento_gestion, nombre_antiguo, fecha_aparicion_antigua, informacion_extra_antigua, descripcion_antigua)
VALUES 
(1, 2, '2023-08-01 09:30:00', 'El Padrino (The Godfather)', '1972-03-15', 'Película de crimen', 'La historia de la familia Corleone y su papel en la mafia americana.'),
(2, 4, '2023-08-02 11:45:00', '1984 - George Orwell', '1949-06-08', 'Novela', 'Novela distópica sobre un futuro totalitario.'),
(1, 7, '2023-08-03 14:20:00', 'Stranger Things - Netflix', '2016-07-15', 'Serie TV', 'Serie de Netflix sobre fenómenos sobrenaturales en un pequeño pueblo.'); 

-- Insertar gestiones de usuarios por administradores
INSERT INTO usuario_gestiona_usuario (usuario_normal_id, usuario_administrador_id, permiso_antiguo, momento_gestion)
VALUES 
(3, 1, 1, '2023-09-01 10:30:00'),
(4, 1, 1, '2023-09-02 14:15:00'),
(5, 2, 1, '2023-09-03 16:20:00');

-- Insertar invitaciones a listas
INSERT INTO invitacion (invitador_id, invitado_id, lista_id)
VALUES 
(3, 4, 1),
(3, 5, 2),
(4, 6, 3),
(5, 7, 4),
(6, 3, 5),
(7, 4, 6);