
// ==========================
// CARREGAR CLIENTES
// ==========================
let clientes = JSON.parse(localStorage.getItem("clientes")) || [];

// ==========================
// DOM
// ==========================
document.addEventListener("DOMContentLoaded", () => {

  const grid = document.querySelector(".clientes-grid");
  const inputBusca = document.getElementById("buscarCliente");
  const filtroStatus = document.getElementById("filtroStatus");
  const btnNovo = document.querySelector(".btn-novo");

  // ==========================
  // SALVAR LOCALSTORAGE
  // ==========================
  function salvar() {
    localStorage.setItem("clientes", JSON.stringify(clientes));
  }

  // ==========================
  // GERAR ID
  // ==========================
  function gerarId() {
    return Date.now().toString();
  }

  // ==========================
  // RENDER
  // ==========================
  function renderClientes(lista) {
    grid.innerHTML = "";

    if (lista.length === 0) {
      grid.innerHTML = "<p style='color:white;'>Nenhum cliente encontrado</p>";
      return;
    }

    lista.forEach((cliente) => {
      const card = document.createElement("div");
      card.classList.add("card-cliente");

      card.innerHTML = `
        <h3><i class="fa fa-user"></i> ${cliente.nome}</h3>

        <p><i class="fa fa-phone"></i> ${cliente.telefone}</p>
        <p><i class="fa fa-envelope"></i> ${cliente.email || "-"}</p>
        <p><i class="fa fa-map-marker"></i> ${cliente.cidade}</p>

        <span class="status ${cliente.status}">
          ${cliente.status}
        </span>

        <div class="btn-card">
          <button class="editar" onclick="editarCliente('${cliente.id}')">Editar</button>
          <button class="pedidos" onclick="verPedidos('${cliente.id}')">Pedidos</button>
          <button class="excluir" onclick="deletarCliente('${cliente.id}')">Excluir</button>
        </div>
      `;

      grid.appendChild(card);
    });
  }

  // ==========================
  // FILTROS
  // ==========================
  function aplicarFiltros() {
    let filtrados = [...clientes];

    const texto = inputBusca.value.toLowerCase();
    const status = filtroStatus.value;

    if (texto) {
      filtrados = filtrados.filter(c =>
        c.nome.toLowerCase().includes(texto)
      );
    }

    if (status !== "todos") {
      filtrados = filtrados.filter(c => c.status === status);
    }

    renderClientes(filtrados);
  }

  inputBusca.addEventListener("input", aplicarFiltros);
  filtroStatus.addEventListener("change", aplicarFiltros);

  // ==========================
  // CREATE (NOVO CLIENTE)
  // ==========================
  btnNovo.addEventListener("click", () => {

    const nome = prompt("Nome do cliente:");
    if (!nome) return;

    const telefone = prompt("Telefone:");
    const email = prompt("Email:");
    const cidade = prompt("Cidade:");
    const status = prompt("Status (ativo, inativo, bloqueado):", "ativo");

    const novoCliente = {
      id: gerarId(),
      nome,
      telefone,
      email,
      cidade,
      status
    };

    clientes.push(novoCliente);
    salvar();
    renderClientes(clientes);
  });

  // ==========================
  // UPDATE
  // ==========================
  window.editarCliente = function (id) {

    const cliente = clientes.find(c => c.id === id);
    if (!cliente) return;

    const nome = prompt("Editar nome:", cliente.nome);
    const telefone = prompt("Editar telefone:", cliente.telefone);
    const email = prompt("Editar email:", cliente.email);
    const cidade = prompt("Editar cidade:", cliente.cidade);
    const status = prompt("Editar status:", cliente.status);

    cliente.nome = nome;
    cliente.telefone = telefone;
    cliente.email = email;
    cliente.cidade = cidade;
    cliente.status = status;

    salvar();
    renderClientes(clientes);
  };

  // ==========================
  // DELETE
  // ==========================
  window.deletarCliente = function (id) {

    const confirmar = confirm("Deseja realmente excluir este cliente?");
    if (!confirmar) return;

    clientes = clientes.filter(c => c.id !== id);

    salvar();
    renderClientes(clientes);
  };

  // ==========================
  // OUTRO BOTÃO
  // ==========================
  window.verPedidos = function (id) {
    alert("Ver pedidos do cliente: " + id);
  };

  // ==========================
  // INIT
  // ==========================
  renderClientes(clientes);

});