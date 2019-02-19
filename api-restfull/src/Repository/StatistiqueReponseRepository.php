<?php

namespace App\Repository;

use App\Entity\StatistiqueReponse;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method StatistiqueReponse|null find($id, $lockMode = null, $lockVersion = null)
 * @method StatistiqueReponse|null findOneBy(array $criteria, array $orderBy = null)
 * @method StatistiqueReponse[]    findAll()
 * @method StatistiqueReponse[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class StatistiqueReponseRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, StatistiqueReponse::class);
    }

    // /**
    //  * @return StatistiqueReponse[] Returns an array of StatistiqueReponse objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('s.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?StatistiqueReponse
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
