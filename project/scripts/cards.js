let todasCartas = {};
let cartasFiltradas = [];
let dominiosSelecionados = [];

document.addEventListener("DOMContentLoaded", async () => {
  await carregarCartas();
  setupInterface();
  renderLista();
  restaurarEstado();

  const ultima = localStorage.getItem("ultimaCarta");
  if (ultima) {
    try {
      const carta = JSON.parse(ultima);
      mostrarCarta(carta);
    } catch {}
  }
});

async function carregarCartas() {
  try {
    const res = await fetch("data/cards.json");
    todasCartas = await res.json();
  } catch (e) {
    console.error("Error to load cards.json:", e);
  }
}

function setupInterface() {
  const toggleCartas = document.getElementById("toggleCartas");
  const panelCartas = document.getElementById("cartasPanel");
  panelCartas.classList.add("retraido");
  toggleCartas.classList.remove("aberto");
  toggleCartas.onclick = () => {
    const fechado = panelCartas.classList.toggle("retraido");
    toggleCartas.classList.toggle("aberto", !fechado);
  };

  const toggleAtivas = document.getElementById("toggleAtivas");
  const panelAtivas = document.getElementById("ativasPanel");
  panelAtivas.classList.add("retraido");
  toggleAtivas.classList.remove("aberto");
  toggleAtivas.onclick = () => {
    const fechado = panelAtivas.classList.toggle("retraido");
    toggleAtivas.classList.toggle("aberto", !fechado);
  };

  const toggleVault = document.getElementById("toggleVault");
  const panelVault = document.getElementById("vaultPanel");
  panelVault.classList.add("retraido");
  toggleVault.classList.remove("aberto");
  toggleVault.onclick = () => {
    const fechado = panelVault.classList.toggle("retraido");
    toggleVault.classList.toggle("aberto", !fechado);
  };

  const filtros = document.getElementById("dominioFiltros");
  Object.keys(todasCartas).forEach((dominio) => {
    const btn = document.createElement("button");
    btn.className = "filtro-btn";
    btn.textContent = dominio;

    btn.onclick = () => {
      if (dominiosSelecionados.includes(dominio)) {
        dominiosSelecionados = dominiosSelecionados.filter((d) => d !== dominio);
        btn.classList.remove("ativo");
      } else {
        if (dominiosSelecionados.length < 2) {
          dominiosSelecionados.push(dominio);
          btn.classList.add("ativo");
        }
      }
      renderLista();
    };

    filtros.appendChild(btn);
  });

  document.getElementById("limparFiltros").onclick = () => {
    dominiosSelecionados = [];
    document.querySelectorAll(".filtro-btn").forEach((btn) => btn.classList.remove("ativo"));
    document.getElementById("searchInput").value = "";
    renderLista();
    limparVisualizador();
  };

  document.getElementById("searchInput").oninput = renderLista;
}

function renderLista() {
  const termoBusca = document.getElementById("searchInput").value.toLowerCase();
  const container = document.getElementById("listaCartas");
  container.innerHTML = "";

  cartasFiltradas = [];

  Object.entries(todasCartas).forEach(([dominio, cartas]) => {
    if (dominiosSelecionados.length === 0 || dominiosSelecionados.includes(dominio)) {
      cartas.forEach((carta) => {
        if (carta.nome.toLowerCase().includes(termoBusca)) {
          cartasFiltradas.push({ ...carta, dominio });
        }
      });
    }
  });

  cartasFiltradas.forEach((carta) => {
    const item = document.createElement("div");
    item.className = "carta-lista-item";
    item.textContent = `${carta.nome} (Nível ${carta.nivel})`;
    item.onclick = () => mostrarCarta(carta);
    container.appendChild(item);
  });

  if (cartasFiltradas.length > 0) {
    mostrarCarta(cartasFiltradas[0]);
  } else {
    limparVisualizador();
  }
}

function mostrarCarta(carta) {
  try {
    localStorage.setItem("ultimaCarta", JSON.stringify(carta));
  } catch {}

  const visualizador = document.getElementById("visualizadorCarta");
  visualizador.classList.remove("hidden");

  document.getElementById("cartaImg").src = `images/${carta.img}`;
  document.getElementById("adicionarBtn").onclick = () => {
    adicionarAtiva(carta);
  };
}

function limparVisualizador() {
  document.getElementById("visualizadorCarta").classList.add("hidden");
  document.getElementById("cartaImg").src = "";
}

