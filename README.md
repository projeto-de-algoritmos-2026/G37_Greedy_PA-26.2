# Compressor de Arquivos — Huffman

Número da Lista: Algoritmos Gulosos<br>
Conteúdo da Disciplina: Algoritmos Gulosos — Codificação de Huffman<br>

## Alunos

| Matrícula | Aluno                       |
| --------- | --------------------------- |
| 222006276 | Luís Gustavo Lopes Oliveira |
| 222006211 | Vitor Valerio Hoffmann      |

## Sobre

Aplicação web que **comprime e descomprime arquivos `.txt`** usando o
algoritmo guloso de **Huffman**. O usuário sobe um arquivo de texto e recebe
de volta os dados comprimidos, a taxa de redução alcançada e as métricas de
execução do algoritmo.

**Como o problema foi modelado.** O texto é tratado como uma sequência de
caracteres, cada um com uma frequência de ocorrência. O Huffman constrói uma
**árvore binária** a partir dessas frequências: a cada passo, a escolha
gulosa junta os **dois nós de menor frequência** disponíveis num nó novo, até
sobrar um único nó — a raiz. O caminho da raiz até cada caractere (esquerda =
0, direita = 1) vira o código binário dele:

```
caracteres frequentes  -> códigos curtos
caracteres raros       -> códigos longos
```

Isso faz o texto codificado ocupar, no total, menos bits do que o padrão fixo
de 8 bits por caractere (ASCII) — mas só depois de **empacotar** essa
sequência de bits dentro de bytes reais, de 8 em 8; gerar apenas uma string de
`'0'`s e `'1'`s não economiza espaço nenhum sozinha.

A árvore e os códigos são construídos por uma implementação própria do
**Huffman** (`backend/huffman_tree.py` e `backend/huffman_codec.py`), com fila
de prioridade e reconstrução do código de cada caractere por percurso da
árvore.

## Screenshots

> Frontend ainda em desenvolvimento — screenshots serão adicionados aqui.

## Instalação

Linguagem: Python 3.9+<br>
Framework: FastAPI (backend)<br>

**Pré-requisitos:** Python 3.9 ou superior.

```bash
# 1. ambiente virtual (evita o erro externally-managed-environment)
python3 -m venv venv
source venv/bin/activate      # no Windows: venv\Scripts\activate

# 2. dependências do backend
pip install -r backend/requirements.txt

# 3. sobe a API
python3 run.py
```

A API fica em **[http://127.0.0.1:8000](http://127.0.0.1:8000)**, com
documentação automática em `/docs` — dá pra testar o upload de um `.txt`
direto por lá, sem precisar do frontend ainda.

## Uso

1. **Envie um arquivo `.txt`** para o endpoint `/comprimir`.
2. **Receba de volta** os dados comprimidos (em base64), a tabela de códigos
   de cada caractere e as métricas de compressão.
3. **Para reverter**, envie os dados comprimidos + a tabela de códigos para
   `/descomprimir` e receba o texto original de volta.

A tabela de códigos é essencial: sem ela não é possível saber onde um código
termina e o próximo começa, então ela precisa ser guardada junto com os dados
comprimidos.

### As métricas

| Métrica                       | O que é                                                        |
| ------------------------------ | --------------------------------------------------------------- |
| Tamanho original / comprimido  | Bytes antes e depois da compressão.                             |
| Taxa de compressão             | Percentual de redução alcançado.                                |
| Tempo de cálculo               | Tempo só do algoritmo (construção da árvore + codificação).     |

A taxa de compressão varia bastante conforme o texto: em textos com
caracteres muito repetidos, o Huffman consegue reduzir bastante o tamanho;
em textos com distribuição de frequência quase uniforme (poucas repetições),
a economia é pequena — no limite, se todos os caracteres aparecerem com a
mesma frequência, o código gerado se aproxima de um código fixo, sem ganho
de compressão.

## Outros

### A API

**`POST /comprimir`** — recebe um arquivo `.txt` (multipart/form-data, campo
`arquivo`), devolve o resultado da compressão:

```bash
curl -X POST http://127.0.0.1:8000/comprimir \
  -F "arquivo=@exemplo.txt"
```

```json
{
  "dados_comprimidos_base64": "...",
  "codigos": { "a": "0", "b": "111", "...": "..." },
  "bits_de_preenchimento": 3,
  "tamanho_original_bytes": 230,
  "tamanho_comprimido_bytes": 65,
  "taxa_compressao_percentual": 71.7,
  "tempo_calculo_ms": 0.42
}
```

Devolve **400** se o arquivo não for `.txt`, estiver vazio, ou não for UTF-8
válido.

**`POST /descomprimir`** — recebe os dados comprimidos + a tabela de códigos,
devolve o texto original:

```json
{
  "texto": "abracadabra abracadabra...",
  "tempo_calculo_ms": 0.31
}
```

### Estrutura do projeto

```
backend/
├── huffman_tree.py     construção da árvore de Huffman e geração dos códigos
├── huffman_codec.py     compressão/descompressão (bits <-> bytes reais)
├── main.py               API FastAPI
└── requirements.txt
run.py                    sobe o backend com um único comando
```

### Implementação

- **`huffman_tree.py`** — a classe `NoHuffman` (folha ou nó interno), a
  função `construir_arvore` (escolha gulosa: sempre junta os dois nós de
  menor frequência) e `gerar_codigos` (percurso da árvore que monta o
  código binário de cada caractere). A única estrutura de apoio é o `heapq`
  da biblioteca padrão.
- **`huffman_codec.py`** — `comprimir` troca cada caractere do texto pelo seu
  código e empacota os bits de 8 em 8 dentro de bytes reais;
  `descomprimir` desempacota os bytes de volta em bits e percorre os
  códigos (prefixo a prefixo) até reconstruir o texto original.

**Bibliotecas**: nenhuma biblioteca pronta de compressão (`zlib`, `gzip`,
etc.) é usada — toda a lógica de construção da árvore, codificação e
empacotamento dos bits é própria. **FastAPI** apenas serve a API.

### Rodando a lógica separada da API

```bash
cd backend
python3 -c "
from huffman_codec import comprimir, descomprimir
texto = 'abracadabra abracadabra' * 10
r = comprimir(texto)
print(f'{r.tamanho_original_bytes} -> {r.tamanho_comprimido_bytes} bytes')
print('OK' if descomprimir(r.dados_comprimidos, r.codigos, r.bits_de_preenchimento) == texto else 'ERRO')
"
```

Isso testa a compressão/descompressão isoladamente, sem subir a API nem
precisar de um arquivo de verdade.