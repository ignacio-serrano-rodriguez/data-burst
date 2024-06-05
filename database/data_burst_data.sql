INSERT INTO `usuario` (mail, usuario, contrasenia, verificado, permiso, momento_registro, nombre, apellido_1, apellido_2, fecha_nacimiento, pais, profesion, estudios, avatar, idioma)
VALUES
  ('user1@example.com', 'user1', 'password123', 1, 2, '2024-01-01 00:00:00', 'Ignacio', 'Serrano', 'Rodriguez', '1990-01-01', 'Spain', 'Software Engineer', 'Computer Science', NULL, 'en'),
  ('user2@example.com', 'user2', 'password456', 1, 1, '2024-02-14 12:34:56', 'Jane', 'Doe', NULL, '1995-05-27', 'France', 'Teacher', 'Pedagogy', NULL, 'es'),
  ('admin@example.com', 'admin', 'admin1234', 1, 3, '2023-12-25 10:10:10', 'Admin', NULL, NULL, '1980-10-31', 'Germany', 'Administrator', 'Database Management', NULL, 'en');

INSERT INTO `lista` (nombre, publica)
VALUES
  ('Peliculas', 1),
  ('Cursos', 0),
  ('Recetas', 1);

INSERT INTO `elemento` (nombre, fecha_aparicion, informacion_extra, puntuacion, descripcion, momento_creacion)
VALUES
  ('El Señor de los Anillos: La Comunidad del Anillo', '2001-12-19', 'J.R.R. Tolkien', 5, 'Primera entrega de la trilogía épica de fantasía heroica escrita por el filólogo y catedrático británico J. R. R. Tolkien.', '2024-05-10 15:23:42'),
  ('Curso básico de Python', '2023-01-01', '20 horas estimadas', 4, 'Curso online gratuito para aprender los fundamentos del lenguaje de programación Python.', '2024-04-12 09:10:00'),
  ('Hamburguesa vegetariana con lentejas', '2024-02-22', 'Fácil y rápida', 4, 'Deliciosa receta de hamburguesa vegetariana a base de lentejas.', '2024-05-20 17:45:12');

-- Link Elementos to Listas (using Lista_contiene_elemento table)
INSERT INTO `lista_contiene_elemento` (lista_id, elemento_id, positivo, comentario, momento_contencion)
VALUES
  (1, 1, 1, 'Una de las mejores películas de fantasía jamás rodadas.', '2024-05-10 15:24:12'),
  (2, 2, 1, 'Excelente curso para iniciarse en Python.', '2024-04-15 11:23:56'),
  (3, 3, 1, 'Muy rica y fácil de preparar.', '2024-05-20 17:45:45');

INSERT INTO `usuario_manipula_lista` (usuario_id, lista_id)
VALUES
  (1, 1),  -- user1 creates list 1
  (2, 2),  -- user2 creates list 2
  (3, 3);  -- admin creates list 3

INSERT INTO `usuario_reporta_elemento` (usuario_id, elemento_id, descripcion, momento_reporte)
VALUES
  (2, 1, 'Enlace roto en la descripción del elemento.', '2024-05-22 14:56:12');
