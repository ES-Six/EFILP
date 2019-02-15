define({ "api": [
  {
    "type": "post",
    "url": "/v1/professeurs/{id_professeur}/classes",
    "title": "Créer une classe",
    "name": "CreateClasse",
    "group": "Classes",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "number",
            "optional": false,
            "field": "id_professeur",
            "description": "<p>l'id du compte professeur</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "nom",
            "description": "<p>Le nom de la classe</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Exemple d'utilisation:",
        "content": "curl -X POST -H \"Authorization: Bearer votre_jeton_d_authentification_ici\" -i \"http://api-base.hub3e.com/v1/professeurs/123/classes\" -d '{\"nom\": \"terminale_1\"}'",
        "type": "curl"
      }
    ],
    "filename": "src/Controller/ClasseController.php",
    "groupTitle": "Classes"
  },
  {
    "type": "delete",
    "url": "/v1/professeurs/{id_professeur}/classes/{id_classe}",
    "title": "Supprimer une classe",
    "name": "DeleteClasse",
    "group": "Classes",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "number",
            "optional": false,
            "field": "id_professeur",
            "description": "<p>l'id du compte professeur</p>"
          },
          {
            "group": "Parameter",
            "type": "number",
            "optional": false,
            "field": "id_classe",
            "description": "<p>l'id de la classe</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Exemple d'utilisation:",
        "content": "curl -X DELETE -H \"Authorization: Bearer votre_jeton_d_authentification_ici\" -i \"http://api-base.hub3e.com/v1/professeurs/123/classes/1\"",
        "type": "curl"
      }
    ],
    "filename": "src/Controller/ClasseController.php",
    "groupTitle": "Classes"
  },
  {
    "type": "get",
    "url": "/v1/professeurs/{id_professeur}/classes",
    "title": "Voir les classes d'un professeur",
    "name": "GetClasses",
    "group": "Classes",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Exemple d'utilisation:",
        "content": "curl -X GET -H \"Authorization: Bearer votre_jeton_d_authentification_ici\" -i \"http://api-rest-efilp/v1/professeurs/123/classes\"",
        "type": "curl"
      }
    ],
    "filename": "src/Controller/ClasseController.php",
    "groupTitle": "Classes"
  },
  {
    "type": "put",
    "url": "/v1/professeurs/{id_professeur}/classes/{id_classe}",
    "title": "Mettre à jour une classe",
    "name": "UpdateClasse",
    "group": "Classes",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "number",
            "optional": false,
            "field": "id_professeur",
            "description": "<p>l'id du compte professeur</p>"
          },
          {
            "group": "Parameter",
            "type": "number",
            "optional": false,
            "field": "id_classe",
            "description": "<p>l'id de la classe</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "nom",
            "description": "<p>Le nom de la classe</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Exemple d'utilisation:",
        "content": "curl -X PUT -H \"Authorization: Bearer votre_jeton_d_authentification_ici\" -i \"http://api-base.hub3e.com/v1/professeurs/123/classes/2\" -d '{\"nom\": \"terminale_1\"}'",
        "type": "curl"
      }
    ],
    "filename": "src/Controller/ClasseController.php",
    "groupTitle": "Classes"
  },
  {
    "type": "post",
    "url": "/v1/professeurs/{id_professeur}/qcms",
    "title": "Créer un QCMs",
    "name": "CreateQCMs",
    "group": "QCMs",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "number",
            "optional": false,
            "field": "id_professeur",
            "description": "<p>l'id du compte professeur</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "nom",
            "description": "<p>Le nom du QCM</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Exemple d'utilisation:",
        "content": "curl -X POST -H \"Authorization: Bearer votre_jeton_d_authentification_ici\" -i \"http://api-rest-efilp/v1/professeurs/123/qcms\" -d '{\"nom\": \"QCM_test\"}'",
        "type": "curl"
      }
    ],
    "filename": "src/Controller/QCMController.php",
    "groupTitle": "QCMs"
  },
  {
    "type": "get",
    "url": "/v1/professeurs/{id_professeur}/qcms",
    "title": "Voir les QCMs d'un professeur",
    "name": "GetQCMs",
    "group": "QCMs",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Exemple d'utilisation:",
        "content": "curl -X GET -H \"Authorization: Bearer votre_jeton_d_authentification_ici\" -i \"http://api-rest-efilp/v1/professeurs/123/qcms\"",
        "type": "curl"
      }
    ],
    "filename": "src/Controller/QCMController.php",
    "groupTitle": "QCMs"
  },
  {
    "type": "put",
    "url": "/v1/professeurs/{id_professeur}/qcms/{id_qcm}",
    "title": "Mettre à jour un QCMs",
    "name": "UpdateQCMs",
    "group": "QCMs",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "number",
            "optional": false,
            "field": "id_professeur",
            "description": "<p>l'id du compte professeur</p>"
          },
          {
            "group": "Parameter",
            "type": "number",
            "optional": false,
            "field": "id_qcm",
            "description": "<p>l'id du QCM</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "nom",
            "description": "<p>Le nom du QCM</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Exemple d'utilisation:",
        "content": "curl -X PUT -H \"Authorization: Bearer votre_jeton_d_authentification_ici\" -i \"http://api-rest-efilp/v1/professeurs/123/qcms/4\" -d '{\"nom\": \"QCM_test\"}'",
        "type": "curl"
      }
    ],
    "filename": "src/Controller/QCMController.php",
    "groupTitle": "QCMs"
  },
  {
    "type": "delete",
    "url": "/v1/professeurs/{id_professeur}/qcms/{id_qcm}",
    "title": "Supprimer un QCMs",
    "name": "UpdateQCMs",
    "group": "QCMs",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "number",
            "optional": false,
            "field": "id_professeur",
            "description": "<p>l'id du compte professeur</p>"
          },
          {
            "group": "Parameter",
            "type": "number",
            "optional": false,
            "field": "id_qcm",
            "description": "<p>l'id du QCM</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Exemple d'utilisation:",
        "content": "curl -X DELETE -H \"Authorization: Bearer votre_jeton_d_authentification_ici\" -i \"http://api-rest-efilp/v1/professeurs/123/qcms/4\"",
        "type": "curl"
      }
    ],
    "filename": "src/Controller/QCMController.php",
    "groupTitle": "QCMs"
  },
  {
    "type": "post",
    "url": "/v1/professeurs/register",
    "title": "Créer un compte professeur",
    "name": "CreateProfesseur",
    "group": "Users",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "nom",
            "description": "<p>le nom associé au compte</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "prenom",
            "description": "<p>le prénom associé au compte</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "username",
            "description": "<p>l'identifiant du compte</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "password",
            "description": "<p>le mot de passe du compte</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Exemple d'utilisation:",
        "content": "curl -X POST -H \"Authorization: Bearer votre_jeton_d_authentification_ici\" -i \"http://api-base.hub3e.com/v1/professeurs/register\" -d '{\"username\": \"nom_d_utilisateur\", \"password\": \"greetings earthling\", \"nom\": \"UN_NOM\", \"prenom\": \"UN_PRENOM\"}'",
        "type": "curl"
      }
    ],
    "filename": "src/Controller/UserController.php",
    "groupTitle": "Users"
  },
  {
    "type": "delete",
    "url": "/v1/professeurs/{id_professeur}",
    "title": "Effacer un professeur",
    "name": "DeleteProfesseur",
    "group": "Users",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "number",
            "optional": false,
            "field": "id_professeur",
            "description": "<p>l'id du compte professeur</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Exemple d'utilisation:",
        "content": "curl -X DELETE -H \"Authorization: Bearer votre_jeton_d_authentification_ici\" -i \"http://api-base.hub3e.com/v1/professeurs/123\"",
        "type": "curl"
      }
    ],
    "filename": "src/Controller/UserController.php",
    "groupTitle": "Users"
  },
  {
    "type": "get",
    "url": "/v1/professeurs/current",
    "title": "Voir le professeur actuellement connecté",
    "name": "GetCurrentProfesseur",
    "group": "Users",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Exemple d'utilisation:",
        "content": "curl -X GET -H \"Authorization: Bearer votre_jeton_d_authentification_ici\" -i \"http://api-rest-efilp/v1/professeurs/current\"",
        "type": "curl"
      }
    ],
    "filename": "src/Controller/UserController.php",
    "groupTitle": "Users"
  },
  {
    "type": "post",
    "url": "/v1/login_check",
    "title": "Obtenir un token d'authentification",
    "name": "LoginProfesseur",
    "group": "Users",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Exemple d'utilisation:",
        "content": "curl -X POST -i \"http://api-rest-efilp/v1/login_check\" -d '{\"username\": \"TEST\", \"password\": \"testpass\"}'",
        "type": "curl"
      }
    ],
    "filename": "src/Controller/UserController.php",
    "groupTitle": "Users"
  },
  {
    "type": "patch",
    "url": "/v1/professeurs/{id_professeur}/password",
    "title": "Mettre à jour le mot de passe",
    "name": "UpdatePasswordProfesseur",
    "group": "Users",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "number",
            "optional": false,
            "field": "id_professeur",
            "description": "<p>l'id du compte professeur</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "currentPassword",
            "description": "<p>l'ancien mot de passe</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "newPassword",
            "description": "<p>le nouveau mot de passe</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Exemple d'utilisation:",
        "content": "curl -X PATCH -H \"Authorization: Bearer votre_jeton_d_authentification_ici\" -i \"http://api-base.hub3e.com/v1/professeurs/{id_professeur}/password\" -d '{\"username\": \"nom_d_utilisateur\", \"nom\": \"UN_NOM\", \"prenom\": \"UN_PRENOM\"}'",
        "type": "curl"
      }
    ],
    "filename": "src/Controller/UserController.php",
    "groupTitle": "Users"
  },
  {
    "type": "patch",
    "url": "/v1/professeurs/{id_professeur}/info",
    "title": "Mettre à jour les informations personelles",
    "name": "UpdateProfesseur",
    "group": "Users",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "number",
            "optional": false,
            "field": "id_professeur",
            "description": "<p>l'id du compte professeur</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "nom",
            "description": "<p>le nom associé au compte</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "prenom",
            "description": "<p>le prénom associé au compte</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "username",
            "description": "<p>l'identifiant du compte</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Exemple d'utilisation:",
        "content": "curl -X PATCH -H \"Authorization: Bearer votre_jeton_d_authentification_ici\" -i \"http://api-base.hub3e.com/v1/professeurs/{id_professeur}/info\" -d '{\"username\": \"nom_d_utilisateur\", \"nom\": \"UN_NOM\", \"prenom\": \"UN_PRENOM\"}'",
        "type": "curl"
      }
    ],
    "filename": "src/Controller/UserController.php",
    "groupTitle": "Users"
  }
] });