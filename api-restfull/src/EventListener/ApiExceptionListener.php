<?php

namespace App\EventListener;

use App\Exception\ApiExceptionInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\GetResponseForExceptionEvent;
use Symfony\Component\HttpKernel\Exception\HttpException;

class ApiExceptionListener
{
    public function onKernelException(GetResponseForExceptionEvent $event)
    {
        if ($event->getException() instanceof ApiExceptionInterface) {
            $response = new JsonResponse($this->buildResponseData($event->getException()));
            $response->setStatusCode($event->getException()->getCode());
            $event->setResponse($response);
        } else {
            return;
        }
    }

    private function buildResponseData(ApiExceptionInterface $exception)
    {
        $messages = json_decode($exception->getMessage());
        if (!is_array($messages)) {
            $messages = $exception->getMessage() ? [$exception->getMessage()] : [];
        }

        return [
            'error' => [
                'code' => $exception->getCode(),
                'messages' => $messages
            ]];
    }
}