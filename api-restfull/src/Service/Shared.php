<?php

namespace App\Service;

use Doctrine\ORM\EntityManagerInterface;
use FOS\RestBundle\View\View;

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
     * @param array $group
     * @return View
     */
    public function createSuccessResponse($datas, $message = 'success', $code = 200, array $group = null) {
        $view = View::create([
            'code'=>$code,
            'message'=>$message,
            'results'=>$datas
        ], $code);

        if (!empty($group)) {
            $view->getContext()->setGroups($group);
        }

        return $view;
    }
}