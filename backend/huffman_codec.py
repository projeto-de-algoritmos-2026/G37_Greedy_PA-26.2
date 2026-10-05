from dataclasses import dataclass
from typing import Dict

from huffman_tree import construir_arvore, contar_frequencias, gerar_codigos


@dataclass
class ResultadoCompressao:
    dados_comprimidos: bytes
    codigos: Dict[str, str]
    frequencias: Dict[str, int]
    bits_de_preenchimento: int
    tamanho_original_bytes: int
    tamanho_comprimido_bytes: int


def comprimir(texto: str) -> ResultadoCompressao:
    """
    Comprime uma string de texto usando Huffman.

    Passos:
      1. Conta frequencia de cada caractere
      2. Constroi a arvore de Huffman (algoritmo guloso)
      3. Gera o codigo binario de cada caractere
      4. Troca cada caractere do texto pelo seu codigo, formando uma unica
         string gigante de '0's e '1's
      5. Empacota essa string de 8 em 8 bits dentro de bytes de verdade
    """
    frequencias = contar_frequencias(texto)
    raiz = construir_arvore(frequencias)
    codigos = gerar_codigos(raiz)

    bits = "".join(codigos[caractere] for caractere in texto)
    bits_de_preenchimento = (8 - len(bits) % 8) % 8
    bits_preenchidos = bits + "0" * bits_de_preenchimento

    dados_comprimidos = bytearray()
    for i in range(0, len(bits_preenchidos), 8):
        byte_str = bits_preenchidos[i : i + 8]
        dados_comprimidos.append(int(byte_str, 2))

    return ResultadoCompressao(
        dados_comprimidos=bytes(dados_comprimidos),
        codigos=codigos,
        frequencias=frequencias,
        bits_de_preenchimento=bits_de_preenchimento,
        tamanho_original_bytes=len(texto.encode("utf-8")),
        tamanho_comprimido_bytes=len(dados_comprimidos),
    )


def descomprimir(
    dados_comprimidos: bytes, codigos: Dict[str, str], bits_de_preenchimento: int
) -> str:
    """
    Reverte a compressao: bytes -> string de bits -> percorre os codigos
    (do maior prefixo que bate) -> caracteres originais.
    """

    bits = "".join(f"{byte:08b}" for byte in dados_comprimidos)

    if bits_de_preenchimento > 0:
        bits = bits[:-bits_de_preenchimento]

    codigo_para_caractere = {codigo: caractere for caractere, codigo in codigos.items()}

    texto_decodificado = []
    buffer_atual = ""
    for bit in bits:
        buffer_atual += bit
        if buffer_atual in codigo_para_caractere:
            texto_decodificado.append(codigo_para_caractere[buffer_atual])
            buffer_atual = ""

    if buffer_atual:
        raise ValueError("Dados comprimidos nao batem com a tabela de codigos.")

    return "".join(texto_decodificado)