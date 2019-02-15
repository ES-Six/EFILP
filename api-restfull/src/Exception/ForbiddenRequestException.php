<?php

namespace App\Exception;

use Exception;
use Symfony\Component\HttpFoundation\Response;
use App\Exception\ApiExceptionInterface;

class ForbiddenRequestException extends Exception implements ApiExceptionInterface
{
    public function __construct(
        string $message = 'Forbidden',
        $code = Response::HTTP_FORBIDDEN,
        Exception $previous = null
    ) {
        parent::__construct(json_encode($message), $code, $previous);
    }
}