import { useState } from "react";
import AbaComprimir from "./components/AbaComprimir";
import AbaDescomprimir from "./components/AbaDescomprimir";

const ABAS = [
  { id: "comprimir", rotulo: "Comprimir" },
  { id: "descomprimir", rotulo: "Descomprimir" },
];

export default function App() {
  const [aba, setAba] = useState("comprimir");

  return (
    <div className="pagina">
      <header className="cabecalho">
        <h1>Compressor Huffman</h1>
        <p>
          Compressão de arquivos de texto com o algoritmo guloso de Huffman: caracteres frequentes
          recebem códigos curtos, caracteres raros recebem códigos longos.
        </p>
      </header>

      <nav className="abas" role="tablist">
        {ABAS.map(({ id, rotulo }) => (
          <button
            key={id}
            role="tab"
            aria-selected={aba === id}
            className={`aba ${aba === id ? "aba--ativa" : ""}`}
            onClick={() => setAba(id)}
          >
            {rotulo}
          </button>
        ))}
      </nav>

      {/* As duas abas ficam montadas para manter o resultado ao alternar. */}
      <main hidden={aba !== "comprimir"}>
        <AbaComprimir />
      </main>
      <main hidden={aba !== "descomprimir"}>
        <AbaDescomprimir />
      </main>

      <footer className="rodape">Projeto de Algoritmos — Algoritmos Gulosos · G37</footer>
    </div>
  );
}
