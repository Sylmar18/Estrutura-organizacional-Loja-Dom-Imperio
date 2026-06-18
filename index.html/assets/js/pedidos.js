let pedidos =
JSON.parse(
  localStorage.getItem("pedidos")
) || [];

let produtos =
JSON.parse(
  localStorage.getItem("produtos")
) || [];

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
    alert("Digite o nome do cliente.");
    return;
  }

  if(!produtoId){
    alert("Selecione um produto.");
    return;
  }

  if(quantidade <= 0){
    alert("Quantidade inválida.");
    return;
  }

  let produto =
  produtos.find(
    p => p.id == produtoId
  );

  if(!produto){
    alert("Produto não encontrado.");
    return;
  }

  let total =
  produto.preco * quantidade;

  let pedido = {

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

    data:
    new Date().toLocaleString()

  };

  pedidos.push(pedido);

  localStorage.setItem(
    "pedidos",
    JSON.stringify(pedidos)
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
    alert("Quantidade inválida.");
    return;
  }

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

  atualizarTabelaPedidos();
  atualizarResumo();

}

function atualizarTabelaPedidos(){

  let tabela =
  document.getElementById(
    "tabelaPedidos"
  );

  tabela.innerHTML = "";

  pedidos.forEach((pedido,index)=>{

    tabela.innerHTML += `
      <tr>

        <td>${pedido.cliente}</td>

        <td>
          ${pedido.produto}
          <br>
          <small>
            ${pedido.cor}
            |
            ${pedido.tamanho}
          </small>
        </td>

        <td>${pedido.quantidade}</td>

        <td>${pedido.pagamento}</td>

        <td>
          R$ ${pedido.total.toFixed(2)}
        </td>

        <td>${pedido.data}</td>

        <td>

          <button
            class="btn editar"
            onclick="editarPedido(${index})">
            Editar
          </button>

        </td>

      </tr>
    `;

  });

}

function atualizarResumo(){

  let totalPedidos = 0;
  let faturamento = 0;
  let itensVendidos = 0;

  totalPedidos =
  pedidos.length;

  pedidos.forEach(pedido => {

    faturamento +=
    pedido.total;

    itensVendidos +=
    pedido.quantidade;

  });

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

carregarProdutosPedido();
atualizarTabelaPedidos();
atualizarResumo();