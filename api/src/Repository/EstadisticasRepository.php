<?php
namespace App\Repository;

use App\Entity\Lista;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/*
cada página tiene que 

*/

/**
 * @extends ServiceEntityRepository<Lista>
 */
class EstadisticasRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Lista::class);
    }

    public function obtenerMasAgregado(string $nombre, int $page = 1, int $limit = 10): array
    {
        $offset = ($page - 1) * $limit;
        
        return $this->createQueryBuilder('l')
            ->select('e.nombre, COUNT(e.id) as total')
            ->leftJoin('l.listaContieneElementos', 'lce')
            ->leftJoin('lce.elemento', 'e')
            ->where('l.nombre = :nombre')
            ->setParameter('nombre', $nombre)
            ->groupBy('e.nombre')
            ->orderBy('total', 'DESC')
            ->setFirstResult($offset)
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    public function obtenerMasGustado(string $nombre): array
    {
        // Lógica para obtener los elementos más gustados en la lista con el nombre especificado
        return $this->createQueryBuilder('l')
            ->select('e.nombre, SUM(CASE WHEN uep.positivo = true THEN 1 ELSE 0 END) as total')
            ->leftJoin('l.listaContieneElementos', 'lce')
            ->leftJoin('lce.elemento', 'e')
            ->leftJoin('e.usuarioElementoPositivos', 'uep')
            ->where('l.nombre = :nombre')
            ->setParameter('nombre', $nombre)
            ->groupBy('e.nombre')
            ->orderBy('total', 'DESC')
            ->setMaxResults(3) // Devolver solo los tres primeros resultados
            ->getQuery()
            ->getResult();
    }

    public function obtenerMenosGustado(string $nombre): array
    {
        // Lógica para obtener los elementos menos gustados en la lista con el nombre especificado
        return $this->createQueryBuilder('l')
            ->select('e.nombre, SUM(CASE WHEN uep.positivo = false THEN 1 ELSE 0 END) as total')
            ->leftJoin('l.listaContieneElementos', 'lce')
            ->leftJoin('lce.elemento', 'e')
            ->leftJoin('e.usuarioElementoPositivos', 'uep')
            ->where('l.nombre = :nombre')
            ->setParameter('nombre', $nombre)
            ->groupBy('e.nombre')
            ->orderBy('total', 'DESC')
            ->setMaxResults(3) // Devolver solo los tres primeros resultados
            ->getQuery()
            ->getResult();
    }
}