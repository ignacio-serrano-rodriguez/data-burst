SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE usuario_reporta_elemento;
TRUNCATE TABLE usuario_elemento_comentario;
TRUNCATE TABLE usuario_elemento_puntuacion;
TRUNCATE TABLE usuario_gestiona_elemento;
TRUNCATE TABLE usuario_gestiona_usuario;
TRUNCATE TABLE usuario_manipula_lista;
TRUNCATE TABLE usuario_agrega_usuario;
TRUNCATE TABLE lista_contiene_elemento;
TRUNCATE TABLE invitacion;
TRUNCATE TABLE elemento_categoria;
TRUNCATE TABLE lista_categoria;
TRUNCATE TABLE elemento;
TRUNCATE TABLE lista;
TRUNCATE TABLE categoria;
TRUNCATE TABLE usuario;

SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO categoria (id, nombre) VALUES
(1, 'Libros'),
(2, 'Películas'),
(3, 'Series'),
(4, 'Videojuegos'),
(5, 'Música'),
(6, 'Anime'),
(7, 'Juegos de mesa'),
(8, 'Juegos de rol'),
(10, 'Manga'),
(11, 'Cómics'),
(12, 'Podcasts'),
(13, 'Programas TV');

INSERT INTO usuario (mail, usuario, contrasenia, verificado, permiso, momento_registro, nombre, apellido_1, apellido_2, fecha_nacimiento, pais, profesion, estudios, idioma)
VALUES 
('admin1@databurst.com', 'admin1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 3, '2023-01-01 10:00:00', 'Ignacio', 'Serrano', 'Rodríguez', '2000-03-24', 'España', 'Informático', 'Ingeniería Informática', 'es'),
('moderador1@databurst.com', 'moderador1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 2, '2023-01-02 11:30:00', 'Rosa María', 'Durán', 'Guzmán', '2000-03-06', 'España', 'Enfemera', 'Enfermería', 'es'),
('usuario1@databurst.com', 'usuario1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, '2023-01-03 14:20:00', 'Ana', 'García', 'López', '1990-03-12', 'España', 'Profesora', 'Magisterio', 'es'),
('usuario2@databurst.com', 'usuario2', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, '2023-01-04 09:15:00', 'Carlos', 'Martínez', 'Rodríguez', '1988-07-08', 'México', 'Ingeniero', 'Ingeniería Civil', 'es'),
('usuario3@databurst.com', 'usuario3', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, '2023-01-05 16:45:00', 'Laura', 'Fernández', 'Gómez', '1992-11-27', 'Argentina', 'Médica', 'Medicina', 'es'),
('usuario4@databurst.com', 'usuario4', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, '2023-01-06 08:30:00', 'Miguel', 'Sánchez', 'Pérez', '1987-09-03', 'Colombia', 'Abogado', 'Derecho', 'es'),
('usuario5@databurst.com', 'usuario5', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, '2023-01-07 12:10:00', 'Elena', 'López', 'Torres', '1994-05-15', 'Chile', 'Arquitecta', 'Arquitectura', 'es'),
('usuario6@databurst.com', 'usuario6', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, '2023-01-08 10:25:00', 'Javier', 'Ruiz', 'Morales', '1991-08-22', 'Perú', 'Periodista', 'Comunicación', 'es'),
('usuario7@databurst.com', 'usuario7', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, '2023-01-09 14:35:00', 'Natalia', 'Herrera', 'Vega', '1989-02-14', 'Ecuador', 'Psicóloga', 'Psicología', 'es'),
('usuario8@databurst.com', 'usuario8', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, '2023-01-10 09:50:00', 'Pablo', 'Ortega', 'Díaz', '1993-04-30', 'Uruguay', 'Biólogo', 'Biología Marina', 'es'),
('usuario9@databurst.com', 'usuario9', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, '2023-01-11 15:40:00', 'Carmen', 'Navarro', 'Fuentes', '1986-12-05', 'Venezuela', 'Veterinaria', 'Medicina Veterinaria', 'es'),
('usuario10@databurst.com', 'usuario10', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, '2023-01-12 11:15:00', 'Roberto', 'Vargas', 'Castro', '1995-07-17', 'Paraguay', 'Chef', 'Gastronomía', 'es'),
('usuario11@databurst.com', 'usuario11', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, '2023-01-13 13:20:00', 'Silvia', 'Mendoza', 'Rojas', '1990-10-28', 'Bolivia', 'Fotógrafa', 'Bellas Artes', 'es'),
('usuario12@databurst.com', 'usuario12', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, '2023-01-14 16:30:00', 'Andrés', 'Jiménez', 'Rivera', '1987-05-03', 'Costa Rica', 'Músico', 'Conservatorio', 'es'),
('usuario13@databurst.com', 'usuario13', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, '2023-01-15 10:45:00', 'Paula', 'González', 'Soto', '1992-01-19', 'Guatemala', 'Enfermera', 'Enfermería', 'es'),
('usuario14@databurst.com', 'usuario14', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, '2023-01-16 14:10:00', 'Diego', 'Torres', 'Molina', '1989-06-24', 'Honduras', 'Programador', 'Ingeniería de Software', 'es'),
('usuario15@databurst.com', 'usuario15', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, '2023-01-17 09:30:00', 'Marina', 'Ramírez', 'Paredes', '1993-11-11', 'El Salvador', 'Diseñadora', 'Diseño Gráfico', 'es'),
('usuario16@databurst.com', 'usuario16', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, '2023-01-18 12:20:00', 'Fernando', 'Castro', 'Luna', '1988-03-07', 'Panamá', 'Economista', 'Economía', 'es'),
('usuario17@databurst.com', 'usuario17', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, '2023-01-19 15:50:00', 'Lucía', 'Morales', 'Campos', '1994-09-29', 'Nicaragua', 'Dentista', 'Odontología', 'es'),
('usuario18@databurst.com', 'usuario18', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, '2023-01-20 11:40:00', 'Raúl', 'Vega', 'Méndez', '1986-04-16', 'República Dominicana', 'Actor', 'Arte Dramático', 'es'),
('usuario19@databurst.com', 'usuario19', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, '2023-01-21 14:25:00', 'Beatriz', 'Díaz', 'Santos', '1991-12-01', 'Cuba', 'Nutricionista', 'Nutrición', 'es'),
('usuario20@databurst.com', 'usuario20', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, '2023-01-22 10:05:00', 'Héctor', 'Ortiz', 'Ríos', '1990-08-13', 'Puerto Rico', 'Piloto', 'Aeronáutica', 'es'),
('usuario21@databurst.com', 'usuario21', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, '2023-01-23 15:15:00', 'Isabel', 'Medina', 'Cruz', '1989-02-26', 'Francia', 'Traductora', 'Filología', 'fr'),
('usuario22@databurst.com', 'usuario22', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, '2023-01-24 09:55:00', 'Alejandro', 'Reyes', 'Varela', '1992-05-10', 'Inglaterra', 'Profesor', 'Educación', 'en'),
('usuario23@databurst.com', 'usuario23', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, '2023-01-25 13:40:00', 'Valeria', 'Peña', 'Guzmán', '1987-11-25', 'Alemania', 'Consultora', 'Administración', 'de'),
('usuario24@databurst.com', 'usuario24', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, '2023-01-26 16:10:00', 'Gabriel', 'Luna', 'Flores', '1993-07-08', 'Italia', 'Historiador', 'Historia del Arte', 'it'),
('usuario25@databurst.com', 'usuario25', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, '2023-01-27 10:35:00', 'Camila', 'Sanz', 'Vidal', '1991-04-21', 'Portugal', 'Arqueóloga', 'Arqueología', 'pt'),
('usuario26@databurst.com', 'usuario26', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, '2023-01-28 14:50:00', 'Mateo', 'Duarte', 'Aguilar', '1988-09-14', 'Holanda', 'Fisioterapeuta', 'Fisioterapia', 'nl'),
('usuario27@databurst.com', 'usuario27', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, '2023-01-29 11:20:00', 'Sara', 'Ibáñez', 'Mora', '1994-01-03', 'Bélgica', 'Astrónoma', 'Astrofísica', 'fr'),
('usuario28@databurst.com', 'usuario28', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 1, '2023-01-30 15:05:00', 'Daniel', 'Rojas', 'Paz', '1990-06-18', 'Suiza', 'Relojero', 'Ingeniería de Precisión', 'de');

INSERT INTO elemento (usuario_id, nombre, fecha_aparicion, descripcion, momento_creacion, categoria_id)
VALUES 
(3, 'Breaking Bad', '2008-01-20', 'Un profesor de química con cáncer terminal se asocia con un exalumno para fabricar y vender metanfetamina.', '2023-02-01 15:30:00', 3),
(3, 'El Padrino', '1972-03-15', 'La historia de la familia Corleone, una de las más poderosas familias de la mafia italiana en Nueva York.', '2023-02-02 10:20:00', 2),
(4, 'Los Simpson', '1989-12-17', 'Serie de comedia sobre una familia disfuncional que vive en un pueblo ficticio llamado Springfield.', '2023-02-03 18:45:00', 3),
(5, '1984', '1949-06-08', 'Novela distópica de George Orwell que presenta una sociedad totalitaria vigilada por el "Gran Hermano".', '2023-02-04 09:15:00', 1),
(6, 'The Legend of Zelda: Breath of the Wild', '2017-03-03', 'Juego de acción-aventura desarrollado por Nintendo para las consolas Switch y Wii U.', '2023-02-05 14:30:00', 4),
(4, 'Pink Floyd - The Dark Side of the Moon', '1973-03-01', 'Uno de los álbumes más vendidos y aclamados de todos los tiempos, conocido por su innovación musical.', '2023-02-06 11:20:00', 5),
(7, 'Stranger Things', '2016-07-15', 'Serie de ciencia ficción y terror ambientada en los años 80 que sigue a un grupo de niños en el pueblo de Hawkins.', '2023-02-07 16:40:00', 3),
(5, 'Harry Potter y la Piedra Filosofal', '1997-06-26', 'Primera novela de la serie Harry Potter que introduce el mundo mágico creado por J.K. Rowling.', '2023-02-08 13:15:00', 1),
(6, 'El Señor de los Anillos: La Comunidad del Anillo', '2001-12-19', 'Adaptación cinematográfica de la primera parte de la trilogía de J.R.R. Tolkien.', '2023-02-09 19:30:00', 2),
(7, 'Grand Theft Auto V', '2013-09-17', 'Videojuego de mundo abierto desarrollado por Rockstar Games ambientado en el ficticio estado de San Andreas.', '2023-02-10 10:45:00', 4),
(3, 'Cien años de soledad', '1967-05-30', 'Obra maestra del realismo mágico que narra la historia de la familia Buendía a lo largo de siete generaciones en el ficticio pueblo de Macondo.', '2023-03-15 10:20:00', 1),
(4, 'Don Quijote de la Mancha', '1605-01-16', 'Considerada la primera novela moderna, narra las aventuras del ingenioso hidalgo Don Quijote y su fiel escudero Sancho Panza.', '2023-03-16 11:30:00', 1),
(5, 'Orgullo y prejuicio', '1813-01-28', 'Novela romántica de Jane Austen que explora temas de clase, matrimonio y moralidad en la Inglaterra rural del siglo XIX.', '2023-03-17 09:15:00', 1),
(6, 'Crimen y castigo', '1866-12-22', 'Exploración psicológica de un estudiante que comete un asesinato y su posterior lucha con la culpa y la redención.', '2023-03-18 14:45:00', 1),
(7, 'El Gran Gatsby', '1925-04-10', 'Retrato de la era del jazz y crítica del sueño americano a través de la historia de Jay Gatsby y su amor por Daisy Buchanan.', '2023-03-19 16:30:00', 1),
(3, 'La sombra del viento', '2001-05-01', 'Thriller literario ambientado en la Barcelona posterior a la Guerra Civil Española que mezcla intriga, misterio y romance.', '2023-03-20 10:10:00', 1),
(4, 'Nunca me abandones', '2005-02-24', 'Historia distópica sobre un grupo de estudiantes que descubren un terrible secreto sobre su existencia.', '2023-03-21 15:20:00', 1),
(5, 'La carretera', '2006-09-26', 'Relato post-apocalíptico sobre un padre y su hijo que viajan a través de un paisaje devastado en busca de supervivencia.', '2023-03-22 13:45:00', 1),
(6, 'El nombre del viento', '2007-03-27', 'Primera entrega de la Crónica del Asesino de Reyes, narra la historia del músico, ladrón y mago Kvothe.', '2023-03-23 11:05:00', 1),
(7, 'Los detectives salvajes', '1998-11-12', 'Novela coral que sigue la búsqueda de una poeta mexicana desaparecida por parte de dos jóvenes poetas.', '2023-03-24 09:30:00', 1),
(3, 'Dune', '1965-08-01', 'Epopeya de ciencia ficción que combina política, religión y ecología en un futuro lejano donde se disputa el control de un planeta desértico.', '2023-03-25 14:15:00', 1),
(4, 'Neuromante', '1984-07-01', 'Novela fundacional del género cyberpunk que explora un futuro dominado por corporaciones, hackers y realidad virtual.', '2023-03-26 16:50:00', 1),
(5, 'Fundación', '1951-05-01', 'Saga que narra el colapso de un imperio galáctico y los intentos de preservar el conocimiento humano durante la edad oscura resultante.', '2023-03-27 10:25:00', 1),
(6, 'Juego de Tronos', '1996-08-01', 'Primera entrega de Canción de Hielo y Fuego, una compleja historia de intrigas políticas en un mundo medieval de fantasía.', '2023-03-28 13:40:00', 1),
(7, 'El Silmarillion', '1977-09-15', 'Compendio de mitos y leyendas del universo de la Tierra Media creado por J.R.R. Tolkien.', '2023-03-29 15:15:00', 1),
(3, 'Sapiens: De animales a dioses', '2011-02-10', 'Historia de la humanidad que explora cómo una especie insignificante de simios se convirtió en la dominante del planeta.', '2023-03-30 11:20:00', 1),
(4, 'El infinito en un junco', '2019-11-13', 'Ensayo sobre la historia de los libros, las bibliotecas y la pasión por la lectura a lo largo de los siglos.', '2023-03-31 09:45:00', 1),
(5, 'Pensar rápido, pensar despacio', '2011-10-25', 'Exploración de los dos sistemas de pensamiento humano y cómo afectan nuestras decisiones y juicios.', '2023-04-01 14:30:00', 1),
(6, 'Los años del hambre', '2022-03-17', 'Historia de la posguerra española a través de testimonios y documentos sobre la escasez alimentaria.', '2023-04-02 10:50:00', 1),
(7, 'El gen egoísta', '1976-04-30', 'Revolucionaria visión de la evolución centrada en los genes como unidades de selección natural.', '2023-04-03 16:25:00', 1),
(3, 'Pedro Páramo', '1955-03-01', 'Novela sobre un hombre que busca a su padre en un pueblo fantasma habitado por almas en pena.', '2023-04-04 13:10:00', 1),
(4, 'Rayuela', '1963-06-28', 'Obra experimental que invita al lector a saltar entre capítulos para crear diferentes experiencias de lectura.', '2023-04-05 11:45:00', 1),
(5, 'La casa de los espíritus', '1982-01-01', 'Saga familiar que entrelaza lo político y lo mágico a lo largo de varias generaciones en un país sudamericano.', '2023-04-06 09:30:00', 1),
(6, 'Ficciones', '1944-01-01', 'Colección de cuentos que juegan con conceptos filosóficos, laberintos mentales y paradojas.', '2023-04-07 15:20:00', 1),
(7, 'Conversación en La Catedral', '1969-01-01', 'Novela que retrata la corrupción política y moral durante la dictadura de Odría en Perú.', '2023-04-08 12:40:00', 1),
(3, 'Los pilares de la Tierra', '1989-10-01', 'Épica historia sobre la construcción de una catedral en la Inglaterra medieval del siglo XII.', '2023-04-09 10:15:00', 1),
(4, 'La chica del tren', '2015-01-13', 'Thriller psicológico sobre una mujer alcohólica que cree haber presenciado un crimen desde la ventana de un tren.', '2023-04-10 14:50:00', 1),
(5, 'Eleanor Oliphant está perfectamente', '2017-05-09', 'Historia sobre una mujer solitaria con un pasado traumático que comienza a abrirse al mundo.', '2023-04-11 16:30:00', 1),
(6, 'El proyecto Hail Mary', '2021-05-04', 'Un maestro de ciencias amnésico despierta solo en una nave espacial con la misión de salvar a la humanidad.', '2023-04-12 11:25:00', 1),
(7, 'Reina Roja', '2018-11-08', 'Thriller futurista donde una detective especial investiga asesinatos en una sociedad vigilada por inteligencia artificial.', '2023-04-13 09:40:00', 1);

INSERT INTO lista (id, nombre, categoria_id)
VALUES 
(1, 'Series', 3),
(2, 'Películas', 2),
(3, 'Libros', 1),
(4, 'Videojuegos', 4),
(5, 'Lo mejor del 2023', 3),
(6, 'Para ver este fin de semana', 3),
(7, 'Recomendaciones para principiantes', 1),
(8, 'Clásicos literarios', 1),
(9, 'Ciencia ficción y fantasía', 1),
(10, 'Literatura latinoamericana', 1),
(11, 'Novela histórica', 1),
(12, 'Literatura contemporánea', 1),
(13, 'Libros de no ficción', 1),
(14, 'Mis favoritos de todos los tiempos', 1),
(15, 'Lecturas pendientes', 1),
(16, 'Libros para el verano', 1),
(17, 'Lecturas académicas', 1),
(18, 'Novela negra y thrillers', 1),
(19, 'Recomendados por amigos', 1),
(20, 'Libros premiados', 1);

INSERT INTO usuario_manipula_lista (usuario_id, lista_id, publica, momento_manipulacion)
VALUES 
(3, 1, 1, '2023-03-10 09:30:00'),
(3, 2, 1, '2023-03-10 09:35:00'),
(4, 3, 1, '2023-03-11 14:20:00'),
(5, 4, 0, '2023-03-12 16:45:00'),
(6, 5, 1, '2023-03-13 11:15:00'),
(7, 6, 0, '2023-03-14 18:30:00'),
(4, 7, 1, '2023-03-15 10:10:00'),
(8, 8, 1, '2023-03-16 11:20:00'),
(9, 9, 1, '2023-03-17 14:45:00'),
(10, 10, 1, '2023-03-18 09:30:00'),
(11, 11, 1, '2023-03-19 16:15:00'),
(12, 12, 1, '2023-03-20 13:50:00'),
(13, 13, 0, '2023-03-21 10:25:00'),
(14, 14, 1, '2023-03-22 15:40:00'),
(15, 15, 0, '2023-03-23 12:10:00'),
(16, 16, 1, '2023-03-24 09:55:00'),
(17, 17, 1, '2023-03-25 17:30:00'),
(18, 18, 1, '2023-03-26 14:15:00'),
(19, 19, 0, '2023-03-27 11:40:00'),
(20, 20, 1, '2023-03-28 16:05:00');

INSERT INTO lista_contiene_elemento (lista_id, elemento_id, momento_contencion)
VALUES
(1, 1, '2023-03-01 10:15:00'),
(1, 3, '2023-03-01 10:16:00'),
(1, 7, '2023-03-01 10:17:00'),
(2, 2, '2023-03-02 15:30:00'),
(2, 9, '2023-03-02 15:31:00'),
(8, 11, '2023-04-14 10:00:00'),
(8, 12, '2023-04-14 10:01:00'),
(8, 13, '2023-04-14 10:02:00'),
(8, 14, '2023-04-14 10:03:00'),
(8, 15, '2023-04-14 10:04:00'),
(12, 16, '2023-04-14 10:05:00'),
(12, 17, '2023-04-14 10:06:00'),
(12, 18, '2023-04-14 10:07:00'),
(12, 19, '2023-04-14 10:08:00'),
(12, 20, '2023-04-14 10:09:00'),
(9, 21, '2023-04-14 10:10:00'),
(9, 22, '2023-04-14 10:11:00'),
(9, 23, '2023-04-14 10:12:00'),
(9, 24, '2023-04-14 10:13:00'),
(9, 25, '2023-04-14 10:14:00'),
(13, 26, '2023-04-14 10:15:00'),
(13, 27, '2023-04-14 10:16:00'),
(13, 28, '2023-04-14 10:17:00'),
(13, 29, '2023-04-14 10:18:00'),
(13, 30, '2023-04-14 10:19:00'),
(10, 31, '2023-04-14 10:20:00'),
(10, 32, '2023-04-14 10:21:00'),
(10, 33, '2023-04-14 10:22:00'),
(10, 34, '2023-04-14 10:23:00'),
(10, 35, '2023-04-14 10:24:00'),
(20, 36, '2023-04-14 10:25:00'),
(20, 37, '2023-04-14 10:26:00'),
(20, 38, '2023-04-14 10:27:00'),
(20, 39, '2023-04-14 10:28:00'),
(20, 40, '2023-04-14 10:29:00'),
(14, 11, '2023-04-15 09:00:00'),
(14, 16, '2023-04-15 09:01:00'),
(14, 21, '2023-04-15 09:02:00'),
(14, 31, '2023-04-15 09:03:00'),
(14, 36, '2023-04-15 09:04:00'),
(15, 12, '2023-04-16 11:30:00'),
(15, 17, '2023-04-16 11:31:00'),
(15, 22, '2023-04-16 11:32:00'),
(15, 27, '2023-04-16 11:33:00'),
(15, 32, '2023-04-16 11:34:00'),
(15, 37, '2023-04-16 11:35:00'),
(16, 13, '2023-04-17 14:15:00'),
(16, 18, '2023-04-17 14:16:00'),
(16, 23, '2023-04-17 14:17:00'),
(16, 33, '2023-04-17 14:18:00'),
(16, 38, '2023-04-17 14:19:00'),
(18, 14, '2023-04-18 16:45:00'),
(18, 37, '2023-04-18 16:46:00'),
(18, 40, '2023-04-18 16:47:00'),
(4, 5, '2023-03-04 14:10:00'),
(4, 10, '2023-03-04 14:11:00'),
(5, 1, '2023-03-05 11:45:00'),
(5, 3, '2023-03-05 11:46:00'),
(5, 7, '2023-03-05 11:47:00'),
(6, 1, '2023-03-06 18:30:00'),
(6, 3, '2023-03-06 18:31:00'),
(7, 8, '2023-03-07 12:20:00'),
(7, 4, '2023-03-07 12:21:00');

INSERT INTO elemento_categoria (elemento_id, categoria_id) VALUES
(1, 3), 
(2, 2), 
(3, 3), 
(4, 1), 
(5, 4),  
(6, 5),  
(7, 3),  
(8, 1),  
(9, 2),  
(10, 4), 
(11, 1),
(12, 1),
(13, 1),
(14, 1),
(15, 1),
(16, 1),
(17, 1),
(18, 1),
(19, 1),
(20, 1),
(21, 1),
(22, 1),
(23, 1),
(24, 1),
(25, 1),
(26, 1),
(27, 1),
(28, 1),
(29, 1),
(30, 1),
(31, 1),
(32, 1),
(33, 1),
(34, 1),
(35, 1),
(36, 1),
(37, 1),
(38, 1),
(39, 1),
(40, 1);

INSERT INTO lista_categoria (lista_id, categoria_id) VALUES
(1, 3),
(2, 2),
(3, 1),
(4, 4),
(5, 2),
(5, 3),
(5, 1),
(5, 4),
(6, 2),
(6, 3),
(7, 1),
(7, 2),
(7, 3),
(7, 4),
(8, 1),
(9, 1),
(10, 1),
(11, 1),
(12, 1),
(13, 1),
(14, 1),
(14, 2),
(14, 3),
(15, 1),
(16, 1),
(17, 1),
(18, 1),
(19, 1),
(19, 2),
(19, 3),
(20, 1);

INSERT INTO usuario_agrega_usuario (usuario_1_id, usuario_2_id, momento_agregacion)
VALUES 
(3, 4, '2023-04-01 14:20:00'),
(3, 5, '2023-04-02 15:30:00'),
(4, 5, '2023-04-03 09:45:00'),
(4, 6, '2023-04-04 11:30:00'),
(5, 7, '2023-04-05 16:20:00'),
(6, 7, '2023-04-06 13:15:00'),
(3, 6, '2023-04-07 10:10:00'),
(8, 9, '2023-04-08 09:30:00'),
(9, 10, '2023-04-08 11:45:00'),
(10, 11, '2023-04-08 14:20:00'),
(11, 12, '2023-04-08 16:35:00'),
(12, 13, '2023-04-09 10:15:00'),
(13, 14, '2023-04-09 13:40:00'),
(14, 15, '2023-04-09 15:55:00');

INSERT INTO usuario_elemento_comentario (usuario_id, elemento_id, comentario, momento_comentario)
VALUES 
(3, 2, '¡Una obra maestra del cine! La actuación de Marlon Brando es insuperable.', '2023-05-01 14:30:00'),
(4, 1, 'La mejor serie que he visto en mi vida. Bryan Cranston merece todos los premios.', '2023-05-02 16:45:00'),
(5, 3, 'Un clásico que nunca pasa de moda, sigo viéndolo después de tantos años.', '2023-05-03 10:20:00'),
(6, 5, 'La libertad y el mundo abierto que ofrece este juego es increíble. Nintendo se superó.', '2023-05-04 19:15:00'),
(7, 4, 'Libro que te hace reflexionar sobre la libertad y el poder. Muy actual a pesar de ser de 1949.', '2023-05-05 12:30:00'),
(8, 11, 'Una obra maestra del realismo mágico. La forma en que García Márquez construye Macondo es fascinante.', '2023-05-10 09:15:00'),
(9, 12, 'El mejor libro de la literatura española. La relación entre Don Quijote y Sancho es inigualable.', '2023-05-10 11:30:00'),
(10, 13, 'Jane Austen retrata perfectamente la sociedad de su época. Elizabeth Bennet es un personaje adelantado a su tiempo.', '2023-05-10 14:45:00'),
(11, 14, 'La exploración psicológica de Raskolnikov es increíblemente profunda. Dostoievski era un genio.', '2023-05-10 17:00:00'),
(12, 15, 'Un retrato perfecto de los excesos de los años 20 y la decadencia del sueño americano.', '2023-05-10 19:15:00'),
(13, 16, 'Un thriller literario con Barcelona como protagonista. La prosa de Ruiz Zafón es adictiva.', '2023-05-11 10:00:00'),
(14, 17, 'Una distopía sutil y desgarradora. La forma en que Ishiguro revela la verdad poco a poco es magistral.', '2023-05-11 12:15:00'),
(15, 18, 'McCarthy escribe el apocalipsis como nadie. La relación padre-hijo es el corazón de esta historia desoladora.', '2023-05-11 14:30:00'),
(16, 19, 'La construcción del mundo y el sistema de magia son fascinantes. Estoy esperando ansiosamente la tercera parte.', '2023-05-11 16:45:00'),
(17, 20, 'Bolaño revolucionó la literatura latinoamericana con esta novela. Su estructura es innovadora.', '2023-05-11 19:00:00'),
(18, 21, 'El worldbuilding de Herbert es inigualable. Los conceptos religiosos y políticos están muy bien desarrollados.', '2023-05-12 09:30:00'),
(19, 22, 'Gibson prácticamente inventó el cyberpunk con esta novela. Su visión del futuro sigue siendo relevante.', '2023-05-12 11:45:00'),
(20, 23, 'Asimov era un visionario. Su concepto de psicohistoria es fascinante y la caída del imperio está muy bien construida.', '2023-05-12 14:00:00'),
(21, 24, 'Martin subvierte todas las expectativas del género de fantasía. Nadie está a salvo en esta saga.', '2023-05-12 16:15:00'),
(22, 25, 'La mitología creada por Tolkien es increíblemente detallada. Este libro es la base de todo El Señor de los Anillos.', '2023-05-12 18:30:00'),
(23, 26, 'Harari tiene una forma fascinante de explicar la historia y evolución humana. Muy revelador.', '2023-05-13 10:45:00'),
(24, 27, 'Un ensayo bellísimo sobre la historia de los libros. La erudición de Vallejo es impresionante.', '2023-05-13 13:00:00'),
(25, 28, 'Kahneman explica perfectamente cómo funciona nuestra mente y por qué tomamos decisiones irracionales.', '2023-05-13 15:15:00'),
(26, 29, 'Un documento histórico esencial para entender la posguerra española. Las historias son desgarradoras.', '2023-05-13 17:30:00'),
(27, 30, 'Dawkins revolucionó la forma de entender la evolución. Su tesis sigue siendo relevante hoy en día.', '2023-05-13 19:45:00');

INSERT INTO usuario_elemento_puntuacion (usuario_id, elemento_id, puntuacion, momento_puntuacion)
VALUES 
(3, 1, 1, '2023-06-01 10:15:00'),
(3, 2, 1, '2023-06-01 10:16:00'),
(4, 1, 1, '2023-06-02 14:30:00'),
(4, 3, NULL, '2023-06-02 14:31:00'),
(5, 2, 1, '2023-06-03 09:20:00'),
(5, 4, 0, '2023-06-03 09:21:00'),
(6, 5, NULL, '2023-06-04 16:40:00'),
(6, 9, 1, '2023-06-04 16:41:00'),
(7, 7, 1, '2023-06-05 12:15:00'),
(7, 10, NULL, '2023-06-05 12:16:00'),
(8, 11, 1, '2023-06-10 09:00:00'),
(9, 11, 1, '2023-06-10 09:01:00'),
(10, 11, NULL, '2023-06-10 09:02:00'),
(11, 11, 1, '2023-06-10 09:03:00'),
(12, 11, 0, '2023-06-10 09:04:00'),
(8, 12, 1, '2023-06-10 09:05:00'),
(9, 12, NULL, '2023-06-10 09:06:00'),
(10, 12, 0, '2023-06-10 09:07:00'),
(11, 13, 1, '2023-06-10 09:08:00'),
(12, 13, 1, '2023-06-10 09:09:00'),
(8, 14, NULL, '2023-06-10 09:10:00'),
(9, 14, 0, '2023-06-10 09:11:00'),
(10, 15, 1, '2023-06-10 09:12:00'),
(11, 15, 1, '2023-06-10 09:13:00'),
(12, 16, NULL, '2023-06-11 10:00:00'),
(13, 16, 1, '2023-06-11 10:01:00'),
(14, 16, 1, '2023-06-11 10:02:00'),
(15, 16, 0, '2023-06-11 10:03:00'),
(12, 17, 1, '2023-06-11 10:04:00'),
(13, 17, NULL, '2023-06-11 10:05:00'),
(14, 18, 0, '2023-06-11 10:06:00'),
(15, 18, 1, '2023-06-11 10:07:00'),
(12, 19, 1, '2023-06-11 10:08:00'),
(13, 20, NULL, '2023-06-11 10:09:00'),
(14, 20, 0, '2023-06-11 10:10:00'),
(15, 21, 1, '2023-06-12 11:00:00'),
(16, 21, 1, '2023-06-12 11:01:00'),
(17, 21, NULL, '2023-06-12 11:02:00'),
(18, 21, 0, '2023-06-12 11:03:00'),
(15, 22, 1, '2023-06-12 11:04:00'),
(16, 23, 1, '2023-06-12 11:05:00'),
(17, 23, 0, '2023-06-12 11:06:00'),
(18, 24, NULL, '2023-06-12 11:07:00'),
(19, 24, 1, '2023-06-12 11:08:00'),
(20, 24, 1, '2023-06-12 11:09:00'),
(21, 24, 1, '2023-06-12 11:10:00'),
(22, 24, 0, '2023-06-12 11:11:00'),
(19, 25, NULL, '2023-06-12 11:12:00'),
(20, 26, 1, '2023-06-13 12:00:00'),
(21, 26, 1, '2023-06-13 12:01:00'),
(22, 26, 1, '2023-06-13 12:02:00'),
(23, 26, 0, '2023-06-13 12:03:00'),
(20, 27, NULL, '2023-06-13 12:04:00'),
(21, 28, 1, '2023-06-13 12:05:00'),
(22, 28, 1, '2023-06-13 12:06:00'),
(23, 28, 1, '2023-06-13 12:07:00'),
(24, 29, 0, '2023-06-13 12:08:00'),
(25, 29, 0, '2023-06-13 12:09:00'),
(24, 30, NULL, '2023-06-13 12:10:00'),
(25, 30, 1, '2023-06-13 12:11:00'),
(23, 31, 1, '2023-06-14 13:00:00'),
(24, 31, 1, '2023-06-14 13:01:00'),
(25, 31, NULL, '2023-06-14 13:02:00'),
(26, 31, 1, '2023-06-14 13:03:00'),
(27, 31, 0, '2023-06-14 13:04:00'),
(23, 32, 1, '2023-06-14 13:05:00'),
(24, 33, NULL, '2023-06-14 13:06:00'),
(25, 34, 1, '2023-06-14 13:07:00'),
(26, 34, 1, '2023-06-14 13:08:00'),
(27, 34, 1, '2023-06-14 13:09:00'),
(23, 35, 0, '2023-06-14 13:10:00'),
(24, 36, 1, '2023-06-15 14:00:00'),
(25, 36, NULL, '2023-06-15 14:01:00'),
(26, 36, 1, '2023-06-15 14:02:00'),
(27, 36, 1, '2023-06-15 14:03:00'),
(28, 36, 0, '2023-06-15 14:04:00'),
(24, 37, 1, '2023-06-15 14:05:00'),
(25, 37, NULL, '2023-06-15 14:06:00'),
(26, 38, 1, '2023-06-15 14:07:00'),
(27, 38, 1, '2023-06-15 14:08:00'),
(28, 39, NULL, '2023-06-15 14:09:00'),
(24, 39, 1, '2023-06-15 14:10:00'),
(25, 40, 1, '2023-06-15 14:11:00'),
(26, 40, 1, '2023-06-15 14:12:00'),
(27, 40, NULL, '2023-06-15 14:13:00');

INSERT INTO usuario_reporta_elemento (usuario_id, elemento_id, descripcion, momento_reporte)
VALUES 
(4, 2, 'Contiene información incorrecta sobre el año de estreno.', '2023-07-01 14:20:00'),
(6, 3, 'La descripción tiene errores ortográficos.', '2023-07-02 16:30:00'),
(7, 5, 'Hay un error en el nombre del desarrollador del juego.', '2023-07-03 10:15:00'),
(9, 11, 'La fecha de publicación es incorrecta.', '2023-07-04 09:30:00'),
(12, 16, 'Hay un error en el nombre del autor.', '2023-07-05 11:45:00'),
(15, 21, 'La información sobre la saga está incompleta.', '2023-07-06 14:00:00'),
(18, 26, 'La descripción tiene información imprecisa sobre las teorías del autor.', '2023-07-07 16:15:00'),
(21, 31, 'Hay un error en el país de origen del autor.', '2023-07-08 10:30:00'),
(24, 36, 'La descripción contiene spoilers importantes sin advertencia.', '2023-07-09 13:45:00');

INSERT INTO usuario_reporta_elemento (id, usuario_id, elemento_id, nombre_reportado, fecha_aparicion_reportada, descripcion_reportada, momento_reporte, estado, moderador_id, momento_procesado, comentario_moderador)
VALUES 
(1, 4, 2, 'El Padrino', '1972-03-24', NULL, '2023-07-01 14:20:00', 1, 2, '2023-07-15 10:30:00', 'Fecha corregida según IMDB'),
(2, 6, 3, NULL, NULL, 'Serie de comedia sobre una familia disfuncional que vive en el pueblo ficticio de Springfield.', '2023-07-02 16:30:00', 1, 2, '2023-07-16 11:45:00', 'Corrección ortográfica aceptada'),
(3, 7, 5, 'The Legend of Zelda: Breath of the Wild', NULL, NULL, '2023-07-03 10:15:00', 0, NULL, NULL, NULL),
(4, 9, 11, NULL, '1967-06-05', NULL, '2023-07-04 09:30:00', 1, 1, '2023-07-17 14:20:00', 'Fecha verificada en la base de datos de la editorial'),
(5, 12, 16, 'La sombra del viento - Carlos Ruiz Zafón', NULL, NULL, '2023-07-05 11:45:00', 2, 2, '2023-07-18 09:15:00', 'El nombre del autor es correcto en la base de datos'),
(6, 15, 21, NULL, NULL, 'Epopeya de ciencia ficción que combina política, religión y ecología en un futuro lejano donde se disputa el control del planeta desértico Arrakis, fuente de la valiosa especia melange.', '2023-07-06 14:00:00', 1, 1, '2023-07-19 16:30:00', 'Ampliada la descripción'),
(7, 18, 26, NULL, NULL, 'Historia de la humanidad basada en estudios antropológicos que explora cómo Homo sapiens pasó de ser una especie insignificante de simios en África a convertirse en la dominante del planeta.', '2023-07-07 16:15:00', 0, NULL, NULL, NULL),
(8, 21, 31, 'Pedro Páramo - Juan Rulfo (México)', NULL, NULL, '2023-07-08 10:30:00', 1, 1, '2023-07-20 11:10:00', 'Añadido país de origen del autor'),
(9, 24, 36, NULL, NULL, '[AVISO: CONTIENE SPOILERS] Novela sobre un hombre que busca a su padre en un pueblo fantasma habitado por almas en pena, donde descubrirá secretos sobre su propia identidad.', '2023-07-09 13:45:00', 2, 2, '2023-07-21 15:40:00', 'No consideramos necesario el aviso de spoilers para esta obra clásica');

INSERT INTO usuario_gestiona_elemento (id, usuario_id, elemento_id, momento_gestion, nombre_antiguo, fecha_aparicion_antigua, descripcion_antigua, moderador_id, reporte_id)
VALUES 
(1, 1, 2, '2023-08-01 09:30:00', 'El Padrino (The Godfather)', '1972-03-15', 'La historia de la familia Corleone y su papel en la mafia americana.', 2, 1),
(2, 2, 4, '2023-08-02 11:45:00', '1984 - George Orwell', '1949-06-08', 'Novela distópica sobre un futuro totalitario.', NULL, NULL),
(3, 1, 7, '2023-08-03 14:20:00', 'Stranger Things - Netflix', '2016-07-15', 'Serie de Netflix sobre fenómenos sobrenaturales en un pequeño pueblo.', NULL, NULL),
(4, 1, 11, '2023-08-04 10:00:00', 'Cien años de soledad - Gabriel García Márquez', '1967-05-30', 'Historia de la familia Buendía en el pueblo de Macondo.', 1, 4),
(5, 2, 21, '2023-08-05 15:30:00', 'Dune - Frank Herbert', '1965-08-01', 'Historia sobre el planeta desértico Arrakis y la especia melange.', 1, 6),
(6, 1, 31, '2023-08-06 13:15:00', 'Pedro Páramo - Juan Rulfo', '1955-03-01', 'Historia de Juan Preciado buscando a su padre en Comala.', 1, 8);

INSERT INTO usuario_gestiona_usuario (usuario_normal_id, usuario_administrador_id, permiso_antiguo, momento_gestion)
VALUES 
(3, 1, 1, '2023-09-01 10:30:00'),
(4, 1, 1, '2023-09-02 14:15:00'),
(5, 2, 1, '2023-09-03 16:20:00'),
(10, 1, 1, '2023-09-04 09:45:00'),
(15, 2, 1, '2023-09-05 11:30:00'),
(20, 1, 1, '2023-09-06 14:00:00'),
(25, 2, 1, '2023-09-07 16:45:00');

INSERT INTO invitacion (invitador_id, invitado_id, lista_id)
VALUES 
(3, 4, 1),
(3, 5, 2),
(4, 6, 3),
(5, 7, 4),
(6, 3, 5),
(7, 4, 6),
(8, 9, 8),
(9, 10, 9),
(10, 11, 10),
(11, 12, 11),
(12, 13, 12),
(13, 14, 13),
(14, 15, 14),
(15, 16, 15);