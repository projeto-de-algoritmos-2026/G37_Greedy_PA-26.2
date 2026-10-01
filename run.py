import subprocess
import sys
from pathlib import Path

RAIZ = Path(__file__).parent
BACKEND_DIR = RAIZ / "backend"


def main():
    print("Subindo backend (porta 8000)...\n")

    processo_backend = subprocess.Popen(
        [sys.executable, "main.py"],
        cwd=BACKEND_DIR,
    )

    print("\nBackend: http://127.0.0.1:8000")
    print("Documentacao: http://127.0.0.1:8000/docs")
    print("\nCtrl+C para parar.\n")

    try:
        processo_backend.wait()
    except KeyboardInterrupt:
        print("\nEncerrando...")
        processo_backend.terminate()


if __name__ == "__main__":
    main()