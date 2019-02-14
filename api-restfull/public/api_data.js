define({ "api": [
  {
    "type": "get",
    "url": "/v1/users/current",
    "title": "Voir le professeur actuellement connecté",
    "name": "GetCurrentProfesseur",
    "group": "Users",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Exemple d'utilisation:",
        "content": "curl -X GET -H \"Authorization: Bearer votre_jeton_d_authentification_ici\" -i \"http://api-rest-efilp/v1/users/current\"",
        "type": "curl"
      }
    ],
    "filename": "src/Controller/UserController.php",
    "groupTitle": "Users"
  },
  {
    "type": "get",
    "url": "/v1/login_check",
    "title": "Obtenir un token d'authentification",
    "name": "LoginProfesseur",
    "group": "Users",
    "version": "1.0.0",
    "examples": [
      {
        "title": "Exemple d'utilisation:",
        "content": "curl -X GET -H \"Authorization: Bearer votre_jeton_d_authentification_ici\" -i \"http://api-rest-efilp/v1/login_check\"",
        "type": "curl"
      }
    ],
    "filename": "src/Controller/UserController.php",
    "groupTitle": "Users"
  }
] });
