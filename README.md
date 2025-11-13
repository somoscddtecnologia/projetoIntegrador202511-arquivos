# API de Gerenciamento de Arquivos (Proxy Reverso com S3)
Esta é a documentação da versão final da API, que implementa um padrão de Proxy Reverso. Nesta arquitetura, o servidor atua como um intermediário seguro, garantindo que a URL do S3 e a localização dos arquivos nunca sejam expostas ao cliente.

# Funcionalidades
Upload de Arquivos Privados: A API recebe um arquivo (via POST /enviar), o valida e o armazena como um objeto privado no Amazon S3. O público não tem nenhum acesso direto a ele.

Persistência de Chave: Em vez de salvar uma URL pública, o banco de dados armazena apenas uma chave_s3 interna. Essa chave é um identificador único (como um nome de arquivo hash) que só a API entende.

Proxy Reverso de Download: Quando um usuário solicita um arquivo (via GET /pegar/:uuid), a API atua como um intermediário. Ela usa o UUID para encontrar a chave_s3 no banco, busca privadamente o arquivo no S3, o carrega em sua própria memória (buffer) e, em seguida, envia esse arquivo diretamente ao usuário.

Segurança (Ocultação de URL): O resultado do "Proxy Reverso" é que o usuário nunca vê uma URL do S3. A URL que ele acessa no navegador é a da própria API (ex: api.meusite.com/pegar/...). A localização do S3 fica 100% oculta.

Validação na Entrada: Antes de aceitar qualquer upload, a API verifica rigorosamente se o arquivo é de um tipo permitido (PDF, JPG, PNG) e se está abaixo do limite de tamanho (5MB).

Gerenciamento de Banco: A estrutura do banco de dados (como a criação da tabela arquivo) é gerenciada de forma profissional usando migrations do Knex, o que permite controle de versão.