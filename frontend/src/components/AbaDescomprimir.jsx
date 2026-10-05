import { useState } from "react";
import { descomprimir } from "../api";
import { trocarExtensao } from "../utils/formatar";
import ResultadoTexto from "./ResultadoTexto";
import UploadArquivo from "./UploadArquivo";

function lerHuff(conteudo) {
  let dados;
  try {
    dados = JSON.parse(conteudo);
  } catch {
    throw new Error("Arquivo .huff inválido: não é um JSON.");
  }

  const valido =
    dados &&
    typeof dados.dados_comprimidos_base64 === "string" &&
    dados.codigos &&
    typeof dados.codigos === "object" &&
    Number.isInteger(dados.bits_de_preenchimento);
  if (!valido) {
    throw new Error("Arquivo .huff inválido: faltam os dados comprimidos, a tabela de códigos ou os bits de preenchimento.");
  }
  return dados;
}

export default function AbaDescomprimir() {
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);

  async function aoSelecionar(arquivo) {
    setResultado(null);
    setErro(null);

    if (!arquivo.name.toLowerCase().endsWith(".huff")) {
      setErro("Envie um arquivo .huff gerado na aba Comprimir.");
      return;
    }

    setCarregando(true);
    try {
      const dados = lerHuff(await arquivo.text());
      const { texto, tempo_calculo_ms } = await descomprimir(dados);
      const nomeArquivo = dados.nome_original ?? trocarExtensao(arquivo.name, ".txt");
      setResultado({ texto, tempo: tempo_calculo_ms, nomeArquivo });
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <>
      <section className="cartao">
        <h2>Descomprimir arquivo</h2>
        <UploadArquivo
          extensao=".huff"
          descricao="Arraste aqui ou clique para escolher um arquivo .huff gerado na aba Comprimir"
          onSelecionar={aoSelecionar}
          desabilitado={carregando}
        />
        {carregando && <p className="carregando">Descomprimindo…</p>}
        {erro && <p className="erro">{erro}</p>}
      </section>

      {resultado && <ResultadoTexto {...resultado} />}
    </>
  );
}
