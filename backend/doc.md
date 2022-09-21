# KANBADA API

Documentação básica para interação com API da KANBADA.

## Endpoints Tarefas

Endpoinds para o recurso: tarefas.

> GET /api/tarefa/:id_categoria

Pesquisa uma tarefa com base na id_categoria

**Response**
`200 OK`

```js
[
	{
		id: 2,
		coluna_id: 2,
		data_criacao: "2022-09-18T20:11:51.288Z",
		nome: "tarefa2",
		ordem: 1,
		tags: "tag2",
		anotacoes: "anotações",
	},
	{
		id: 4,
		coluna_id: 2,
		data_criacao: "2022-09-19T14:44:38.715Z",
		nome: "tarefa1",
		ordem: 1,
		tags: "tag1",
		anotacoes: "anotacao",
	},
];
```

> POST /api/tarefa/

Cria uma tarefa.

**body**

```js
{
    "coluna_id": "string",
    "nome": "string",
    "ordem": "number",
    "tags": "string",
    "anotacoes": "string"
}
```

**Response**
`201 CREATED`

```js
{
    "result": "Tarefa criada com sucesso!"
    "id": "string"
}
```

> PATCH /api/tarefa/

Altera uma tarefa com base no id.

**body**

```js
{
    "coluna_id": "string",
    "nome": "string",
    "ordem": "number",
    "tags": "string",
    "anotacoes": "string",
    "colaboradores": "[]",
    "id": "number"
}
```

**Response**
`200 OK`

```js
{
    "result": "Tarefa alterada com sucesso!"
}
```

> DELETE /api/tarefa/

Deleta uma tarefa com base no id.

**body**

```js
{
    "id": "number"
}
```

**Response**
`200 OK`

```js
{
    "result": "Tarefa deletada com sucesso!"
}
```

## Endpoints Usuarios

Endpoinds para o recurso: usuario.

> POST /api/usuario/

Cria um usuário.

**body**

```js
{
    "usuario": "string",
    "email": "string",
    "senha": "string"
}
```

**Response**
`201 CREATED`

```js
{
    "result": "Usuario criado com sucesso!"
}
```

> POST /api/usuario/login

Faz login e retorna token jwt.

**body**

```js
{
    "email": "string",
    "senha": "string"
}
```

**Response**
`200 OK`

```js
{
	"auth": true,
	"token": "JWT Token"
}
```

> PATCH /api/usuario/

Altera um usuário.

**body**

```js
{
    "id": "string",
    "email": "string",
    "usuario": "string"
}
```

**Response**
`200 OK`

```js
{
    "result": "Usuario alterado com sucesso!"
}
```

> PATCH /api/usuario/senha

Altera a senha de um usuário.

**body**

```js
{
    "id": "string"
    "senha": "string"
}
```

**Response**
`200 OK`

```js
{
    "result": "Senha alterada!"
}
```

> DELETE /api/usuario/

Deleta um usuário

**body**

```js
{
    "id": "string",
}
```

**Response**
`200 OK`

```js
{
    "result": "Usuario deletado com sucesso!"
}
```

> GET /api/usuario/:id

Traz todas as informações do usuario;

**Response**
`200 OK`

```js
{
	"id": "string",
	"data_criacao": "timestamp",
	"usuario": "string",
	"email": "string",
	"senha": "string"
}
```

> POST /api/usuario/projetos

Traz todos os projetos nos quais o usuario esta inserido

**body**

```js
{
    "id": "string",
}
```

**Response**
`200 OK`

```js
{
	"projetos": [
		{
			"id": "string",
			"nome": "string",
			"data_criacao": "timestamp",
			"ultimo_acesso": "timestamp",
			"adm": "string"
		}
	]
}
```