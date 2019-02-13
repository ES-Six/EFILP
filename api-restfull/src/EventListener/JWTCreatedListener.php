<?php

namespace App\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

class JWTCreatedListener
{
    /**
     * @param JWTCreatedEvent $event
     * @throws \Exception
     */
    public function onJWTCreated(JWTCreatedEvent $event)
    {
        $payload = $event->getData();

        // Create custom JWT payload here

        $event->setData($payload);
    }
}