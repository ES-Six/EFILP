<?php

namespace App\ParamConverter;

use Sensio\Bundle\FrameworkExtraBundle\Request\ParamConverter\ParamConverterInterface;
use Symfony\Bridge\Doctrine\ManagerRegistry;
use Doctrine\ORM\EntityManagerInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Doctrine\DBAL\Types\ConversionException;
use Symfony\Component\ExpressionLanguage\ExpressionLanguage;
use Symfony\Component\ExpressionLanguage\SyntaxError;
use Doctrine\ORM\NoResultException;

class RequestParamConverter implements ParamConverterInterface
{
    private $registry;
    private $language;
    private $defaultOptions;

    public function __construct(ManagerRegistry $registry = null, ExpressionLanguage $expressionLanguage = null, array $options = [])
    {
        $this->registry = $registry;
        $this->language = $expressionLanguage;

        $defaultValues = [
            'entity_manager' => null,
            'exclude' => [],
            'mapping' => [],
            'param' => null,
            'strip_null' => false,
            'expr' => null,
            'id' => null,
            'repository_method' => null,
            'map_method_signature' => false,
            'evict_cache' => false,
        ];

        $this->defaultOptions = array_merge($defaultValues, $options);
    }

    /**
     * @param Request $request
     * @param ParamConverter $configuration
     * @return bool
     * @throws \ReflectionException
     */
    public function apply(Request $request, ParamConverter $configuration)
    {
        $name = $configuration->getName();
        $class = $configuration->getClass();
        $options = $this->getOptions($configuration);

        if (null === $request->get($name, false)) {
            $configuration->setIsOptional(true);
        }

        $errorMessage = null;
        if ($expr = $options['expr']) {
            $object = $this->findViaExpression($class, $request, $expr, $options, $configuration);

            if (null === $object) {
                $errorMessage = sprintf('The expression "%s" returned null', $expr);
            }

            // find by identifier?
        } elseif (false === $object = $this->find($class, $request, $options, $name)) {
            // find by criteria
            if (false === $object = $this->findOneBy($class, $request, $options)) {
                if ($configuration->isOptional()) {
                    $object = null;
                } else {
                    throw new \LogicException(sprintf('Unable to guess how to get a Doctrine instance from the request information for parameter "%s".', $name));
                }
            }
        }
        if (null === $object && false === $configuration->isOptional()) {
            $message = sprintf('%s object not found by the @%s annotation.', $class, $this->getAnnotationName($configuration));
            if ($errorMessage) {
                $message .= ' '.$errorMessage;
            }
            throw new NotFoundHttpException($message);
        }

        $request->attributes->set($name, $object);

        return true;
    }

    private function find($class, Request $request, $options, $name)
    {
        if ($options['mapping'] || $options['exclude']) {
            return false;
        }

        $id = $this->getIdentifier($request, $options, $name);

        if (false === $id || null === $id) {
            return false;
        }

        if ($options['repository_method']) {
            $method = $options['repository_method'];
        } else {
            $method = 'find';
        }

        $om = $this->getManager($options['entity_manager'], $class);
        if ($options['evict_cache'] && $om instanceof EntityManagerInterface) {
            $cacheProvider = $om->getCache();
            if ($cacheProvider && $cacheProvider->containsEntity($class, $id)) {
                $cacheProvider->evictEntity($class, $id);
            }
        }

        try {
            return $om->getRepository($class)->$method($id);
        } catch (NoResultException $e) {
            return ;
        } catch (ConversionException $e) {
            return ;
        }
    }

    private function getIdentifier(Request $request, $options, $name)
    {
        if (null !== $options['id']) {
            if (!\is_array($options['id'])) {
                $name = $options['id'];
            } elseif (\is_array($options['id'])) {
                $id = [];
                foreach ($options['id'] as $field) {
                    if (false !== strstr($field, '%s')) {
                        // Convert "%s_uuid" to "foobar_uuid"
                        $field = sprintf($field, $name);
                    }
                    $id[$field] = $request->get($field);
                }

                return $id;
            }
        }

        if ($request->has($name)) {
            return $request->get($name);
        }

        if ($request->has('id') && !$options['id']) {
            return $request->get('id');
        }

        return false;
    }

