<?php

namespace App\Service;

use App\Exception\NotFoundException;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use App\Exception\BadRequestException;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Validation;
use Symfony\Component\Validator\Constraints\NotBlank;

class UserValidation
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
    public function validateCreateUser(Request $request)
    {
        $validator = Validation::createValidator();

        $violations = $validator->validate($request->get('username'), [
            new NotBlank([
                'message' => "Un nom d'utilisateur dois être spécifié"
            ]),
            new Length([
                'max'=>25,
                'maxMessage' => "Un nom d'utilisateur dois faire au maximum 25 caractères"
            ])
        ]);
        $this->storeErrors('username', $violations);

        $violations = $validator->validate($request->get('password'), [
            new NotBlank([
                'message' => 'Un mot de passe doit être spécifiée'
            ]),
            new Length(array(
                'max'=>32,
                'min'=>6,
                'maxMessage' => 'Le mot de passe ne peut excéder 32 caractères',
                'minMessage' => 'Le mot de passe dois faire au minimum 6 caractères',
            )),
        ]);
        $this->storeErrors('password', $violations);

        $violations = $validator->validate($request->get('nom'), [
            new NotBlank([
                'message' => 'Un nom doit être spécifiée'
            ]),
        ]);
        $this->storeErrors('nom', $violations);

        $violations = $validator->validate($request->get('prenom'), [
            new NotBlank([
                'message' => 'Un prenom doit être spécifiée'
            ]),
        ]);
        $this->storeErrors('prenom', $violations);

        $this->flushErrors();
    }
}