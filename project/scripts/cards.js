// GLOBAL VARIABLES
let todasCartas = {}; // todasCartas -> allCards
let cartasFiltradas = []; // cartasFiltradas -> filteredCards
let dominiosSelecionados = []; // dominiosSelecionados -> selectedDomains

// EVENT LISTENER: Runs when the initial HTML document has been completely loaded and parsed
document.addEventListener("DOMContentLoaded", async () => {
  await carregarCartas(); // carregarCartas -> loadCards
  setupInterface();
  renderLista(); // renderLista -> renderList
  restaurarEstado(); // restaurarEstado -> restoreState

  // Checks if there's a recently viewed card in local storage to display it again
  const ultima = localStorage.getItem("ultimaCarta"); // ultimaCarta -> lastCard
  if (ultima) {
    try {
      const carta = JSON.parse(ultima); // carta -> card
      mostrarCarta(carta); // mostrarCarta -> showCard
    } catch (e) {
      console.error("Failed to parse last card from localStorage", e);
    }
  }
});

// FUNCTIONS

/**
 * Asynchronously loads card data from a JSON file.
 * Function: carregarCartas -> loadCards
 */
async function carregarCartas() {
  try {
    const res = await fetch("data/cards.json");
    todasCartas = await res.json(); // todasCartas -> allCards
  } catch (e) {
    console.error("Error loading cards.json:", e);
  }
}

/**
 * Sets up the initial user interface, including toggle buttons and filters.
 */
function setupInterface() {
  // Setup for the main card list panel toggle
  const toggleCartas = document.getElementById("toggleCartas"); // toggleCartas -> toggleCards
  const panelCartas = document.getElementById("cartasPanel"); // cartasPanel -> cardsPanel
  panelCartas.classList.add("retraido"); // retraido -> collapsed
  toggleCartas.classList.remove("aberto"); // aberto -> open
  toggleCartas.onclick = () => {
    const fechado = panelCartas.classList.toggle("retraido"); // fechado -> closed
    toggleCartas.classList.toggle("aberto", !fechado); // aberto -> open
  };

  // Setup for the "Active Cards" panel toggle
  const toggleAtivas = document.getElementById("toggleAtivas"); // toggleAtivas -> toggleActive
  const panelAtivas = document.getElementById("ativasPanel"); // ativasPanel -> activePanel
  panelAtivas.classList.add("retraido"); // retraido -> collapsed
  toggleAtivas.classList.remove("aberto"); // aberto -> open
  toggleAtivas.onclick = () => {
    const fechado = panelAtivas.classList.toggle("retraido"); // fechado -> closed
    toggleAtivas.classList.toggle("aberto", !fechado); // aberto -> open
  };

  // Setup for the "Vault" panel toggle
  const toggleVault = document.getElementById("toggleVault");
  const panelVault = document.getElementById("vaultPanel");
  panelVault.classList.add("retraido"); // retraido -> collapsed
  toggleVault.classList.remove("aberto"); // aberto -> open
  toggleVault.onclick = () => {
    const fechado = panelVault.classList.toggle("retraido"); // fechado -> closed
    toggleVault.classList.toggle("aberto", !fechado); // aberto -> open
  };

  // Creates filter buttons for each card domain
  const filtros = document.getElementById("dominioFiltros"); // dominioFiltros -> domainFilters
  Object.keys(todasCartas).forEach((dominio) => {
    // dominio -> domain
    const btn = document.createElement("button");
    btn.className = "filtro-btn"; // filtro-btn -> filter-btn
    btn.textContent = dominio;

    btn.onclick = () => {
      // Toggles the selection of a domain filter
      if (dominiosSelecionados.includes(dominio)) {
        // dominiosSelecionados -> selectedDomains
        dominiosSelecionados = dominiosSelecionados.filter(
          (d) => d !== dominio
        );
        btn.classList.remove("ativo"); // ativo -> active
      } else {
        // Allows selection of up to 2 domains
        if (dominiosSelecionados.length < 2) {
          dominiosSelecionados.push(dominio);
          btn.classList.add("ativo"); // ativo -> active
        }
      }
      renderLista(); // renderLista -> renderList
    };

    filtros.appendChild(btn);
  });

  // Setup for the "Clear Filters" button
  // ID: limparFiltros -> clearFilters
  document.getElementById("limparFiltros").onclick = () => {
    dominiosSelecionados = []; // dominiosSelecionados -> selectedDomains
    document
      .querySelectorAll(".filtro-btn")
      .forEach((btn) => btn.classList.remove("ativo")); // ativo -> active
    document.getElementById("searchInput").value = "";
    renderLista(); // renderLista -> renderList
    limparVisualizador(); // limparVisualizador -> clearViewer
  };

  // Adds an event listener to the search input to re-render the list on input
  document.getElementById("searchInput").oninput = renderLista;
}

