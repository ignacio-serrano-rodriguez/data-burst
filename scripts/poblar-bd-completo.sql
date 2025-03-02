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
(7, 'Grand Theft Auto V', '2013-09-17', 'Videojuego', 91, 'Videojuego de mundo abierto desarrollado por Rockstar Games ambientado en el ficticio estado de San Andreas.', '2023-02-10 10:45:00'),

-- Libros clásicos
(3, 'Cien años de soledad', '1967-05-30', 'Libro', 97, 'Obra maestra del realismo mágico que narra la historia de la familia Buendía a lo largo de siete generaciones en el ficticio pueblo de Macondo.', '2023-03-15 10:20:00'),
(4, 'Don Quijote de la Mancha', '1605-01-16', 'Libro', 96, 'Considerada la primera novela moderna, narra las aventuras del ingenioso hidalgo Don Quijote y su fiel escudero Sancho Panza.', '2023-03-16 11:30:00'),
(5, 'Orgullo y prejuicio', '1813-01-28', 'Libro', 94, 'Novela romántica de Jane Austen que explora temas de clase, matrimonio y moralidad en la Inglaterra rural del siglo XIX.', '2023-03-17 09:15:00'),
(6, 'Crimen y castigo', '1866-12-22', 'Libro', 93, 'Exploración psicológica de un estudiante que comete un asesinato y su posterior lucha con la culpa y la redención.', '2023-03-18 14:45:00'),
(7, 'El Gran Gatsby', '1925-04-10', 'Libro', 92, 'Retrato de la era del jazz y crítica del sueño americano a través de la historia de Jay Gatsby y su amor por Daisy Buchanan.', '2023-03-19 16:30:00'),

-- Literatura contemporánea
(3, 'La sombra del viento', '2001-05-01', 'Libro', 91, 'Thriller literario ambientado en la Barcelona posterior a la Guerra Civil Española que mezcla intriga, misterio y romance.', '2023-03-20 10:10:00'),
(4, 'Nunca me abandones', '2005-02-24', 'Libro', 90, 'Historia distópica sobre un grupo de estudiantes que descubren un terrible secreto sobre su existencia.', '2023-03-21 15:20:00'),
(5, 'La carretera', '2006-09-26', 'Libro', 89, 'Relato post-apocalíptico sobre un padre y su hijo que viajan a través de un paisaje devastado en busca de supervivencia.', '2023-03-22 13:45:00'),
(6, 'El nombre del viento', '2007-03-27', 'Libro', 93, 'Primera entrega de la Crónica del Asesino de Reyes, narra la historia del músico, ladrón y mago Kvothe.', '2023-03-23 11:05:00'),
(7, 'Los detectives salvajes', '1998-11-12', 'Libro', 92, 'Novela coral que sigue la búsqueda de una poeta mexicana desaparecida por parte de dos jóvenes poetas.', '2023-03-24 09:30:00'),

-- Ciencia ficción y fantasía
(3, 'Dune', '1965-08-01', 'Libro', 95, 'Epopeya de ciencia ficción que combina política, religión y ecología en un futuro lejano donde se disputa el control de un planeta desértico.', '2023-03-25 14:15:00'),
(4, 'Neuromante', '1984-07-01', 'Libro', 88, 'Novela fundacional del género cyberpunk que explora un futuro dominado por corporaciones, hackers y realidad virtual.', '2023-03-26 16:50:00'),
(5, 'Fundación', '1951-05-01', 'Libro', 91, 'Saga que narra el colapso de un imperio galáctico y los intentos de preservar el conocimiento humano durante la edad oscura resultante.', '2023-03-27 10:25:00'),
(6, 'Juego de Tronos', '1996-08-01', 'Libro', 94, 'Primera entrega de Canción de Hielo y Fuego, una compleja historia de intrigas políticas en un mundo medieval de fantasía.', '2023-03-28 13:40:00'),
(7, 'El Silmarillion', '1977-09-15', 'Libro', 87, 'Compendio de mitos y leyendas del universo de la Tierra Media creado por J.R.R. Tolkien.', '2023-03-29 15:15:00'),

-- No ficción y ensayo
(3, 'Sapiens: De animales a dioses', '2011-02-10', 'Libro', 90, 'Historia de la humanidad que explora cómo una especie insignificante de simios se convirtió en la dominante del planeta.', '2023-03-30 11:20:00'),
(4, 'El infinito en un junco', '2019-11-13', 'Libro', 89, 'Ensayo sobre la historia de los libros, las bibliotecas y la pasión por la lectura a lo largo de los siglos.', '2023-03-31 09:45:00'),
(5, 'Pensar rápido, pensar despacio', '2011-10-25', 'Libro', 92, 'Exploración de los dos sistemas de pensamiento humano y cómo afectan nuestras decisiones y juicios.', '2023-04-01 14:30:00'),
(6, 'Los años del hambre', '2022-03-17', 'Libro', 86, 'Historia de la posguerra española a través de testimonios y documentos sobre la escasez alimentaria.', '2023-04-02 10:50:00'),
(7, 'El gen egoísta', '1976-04-30', 'Libro', 88, 'Revolucionaria visión de la evolución centrada en los genes como unidades de selección natural.', '2023-04-03 16:25:00'),

