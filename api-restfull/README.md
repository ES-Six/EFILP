# API RESTFULL EFILP

## Description

L'API restfull EFILP permet la gestion des ressources de la plateforme EFILP

## Déployement en mode développement

- Dans le dossier du projet tapez les commandes suivantes :

        php composer.phar install

- Puis configurez le projet en effectuant une copie du fichier .env sous le nom .env.local et éditant le fichier .env.local

- **Attention** : **n'éditez jamais le fichier .env**, éditez toujours le fichier .env.local à la place car le fichier .env est poussé sur git

- Puis creez la base de donnée avec la commmande :

        php bin/console doctrine:database:create
        
- Puis appliquez toutes les migrations avec la commande :

        php bin/console doctrine:migrations:migrate

- Servez ensuite le contenu du répertoire public_html à l'aide d'un serveur http tel que apache2 (la réecriture des rêgles axistantes par le fichier .htaccess doit être autorisé sinon il faudra créer vos propres rêgles basés sur celles présentes dans le fichier .htaccess)

## Déployement en mode production

- Installez des dépendances optimisés :

        APP_ENV=prod php APP_DEBUG=0 composer.phar install --no-dev --optimize-autoloader

- Puis configurez le projet en effectuant une copie du fichier .env sous le nom .env.local et éditant le fichier .env.local :

        N'oubliez pas de remplacez "APP_ENV=dev" par "APP_ENV=prod"

- **Attention** : **n'éditez jamais le fichier .env**, éditez toujours le fichier .env.local à la place car le fichier .env est poussé sur git

- Puis creez la base de donnée avec la commmande :

        php bin/console doctrine:database:create
        
- Puis appliquez toutes les migrations avec la commande :

        php bin/console doctrine:migrations:migrate

- Puis créez les fichiers initiaux du cache de production de symfony :

        APP_ENV=prod APP_DEBUG=0 php bin/console cache:clear
        APP_ENV=prod APP_DEBUG=0 php bin/console cache:warmup

- Servez ensuite le contenu du répertoire public_html à l'aide d'un serveur http tel que apache2 (la réecriture des rêgles axistantes par le fichier .htaccess doit être autorisé sinon il faudra créer vos propres rêgles basés sur celles présentes dans le fichier .htaccess)


## Documentation de l'API

La documentation autogénérée est consultatble à l'adresse suivante: NON_CRÉÉ_ACTUELLEMENT

La documentation est générée dans le répertoire public et est automatiquement déployée par gitlab.

## Générer la documentation
    npm install -g apidoc http-server
    apidoc -i src/Controller -o public/ --silent
    cd public && http-server -o

## Note concernant à la gestion de l'authentification

L'authentification à l'API utilise la méthode du JWT (JSON Web Token).
Cf à la documentation du bundle [LexikJWTAuthenticationBundle](https://github.com/lexik/LexikJWTAuthenticationBundle) pour plus d'informations.

## Note concernant les commandes dans ce readme

L'ensemble des commandes est prévue pour fonctionner sur un système linux, si vous utilisez Windows, vous devrez adapter les commandes en conséquence.