const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

async function requisitar(caminho, opcoes, mensagemPadrao) {
  let resp;
  try {
    resp = await fetch(`${API_URL}${caminho}`, opcoes);
  } catch {
    throw new Error("API indisponível — confira se o backend está rodando (python3 run.py).");
  }

  if (!resp.ok) {
    const corpo = await resp.json().catch(() => ({}));
    const detalhe = typeof corpo.detail === "string" ? corpo.detail : mensagemPadrao;
    throw new Error(detalhe);
  }
  return resp.json();
}

export function comprimir(arquivo) {
  const form = new FormData();
  form.append("arquivo", arquivo);
  return requisitar("/comprimir", { method: "POST", body: form }, "Erro ao comprimir.");
}

export function descomprimir({ dados_comprimidos_base64, codigos, bits_de_preenchimento }) {
  return requisitar(
    "/descomprimir",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dados_comprimidos_base64, codigos, bits_de_preenchimento }),
    },
    "Erro ao descomprimir.",
  );
}
