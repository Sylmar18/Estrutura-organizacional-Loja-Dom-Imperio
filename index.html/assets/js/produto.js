let produtos =
JSON.parse(localStorage.getItem("produtos"))
|| [];

let historico =
JSON.parse(localStorage.getItem("historico"))
|| [];

function salvarDados(){

  localStorage.setItem(
    "produtos",
    JSON.stringify(produtos)
  );

  localStorage.setItem(
    "historico",
    JSON.stringify(historico)
  );
}

function cadastrarProduto(){

  let nome =
  document.getElementById("nome").value;

  let cor =
  document.getElementById("cor").value;

  let tamanho =
  document.getElementById("tamanho").value;

  let preco =
  Number(
    document.getElementById("preco").value
  );

  let tipo =
  document.getElementById("tipo").value;
  
  let genero =
   document.getElementById("genero").value

  let estoque =
  Number(
    document.getElementById("estoque").value
  );

  let vendidos =
  Number(
    document.getElementById("vendidos").value
  );

  let restante =
  estoque - vendidos;

  let produto = {

    id:Date.now(),

    nome,
    cor,
    tamanho,
    preco,
    tipo,
    genero,
    estoque,
    vendidos,
    restante
  };

  produtos.push(produto);

  historico.push({

    produto:nome,

    movimento:"Cadastro",

    quantidade:estoque,

    data:new Date().toLocaleString()

  });

  salvarDados();

  atualizarTabela();

  atualizarHistorico();

  atualizarGrafico();
}

function atualizarTabela(){

  let tabela =
  document.getElementById("tabelaProdutos");

  tabela.innerHTML = "";

  produtos.forEach((produto,index)=>{

    tabela.innerHTML += `

      <tr class="${
        produto.restante <= 5
        ? "estoque-baixo"
        : ""
      }">

        <td>${produto.nome}</td>

        <td>${produto.cor}</td>

        <td>${produto.tamanho}</td>

        <td>
          R$ ${produto.preco}
        </td>

        <td>

          <span class="badge ${
            produto.tipo === "Conjunto"
            ? "conjunto"
            : "simples"
          }">

            ${produto.tipo}

          </span>

        </td>

        <td>${produto.genero}</td>

        <td>${produto.estoque}</td>

        <td>${produto.vendidos}</td>

        <td>${produto.restante}</td>

        <td>

          <button
            class="btn editar"
            onclick="editarProduto(${index})"
          >
            Editar
          </button>

          <button
            class="btn excluir"
            onclick="excluirProduto(${index})"
          >
            Excluir
          </button>

        </td>

      </tr>

    `;
  });
}

function excluirProduto(index){

  produtos.splice(index,1);

  salvarDados();

  atualizarTabela();

  atualizarGrafico();
}

function editarProduto(index){

  let novaVenda =
  prompt("Quantidade vendida:");

  if(novaVenda !== null){

    produtos[index].vendidos =
    Number(novaVenda);

    produtos[index].restante =
    produtos[index].estoque -
    produtos[index].vendidos;

    historico.push({

      produto:
      produtos[index].nome,

      movimento:"Venda",

      quantidade:novaVenda,

      data:new Date().toLocaleString()

    });

    salvarDados();

    atualizarTabela();

    atualizarHistorico();

    atualizarGrafico();
  }
}

function atualizarHistorico(){

  let tabela =
  document.getElementById("historicoTabela");

  tabela.innerHTML = "";

  historico.forEach(item=>{

    tabela.innerHTML += `

      <tr>

        <td>${item.produto}</td>

        <td>${item.movimento}</td>

        <td>${item.quantidade}</td>

        <td>${item.data}</td>

      </tr>

    `;
  });
}

/* BUSCA */

document
.getElementById("busca")
.addEventListener("input",()=>{

  let termo =
  document
  .getElementById("busca")
  .value
  .toLowerCase();

  let linhas =
  document.querySelectorAll(
    "#tabelaProdutos tr"
  );

  linhas.forEach(linha=>{

    linha.style.display =
    linha.innerText
    .toLowerCase()
    .includes(termo)
    ? ""
    : "none";
  });
});

/* GRÁFICO */

let grafico;

function atualizarGrafico(){

  let ctx =
  document
  .getElementById("graficoVendas");

  let nomes =
  produtos.map(p=>p.nome);

  let vendas =
  produtos.map(p=>p.vendidos);

  if(grafico){

    grafico.destroy();
  }

  grafico =
  new Chart(ctx,{

    type:"bar",

    data:{

      labels:nomes,

      datasets:[{

        label:"Vendas",

        data:vendas,

        borderWidth:1

      }]
    }
  });
}
function aplicarFiltros() {

  let cor =
  document.getElementById("filtroCor").value;

  let tamanho =
  document.getElementById("filtroTamanho").value;

  let genero =
  document.getElementById("filtroGenero").value;

  let busca =
  document.getElementById("busca")
  .value
  .toLowerCase();

  let tabela =
  document.getElementById("tabelaProdutos");

  tabela.innerHTML = "";

  produtos.forEach(produto => {

    let correspondeBusca =
      produto.nome.toLowerCase().includes(busca);

    let correspondeCor =
      cor === "" || produto.cor === cor;

    let correspondeTamanho =
      tamanho === "" || produto.tamanho === tamanho;

    let correspondeGenero =
      genero === "" || produto.genero === genero;

    if (
      correspondeBusca &&
      correspondeCor &&
      correspondeTamanho &&
      correspondeGenero
    ) {

      tabela.innerHTML += `
        <tr class="${
          produto.restante <= 5
          ? "estoque-baixo"
          : ""
        }">

          <td>${produto.nome}</td>
          <td>${produto.cor}</td>
          <td>${produto.tamanho}</td>
          <td>R$ ${produto.preco}</td>

          <td>
            <span class="badge ${
              produto.tipo === "Conjunto"
              ? "conjunto"
              : "simples"
            }">
              ${produto.tipo}
            </span>
          </td>

          <td>${produto.genero}</td>

          <td>${produto.estoque}</td>
          <td>${produto.vendidos}</td>
          <td>${produto.restante}</td>

          <td>
            <button
              class="btn editar"
              onclick="editarProduto(${produtos.indexOf(produto)})">
              Editar
            </button>

            <button
              class="btn excluir"
              onclick="excluirProduto(${produtos.indexOf(produto)})">
              Excluir
            </button>
          </td>

        </tr>
      `;
    }
  });
}

atualizarTabela();

atualizarHistorico();

atualizarGrafico();