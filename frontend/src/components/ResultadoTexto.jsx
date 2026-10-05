import { baixarArquivo } from "../utils/download";
import { formatarBytes, formatarNumero } from "../utils/formatar";

export default function ResultadoTexto({ texto, tempo, nomeArquivo }) {
  const bytes = new TextEncoder().encode(texto).length;

  return (
    <section className="cartao">
      <div className="cartao__topo">
        <h2>Texto descomprimido</h2>
        <button className="botao" onClick={() => baixarArquivo(texto, nomeArquivo, "text/plain;charset=utf-8")}>
          Baixar {nomeArquivo}
        </button>
      </div>
      <p className="nota">
        {texto.length.toLocaleString("pt-BR")} caracteres · {formatarBytes(bytes)} · descomprimido em{" "}
        {formatarNumero(tempo, 2)} ms
      </p>
      <pre className="texto">{texto}</pre>
    </section>
  );
}
