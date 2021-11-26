Para rodar está aplicação é necessário fazer um clone deste repositorio ou um fork,
O clone pode ser feito com o comando.

```bash
git clone https://github.com/patrick0806/aws-lambda-crud.git
```

Após isso no arquivo serverless.yml, voce pode mudar a região se desejar.

Você deve criar um usuário de api no painel da AWS, para gerar as informações de acesso

No repositorio do github, você deve ir em configurações, segredo e adicionar as informações de acesso em duas variaveis.

AWS_ACCESS_KEY_ID = ""
AWS_SECRET_ACCESS_KEY = ""

Após isso faça um commit para a branch main, que a integração rodara automaticamente e gerara as suas funções lambda na AWS.

Devido ao tempo, eu não consegui finalizar tudo, então acabei n fazendo um front end para mostrar os dados, mas as funções podem ser acessadas
por estes links:

    GET - https://z0o2u7zz95.execute-api.sa-east-1.amazonaws.com/dev/workers
    GET - https://z0o2u7zz95.execute-api.sa-east-1.amazonaws.com/dev/worker/{workerId}
    POST - https://z0o2u7zz95.execute-api.sa-east-1.amazonaws.com/dev/worker
    PUT - https://z0o2u7zz95.execute-api.sa-east-1.amazonaws.com/dev/worker/{workerId}
    DELETE - https://z0o2u7zz95.execute-api.sa-east-1.amazonaws.com/dev/worker/{workerId}

Recomendo o uso de ferramentes como o insomina ou PostMan para fazer os testes, na pasta test, o arquivo users.json, tem um usuários que já cadastrei no meu banco dynamodb que podem ser utilizado para testar as funções.