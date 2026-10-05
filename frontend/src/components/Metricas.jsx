import { formatarBytes, formatarNumero } from "../utils/formatar";

export default function Metricas({ resultado, tamanhoHuff }) {
  const {
    tamanho_original_bytes: original,
    tamanho_comprimido_bytes: comprimido,
    taxa_compressao_percentual: taxa,
    tempo_calculo_ms: tempo,
  } = resultado;

  const maior = Math.max(original, comprimido, tamanhoHuff);
  const largura = (valor) => `${Math.max((valor / maior) * 100, 1)}%`;
  const taxaRuim = taxa <= 0;

  return (
    <section className="cartao">
      <h2>Métricas</h2>
      <div className="metricas">
        <div className="metrica">
          <span className="metrica__rotulo">Tamanho original</span>
          <span className="metrica__valor">{formatarBytes(original)}</span>
        </div>
        <div className="metrica">
          <span className="metrica__rotulo">Tamanho comprimido</span>
          <span className="metrica__valor">{formatarBytes(comprimido)}</span>
        </div>
        <div className={`metrica ${taxaRuim ? "metrica--alerta" : "metrica--destaque"}`}>
          <span className="metrica__rotulo">Taxa de compressão</span>
          <span className="metrica__valor">{formatarNumero(taxa)}%</span>
        </div>
        <div className="metrica">
          <span className="metrica__rotulo">Tempo de cálculo</span>
          <span className="metrica__valor">{formatarNumero(tempo, 2)} ms</span>
        </div>
      </div>

      <div className="barras">
        <Barra rotulo="Original" valor={original} largura={largura(original)} tipo="original" />
        <Barra rotulo="Comprimido (dados)" valor={comprimido} largura={largura(comprimido)} tipo="comprimido" />
        <Barra rotulo="Arquivo .huff (dados + tabela)" valor={tamanhoHuff} largura={largura(tamanhoHuff)} tipo="huff" />
      </div>

      {taxaRuim && (
        <p className="aviso">
          O resultado não ficou menor que o original. Isso acontece em textos muito curtos ou com
          poucas repetições: a economia dos códigos curtos não compensa.
        </p>
      )}
      <p className="nota">
        A taxa de compressão considera só os dados codificados. O arquivo <code>.huff</code> também
        guarda a tabela de códigos (em JSON), necessária para descomprimir.
      </p>
    </section>
  );
}

function Barra({ rotulo, valor, largura, tipo }) {
  return (
    <div className="barra">
      <span className="barra__rotulo">{rotulo}</span>
      <div className="barra__trilho">
        <div className={`barra__preenchimento barra__preenchimento--${tipo}`} style={{ width: largura }} />
      </div>
      <span className="barra__valor">{formatarBytes(valor)}</span>
    </div>
  );
}
