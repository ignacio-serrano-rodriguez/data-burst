<?php
namespace App\Repository;

use App\Entity\UsuarioElementoPuntuacion;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<UsuarioElementoPuntuacion>
 *
 * @method UsuarioElementoPuntuacion|null find($id, $lockMode = null, $lockVersion = null)
 * @method UsuarioElementoPuntuacion|null findOneBy(array $criteria, array $orderBy = null)
 * @method UsuarioElementoPuntuacion[]    findAll()
 * @method UsuarioElementoPuntuacion[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UsuarioElementoPuntuacionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, UsuarioElementoPuntuacion::class);
    }

    public function save(UsuarioElementoPuntuacion $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(UsuarioElementoPuntuacion $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
}