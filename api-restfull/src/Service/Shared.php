<?php

namespace App\Service;

use Doctrine\ORM\EntityManagerInterface;
use FOS\RestBundle\View\View;
use JMS\Serializer\SerializationContext;

class Shared
{
    private $em;

    /**
     * Shared constructor.
     * @param EntityManagerInterface $em
     */
    public function __construct(EntityManagerInterface $em) {
        $this->em = $em;
    }

    /**
     * @param $datas
     * @param string $message
     * @param int $code
     * @return View
     */
    public function createSuccessResponse($datas, $message = 'success', $code = 200) {
        return View::create(array(
            'code'=>$code,
            'message'=>$message,
            'results'=>$datas
        ), $code);
    }
}