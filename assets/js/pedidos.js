let pedidos =
JSON.parse(
  localStorage.getItem("pedidos")
) || [];

let produtos =
JSON.parse(
  localStorage.getItem("produtos")
) || [];

/* ==========================
   CARREGAR PRODUTOS
========================== */

function carregarProdutosPedido(){

  let select =
  document.getElementById(
    "produtoPedido"
  );

  select.innerHTML = `
    <option value="">
      Selecione um produto
    </option>
  `;

  produtos.forEach(produto => {

    select.innerHTML += `
      <option value="${produto.id}">
        ${produto.nome}
        | ${produto.cor}
        | ${produto.tamanho}
        | ${produto.genero}
        | ${produto.detalheManga}
      </option>
    `;

  });

}

/* ==========================
   REGISTRAR PEDIDO
========================== */

function registrarPedido(){

  let cliente =
  document.getElementById(
    "cliente"
  ).value;

  let produtoId =
  Number(
    document.getElementById(
      "produtoPedido"
    ).value
  );

  let quantidade =
  Number(
    document.getElementById(
      "quantidadePedido"
    ).value
  );

  let pagamento =
  document.getElementById(
    "pagamento"
  ).value;

  if(cliente.trim() === ""){

    alert(
      "Digite o nome do cliente."
    );

    return;

  }

  if(!produtoId){

    alert(
      "Selecione um produto."
    );

    return;

  }

  if(quantidade <= 0){

    alert(
      "Quantidade inválida."
    );

    return;

  }

  let produto =
  produtos.find(
    p => p.id == produtoId
  );

  if(!produto){

    alert(
      "Produto não encontrado."
    );

    return;

  }

  if(quantidade > produto.restante){

    alert(
      "Estoque insuficiente. Disponível: " +
      produto.restante
    );

    return;

  }

  let total =
  produto.preco *
  quantidade;

  let pedido = {

    cliente,

    produtoId:
    produto.id,

    cliente,

    produto:
    produto.nome,

    cor:
    produto.cor,

    tamanho:
    produto.tamanho,

    genero:
    produto.genero,

    detalheManga:
    produto.detalheManga,

    quantidade,

    pagamento,

    total,

       valorPago: Number(
        document.getElementById("valorPago").value
    ) || 0,

    dataEntrega:
    document.getElementById("dataEntrega").value,

    data:
    new Date().toLocaleString()

  };

  function obterStatus(pedido){

    let hoje = new Date();

    let entrega =
    new Date(pedido.dataEntrega);

    if(pedido.valorPago >= pedido.total){

        return {
            texto:"Pago",
            cor:"verde",
            icone:"✅"
        };

    }

    if(
        pedido.valorPago > 0 &&
        pedido.valorPago < pedido.total
    ){

        return {
            texto:"Pagamento Parcial",
            cor:"laranja",
            icone:"🟠"
        };

    }

    if(entrega >= hoje){

        return {
            texto:"No Prazo",
            cor:"azul",
            icone:"🔵"
        };

    }

    return {

        texto:"Atrasado",

        cor:"vermelho",

        icone:"🔴"

    };

}

  pedidos.push(pedido);

  produto.vendidos +=
  quantidade;

  produto.restante =
  produto.estoque -
  produto.vendidos;

  localStorage.setItem(
    "pedidos",
    JSON.stringify(pedidos)
  );

  localStorage.setItem(
    "produtos",
    JSON.stringify(produtos)
  );

  document.getElementById(
    "cliente"
  ).value = "";

  document.getElementById(
    "produtoPedido"
  ).selectedIndex = 0;

  document.getElementById(
    "quantidadePedido"
  ).value = "";

  atualizarTabelaPedidos();

  atualizarResumo();

}

/* ==========================
   EDITAR PEDIDO
========================== */

