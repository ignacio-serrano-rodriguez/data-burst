<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240928152233 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE elemento (id INT AUTO_INCREMENT NOT NULL, usuario_id INT NOT NULL, nombre VARCHAR(255) NOT NULL, fecha_aparicion DATE NOT NULL, informacion_extra VARCHAR(255) NOT NULL, puntuacion INT NOT NULL, descripcion LONGTEXT NOT NULL, momento_creacion DATETIME NOT NULL, INDEX IDX_504B5B12DB38439E (usuario_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE lista (id INT AUTO_INCREMENT NOT NULL, nombre VARCHAR(255) NOT NULL, publica TINYINT(1) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE lista_contiene_elemento (id INT AUTO_INCREMENT NOT NULL, lista_id INT NOT NULL, elemento_id INT NOT NULL, positivo TINYINT(1) DEFAULT NULL, comentario LONGTEXT DEFAULT NULL, momento_contencion DATETIME NOT NULL, INDEX IDX_CA30CE296736D68F (lista_id), INDEX IDX_CA30CE29C1A2AEF9 (elemento_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE usuario (id INT AUTO_INCREMENT NOT NULL, mail VARCHAR(254) NOT NULL, usuario VARCHAR(255) NOT NULL, contrasenia VARCHAR(255) NOT NULL, verificado TINYINT(1) NOT NULL, permiso SMALLINT NOT NULL, momento_registro DATETIME NOT NULL, nombre VARCHAR(255) DEFAULT NULL, apellido_1 VARCHAR(255) DEFAULT NULL, apellido_2 VARCHAR(255) DEFAULT NULL, fecha_nacimiento DATE DEFAULT NULL, pais VARCHAR(255) DEFAULT NULL, profesion VARCHAR(255) DEFAULT NULL, estudios VARCHAR(255) DEFAULT NULL, avatar LONGBLOB DEFAULT NULL, idioma VARCHAR(255) DEFAULT NULL, UNIQUE INDEX UNIQ_2265B05D5126AC48 (mail), UNIQUE INDEX UNIQ_2265B05D2265B05D (usuario), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE usuario_agrega_usuario (id INT AUTO_INCREMENT NOT NULL, usuario_1_id INT NOT NULL, usuario_2_id INT NOT NULL, momento_agregacion DATETIME NOT NULL, INDEX IDX_70AAA6E599A926EA (usuario_1_id), INDEX IDX_70AAA6E58B1C8904 (usuario_2_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE usuario_gestiona_elemento (id INT AUTO_INCREMENT NOT NULL, usuario_administrador_id INT NOT NULL, elemento_id INT NOT NULL, momento_gestion DATETIME NOT NULL, nombre_antiguo VARCHAR(255) NOT NULL, fecha_aparicion_antigua DATE NOT NULL, informacion_extra_antigua VARCHAR(255) NOT NULL, descripcion_antigua LONGTEXT NOT NULL, INDEX IDX_1C2170349E12E92 (usuario_administrador_id), INDEX IDX_1C21703C1A2AEF9 (elemento_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE usuario_gestiona_usuario (id INT AUTO_INCREMENT NOT NULL, usuario_normal_id INT NOT NULL, usuario_administrador_id INT NOT NULL, permiso_antiguo SMALLINT NOT NULL, momento_gestion DATETIME NOT NULL, INDEX IDX_75299B6C7167C17F (usuario_normal_id), INDEX IDX_75299B6C49E12E92 (usuario_administrador_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE usuario_manipula_lista (id INT AUTO_INCREMENT NOT NULL, usuario_id INT NOT NULL, lista_id INT NOT NULL, INDEX IDX_94038C7DDB38439E (usuario_id), INDEX IDX_94038C7D6736D68F (lista_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE usuario_reporta_elemento (id INT AUTO_INCREMENT NOT NULL, usuario_id INT NOT NULL, elemento_id INT NOT NULL, descripcion LONGTEXT NOT NULL, momento_reporte DATETIME NOT NULL, INDEX IDX_273B04C4DB38439E (usuario_id), INDEX IDX_273B04C4C1A2AEF9 (elemento_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE elemento ADD CONSTRAINT FK_504B5B12DB38439E FOREIGN KEY (usuario_id) REFERENCES usuario (id)');
        $this->addSql('ALTER TABLE lista_contiene_elemento ADD CONSTRAINT FK_CA30CE296736D68F FOREIGN KEY (lista_id) REFERENCES lista (id)');
        $this->addSql('ALTER TABLE lista_contiene_elemento ADD CONSTRAINT FK_CA30CE29C1A2AEF9 FOREIGN KEY (elemento_id) REFERENCES elemento (id)');
        $this->addSql('ALTER TABLE usuario_agrega_usuario ADD CONSTRAINT FK_70AAA6E599A926EA FOREIGN KEY (usuario_1_id) REFERENCES usuario (id)');
        $this->addSql('ALTER TABLE usuario_agrega_usuario ADD CONSTRAINT FK_70AAA6E58B1C8904 FOREIGN KEY (usuario_2_id) REFERENCES usuario (id)');
        $this->addSql('ALTER TABLE usuario_gestiona_elemento ADD CONSTRAINT FK_1C2170349E12E92 FOREIGN KEY (usuario_administrador_id) REFERENCES usuario (id)');
        $this->addSql('ALTER TABLE usuario_gestiona_elemento ADD CONSTRAINT FK_1C21703C1A2AEF9 FOREIGN KEY (elemento_id) REFERENCES elemento (id)');
        $this->addSql('ALTER TABLE usuario_gestiona_usuario ADD CONSTRAINT FK_75299B6C7167C17F FOREIGN KEY (usuario_normal_id) REFERENCES usuario (id)');
        $this->addSql('ALTER TABLE usuario_gestiona_usuario ADD CONSTRAINT FK_75299B6C49E12E92 FOREIGN KEY (usuario_administrador_id) REFERENCES usuario (id)');
        $this->addSql('ALTER TABLE usuario_manipula_lista ADD CONSTRAINT FK_94038C7DDB38439E FOREIGN KEY (usuario_id) REFERENCES usuario (id)');
        $this->addSql('ALTER TABLE usuario_manipula_lista ADD CONSTRAINT FK_94038C7D6736D68F FOREIGN KEY (lista_id) REFERENCES lista (id)');
        $this->addSql('ALTER TABLE usuario_reporta_elemento ADD CONSTRAINT FK_273B04C4DB38439E FOREIGN KEY (usuario_id) REFERENCES usuario (id)');
        $this->addSql('ALTER TABLE usuario_reporta_elemento ADD CONSTRAINT FK_273B04C4C1A2AEF9 FOREIGN KEY (elemento_id) REFERENCES elemento (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE elemento DROP FOREIGN KEY FK_504B5B12DB38439E');
        $this->addSql('ALTER TABLE lista_contiene_elemento DROP FOREIGN KEY FK_CA30CE296736D68F');
        $this->addSql('ALTER TABLE lista_contiene_elemento DROP FOREIGN KEY FK_CA30CE29C1A2AEF9');
        $this->addSql('ALTER TABLE usuario_agrega_usuario DROP FOREIGN KEY FK_70AAA6E599A926EA');
        $this->addSql('ALTER TABLE usuario_agrega_usuario DROP FOREIGN KEY FK_70AAA6E58B1C8904');
        $this->addSql('ALTER TABLE usuario_gestiona_elemento DROP FOREIGN KEY FK_1C2170349E12E92');
        $this->addSql('ALTER TABLE usuario_gestiona_elemento DROP FOREIGN KEY FK_1C21703C1A2AEF9');
        $this->addSql('ALTER TABLE usuario_gestiona_usuario DROP FOREIGN KEY FK_75299B6C7167C17F');
        $this->addSql('ALTER TABLE usuario_gestiona_usuario DROP FOREIGN KEY FK_75299B6C49E12E92');
        $this->addSql('ALTER TABLE usuario_manipula_lista DROP FOREIGN KEY FK_94038C7DDB38439E');
        $this->addSql('ALTER TABLE usuario_manipula_lista DROP FOREIGN KEY FK_94038C7D6736D68F');
        $this->addSql('ALTER TABLE usuario_reporta_elemento DROP FOREIGN KEY FK_273B04C4DB38439E');
        $this->addSql('ALTER TABLE usuario_reporta_elemento DROP FOREIGN KEY FK_273B04C4C1A2AEF9');
        $this->addSql('DROP TABLE elemento');
        $this->addSql('DROP TABLE lista');
        $this->addSql('DROP TABLE lista_contiene_elemento');
        $this->addSql('DROP TABLE usuario');
        $this->addSql('DROP TABLE usuario_agrega_usuario');
        $this->addSql('DROP TABLE usuario_gestiona_elemento');
        $this->addSql('DROP TABLE usuario_gestiona_usuario');
        $this->addSql('DROP TABLE usuario_manipula_lista');
        $this->addSql('DROP TABLE usuario_reporta_elemento');
    }
}
