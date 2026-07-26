let historico = [];

// ======================================
// CARREGAR HISTÓRICO
// ======================================

async function carregarHistorico() {

    historico = await listar("historico");

    preencherFiltro();

    atualizarHistorico();

}

// ======================================
// PREENCHER FILTRO DE MESES
// ======================================

function preencherFiltro() {

    const filtro =
        document.getElementById("filtroMes");

    filtro.innerHTML =
        '<option value="">Todos os meses</option>';

    const meses = [
        ...new Set(
            historico.map(item => item.mes)
        )
    ];

    meses.sort();

    meses.forEach(mes => {

        filtro.innerHTML += `
            <option value="${mes}">
                ${mes}
            </option>
        `;

    });

}

// ======================================
// ATUALIZAR TELA
// ======================================

function atualizarHistorico() {

    const filtro =
        document.getElementById("filtroMes").value;

    let dados = historico;

    if(filtro !== ""){

        dados =
        historico.filter(
            h => h.mes === filtro
        );

    }

    atualizarResumo(dados);

    atualizarTabela(dados);

}

// ======================================
// RESUMO
// ======================================

function atualizarResumo(lista){

    let vendas = 0;

    let despesas = 0;

    const produtos = {};

    lista.forEach(item=>{

        vendas += item.quantidade || 0;

        despesas += item.totalDespesa || 0;

        if(!produtos[item.produto]){

            produtos[item.produto] = 0;

        }

        produtos[item.produto] +=
        item.quantidade;

    });

    document.getElementById("totalVendas")
    .textContent = vendas;

    document.getElementById("totalDespesas")
    .textContent =
    "R$ " + despesas.toFixed(2);

    const listaProdutos =
    document.getElementById("vendasProdutos");

    listaProdutos.innerHTML = "";

    for(let nome in produtos){

        listaProdutos.innerHTML += `
            <li>
                ${nome}
                <strong>
                    ${produtos[nome]}
                </strong>
            </li>
        `;

    }

}

// ======================================
// TABELA
// ======================================

function atualizarTabela(lista){

    const tabela =
    document.getElementById("tabelaHistorico");

    tabela.innerHTML = "";

    lista.forEach(item=>{

        tabela.innerHTML += `

        <tr>

            <td>${item.data}</td>

            <td>${item.mes}</td>

            <td>${item.produto}</td>

            <td>${item.quantidade}</td>

            <td>R$ ${item.total.toFixed(2)}</td>

            <td>R$ ${(item.totalDespesa || 0).toFixed(2)}</td>

        </tr>

        `;

    });

}

// ======================================
// EVENTOS
// ======================================

document
.getElementById("filtroMes")
.addEventListener(
    "change",
    atualizarHistorico
);

// ======================================
// INICIAR
// ======================================

document.addEventListener(
    "DOMContentLoaded",
    async ()=>{

        await abrirBanco();

        await carregarHistorico();

    }
);