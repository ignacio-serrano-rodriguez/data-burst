CREATE DATABASE Data_Burst;

USE Data_Burst;

CREATE TABLE Usuario (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  mail VARCHAR(254) NOT NULL UNIQUE,
  usuario VARCHAR(255) NOT NULL UNIQUE,
  contrasenia VARCHAR(64) NOT NULL,
  verificado BOOLEAN NOT NULL DEFAULT FALSE,
  permiso ENUM('Ninguno', 'Normal', 'Administrador') NOT NULL DEFAULT 'Normal',
  momento_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  nombre VARCHAR(255) DEFAULT NULL,
  apellido_1 VARCHAR(255) DEFAULT NULL,
  apellido_2 VARCHAR(255) DEFAULT NULL,
  fecha_nacimiento DATE DEFAULT NULL,
  pais VARCHAR(255) DEFAULT NULL,
  profesion VARCHAR(255) DEFAULT NULL,
  estudios VARCHAR(255) DEFAULT NULL,
  avatar MEDIUMBLOB DEFAULT NULL,
  idioma VARCHAR(255) DEFAULT NULL
);

CREATE TABLE Lista (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(255) NOT NULL,
  publica BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE Elemento (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(255) NOT NULL,
  fecha_aparicion DATE NOT NULL,
  informacion_extra VARCHAR(255) NOT NULL,
  puntuacion INT NOT NULL DEFAULT 0,
  descripcion TEXT NOT NULL,
  momento_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  id_usuario INT UNSIGNED NOT NULL,
  FOREIGN KEY (id_usuario) REFERENCES Usuario(id),
  UNIQUE (id, id_usuario)
);

CREATE TABLE Lista_Contiene_Elemento ( 
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  lista_id INT UNSIGNED NOT NULL,
  elemento_id INT UNSIGNED NOT NULL,
  positivo BOOLEAN DEFAULT NULL,
  comentario TEXT,
  momento_contencion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lista_id) REFERENCES Lista(id),
  FOREIGN KEY (elemento_id) REFERENCES Elemento(id),
  UNIQUE (lista_id, elemento_id)
);

CREATE TABLE Usuario_Manipula_Lista (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT UNSIGNED NOT NULL,
  lista_id INT UNSIGNED NOT NULL,
  FOREIGN KEY (usuario_id) REFERENCES Usuario(id),
  FOREIGN KEY (lista_id) REFERENCES Lista(id),
  UNIQUE (usuario_id, lista_id)
);

CREATE TABLE Usuario_Gestiona_Elemento (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  usuario_administrador_id INT UNSIGNED NOT NULL,
  elemento_id INT UNSIGNED NOT NULL,
  momento_gestion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  nombre_antiguo VARCHAR(255) NOT NULL,
  fecha_aparicion_antigua DATE NOT NULL,
  informacion_extra_antigua VARCHAR(255) NOT NULL,
  descripcion_antigua TEXT NOT NULL,
  FOREIGN KEY (usuario_administrador_id) REFERENCES Usuario(id),
  FOREIGN KEY (elemento_id) REFERENCES Elemento(id)
);

CREATE TABLE Usuario_Gestiona_Usuario (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  usuario_normal_id INT UNSIGNED NOT NULL,
  usuario_administrador_id INT UNSIGNED NOT NULL,
  permiso_antiguo ENUM('Ninguno', 'Normal', 'Administrador') NOT NULL,
  momento_gestion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_normal_id) REFERENCES Usuario(id),
  FOREIGN KEY (usuario_administrador_id) REFERENCES Usuario(id)
);

CREATE TABLE Usuario_Agrega_Usuario (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  usuario_id_1 INT UNSIGNED NOT NULL,
  usuario_id_2 INT UNSIGNED NOT NULL,
  momento_agregacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id_1) REFERENCES Usuario(id),
  FOREIGN KEY (usuario_id_2) REFERENCES Usuario(id),
  UNIQUE (usuario_id_1, usuario_id_2)
);

CREATE TABLE Usuario_Reporta_Elemento (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT UNSIGNED NOT NULL,
    elemento_id INT UNSIGNED NOT NULL,
    descripcion TEXT NOT NULL,
    momento_reporte DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id),
    FOREIGN KEY (elemento_id) REFERENCES Elemento(id)
);