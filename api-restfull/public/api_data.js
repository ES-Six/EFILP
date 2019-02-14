define({ "api": [
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
  }
] });
