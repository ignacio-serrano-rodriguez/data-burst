INSERT INTO `usuario` (mail, usuario, contrasenia, verificado, permiso, momento_registro, nombre, apellido_1, apellido_2, fecha_nacimiento, pais, profesion, estudios, avatar, idioma)
VALUES
  ('iserod@mail.com', 'iserod', '$2y$10$huWGgWMIgNEAKIij1H93kOitS2xoD4w8eLg5wz3G51xB4VFhG9JJW', 1, 1, '2024-01-01 00:00:00', 'Ignacio', 'Serrano', 'Rodriguez', '1990-01-01', 'España', 'Desarrollador', 'DAW', NULL, 'Español'),
  ('roxen@mail.com', 'roxen', '$2y$10$XtU0vuOQXzUdqjjijhDcwuE0TaBDDp14LekuuxoPo3oqjm8poiX82', 1, 1, '2024-02-14 12:34:56', 'Rosa', 'Durán', 'Guzmán', '1995-05-27', 'España', 'Enfemera', 'Enfemería', NULL, 'Español'),
  ('usuario_1@mail.com', 'usuario_1', '$2y$10$Fa.1fo7vZ5M8XlzHWt2S9eptrKF/O0.1DcaCzaA1Vc0xO4F0KrbPi', 1, 1, '2023-12-25 10:10:10', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

INSERT INTO `lista` (nombre, publica)
VALUES
  ('Peliculas', 1),
  ('Cursos', 0),
  ('Recetas', 1);

INSERT INTO `elemento` (usuario_id, nombre, fecha_aparicion, informacion_extra, puntuacion, descripcion, momento_creacion)
VALUES
  (1, 'El Señor de los Anillos: La Comunidad del Anillo', '2001-12-19', 'Escritor: J.R.R. Tolkien', 0, 'Primera entrega de la trilogía épica de fantasía heroica escrita por el filólogo y catedrático británico J. R. R. Tolkien.', '2024-05-10 15:23:42'),
  (2, 'Curso básico de Python', '2023-01-01', 'Autor: Juan', 0, 'Curso online gratuito para aprender los fundamentos del lenguaje de programación Python.', '2024-04-12 09:10:00'),
  (3, 'Hamburguesa vegetariana con lentejas', '2024-02-22', 'Autor: Manuel', 0, 'Deliciosa receta de hamburguesa vegetariana a base de lentejas.', '2024-05-20 17:45:12');

INSERT INTO `lista_contiene_elemento` (lista_id, elemento_id, positivo, comentario, momento_contencion)
VALUES
  (1, 1, NULL, 'Una de las mejores películas de fantasía jamás rodadas.', '2024-05-10 15:24:12'),
  (2, 2, NULL, NULL, '2024-04-15 11:23:56'),
  (3, 3, NULL, NULL, '2024-05-20 17:45:45');

INSERT INTO `usuario_manipula_lista` (usuario_id, lista_id)
VALUES
  (1, 1),  
  (2, 2),  
  (3, 3);  

INSERT INTO `usuario_reporta_elemento` (usuario_id, elemento_id, descripcion, momento_reporte)
VALUES
  (2, 1, 'Enlace roto en la descripción del elemento.', '2024-05-22 14:56:12');