/**
 * Renders the list of cards based on selected filters and search term.
 * Function: renderLista -> renderList
 */
function renderLista() {
  const termoBusca = document.getElementById("searchInput").value.toLowerCase(); // termoBusca -> searchTerm
  const container = document.getElementById("listaCartas"); // listaCartas -> cardList
  container.innerHTML = "";

  cartasFiltradas = []; // cartasFiltradas -> filteredCards

  // Filters all cards based on selected domains and search term
  Object.entries(todasCartas).forEach(([dominio, cartas]) => {
    // dominio -> domain, cartas -> cards
    if (
      dominiosSelecionados.length === 0 ||
      dominiosSelecionados.includes(dominio)
    ) {
      cartas.forEach((carta) => {
        // carta -> card
        if (carta.nome.toLowerCase().includes(termoBusca)) {
          // nome -> name
          cartasFiltradas.push({ ...carta, dominio });
        }
      });
    }
  });

  // Creates and appends list items for each filtered card
  cartasFiltradas.forEach((carta) => {
    // carta -> card
    const item = document.createElement("div");
    item.className = "carta-lista-item"; // carta-lista-item -> card-list-item
    item.textContent = `${carta.nome} (Nível ${carta.nivel})`; // nome -> name, Nível -> Level, nivel -> level
    item.onclick = () => mostrarCarta(carta); // mostrarCarta -> showCard
    container.appendChild(item);
  });

  // Displays the first card in the filtered list or clears the viewer if the list is empty
  if (cartasFiltradas.length > 0) {
    mostrarCarta(cartasFiltradas[0]);
  } else {
    limparVisualizador();
  }
}

/**
 * Displays a selected card in the main viewer.
 * @param {object} carta - The card object to display. (carta -> card)
 * Function: mostrarCarta -> showCard
 */
function mostrarCarta(carta) {
  try {
    // Saves the currently viewed card to localStorage
    localStorage.setItem("ultimaCarta", JSON.stringify(carta)); // ultimaCarta -> lastCard
  } catch {}

  const visualizador = document.getElementById("visualizadorCarta"); // visualizadorCarta -> cardViewer
  visualizador.classList.remove("hidden");

  document.getElementById("cartaImg").src = `images/${carta.img}`;
  // ID: adicionarBtn -> addButton
  document.getElementById("adicionarBtn").onclick = () => {
    adicionarAtiva(carta); // adicionarAtiva -> addActive
  };
}

/**
 * Clears the card viewer display.
 * Function: limparVisualizador -> clearViewer
 */
function limparVisualizador() {
  document.getElementById("visualizadorCarta").classList.add("hidden");
  document.getElementById("cartaImg").src = "";
}

/**
 * Checks if a card has already been added.
 * @param {object} carta - The card object to check. (carta -> card)
 * @returns {boolean} - True if the card is already added.
 * Function: cartaJaAdicionada -> cardAlreadyAdded
 */
function cartaJaAdicionada(carta) {
  const imgs = document.querySelectorAll(
    "#ativasConteudo img, #vaultConteudo img"
  ); // ativasConteudo -> activeContent
  return Array.from(imgs).some((img) => img.src.endsWith(carta.img));
}

/**
 * Adds a card to the "Active" section.
 * @param {object} carta - The card object to add. (carta -> card)
 * Function: adicionarAtiva -> addActive
 */
function adicionarAtiva(carta) {
  if (cartaJaAdicionada(carta)) {
    mostrarToast("This card has already been added!"); // mostrarToast -> showToast
    return;
  }
  const container = document.getElementById("ativasConteudo"); // ativasConteudo -> activeContent
  const item = criarMiniCarta(carta, "ativa"); // criarMiniCarta -> createMiniCard, "ativa" -> "active"
  container.appendChild(item);
  salvarEstado(); // salvarEstado -> saveState
}

