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

carregarProdutosPedido();