-- Literatura latinoamericana
(3, 'Pedro Páramo', '1955-03-01', 'Libro', 93, 'Novela sobre un hombre que busca a su padre en un pueblo fantasma habitado por almas en pena.', '2023-04-04 13:10:00'),
(4, 'Rayuela', '1963-06-28', 'Libro', 91, 'Obra experimental que invita al lector a saltar entre capítulos para crear diferentes experiencias de lectura.', '2023-04-05 11:45:00'),
(5, 'La casa de los espíritus', '1982-01-01', 'Libro', 90, 'Saga familiar que entrelaza lo político y lo mágico a lo largo de varias generaciones en un país sudamericano.', '2023-04-06 09:30:00'),
(6, 'Ficciones', '1944-01-01', 'Libro', 95, 'Colección de cuentos que juegan con conceptos filosóficos, laberintos mentales y paradojas.', '2023-04-07 15:20:00'),
(7, 'Conversación en La Catedral', '1969-01-01', 'Libro', 89, 'Novela que retrata la corrupción política y moral durante la dictadura de Odría en Perú.', '2023-04-08 12:40:00'),

-- Bestsellers recientes
(3, 'Los pilares de la Tierra', '1989-10-01', 'Libro', 92, 'Épica historia sobre la construcción de una catedral en la Inglaterra medieval del siglo XII.', '2023-04-09 10:15:00'),
(4, 'La chica del tren', '2015-01-13', 'Libro', 87, 'Thriller psicológico sobre una mujer alcohólica que cree haber presenciado un crimen desde la ventana de un tren.', '2023-04-10 14:50:00'),
(5, 'Eleanor Oliphant está perfectamente', '2017-05-09', 'Libro', 88, 'Historia sobre una mujer solitaria con un pasado traumático que comienza a abrirse al mundo.', '2023-04-11 16:30:00'),
(6, 'El proyecto Hail Mary', '2021-05-04', 'Libro', 93, 'Un maestro de ciencias amnésico despierta solo en una nave espacial con la misión de salvar a la humanidad.', '2023-04-12 11:25:00'),
(7, 'Reina Roja', '2018-11-08', 'Libro', 90, 'Thriller futurista donde una detective especial investiga asesinatos en una sociedad vigilada por inteligencia artificial.', '2023-04-13 09:40:00');

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
-- Lista 3 (Libros) - Contiene los libros que acabamos de insertar (IDs 11-40)
(3, 11, '2023-04-14 10:00:00'),
(3, 12, '2023-04-14 10:01:00'),
(3, 13, '2023-04-14 10:02:00'),
(3, 14, '2023-04-14 10:03:00'),
(3, 15, '2023-04-14 10:04:00'),
(3, 16, '2023-04-14 10:05:00'),
(3, 17, '2023-04-14 10:06:00'),
(3, 18, '2023-04-14 10:07:00'),
(3, 19, '2023-04-14 10:08:00'),
(3, 20, '2023-04-14 10:09:00'),
(3, 21, '2023-04-14 10:10:00'),
(3, 22, '2023-04-14 10:11:00'),
(3, 23, '2023-04-14 10:12:00'),
(3, 24, '2023-04-14 10:13:00'),
(3, 25, '2023-04-14 10:14:00'),
(3, 26, '2023-04-14 10:15:00'),
(3, 27, '2023-04-14 10:16:00'),
(3, 28, '2023-04-14 10:17:00'),
(3, 29, '2023-04-14 10:18:00'),
(3, 30, '2023-04-14 10:19:00'),
(3, 31, '2023-04-14 10:20:00'),
(3, 32, '2023-04-14 10:21:00'),
(3, 33, '2023-04-14 10:22:00'),
(3, 34, '2023-04-14 10:23:00'),
(3, 35, '2023-04-14 10:24:00'),
(3, 36, '2023-04-14 10:25:00'),
(3, 37, '2023-04-14 10:26:00'),
(3, 38, '2023-04-14 10:27:00'),
(3, 39, '2023-04-14 10:28:00'),
(3, 40, '2023-04-14 10:29:00'),

-- Otras relaciones de listas y elementos
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