function cartaJaAdicionada(carta) {
  const imgs = document.querySelectorAll("#ativasConteudo img, #vaultConteudo img");
  return Array.from(imgs).some((img) => img.src.endsWith(carta.img));
}

function adicionarAtiva(carta) {
  if (cartaJaAdicionada(carta)) {
    mostrarToast("This card has already been added!");
    return;
  }
  const container = document.getElementById("ativasConteudo");
  const item = criarMiniCarta(carta, "ativa");
  container.appendChild(item);
  salvarEstado();
}

function adicionarVault(carta) {
  if (cartaJaAdicionada(carta)) {
    mostrarToast("This card has already been added!");
    return;
  }
  const container = document.getElementById("vaultConteudo");
  const item = criarMiniCarta(carta, "vault");
  container.appendChild(item);
  salvarEstado();
}

function moverParaVault(carta, elemento) {
  elemento.remove();
  adicionarVault(carta);
}

function moverParaAtivas(carta, elemento) {
  elemento.remove();
  adicionarAtiva(carta);
}

function deletarCarta(elemento) {
  if (confirm("Tem certeza que deseja excluir esta carta?")) {
    elemento.remove();
    salvarEstado();
  }
}

function criarMiniCarta(carta, tipo) {
  const div = document.createElement("div");
  div.className = "mini-carta";

  const img = document.createElement("img");
  img.src = `images/${carta.img}`;
  div.appendChild(img);

  const controls = document.createElement("div");
  controls.className = "mini-controles";

  const delBtn = document.createElement("button");
  delBtn.className = "icon-btn";
  delBtn.title = "Remover";
  delBtn.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M6 7h12M9 7v10m6-10v10M10 4h4m-6 0h8M4 7h16v2H4z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `;
  delBtn.onclick = () => deletarCarta(div);
  controls.appendChild(delBtn);

  const trocaBtn = document.createElement("button");
  trocaBtn.className = "icon-btn";
  trocaBtn.title = tipo === "ativa" ? "Mover para Vault" : "Mover para Ativas";
  trocaBtn.innerHTML =
    tipo === "ativa"
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
           <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
         </svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
           <path d="M6 15l6-6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
         </svg>`;
  trocaBtn.onclick = () => {
    if (tipo === "ativa") {
      moverParaVault(carta, div);
    } else {
      moverParaAtivas(carta, div);
    }
  };
  controls.appendChild(trocaBtn);

  div.appendChild(controls);
  return div;
}

function salvarEstado() {
  const ativas = Array.from(document.querySelectorAll("#ativasConteudo img")).map((img) => img.src);
  const vault = Array.from(document.querySelectorAll("#vaultConteudo img")).map((img) => img.src);
  localStorage.setItem("cartasAtivas", JSON.stringify(ativas));
  localStorage.setItem("cartasVault", JSON.stringify(vault));
}

function restaurarEstado() {
  const ativas = JSON.parse(localStorage.getItem("cartasAtivas") || "[]");
  const vault = JSON.parse(localStorage.getItem("cartasVault") || "[]");

  ativas.forEach((src) => {
    const nome = src.split("/").pop();
    const carta = encontrarCartaPorImagem(nome);
    if (carta) adicionarAtiva(carta);
  });

  vault.forEach((src) => {
    const nome = src.split("/").pop();
    const carta = encontrarCartaPorImagem(nome);
    if (carta) adicionarVault(carta);
  });
}

function encontrarCartaPorImagem(nomeImg) {
  for (const cartas of Object.values(todasCartas)) {
    const encontrada = cartas.find((c) => c.img === nomeImg);
    if (encontrada) return encontrada;
  }
  return null;
}

function mostrarToast(texto) {
  let toast = document.getElementById("toastAviso");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toastAviso";
    toast.style.position = "fixed";
    toast.style.bottom = "1rem";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.backgroundColor = "#30363d";
    toast.style.color = "#f0f6fc";
    toast.style.padding = "0.6rem 1.2rem";
    toast.style.borderRadius = "6px";
    toast.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
    toast.style.fontFamily = "'Yrsa', serif";
    toast.style.zIndex = "1000";
    document.body.appendChild(toast);
  }

  toast.textContent = texto;
  toast.style.opacity = "1";
  toast.style.transition = "opacity 0.3s ease";

  setTimeout(() => {
    toast.style.opacity = "0";
  }, 1800);
}

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  toggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
});
