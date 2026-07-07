// =====================================
// CLIENTES.JS
// =====================================

let clientes = [];

// ELEMENTOS
const grid = document.querySelector(".clientes-grid");
const inputBusca = document.getElementById("buscarCliente");
const filtroStatus = document.getElementById("filtroStatus");
const btnNovo = document.querySelector(".btn-novo");

// =====================================
// INICIALIZAÇÃO
// =====================================

document.addEventListener("DOMContentLoaded", async () => {

    await abrirBanco();

    await carregarClientes();

    iniciarEventos();

});

// =====================================
// EVENTOS
// =====================================

function iniciarEventos(){

    inputBusca.addEventListener("input", aplicarFiltros);

    filtroStatus.addEventListener("change", aplicarFiltros);

    btnNovo.addEventListener("click", novoCliente);

}

// =====================================
// CARREGAR CLIENTES
// =====================================

async function carregarClientes(){

    clientes = await listar("clientes");

    renderClientes(clientes);

}

// =====================================
// RENDER
// =====================================

function renderClientes(lista){

    grid.innerHTML="";

    if(lista.length===0){

        grid.innerHTML="<p style='color:white;'>Nenhum cliente cadastrado.</p>";

        return;

    }

    lista.forEach(cliente=>{

        const card=document.createElement("div");

        card.className="card-cliente";

        card.innerHTML=`

            <h3>${cliente.nome}</h3>

            <p><i class="fa-solid fa-phone"></i> ${cliente.telefone}</p>

            <p><i class="fa-solid fa-location-dot"></i> ${cliente.cidade}</p>

            <span class="status ${cliente.status}">
                ${cliente.status}
            </span>

            <div class="btn-card">

                <button class="editar"
                onclick="editarCliente(${cliente.id})">

                Editar

                </button>

                <button class="pedidos"
                onclick="verPedidos(${cliente.id})">

                Pedidos

                </button>

                <button class="excluir"
                onclick="deletarCliente(${cliente.id})">

                Excluir

                </button>

            </div>

        `;

        grid.appendChild(card);

    });

}

// =====================================
// FILTROS
// =====================================

function aplicarFiltros(){

    const texto=inputBusca.value.toLowerCase();

    const status=filtroStatus.value;

    let lista=clientes.filter(cliente=>{

        const nome=cliente.nome.toLowerCase().includes(texto);

        const situacao=status==="todos" || cliente.status===status;

        return nome && situacao;

    });

    renderClientes(lista);

}

// =====================================
// NOVO CLIENTE
// =====================================

async function novoCliente(){

    const nome=prompt("Nome do cliente:");

    if(!nome) return;

    const telefone=prompt("Telefone:");

    const cidade=prompt("Cidade:");

    const status=prompt("Status (ativo/inativo/bloqueado):","ativo");

    await adicionar("clientes",{

        nome,

        telefone,

        cidade,

        status

    });

    await carregarClientes();

}

// =====================================
// EDITAR
// =====================================

window.editarCliente=async function(id){

    const cliente=await buscar("clientes",id);

    if(!cliente) return;

    cliente.nome=prompt("Nome:",cliente.nome);

    cliente.telefone=prompt("Telefone:",cliente.telefone);

    cliente.cidade=prompt("Cidade:",cliente.cidade);

    cliente.status=prompt("Status:",cliente.status);

    await atualizar("clientes",cliente);

    await carregarClientes();

}

// =====================================
// EXCLUIR
// =====================================

window.deletarCliente=async function(id){

    if(!confirm("Deseja excluir este cliente?")) return;

    await excluir("clientes",id);

    await carregarClientes();

}

// =====================================
// PEDIDOS
// =====================================

window.verPedidos=function(id){

    alert("Abrir pedidos do cliente: "+id);

}