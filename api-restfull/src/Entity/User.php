<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Security\User\JWTUserInterface;
use JMS\Serializer\Annotation as Serialize;

/**
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 * @ORM\Table(name="user",indexes={
 *     @ORM\Index(name="role_idx", columns={"roles"}),
 * })
 */
class User implements UserInterface, \Serializable, JWTUserInterface
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue(strategy="AUTO")
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=25, unique=true)
     */
    private $username;

    /**
     * @ORM\Column(type="string", length=64)
     * @Serialize\Exclude
     */
    private $password;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Serialize\Exclude
     */
    private $salt = null;

    /**
     * @ORM\Column(type="string", length=25)
     * @Serialize\SerializedName("role")
     */
    private $roles;

    /**
     * @ORM\Column(type="string", length=45)
     */
    private $nom;

    /**
     * @ORM\Column(type="string", length=45)
     */
    private $prenom;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Classe", mappedBy="professeur")
     * @Serialize\Type("array<integer>")
     * @Serialize\Accessor(getter="getIdClasses")
     */
    private $classes;

    /**
     * User constructor.
     * @param null $username
     * @param null $roles
     * @throws \Exception
     */
    public function __construct($username = null, $roles = null)
    {
        $this->username = $username;
        $this->roles = $roles;
        $this->classes = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): self
    {
        $this->username = $username;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    public function getSalt(): ?string
    {
        return $this->salt;
    }

    public function setSalt(?string $salt): self
    {
        $this->salt = $salt;

        return $this;
    }

    public function getRole(): ?string
    {
        return $this->roles;
    }

    public function setRoles(string $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    public function getNom()
    {
        return $this->nom;
    }

    public function setNom($nom): self
    {
        $this->nom = $nom;

        return $this;
    }

    public function getPrenom()
    {
        return $this->prenom;
    }

    public function setPrenom($prenom): self
    {
        $this->prenom = $prenom;

        return $this;
    }

    /*
    ** Fonction permettant à symfony de retirer les informations sensibles lors de la serialisation de l'entité User
    */
    public function eraseCredentials() {
        return $this;
    }

    /*
    ** Fonction de la UserInterface de symfony, dois retourner un tableau
     * Ne pas utiliser cette fonction, utiliser getRole() à la place
    */
    public function getRoles(): ?array
    {
        return array($this->roles);
    }

    /**
     * @see \Serializable::serialize()
     */
    public function serialize(): ?string
    {
        return serialize(array(
            $this->id,
            $this->username,
            $this->password,
        ));
    }

    /**
     * @param string $serialized
     * @see \Serializable::unserialize()
     */
    public function unserialize($serialized)
    {
        list (
            $this->id,
            $this->username,
            $this->password,
            ) = unserialize($serialized);
    }

    /**
     * Permet de surcharger le payload du JWT
     * @param string $username
     * @param array $payload
     * @return User|JWTUserInterface
     * @throws \Exception
     */
    public static function createFromPayload($username, array $payload)
    {
        return new self(
            $username,
            $payload['roles']
        );
    }

    /**
     * @return Collection|Classe[]
     */
    public function getClasses(): Collection
    {
        return $this->classes;
    }

    public function addClasse(Classe $class): self
    {
        if (!$this->classes->contains($class)) {
            $this->classes[] = $class;
            $class->setProfesseur($this);
        }

        return $this;
    }

    public function removeClasse(Classe $class): self
    {
        if ($this->classes->contains($class)) {
            $this->classes->removeElement($class);
            // set the owning side to null (unless already changed)
            if ($class->getProfesseur() === $this) {
                $class->setProfesseur(null);
            }
        }

        return $this;
    }

    /*
     * Méthodes pour le JMS serializer
     */
    public function getIdClasses() {
        $ids = array_map(function(Classe $classe) {
            return $classe->getId();
        }, $this->classes->toArray());
        return $ids;
    }
}
