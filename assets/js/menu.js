let produtos = [];
let clientes = [];
let pedidos = [];
let despesas = [];

async function atualizarMenu(){

produtos = await listar("produtos");

clientes = await listar("clientes");

pedidos = await listar("pedidos");

despesas = await listar("despesas");

    // Cards principais

  
    const totalProdutos = document.getElementById("totalProdutos");
if(totalProdutos){
    totalProdutos.textContent = produtos.length;
}

const totalClientes = document.getElementById("totalClientes");
if(totalClientes){
    totalClientes.textContent =  clientes.length;
}

const totalPedidos= document.getElementById("totalPedidos");
if(totalPedidos){
    totalPedidos.textContent = pedidos.length;
}

    let faturamento = 0;
    let recebido = 0;
    let receber = 0;

    pedidos.forEach(pedido=>{

        faturamento += pedido.total || 0;

        recebido += pedido.valorPago || 0;

        receber +=
        (pedido.total || 0) -
        (pedido.valorPago || 0);

    });


    const faturamentoCard =
document.getElementById("faturamento");

if(faturamentoCard){
    faturamentoCard.textContent =
    "R$ " + faturamento.toFixed(2);
}

const recebidoCard =
document.getElementById("recebido");

if(recebidoCard){
    recebidoCard.textContent =
    "R$ " + recebido.toFixed(2);
}

const valorReceber =
document.getElementById("valorReceber");

if(valorReceber){
    valorReceber.textContent =
    "R$ " + receber.toFixed(2);
}

    const menuProdutos = document.getElementById("menuProdutos");
const menuClientes = document.getElementById("menuClientes");
const menuPedidos = document.getElementById("menuPedidos");

if(menuProdutos){
    menuProdutos.textContent = produtos.length;
}

if(menuClientes){
    menuClientes.textContent = clientes.length;
}

if(menuPedidos){
    menuPedidos.textContent = pedidos.length;
}

    // Status dos pedidos

    let pagos = 0;
    let parciais = 0;
    let prazo = 0;
    let atrasados = 0;

    let hoje = new Date();

    pedidos.forEach(pedido=>{

        let entrega =
        new Date(pedido.dataEntrega);

        if((pedido.valorPago || 0) >= pedido.total){

            pagos++;

        }

        else if((pedido.valorPago || 0) > 0){

            parciais++;

        }

        else if(entrega >= hoje){

            prazo++;

        }

        else{

            atrasados++;

        }

    });

const cardPagos = document.getElementById("pagos");
if(cardPagos){
    cardPagos.textContent = pagos;
}

const cardParciais = document.getElementById("parciais");
if(cardParciais){
    cardParciais.textContent = parciais;
}

const cardPrazo = document.getElementById("prazo");
if(cardPrazo){
    cardPrazo.textContent = prazo;
}

const cardAtrasados = document.getElementById("atrasados");
if(cardAtrasados){
    cardAtrasados.textContent = atrasados;
}

}

const dataAtual = document.getElementById("dataAtual");

if(dataAtual){
    dataAtual.textContent =
    new Date().toLocaleDateString("pt-BR");
}

document.addEventListener("DOMContentLoaded", async () => {

    await abrirBanco();

    await atualizarMenu();

    window.addEventListener("focus", atualizarMenu);


});