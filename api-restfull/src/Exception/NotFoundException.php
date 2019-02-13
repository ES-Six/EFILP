<?php

namespace App\Exception;

use Exception;
use Symfony\Component\HttpFoundation\Response;
use App\Exception\ApiExceptionInterface;

class NotFoundException extends Exception implements ApiExceptionInterface
{
    public function __construct(
        $message = [],
        $code = Response::HTTP_NOT_FOUND,
        Exception $previous = null
    ) {
        parent::__construct(json_encode($message), $code, $previous);
    }
}