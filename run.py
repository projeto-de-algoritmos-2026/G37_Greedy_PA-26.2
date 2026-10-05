import shutil
import subprocess
import sys
from pathlib import Path

RAIZ = Path(__file__).parent
BACKEND_DIR = RAIZ / "backend"
FRONTEND_DIR = RAIZ / "frontend"


def subir_frontend():
    npm = shutil.which("npm")
    if npm is None:
        print("npm nao encontrado -- instale o Node.js 18+ para subir o frontend.")
        print("Seguindo so com o backend.\n")
        return None

    if not (FRONTEND_DIR / "node_modules").exists():
        print("Instalando dependencias do frontend (npm install)...\n")
        subprocess.run([npm, "install"], cwd=FRONTEND_DIR, check=True)

    print("Subindo frontend (porta 5173)...\n")
    return subprocess.Popen([npm, "run", "dev", "--", "--port", "5173", "--strictPort"], cwd=FRONTEND_DIR)


def main():
    print("Subindo backend (porta 8000)...\n")
    processos = [subprocess.Popen([sys.executable, "main.py"], cwd=BACKEND_DIR)]

    processo_frontend = subir_frontend()
    if processo_frontend is not None:
        processos.append(processo_frontend)
        print("\nFrontend: http://localhost:5173")

    print("Backend: http://127.0.0.1:8000")
    print("Documentacao: http://127.0.0.1:8000/docs")
    print("\nCtrl+C para parar.\n")

    try:
        processos[0].wait()
    except KeyboardInterrupt:
        print("\nEncerrando...")
    finally:
        for processo in processos:
            processo.terminate()


if __name__ == "__main__":
    main()
