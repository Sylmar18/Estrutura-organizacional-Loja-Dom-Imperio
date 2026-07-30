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

   
    // Totais

const totalCamisas = camisas * valorCamisas;
const totalShorts = shorts * valorShorts;
const totalConjuntos = conjuntos * valorConjuntos;
const totalCalcas = calcas * valorCalcas;
const totalBolsas = bolsas * valorBolsas;

const totalPecas =
    camisas +
    shorts +
    conjuntos +
    calcas +
    bolsas;

const totalGasto =
    totalCamisas +
    totalShorts +
    totalConjuntos +
    totalCalcas +
    totalBolsas;

const custoMedio =
    totalPecas > 0
        ? totalGasto / totalPecas
        : 0;


// OBJETO

const despesa = {

    mes,

    camisas,
    valorCamisas,
    totalCamisas,

    shorts,
    valorShorts,
    totalShorts,

    conjuntos,
    valorConjuntos,
    totalConjuntos,

    calcas,
    valorCalcas,
    totalCalcas,

    bolsas,
    valorBolsas,
    totalBolsas,

    totalPecas,

    custoMedio,

    totalGasto,

    dataCadastro:
        new Date().toLocaleString()

};


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


function atualizarTabela(){

    const tabela =
    document.getElementById("tabelaDespesas");

    tabela.innerHTML = "";

    despesas.forEach((despesa,index)=>{

        tabela.innerHTML += `

        <tr>

            <td>${despesa.mes}</td>

            <td>${despesa.totalPecas || 0}</td>

            <td>R$ ${(despesa.totalGasto || 0).toFixed(2)}</td>

            <td>R$ ${(despesa.custoMedio || 0).toFixed(2)}</td>

            <td>

                <button
                class="btn detalhes"
                onclick="verDetalhes(${index})">
                    <i class="fa-solid fa-eye"></i>
                </button>

                <button
                class="btn editar"
                onclick="editarDespesa(${index})">
                    <i class="fa-solid fa-pen"></i>
                </button>

                <button
                class="btn excluir"
                onclick="excluirDespesa(${index})">
                    <i class="fa-solid fa-trash"></i>
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

function verDetalhes(index){

    const d = despesas[index];

    document.getElementById("conteudoModal").innerHTML = `

<h3>${d.mes}</h3>

<table class="tabela-detalhes">

<tr>

<th>Produto</th>

<th>Quantidade</th>

<th>Valor Pago</th>

</tr>

<tr>

<td>👕 Camisas</td>

<td>${d.camisas}</td>

<td>R$ ${(d.totalCamisas || 0).toFixed(2)}</td>

</tr>

<tr>

<td>🩳 Shorts</td>

<td>${d.shorts}</td>

<td>R$ ${(d.totalShorts || 0).toFixed(2)}</td>

</tr>

<tr>

<td>👔 Conjuntos</td>

<td>${d.conjuntos}</td>

<td>R$ ${(d.totalConjuntos || 0).toFixed(2)}</td>

</tr>

<tr>

<td>👖 Calças</td>

<td>${d.calcas}</td>

<td>R$ ${(d.totalCalcas || 0).toFixed(2)}</td>

</tr>

<tr>

<td>🎒 Bolsas</td>

<td>${d.bolsas}</td>

<td>R$ ${(d.totalBolsas || 0).toFixed(2)}</td>

</tr>

</table>

<hr>

<div class="resumo-remessa">

<p>

<strong>Total de peças:</strong>

${d.totalPecas || 0}

</p>

<p>

<strong>Total Investido:</strong>

R$ ${(d.totalGasto || 0).toFixed(2)}

</p>

<p>

<strong>Custo Médio:</strong>

R$ ${(d.custoMedio || 0).toFixed(2)}

</p>

</div>

`;

    document.getElementById("modalDetalhes").style.display = "flex";

}

function fecharModal(){

    document.getElementById("modalDetalhes").style.display = "none";

}

window.onclick = function(event){

    const modal =
    document.getElementById("modalDetalhes");

    if(event.target === modal){

        modal.style.display = "none";

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