import { useState } from "react";
import { comprimir, descomprimir } from "../api";
import { baixarArquivo } from "../utils/download";
import { trocarExtensao } from "../utils/formatar";
import Metricas from "./Metricas";
import TabelaCodigos from "./TabelaCodigos";
import UploadArquivo from "./UploadArquivo";

export default function AbaComprimir() {
  const [arquivo, setArquivo] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [verificacao, setVerificacao] = useState(null);

  async function aoSelecionar(novoArquivo) {
    setResultado(null);
    setVerificacao(null);
    setErro(null);

    if (!novoArquivo.name.toLowerCase().endsWith(".txt")) {
      setErro("Envie um arquivo .txt");
      return;
    }

    setArquivo(novoArquivo);
    setCarregando(true);
    try {
      setResultado(await comprimir(novoArquivo));
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }

  // Conteudo do .huff: exatamente o corpo que /descomprimir espera + o nome original.
  const conteudoHuff = resultado
    ? JSON.stringify({
        nome_original: arquivo.name,
        dados_comprimidos_base64: resultado.dados_comprimidos_base64,
        codigos: resultado.codigos,
        bits_de_preenchimento: resultado.bits_de_preenchimento,
      })
    : null;
  const tamanhoHuff = conteudoHuff ? new TextEncoder().encode(conteudoHuff).length : 0;

  async function verificarIdaEVolta() {
    setVerificacao({ estado: "carregando" });
    try {
      const [original, { texto }] = await Promise.all([arquivo.text(), descomprimir(resultado)]);
      setVerificacao({ estado: texto === original ? "ok" : "falhou" });
    } catch (e) {
      setVerificacao({ estado: "erro", mensagem: e.message });
    }
  }

  return (
    <>
      <section className="cartao">
        <h2>Comprimir arquivo</h2>
        <UploadArquivo
          extensao=".txt"
          descricao="Arraste aqui ou clique para escolher um arquivo de texto (UTF-8)"
          onSelecionar={aoSelecionar}
          desabilitado={carregando}
        />
        {carregando && <p className="carregando">Comprimindo…</p>}
        {erro && <p className="erro">{erro}</p>}

        {resultado && (
          <div className="acoes">
            <button
              className="botao botao--primario"
              onClick={() => baixarArquivo(conteudoHuff, trocarExtensao(arquivo.name, ".huff"), "application/json")}
            >
              Baixar {trocarExtensao(arquivo.name, ".huff")}
            </button>
            <button className="botao" onClick={verificarIdaEVolta} disabled={verificacao?.estado === "carregando"}>
              Verificar descompressão
            </button>
            {verificacao?.estado === "ok" && <span className="selo selo--ok">✓ Texto recuperado idêntico ao original</span>}
            {verificacao?.estado === "falhou" && <span className="selo selo--erro">✗ Texto recuperado difere do original</span>}
            {verificacao?.estado === "erro" && <span className="selo selo--erro">{verificacao.mensagem}</span>}
          </div>
        )}
      </section>

      {resultado && (
        <>
          <Metricas resultado={resultado} tamanhoHuff={tamanhoHuff} />
          <TabelaCodigos codigos={resultado.codigos} frequencias={resultado.frequencias} />
        </>
      )}
    </>
  );
}
