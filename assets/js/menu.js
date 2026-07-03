const dataAtual = document.getElementById("dataAtual");

const hoje = new Date();

dataAtual.textContent = hoje.toLocaleDateString("pt-BR");

let produtos =
JSON.parse(localStorage.getItem("produtos")) || [];

let clientes =
JSON.parse(localStorage.getItem("clientes")) || [];

let pedidos =
JSON.parse(localStorage.getItem("pedidos")) || [];

function atualizarDashboard(){

    // Cards principais

    document.getElementById("totalProdutos").textContent =
    produtos.length;

    document.getElementById("totalClientes").textContent =
    clientes.length;

    document.getElementById("totalPedidos").textContent =
    pedidos.length;

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

    document.getElementById("faturamento").textContent =
    "R$ " + faturamento.toFixed(2);

    document.getElementById("recebido").textContent =
    "R$ " + recebido.toFixed(2);

    document.getElementById("receber").textContent =
    "R$ " + receber.toFixed(2);

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

    document.getElementById("pagos").textContent =
    pagos;

    document.getElementById("parciais").textContent =
    parciais;

    document.getElementById("prazo").textContent =
    prazo;

    document.getElementById("atrasados").textContent =
    atrasados;

    function abrirPedidos(filtro){

    localStorage.setItem(
        "filtroPedidos",
        filtro
    );

    window.location.href = "pedidos.html";

}

}

atualizarDashboard();