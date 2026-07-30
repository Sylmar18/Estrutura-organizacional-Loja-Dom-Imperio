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
    let valorVendas = 0;
    let despesas = 0;

    const produtos = {};

    lista.forEach(item => {

        if(item.movimento === "Venda"){

            vendas += item.quantidade || 0;
            valorVendas += item.total || 0;

        }

        if(item.movimento === "Despesa"){

            despesas += item.totalDespesa || 0;

        }

        if(!produtos[item.produto]){

            produtos[item.produto] = {
                quantidade:0,
                faturamento:0
            };

        }

        produtos[item.produto].quantidade += item.quantidade || 0;
        produtos[item.produto].faturamento += item.total || 0;

    });

    document.getElementById("produtosVendidos").textContent = vendas;

    document.getElementById("totalDespesas").textContent =
        "R$ " + despesas.toFixed(2);

    document.getElementById("movimentacoes").textContent =
        lista.length;

    document.getElementById("lucroMes").textContent =
        "R$ " + (valorVendas - despesas).toFixed(2);

    const tabelaProdutos =
        document.getElementById("tabelaProdutosVendidos");

    tabelaProdutos.innerHTML = "";

    for(let nome in produtos){

        tabelaProdutos.innerHTML += `
            <tr>

                <td>${nome}</td>

                <td>${produtos[nome].quantidade}</td>

                <td>
                    R$ ${produtos[nome].faturamento.toFixed(2)}
                </td>

            </tr>
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

            <td>${item.movimento === "Despesa" ? "Despesa" : "Venda"}</td>

            <td>${item.movimento}</td>

            <td>${item.produto}</td>

            <td>${item.quantidade}</td>

            <td>R$ ${(item.total || item.totalDespesa || 0).toFixed(2)}</td>

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