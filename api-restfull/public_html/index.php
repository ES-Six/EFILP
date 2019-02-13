<?php

use App\Kernel;
use Symfony\Component\Debug\Debug;
use Symfony\Component\HttpFoundation\Request;

require dirname(__DIR__).'/config/bootstrap.php';

// Permet de dire à Doctrine d'ignorer les annotations d'APIdoc
// Car Doctrine lance une exception si il trouve une annotation qu'il ne connais pas
\Doctrine\Common\Annotations\AnnotationReader::addGlobalIgnoredName('api');
\Doctrine\Common\Annotations\AnnotationReader::addGlobalIgnoredName('apiName');
\Doctrine\Common\Annotations\AnnotationReader::addGlobalIgnoredName('apiGroup');
\Doctrine\Common\Annotations\AnnotationReader::addGlobalIgnoredName('apiVersion');
\Doctrine\Common\Annotations\AnnotationReader::addGlobalIgnoredName('apiParam');
\Doctrine\Common\Annotations\AnnotationReader::addGlobalIgnoredName('apiExample');


if ($_SERVER['APP_DEBUG']) {
    umask(0000);

    Debug::enable();
}

if ($trustedProxies = $_SERVER['TRUSTED_PROXIES'] ?? $_ENV['TRUSTED_PROXIES'] ?? false) {
    Request::setTrustedProxies(explode(',', $trustedProxies), Request::HEADER_X_FORWARDED_ALL ^ Request::HEADER_X_FORWARDED_HOST);
}

if ($trustedHosts = $_SERVER['TRUSTED_HOSTS'] ?? $_ENV['TRUSTED_HOSTS'] ?? false) {
    Request::setTrustedHosts([$trustedHosts]);
}

$kernel = new Kernel($_SERVER['APP_ENV'], (bool) $_SERVER['APP_DEBUG']);
$request = Request::createFromGlobals();
$response = $kernel->handle($request);
$response->send();
$kernel->terminate($request, $response);
