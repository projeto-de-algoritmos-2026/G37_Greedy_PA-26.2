import base64
import time

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from huffman_codec import comprimir, descomprimir

app = FastAPI(title="Compressor Huffman")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class RespostaCompressao(BaseModel):
    dados_comprimidos_base64: str
    codigos: dict[str, str]
    bits_de_preenchimento: int
    tamanho_original_bytes: int
    tamanho_comprimido_bytes: int
    taxa_compressao_percentual: float
    tempo_calculo_ms: float


class PedidoDescompressao(BaseModel):
    dados_comprimidos_base64: str
    codigos: dict[str, str]
    bits_de_preenchimento: int


class RespostaDescompressao(BaseModel):
    texto: str
    tempo_calculo_ms: float


@app.post("/comprimir", response_model=RespostaCompressao)
async def rota_comprimir(arquivo: UploadFile = File(...)):
    if not arquivo.filename.endswith(".txt"):
        raise HTTPException(status_code=400, detail="Envie um arquivo .txt")

    conteudo_bytes = await arquivo.read()
    try:
        texto = conteudo_bytes.decode("utf-8")
    except UnicodeDecodeError:
        raise HTTPException(status_code=400, detail="Arquivo nao esta em UTF-8 valido.")

    if not texto:
        raise HTTPException(status_code=400, detail="Arquivo vazio.")

    inicio = time.perf_counter()
    resultado = comprimir(texto)
    tempo_calculo_ms = (time.perf_counter() - inicio) * 1000

    taxa = 100 * (1 - resultado.tamanho_comprimido_bytes / resultado.tamanho_original_bytes)

    return RespostaCompressao(
        dados_comprimidos_base64=base64.b64encode(resultado.dados_comprimidos).decode("ascii"),
        codigos=resultado.codigos,
        bits_de_preenchimento=resultado.bits_de_preenchimento,
        tamanho_original_bytes=resultado.tamanho_original_bytes,
        tamanho_comprimido_bytes=resultado.tamanho_comprimido_bytes,
        taxa_compressao_percentual=taxa,
        tempo_calculo_ms=tempo_calculo_ms,
    )


@app.post("/descomprimir", response_model=RespostaDescompressao)
def rota_descomprimir(pedido: PedidoDescompressao):
    try:
        dados_comprimidos = base64.b64decode(pedido.dados_comprimidos_base64)
    except Exception:
        raise HTTPException(status_code=400, detail="dados_comprimidos_base64 invalido.")

    inicio = time.perf_counter()
    texto = descomprimir(dados_comprimidos, pedido.codigos, pedido.bits_de_preenchimento)
    tempo_calculo_ms = (time.perf_counter() - inicio) * 1000

    return RespostaDescompressao(texto=texto, tempo_calculo_ms=tempo_calculo_ms)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)