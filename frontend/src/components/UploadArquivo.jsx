import { useRef, useState } from "react";

export default function UploadArquivo({ extensao, descricao, onSelecionar, desabilitado }) {
  const inputRef = useRef(null);
  const [arrastando, setArrastando] = useState(false);
  const [nome, setNome] = useState(null);

  function selecionar(arquivo) {
    if (!arquivo) return;
    setNome(arquivo.name);
    onSelecionar(arquivo);
  }

  function aoSoltar(evento) {
    evento.preventDefault();
    setArrastando(false);
    if (!desabilitado) selecionar(evento.dataTransfer.files[0]);
  }

  return (
    <div
      className={`upload ${arrastando ? "upload--arrastando" : ""} ${desabilitado ? "upload--desabilitado" : ""}`}
      onClick={() => !desabilitado && inputRef.current.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setArrastando(true);
      }}
      onDragLeave={() => setArrastando(false)}
      onDrop={aoSoltar}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={extensao}
        hidden
        onChange={(e) => {
          selecionar(e.target.files[0]);
          e.target.value = "";
        }}
      />
      <span className="upload__icone" aria-hidden="true">⇪</span>
      <strong>{nome ?? `Escolha um arquivo ${extensao}`}</strong>
      <span className="upload__dica">{descricao}</span>
    </div>
  );
}
