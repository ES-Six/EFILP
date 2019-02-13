<?php

namespace App\Exception;

use Exception;
use Symfony\Component\HttpFoundation\Response;
use App\Exception\ApiExceptionInterface;

class ConflictException extends Exception implements ApiExceptionInterface
{
    public function __construct(
        $message = 'Cette ressource exise déjà',
        $code = Response::HTTP_CONFLICT,
        Exception $previous = null
    ) {
        parent::__construct(json_encode($message), $code, $previous);
    }
}