    private function findOneBy($class, Request $request, $options)
    {
        if (!$options['mapping']) {
            $keys = $request->keys();
            $options['mapping'] = $keys ? array_combine($keys, $keys) : [];
        }

        foreach ($options['exclude'] as $exclude) {
            unset($options['mapping'][$exclude]);
        }

        if (!$options['mapping']) {
            return false;
        }

        // if a specific id has been defined in the options and there is no corresponding attribute
        // return false in order to avoid a fallback to the id which might be of another object
        if ($options['id'] && null === $request->get($options['id'])) {
            return false;
        }

        $criteria = [];
        $em = $this->getManager($options['entity_manager'], $class);
        $metadata = $em->getClassMetadata($class);

        $mapMethodSignature = $options['repository_method']
            && $options['map_method_signature']
            && true === $options['map_method_signature'];

        foreach ($options['mapping'] as $attribute => $field) {
            if ($metadata->hasField($field)
                || ($metadata->hasAssociation($field) && $metadata->isSingleValuedAssociation($field))
                || $mapMethodSignature) {
                $criteria[$field] = $request->get($attribute);
            }
        }

        if ($options['strip_null']) {
            $criteria = array_filter($criteria, function ($value) {
                return null !== $value;
            });
        }

        if (!$criteria) {
            return false;
        }

        if ($options['repository_method']) {
            $repositoryMethod = $options['repository_method'];
        } else {
            $repositoryMethod = 'findOneBy';
        }

        try {
            if ($mapMethodSignature) {
                return $this->findDataByMapMethodSignature($em, $class, $repositoryMethod, $criteria);
            }

            return $em->getRepository($class)->$repositoryMethod($criteria);
        } catch (NoResultException $e) {
            return ;
        } catch (ConversionException $e) {
            return ;
        }
    }

    /**
     * @param $em
     * @param $class
     * @param $repositoryMethod
     * @param $criteria
     * @return mixed
     * @throws \ReflectionException
     */
    private function findDataByMapMethodSignature($em, $class, $repositoryMethod, $criteria)
    {
        $arguments = [];
        $repository = $em->getRepository($class);
        $ref = new \ReflectionMethod($repository, $repositoryMethod);
        foreach ($ref->getParameters() as $parameter) {
            if (array_key_exists($parameter->name, $criteria)) {
                $arguments[] = $criteria[$parameter->name];
            } elseif ($parameter->isDefaultValueAvailable()) {
                $arguments[] = $parameter->getDefaultValue();
            } else {
                throw new \InvalidArgumentException(sprintf('Repository method "%s::%s" requires that you provide a value for the "$%s" argument.', \get_class($repository), $repositoryMethod, $parameter->name));
            }
        }

        return $ref->invokeArgs($repository, $arguments);
    }

    private function findViaExpression($class, Request $request, $expression, $options, ParamConverter $configuration)
    {
        if (null === $this->language) {
            throw new \LogicException(sprintf('To use the @%s tag with the "expr" option, you need to install the ExpressionLanguage component.', $this->getAnnotationName($configuration)));
        }

        // Ajout pour lister tous les paramètres dans l'ordre de précédance de request->get
        $allAttributes = array_merge($request->query->all(), $request->attributes->all(), $request->request->all());

        $repository = $this->getManager($options['entity_manager'], $class)->getRepository($class);
        $variables = array_merge($allAttributes, ['repository' => $repository]);

        try {
            return $this->language->evaluate($expression, $variables);
        } catch (NoResultException $e) {
            return ;
        } catch (ConversionException $e) {
            return ;
        } catch (SyntaxError $e) {
            throw new \LogicException(sprintf('Error parsing expression -- %s -- (%s)', $expression, $e->getMessage()), 0, $e);
        }
    }

    /**
     * @param ParamConverter $configuration
     * @return bool
     * @throws \ReflectionException
     */
    public function supports(ParamConverter $configuration)
    {
        if ('request_param_converter' !== $configuration->getConverter()) {
            return false;
        }

        // if there is no manager, this means that only Doctrine DBAL is configured
        if (null === $this->registry || !\count($this->registry->getManagerNames())) {
            return false;
        }

        if (null === $configuration->getClass()) {
            return false;
        }

        $options = $this->getOptions($configuration, false);

        // Doctrine Entity?
        $em = $this->getManager($options['entity_manager'], $configuration->getClass());
        if (null === $em) {
            return false;
        }

        return !$em->getMetadataFactory()->isTransient($configuration->getClass());
    }

    /**
     * @param ParamConverter $configuration
     * @param bool $strict
     * @return array
     * @throws \ReflectionException
     */
    private function getOptions(ParamConverter $configuration, $strict = true)
    {
        $passedOptions = $configuration->getOptions();

        if (isset($passedOptions['repository_method'])) {
            @trigger_error('The repository_method option of @ParamConverter is deprecated and will be removed in 6.0. Use the expr option or @Entity.', E_USER_DEPRECATED);
        }

        if (isset($passedOptions['map_method_signature'])) {
            @trigger_error('The map_method_signature option of @ParamConverter is deprecated and will be removed in 6.0. Use the expr option or @Entity.', E_USER_DEPRECATED);
        }

        $extraKeys = array_diff(array_keys($passedOptions), array_keys($this->defaultOptions));
        if ($extraKeys && $strict) {
            throw new \InvalidArgumentException(sprintf('Invalid option(s) passed to @%s: %s', $this->getAnnotationName($configuration), implode(', ', $extraKeys)));
        }

        return array_replace($this->defaultOptions, $passedOptions);
    }

    private function getManager($name, $class)
    {
        if (null === $name) {
            return $this->registry->getManagerForClass($class);
        }

        return $this->registry->getManager($name);
    }

    /**
     * @param ParamConverter $configuration
     * @return string
     * @throws \ReflectionException
     */
    private function getAnnotationName(ParamConverter $configuration)
    {
        $r = new \ReflectionClass($configuration);

        return $r->getShortName();
    }
}