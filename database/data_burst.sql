CREATE DATABASE `data_burst`

USE data_burst_inicial;

CREATE TABLE `doctrine_migration_versions` (
  `version` varchar(191) NOT NULL,
  `executed_at` datetime DEFAULT NULL,
  `execution_time` int(11) DEFAULT NULL,
  PRIMARY KEY (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

CREATE TABLE `elemento` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `fecha_aparicion` date NOT NULL,
  `informacion_extra` varchar(255) NOT NULL,
  `puntuacion` int(11) NOT NULL,
  `descripcion` longtext NOT NULL,
  `momento_creacion` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `lista` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `publica` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mail` varchar(254) NOT NULL,
  `usuario` varchar(255) NOT NULL,
  `contrasenia` varchar(64) NOT NULL,
  `verificado` tinyint(1) NOT NULL,
  `permiso` smallint(6) NOT NULL,
  `momento_registro` datetime NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `apellido_1` varchar(255) DEFAULT NULL,
  `apellido_2` varchar(255) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `pais` varchar(255) DEFAULT NULL,
  `profesion` varchar(255) DEFAULT NULL,
  `estudios` varchar(255) DEFAULT NULL,
  `avatar` longblob DEFAULT NULL,
  `idioma` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `lista_contiene_elemento` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `lista_id` int(11) NOT NULL,
  `elemento_id` int(11) NOT NULL,
  `positivo` tinyint(1) NOT NULL,
  `comentario` longtext DEFAULT NULL,
  `momento_contencion` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_CA30CE296736D68F` (`lista_id`),
  KEY `IDX_CA30CE29C1A2AEF9` (`elemento_id`),
  CONSTRAINT `FK_CA30CE296736D68F` FOREIGN KEY (`lista_id`) REFERENCES `lista` (`id`),
  CONSTRAINT `FK_CA30CE29C1A2AEF9` FOREIGN KEY (`elemento_id`) REFERENCES `elemento` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `usuario_agrega_usuario` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_1_id` int(11) NOT NULL,
  `usuario_2_id` int(11) NOT NULL,
  `momento_agregacion` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_70AAA6E599A926EA` (`usuario_1_id`),
  KEY `IDX_70AAA6E58B1C8904` (`usuario_2_id`),
  CONSTRAINT `FK_70AAA6E58B1C8904` FOREIGN KEY (`usuario_2_id`) REFERENCES `usuario` (`id`),
  CONSTRAINT `FK_70AAA6E599A926EA` FOREIGN KEY (`usuario_1_id`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `usuario_gestiona_elemento` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `elemento_id` int(11) NOT NULL,
  `usuario_administrador_id` int(11) NOT NULL,
  `momento_gestion` datetime NOT NULL,
  `nombre_antiguo` varchar(255) NOT NULL,
  `fecha_aparicion_antigua` date NOT NULL,
  `informacion_extra_antigua` varchar(255) NOT NULL,
  `descripcion_antigua` longtext NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_1C21703C1A2AEF9` (`elemento_id`),
  KEY `IDX_1C2170349E12E92` (`usuario_administrador_id`),
  CONSTRAINT `FK_1C2170349E12E92` FOREIGN KEY (`usuario_administrador_id`) REFERENCES `usuario` (`id`),
  CONSTRAINT `FK_1C21703C1A2AEF9` FOREIGN KEY (`elemento_id`) REFERENCES `elemento` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `usuario_gestiona_usuario` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_normal_id` int(11) NOT NULL,
  `usuario_administrador_id` int(11) NOT NULL,
  `permiso_antiguo` smallint(6) NOT NULL,
  `momento_gestion` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_75299B6C7167C17F` (`usuario_normal_id`),
  KEY `IDX_75299B6C49E12E92` (`usuario_administrador_id`),
  CONSTRAINT `FK_75299B6C49E12E92` FOREIGN KEY (`usuario_administrador_id`) REFERENCES `usuario` (`id`),
  CONSTRAINT `FK_75299B6C7167C17F` FOREIGN KEY (`usuario_normal_id`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `usuario_manipula_lista` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `lista_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_94038C7DDB38439E` (`usuario_id`),
  KEY `IDX_94038C7D6736D68F` (`lista_id`),
  CONSTRAINT `FK_94038C7D6736D68F` FOREIGN KEY (`lista_id`) REFERENCES `lista` (`id`),
  CONSTRAINT `FK_94038C7DDB38439E` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `usuario_reporta_elemento` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) DEFAULT NULL,
  `elemento_id` int(11) NOT NULL,
  `descripcion` longtext NOT NULL,
  `momento_reporte` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_273B04C4DB38439E` (`usuario_id`),
  KEY `IDX_273B04C4C1A2AEF9` (`elemento_id`),
  CONSTRAINT `FK_273B04C4C1A2AEF9` FOREIGN KEY (`elemento_id`) REFERENCES `elemento` (`id`),
  CONSTRAINT `FK_273B04C4DB38439E` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;