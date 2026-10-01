import heapq
from collections import Counter
from dataclasses import dataclass, field
from typing import Dict, Optional


@dataclass
class NoHuffman:
    """
    Um no da arvore de Huffman.

    Se for FOLHA, representa um caractere especifico (`caractere` != None).
    Se for NO INTERNO (criado ao juntar dois nos), `caractere` e None e ele
    tem `esquerda`/`direita` apontando para os dois nos que foram unidos.
    """

    frequencia: int
    caractere: Optional[str] = None
    esquerda: Optional["NoHuffman"] = None
    direita: Optional["NoHuffman"] = None

    def eh_folha(self) -> bool:
        return self.caractere is not None

    def __lt__(self, outro: "NoHuffman") -> bool:
        return self.frequencia < outro.frequencia


def contar_frequencias(texto: str) -> Dict[str, int]:
    """Conta quantas vezes cada caractere aparece no texto."""
    return dict(Counter(texto))


def construir_arvore(frequencias: Dict[str, int]) -> NoHuffman:
    """
    Constroi a arvore de Huffman a partir das frequencias dos caracteres.

    Algoritmo guloso: a cada passo, pega os DOIS nos de MENOR frequencia
    disponiveis e junta eles num no novo (cuja frequencia e a soma dos dois).
    Repete ate sobrar um unico no -- a raiz da arvore.
    """
    if not frequencias:
        raise ValueError("Nao e possivel construir arvore de um texto vazio.")

    heap = [NoHuffman(frequencia=freq, caractere=c) for c, freq in frequencias.items()]
    heapq.heapify(heap)

    if len(heap) == 1:
        unico = heapq.heappop(heap)
        no_vazio = NoHuffman(frequencia=0, caractere="")
        heap = [unico, no_vazio]
        heapq.heapify(heap)

    while len(heap) > 1:
        no1 = heapq.heappop(heap)
        no2 = heapq.heappop(heap)

        no_pai = NoHuffman(
            frequencia=no1.frequencia + no2.frequencia,
            esquerda=no1,
            direita=no2,
        )
        heapq.heappush(heap, no_pai)

    return heap[0]


def gerar_codigos(raiz: NoHuffman) -> Dict[str, str]:
    """
    Percorre a arvore e gera o codigo binario (string de '0's e '1's) de
    cada caractere: '0' para ir à esquerda, '1' para ir à direita.
    """
    codigos: Dict[str, str] = {}

    def percorrer(no: Optional[NoHuffman], caminho: str) -> None:
        if no is None:
            return
        if no.eh_folha():
            codigos[no.caractere] = caminho or "0"
            return
        percorrer(no.esquerda, caminho + "0")
        percorrer(no.direita, caminho + "1")

    percorrer(raiz, "")
    return codigos