/**
 * Adds a card to the "Vault" section.
 * @param {object} carta - The card object to add. (carta -> card)
 * Function: adicionarVault -> addVault
 */
function adicionarVault(carta) {
  if (cartaJaAdicionada(carta)) {
    mostrarToast("This card has already been added!"); // mostrarToast -> showToast
    return;
  }
  const container = document.getElementById("vaultConteudo"); // vaultConteudo -> vaultContent
  const item = criarMiniCarta(carta, "vault"); // criarMiniCarta -> createMiniCard
  container.appendChild(item);
  salvarEstado(); // salvarEstado -> saveState
}

/**
 * Moves a card to the "Vault".
 * @param {object} carta - The card object to move. (carta -> card)
 * @param {HTMLElement} elemento - The card's HTML element. (elemento -> element)
 * Function: moverParaVault -> moveToVault
 */
function moverParaVault(carta, elemento) {
  elemento.remove();
  adicionarVault(carta);
}

/**
 * Moves a card to the "Active" section.
 * @param {object} carta - The card object to move. (carta -> card)
 * @param {HTMLElement} elemento - The card's HTML element. (elemento -> element)
 * Function: moverParaAtivas -> moveToActive
 */
function moverParaAtivas(carta, elemento) {
  elemento.remove();
  adicionarAtiva(carta);
}

/**
 * Displays a confirmation modal and deletes a card element.
 * @param {HTMLElement} elemento - The card element to delete. (elemento -> element)
 * Function: deletarCarta -> deleteCard
 */
function deletarCarta(elemento) {
  let modal = document.getElementById("modalConfirmacao"); // modalConfirmacao -> confirmationModal

  if (!modal) {
    modal = document.createElement("div");
    modal.id = "modalConfirmacao";
    // ... (modal styling)
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("tabindex", "-1");
    modal.style.position = "fixed";
    modal.style.bottom = "1rem";
    modal.style.left = "50%";
    modal.style.transform = "translateX(-50%)";
    modal.style.backgroundColor = "#30363d";
    modal.style.color = "#f0f6fc";
    modal.style.padding = "1rem 1.5rem";
    modal.style.borderRadius = "6px";
    modal.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
    modal.style.fontFamily = "'Yrsa', serif";
    modal.style.zIndex = "1000";
    modal.style.textAlign = "center";
    modal.style.opacity = "1";
    modal.style.transition = "opacity 0.3s ease";

    const texto = document.createElement("p"); // texto -> text
    texto.textContent = "Are you sure you want to delete this card?";
    modal.appendChild(texto);

    const btnSim = document.createElement("button"); // btnSim -> yesButton
    btnSim.textContent = "Yes";
    // ... (button styling)
    btnSim.style.margin = "0.5rem";
    btnSim.style.padding = "0.4rem 0.8rem";
    btnSim.style.backgroundColor = "#58A6FF";
    btnSim.style.color = "#0E1117";
    btnSim.style.border = "none";
    btnSim.style.borderRadius = "4px";
    btnSim.style.cursor = "pointer";
    btnSim.onclick = () => {
      elemento.remove();
      salvarEstado(); // salvarEstado -> saveState
      modal.remove();
    };
    modal.appendChild(btnSim);

    const btnNao = document.createElement("button"); // btnNao -> noButton
    btnNao.textContent = "Cancel";
    // ... (button styling)
    btnNao.style.margin = "0.5rem";
    btnNao.style.padding = "0.4rem 0.8rem";
    btnNao.style.backgroundColor = "#21262D";
    btnNao.style.color = "#F0F6FC";
    btnNao.style.border = "1px solid #30363D";
    btnNao.style.borderRadius = "4px";
    btnNao.style.cursor = "pointer";
    btnNao.onclick = () => {
      modal.remove();
    };
    modal.appendChild(btnNao);

    document.body.appendChild(modal);
    modal.focus();
  }
}

/**
 * Creates a small card element for the "Active" or "Vault" sections.
 * @param {object} carta - The card object. (carta -> card)
 * @param {string} tipo - The type of section ('ativa' or 'vault'). (tipo -> type)
 * @returns {HTMLElement} The created mini card element.
 * Function: criarMiniCarta -> createMiniCard
 */
