export function formatarBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1).replace(".", ",")} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2).replace(".", ",")} MB`;
}

export function formatarNumero(valor, casas = 1) {
  return valor.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas });
}

const INVISIVEIS = {
  " ": "␣ espaço",
  "\n": "↵ \\n",
  "\r": "\\r",
  "\t": "⇥ \\t",
};

export function formatarCaractere(caractere) {
  return INVISIVEIS[caractere] ?? caractere;
}

export function trocarExtensao(nome, novaExtensao) {
  const semExtensao = nome.replace(/\.[^.]+$/, "");
  return `${semExtensao}${novaExtensao}`;
}
