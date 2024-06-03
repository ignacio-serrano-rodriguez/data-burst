<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240603201354 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE lista (id INT AUTO_INCREMENT NOT NULL, nombre VARCHAR(255) NOT NULL, publica TINYINT(1) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE usuario (id INT AUTO_INCREMENT NOT NULL, mail VARCHAR(254) NOT NULL, usuario VARCHAR(255) NOT NULL, contrasenia VARCHAR(64) NOT NULL, verificado TINYINT(1) NOT NULL, permiso SMALLINT NOT NULL, momento_registro DATETIME NOT NULL, nombre VARCHAR(255) DEFAULT NULL, apellido_1 VARCHAR(255) DEFAULT NULL, apellido_2 VARCHAR(255) DEFAULT NULL, fecha_nacimiento DATETIME DEFAULT NULL, pais VARCHAR(255) DEFAULT NULL, profesion VARCHAR(255) DEFAULT NULL, estudios VARCHAR(255) DEFAULT NULL, avatar LONGBLOB DEFAULT NULL, idioma VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE lista');
        $this->addSql('DROP TABLE usuario');
    }
}