function editarPedido(index){

  let pedido =
  pedidos[index];

  let novaQuantidade =
  prompt(
    "Nova quantidade:",
    pedido.quantidade
  );

  if(
    novaQuantidade === null
  ){
    return;
  }

  novaQuantidade =
  Number(novaQuantidade);

  if(
    novaQuantidade <= 0
  ){

    alert(
      "Quantidade inválida."
    );

    return;

  }

  let produto =
  produtos.find(
    p => p.id === pedido.produtoId
  );

  if(!produto){

    alert(
      "Produto não encontrado."
    );

    return;

  }

  let diferenca =
  novaQuantidade -
  pedido.quantidade;

  if(
    diferenca > produto.restante
  ){

    alert(
      "Estoque insuficiente."
    );

    return;

  }

  produto.vendidos +=
  diferenca;

  if(
    produto.vendidos < 0
  ){
    produto.vendidos = 0;
  }

  produto.restante =
  produto.estoque -
  produto.vendidos;

  let valorUnitario =
  pedido.total /
  pedido.quantidade;

  pedido.quantidade =
  novaQuantidade;

  pedido.total =
  valorUnitario *
  novaQuantidade;

  localStorage.setItem(
    "pedidos",
    JSON.stringify(pedidos)
  );

  localStorage.setItem(
    "produtos",
    JSON.stringify(produtos)
  );

  atualizarTabelaPedidos();

  atualizarResumo();

}

/* ==========================
   EXCLUIR PEDIDO
========================== */

function excluirPedido(index){

  let confirmar =
  confirm(
    "Deseja excluir esse pedido?"
  );

  if(!confirmar){
    return;
  }

  let pedido =
  pedidos[index];

  let produto =
  produtos.find(
    p => p.id === pedido.produtoId
  );

  if(produto){

    produto.vendidos -=
    pedido.quantidade;

    if(
      produto.vendidos < 0
    ){
      produto.vendidos = 0;
    }

    produto.restante =
    produto.estoque -
    produto.vendidos;

    localStorage.setItem(
      "produtos",
      JSON.stringify(produtos)
    );

  }

  pedidos.splice(
    index,
    1
  );

  localStorage.setItem(
    "pedidos",
    JSON.stringify(pedidos)
  );

  atualizarTabelaPedidos();

  atualizarResumo();

}

/* ==========================
   TABELA
========================== */

function atualizarTabelaPedidos(){

  let status = 
  obterStatus(pedido);

  <td>

<span class="status ${status.cor}">

${status.icone}
${status.texto}

</span>

</td>

  let tabela =
  document.getElementById(
    "tabelaPedidos"
  );

  tabela.innerHTML = "";

  pedidos.forEach(
    (pedido,index)=>{

      tabela.innerHTML += `

        <tr>

          <td>
            ${pedido.cliente}
          </td>

          <td>

            ${pedido.produto}

            <br>

            <small>

              ${pedido.cor}
              |
              ${pedido.tamanho}
              |
              ${pedido.genero}
              |
              ${pedido.detalheManga}

            </small>

          </td>

          <td>
            ${pedido.quantidade}
          </td>

          <td>
            ${pedido.pagamento}
          </td>

          <td>
            R$ ${pedido.total.toFixed(2)}
          </td>

          <td>
            ${pedido.data}
          </td>

          <td>

            <button
              class="btn editar"
              onclick="editarPedido(${index})">

              Editar

            </button>

            <button
              class="btn excluir"
              onclick="excluirPedido(${index})">

              Excluir

            </button>

          </td>

        </tr>

      `;

    }
  );

}

/* ==========================
   RESUMO
========================== */

function atualizarResumo(){

  let totalPedidos =
  pedidos.length;

  let faturamento = 0;

  let itensVendidos = 0;

  pedidos.forEach(
    pedido => {

      faturamento +=
      pedido.total;

      itensVendidos +=
      pedido.quantidade;

    }
  );

  document.getElementById(
    "totalPedidos"
  ).textContent =
  totalPedidos;

  document.getElementById(
    "faturamento"
  ).textContent =
  "R$ " +
  faturamento.toFixed(2);

  document.getElementById(
    "itensVendidos"
  ).textContent =
  itensVendidos;

}

/* ==========================
   INICIAR SISTEMA
========================== */

carregarProdutosPedido();

atualizarTabelaPedidos();

atualizarResumo();