function criarMiniCarta(carta, tipo) {
  // Main div with class 'mini-carta' -> 'mini-card'
  const div = document.createElement("div");
  div.className = "mini-carta";

  const img = document.createElement("img");
  img.src = `images/${carta.img}`;
  div.appendChild(img);

  // div for controls with class 'mini-controles' -> 'mini-controls'
  const controls = document.createElement("div");
  controls.className = "mini-controles";

  const delBtn = document.createElement("button");
  delBtn.className = "icon-btn";
  
  delBtn.title = "Delete";
  // SVG for a trash can icon.
  delBtn.innerHTML = `
 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
 <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>
</svg>
 `;
  // onclick calls 'deletarCarta' -> 'deleteCard'
  delBtn.onclick = () => deletarCarta(div);
  controls.appendChild(delBtn);

  // 'trocaBtn' -> 'swapButton' or 'moveButton'
  const trocaBtn = document.createElement("button");
  trocaBtn.className = "icon-btn";
  // Title depends on 'tipo' ('type'): if 'ativa' ('active'), title is 'Move to Vault' , else 'Move to Active' 
  trocaBtn.title = tipo === "ativa" ? "Move to Vault" : "Move to Active";
  // The following innerHTML assignment contains the SVG for the move icon.
  trocaBtn.innerHTML =
    tipo === "ativa" // if tipo (type) is 'ativa' (active), use down-arrow SVG
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
<path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
<path d="M6 15l6-6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>`; // else, use up-arrow SVG
  trocaBtn.onclick = () => {
    if (tipo === "ativa") {
      // if tipo (type) is 'ativa' (active)
      moverParaVault(carta, div); // call 'moverParaVault' -> 'moveToVault'
    } else {
      moverParaAtivas(carta, div); // call 'moverParaAtivas' -> 'moveToActive'
    }
  };
  controls.appendChild(trocaBtn);

  div.appendChild(controls);
  return div;
}

/**
 * Saves the current state of "Active" and "Vault" cards to localStorage.
 * Function: salvarEstado -> saveState
 */
function salvarEstado() {
  const ativas = Array.from(
    document.querySelectorAll("#ativasConteudo img")
  ).map((img) => img.src); // ativas -> active (list)
  const vault = Array.from(document.querySelectorAll("#vaultConteudo img")).map(
    (img) => img.src
  );
  localStorage.setItem("cartasAtivas", JSON.stringify(ativas)); // cartasAtivas -> activeCards
  localStorage.setItem("cartasVault", JSON.stringify(vault)); // cartasVault -> vaultCards
}

/**
 * Restores the state of "Active" and "Vault" cards from localStorage.
 * Function: restaurarEstado -> restoreState
 */
function restaurarEstado() {
  const ativas = JSON.parse(localStorage.getItem("cartasAtivas") || "[]"); // cartasAtivas -> activeCards
  const vault = JSON.parse(localStorage.getItem("cartasVault") || "[]"); // cartasVault -> vaultCards

  ativas.forEach((src) => {
    const nome = src.split("/").pop(); // nome -> name
    const carta = encontrarCartaPorImagem(nome); // encontrarCartaPorImagem -> findCardByImage
    if (carta) adicionarAtiva(carta);
  });

  vault.forEach((src) => {
    const nome = src.split("/").pop(); // nome -> name
    const carta = encontrarCartaPorImagem(nome); // encontrarCartaPorImagem -> findCardByImage
    if (carta) adicionarVault(carta);
  });
}

/**
 * Finds a card object by its image file name.
 * @param {string} nomeImg - The image file name. (nomeImg -> imageName)
 * @returns {object|null} - The found card object or null.
 * Function: encontrarCartaPorImagem -> findCardByImage
 */
function encontrarCartaPorImagem(nomeImg) {
  for (const cartas of Object.values(todasCartas)) {
    // cartas -> cards
    const encontrada = cartas.find((c) => c.img === nomeImg); // encontrada -> found
    if (encontrada) return encontrada;
  }
  return null;
}

/**
 * Displays a short-lived notification message (a "toast").
 * @param {string} texto - The message text to display. (texto -> text)
 * Function: mostrarToast -> showToast
 */
function mostrarToast(texto) {
  let toast = document.getElementById("toastAviso"); // toastAviso -> toastNotification
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toastAviso";
    // ... (toast styling)
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

// Event listener for the mobile navigation menu toggle
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  toggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
});
