# 🎴 FullStack Yu-Gi-Oh! 

Bem-vindo ao **FullStack Yu-Gi-Oh!**, o segundo projeto da disciplina de Programação Web Fullstack! 🚀

## 📖 Descrição do Projeto

O **FullStack Yu-Gi-Oh!** é composto por:

 - Back-end: API REST em Node.js + Express, conectada a um banco de dados (MongoDB).

 - Front-end: SPA com React.js, consumindo os dados da API para autenticação, busca e cadastro.

## 🚀 Funcionalidades

### 🔐 Autenticação (Login)
 - Tela de login com validação de credenciais.

 - Utilização de JWT para autenticação.

 - Rotas protegidas exigem token válido.

### 🔍 Busca de Cards
 - Interface de pesquisa por nome e/ou tipo.

### ➕ Inserção de Cards
 - Formulário de cadastro com validação.

### ⚠️ Validações
 - Validação no back-end e front-end.

 - Retorno de mensagens claras ao usuário.

### 🛡️ Segurança
 - Senhas com hashing (bcrypt).

 - Middlewares de segurança (helmet, express-rate-limit...).

 - Sanitização (express-mongo-sanitize, express-validator).

 - Logs de eventos e autenticação.

### ⚡ Otimização
 - Compressão de respostas HTTP (compression).

 - Pool de conexões com o banco.

 - Cache para buscas.


## 🛠️ Principais Tecnologias Utilizadas

| Tecnologias              | Uso                          |
|--------------------------|------------------------------|
| **React.js**             | SPA Front-end                |
| **Express.js**           | Servidor back-end            |
| **MongoDB**              | Banco de dados               |
| **JWT (jsonwebtoken)**   | Autenticação                 |
| **bcrypt**               | Hash de senhas               |
| **helmet**               | Segurança HTTP               |
| **express-rate-limit**   | Limite de requisições        |
| **compression**          | Compressão de respostas      |
| **node-cache**           | Sistema de cahce em rotas    |
| **AJAX (fetch / axios)** | Requisições HTTP no front    |


## 📁 Estrutura do projeto 

### Backend (server)

```
└── 📁server
    └── 📁certificates
        └── server.cert
        └── server.key
    └── 📁config
        └── db.js
    └── 📁controllers
        └── cardController.js
        └── userController.js
    └── 📁logs
        └── access.log
    └── 📁middlewares
        └── auth.js
        └── logger.js
        └── sanitizer.js
    └── 📁models
        └── Card.js
        └── User.js
    └── 📁routes
        └── cardRoutes.js
        └── userRoutes.js
    └── 📁utils
        └── cache.js
    └── .env
    └── .gitignore
    └── index.js
    └── package-lock.json
    └── package.json
    └── seed.js
```
### Frontend (web)

```
└── 📁web
    └── 📁build
    └── 📁public
        └── 📁assets
            └── 📁images
                └── card.png
                └── yu_gi_oh.ico
                └── yugioh-logo.png
        └── favicon.ico
        └── index.html
    └── 📁src
        └── App.css
        └── App.js
        └── 📁components
            └── CardCreationModal.js
            └── CardDetailsModal.js
            └── 📁layout
                └── Footer.js
                └── Navbar.js
            └── 📁modals
                └── LoginModal.js
            └── 📁ui
                └── ModalWrapper.js
        └── 📁context
            └── AuthContext.js
        └── 📁hooks
            └── useAuth.js
        └── index.css
        └── index.js
        └── 📁pages
            └── CardsPage.js
            └── HomePage.js
        └── 📁routes
            └── AppRoutes.js
        └── 📁services
            └── api.js
            └── authService.js
    └── .gitignore
    └── package-lock.json
    └── package.json
    └── postcss.config.js
    └── README.md
    └── tailwind.config.js
```

## 🚀 Como Rodar a Aplicação

1. **Clone o repositório**  
    - git clone https://github.com/Giovani2601/Yu-Gi-Oh-FULL.git

2. **Navegue até a pasta do projeto**
    - cd YU-GI-OH-FULL

3. **Navegue até a pasta do backend (server**)
    - cd server

4. **Crie um .env com as seguintes informações**
    - JWT_SECRET=qualquer
    - JWT_EXPIRES_IN=1d (quanto tempo quiser)

5. **Instale as dependências** 
    - npm install

6. **Inicie o servidor**
    - node index.js

7. **Navegue de volta até a pasta raiz do projeto**
    - cd ..

8. **Navegueaté a pasta do frontend (web**)
    - cd web

9. **Instale as dependências** 
    - npm install

10. **Inicie a aplicação web**
    - npm start

11. **Se desejar, utilize o comando node seed.js no server**
    - Isso irá inserir alguns dados no banco, ideal para testes