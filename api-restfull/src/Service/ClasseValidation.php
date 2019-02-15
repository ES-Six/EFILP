<?php

namespace App\Service;

use App\Entity\User;
use App\Exception\ConflictException;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use App\Exception\BadRequestException;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Validation;
use Symfony\Component\Validator\Constraints\NotBlank;

class ClasseValidation
{
    private $em;
    private $errors = array();

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    /**
     * @throws BadRequestException
     */
    private function flushErrors()
    {
        if (count($this->errors) > 0) {
            throw new BadRequestException($this->errors);
        }
    }

    private function storeErrors(String $field, $violations)
    {
        if (count($violations) !== 0) {
            foreach ($violations as $violation) {
                array_push($this->errors, "$field: ".$violation->getMessage());
            }
        }
    }

    /**
     * @param Request $request
     * @throws BadRequestException
     */
    public function validateCreateClass(Request $request)
    {
        $validator = Validation::createValidator();

        $violations = $validator->validate($request->get('nom'), [
            new NotBlank([
                'message' => "Un nom de classe doit être spécifié"
            ]),
            new Length([
                'max'=>255,
                'maxMessage' => "Un nom de classe fait au maximum 255 caractères"
            ])
        ]);
        $this->storeErrors('nom', $violations);

        $this->flushErrors();
    }

    /**
     * @param Request $request
     * @throws BadRequestException
     */
    public function validateUpdateClass(Request $request)
    {
        $validator = Validation::createValidator();

        $violations = $validator->validate($request->get('nom'), [
            new NotBlank([
                'message' => "Un nom de classe doit être spécifié"
            ]),
            new Length([
                'max'=>255,
                'maxMessage' => "Un nom de classe fait au maximum 255 caractères"
            ])
        ]);
        $this->storeErrors('nom', $violations);

        $this->flushErrors();
    }
}