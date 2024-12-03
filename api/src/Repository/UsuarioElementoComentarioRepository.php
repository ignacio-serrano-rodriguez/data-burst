<?php

namespace App\Repository;

use App\Entity\UsuarioElementoComentario;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<UsuarioElementoComentario>
 *
 * @method UsuarioElementoComentario|null find($id, $lockMode = null, $lockVersion = null)
 * @method UsuarioElementoComentario|null findOneBy(array $criteria, array $orderBy = null)
 * @method UsuarioElementoComentario[]    findAll()
 * @method UsuarioElementoComentario[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UsuarioElementoComentarioRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, UsuarioElementoComentario::class);
    }

    public function save(UsuarioElementoComentario $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(UsuarioElementoComentario $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
}