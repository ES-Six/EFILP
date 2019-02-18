<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation as Serialize;

/**
 * @ORM\Entity(repositoryClass="App\Repository\SessionRepository")
 */
class Session
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="boolean")
     */
    private $config_generation_pseudo;

    /**
     * @ORM\Column(type="boolean")
     */
    private $config_affichage_classement;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $nom_session;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\QCM", inversedBy="sessions")
     * @ORM\JoinColumn(nullable=false)
     */
    private $qcm;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Classe", inversedBy="sessions")
     * @ORM\JoinColumn(nullable=false)
     */
    private $classe;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getConfigGenerationPseudo(): ?bool
    {
        return $this->config_generation_pseudo;
    }

    public function setConfigGenerationPseudo(bool $config_generation_pseudo): self
    {
        $this->config_generation_pseudo = $config_generation_pseudo;

        return $this;
    }

    public function getConfigAffichageClassement(): ?bool
    {
        return $this->config_affichage_classement;
    }

    public function setConfigAffichageClassement(bool $config_affichage_classement): self
    {
        $this->config_affichage_classement = $config_affichage_classement;

        return $this;
    }

    public function getNomSession(): ?string
    {
        return $this->nom_session;
    }

    public function setNomSession(string $nom_session): self
    {
        $this->nom_session = $nom_session;

        return $this;
    }

    public function getQcm(): ?QCM
    {
        return $this->qcm;
    }

    public function setQcm(?QCM $qcm): self
    {
        $this->qcm = $qcm;

        return $this;
    }

    public function getClasse(): ?Classe
    {
        return $this->classe;
    }

    public function setClasse(?Classe $classe): self
    {
        $this->classe = $classe;

        return $this;
    }
}
