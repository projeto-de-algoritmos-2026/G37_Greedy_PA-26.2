import { formatarCaractere } from "../utils/formatar";

export default function TabelaCodigos({ codigos, frequencias }) {
  // A chave "" e a folha sentinela criada quando o texto tem um unico caractere distinto.
  const linhas = Object.entries(codigos)
    .filter(([caractere]) => caractere !== "")
    .map(([caractere, codigo]) => {
      const frequencia = frequencias?.[caractere] ?? 0;
      return { caractere, codigo, frequencia, totalBits: frequencia * codigo.length };
    })
    .sort((a, b) => b.frequencia - a.frequencia || a.codigo.length - b.codigo.length);

  const totalBits = linhas.reduce((soma, linha) => soma + linha.totalBits, 0);

  return (
    <section className="cartao">
      <h2>Tabela de códigos</h2>
      <p className="nota">
        {linhas.length} caracteres distintos · {totalBits.toLocaleString("pt-BR")} bits no total.
        Os mais frequentes recebem os códigos mais curtos.
      </p>
      <div className="tabela-rolagem">
        <table className="tabela">
          <thead>
            <tr>
              <th>Caractere</th>
              <th className="num">Frequência</th>
              <th>Código</th>
              <th className="num">Bits</th>
              <th className="num">Total de bits</th>
            </tr>
          </thead>
          <tbody>
            {linhas.map(({ caractere, codigo, frequencia, totalBits }) => (
              <tr key={caractere}>
                <td><span className="caractere">{formatarCaractere(caractere)}</span></td>
                <td className="num">{frequencia.toLocaleString("pt-BR")}</td>
                <td><code className="codigo">{codigo}</code></td>
                <td className="num">{codigo.length}</td>
                <td className="num">{totalBits.toLocaleString("pt-BR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
