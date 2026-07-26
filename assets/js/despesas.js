let despesas = [];

// ==============================
// CADASTRAR DESPESA
// ==============================

async function cadastrarDespesa() {

    const mes = document.getElementById("mesRemessa").value;

    const camisas = Number(document.getElementById("camisas").value) || 0;
    const valorCamisas = Number(document.getElementById("valorCamisas").value) || 0;

    const shorts = Number(document.getElementById("shorts").value) || 0;
    const valorShorts = Number(document.getElementById("valorShorts").value) || 0;

    const conjuntos = Number(document.getElementById("conjuntos").value) || 0;
    const valorConjuntos = Number(document.getElementById("valorConjuntos").value) || 0;

    const calcas = Number(document.getElementById("calcas").value) || 0;
    const valorCalcas = Number(document.getElementById("valorCalcas").value) || 0;

    const bolsas = Number(document.getElementById("bolsas").value) || 0;
    const valorBolsas = Number(document.getElementById("valorBolsas").value) || 0;

    if (mes === "") {

        alert("Informe o mês da remessa.");
        return;

    }

    // Totais por produto

    const despesa = {

    mes,

    camisas,
    valorCamisas,

    shorts,
    valorShorts,

    conjuntos,
    valorConjuntos,

    calcas,
    valorCalcas,

    bolsas,
    valorBolsas,

    totalGasto: 0,

    dataCadastro: new Date().toLocaleString()

};

    const totalCamisas = camisas * valorCamisas;
    const totalShorts = shorts * valorShorts;
    const totalConjuntos = conjuntos * valorConjuntos;
    const totalCalcas = calcas * valorCalcas;
    const totalBolsas = bolsas * valorBolsas;

  
    despesa.totalGasto =

    (despesa.camisas * despesa.valorCamisas) +
    (despesa.shorts * despesa.valorShorts) +
    (despesa.conjuntos * despesa.valorConjuntos) +
    (despesa.calcas * despesa.valorCalcas) +
    (despesa.bolsas * despesa.valorBolsas);





    await adicionar("despesas", despesa);

    const agora = new Date();

    await adicionar("historico", {

        movimento: "Despesa",

        produto: "Remessa",

        quantidade:
            camisas +
            shorts +
            conjuntos +
            calcas +
            bolsas,

        total: 0,

        totalDespesa: despesa.totalGasto,

        data: agora.toLocaleDateString("pt-BR"),

        mes: agora.toLocaleDateString("pt-BR", {
            month: "long",
            year: "numeric"
        })

    });

    despesas = await listar("despesas");

    atualizarTabela();

    atualizarResumo();

    limparFormulario();

}

// ==============================
// LIMPAR FORMULÁRIO
// ==============================

function limparFormulario() {

    document.getElementById("mesRemessa").value = "";

    document.getElementById("camisas").value = "";
    document.getElementById("valorCamisas").value = "";

    document.getElementById("shorts").value = "";
    document.getElementById("valorShorts").value = "";

    document.getElementById("conjuntos").value = "";
    document.getElementById("valorConjuntos").value = "";

    document.getElementById("calcas").value = "";
    document.getElementById("valorCalcas").value = "";

    document.getElementById("bolsas").value = "";
    document.getElementById("valorBolsas").value = "";

}

// ==============================
// TABELA
// ==============================

function atualizarTabela() {

    const tabela =
        document.getElementById("tabelaDespesas");

    tabela.innerHTML = "";

    despesas.forEach((despesa, index) => {

        tabela.innerHTML += `

        <tr>

            <td>${despesa.mes}</td>

            <td>${despesa.camisas}</td>


            <td>${despesa.camisas} × R$ ${despesa.valorCamisas.toFixed(2)}</td>

            <td>${despesa.shorts}</td>

            <td>R$ ${despesa.shorts} × R$ ${despesa.valorShorts.toFixed(2)}</td>

            <td>${despesa.conjuntos}</td>

            <td>R$ ${despesa.conjuntos} × R$ ${despesa.valorConjuntos.toFixed(2)}</td>

            <td>${despesa.calcas}</td>

            <td>R$ ${despesa.calcas} × R$ ${despesa.valorCalcas.toFixed(2)}</td>

            <td>${despesa.bolsas}</td>

            <td>R$ ${despesa.bolsas} × R$ ${despesa.valorBolsas.toFixed(2)}</td>

            <td><strong>R$ ${despesa.totalGasto.toFixed(2)}</strong></td>

            <td>

                <button
                    class="btn editar"
                    onclick="editarDespesa(${index})">
                    Editar
                </button>

                <button
                    class="btn excluir"
                    onclick="excluirDespesa(${index})">
                    Excluir
                </button>

            </td>

        </tr>

        `;

    });

}

// ==============================
// EDITAR
// ==============================

async function editarDespesa(index) {

    let despesa = despesas[index];

    let novoValor = prompt(
        "Novo valor total das camisas:",
        despesa.valorCamisas
    );

    if (novoValor === null) return;

    despesa.valorCamisas = Number(novoValor);

    
    despesa.totalGasto =

    (despesa.camisas * despesa.valorCamisas) +
    (despesa.shorts * despesa.valorShorts) +
    (despesa.conjuntos * despesa.valorConjuntos) +
    (despesa.calcas * despesa.valorCalcas) +
    (despesa.bolsas * despesa.valorBolsas);

    await atualizar("despesas", despesa);

    despesas = await listar("despesas");

    atualizarTabela();

    atualizarResumo();

}

// ==============================
// EXCLUIR
// ==============================

async function excluirDespesa(index) {

    if (!confirm("Excluir despesa?"))
        return;

    await excluir(
        "despesas",
        despesas[index].id
    );

    despesas = await listar("despesas");

    atualizarTabela();

    atualizarResumo();

}

// ==============================
// RESUMO
// ==============================

function atualizarResumo() {

    let total = 0;

    despesas.forEach(d => {

        total += d.totalGasto;

    });


    const elemento = document.getElementById("totalDespesas");


    if(elemento){

        elemento.textContent =
        "R$ " + total.toFixed(2);

    }

}

// ==============================
// INICIAR
// ==============================

document.addEventListener("DOMContentLoaded", async () => {

    await abrirBanco();

    despesas = await listar("despesas");

    atualizarTabela();

    atualizarResumo();

});