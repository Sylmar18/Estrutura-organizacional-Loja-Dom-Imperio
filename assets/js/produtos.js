let produtos = [];
let historico = [];



async function cadastrarProduto(){

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

  let marca =
  document.getElementById("marca").value;

  let tipo =
  document.getElementById("tipo").value;
  
  let genero =
   document.getElementById("genero").value
   
   let detalheManga =
   document.getElementById("detalheManga").value

  let estoque =
  Number(
    document.getElementById("estoque").value
  );

  let vendidos =
  Number(
    document.getElementById("vendidos").value
  );
  if(
  nome.trim() === "" ||
  cor.trim() === "" ||
  tamanho.trim() === ""
){
  alert("Preencha todos os campos.");
  return;
}

if(vendidos > estoque){
  alert("Vendidos não pode ser maior que o estoque.");
  return;
}
if(preco < 0){
  alert("Preço inválido.");
  return;
}

if(estoque < 0){
  alert("Estoque inválido.");
  return;
}

if(vendidos < 0){
  alert("Quantidade vendida inválida.");
  return;
}

  let restante =
  estoque - vendidos;

  let produto = {

    nome,
    marca,
    cor,
    tamanho,
    preco,
    tipo,
    genero,
    detalheManga,
    estoque,
    vendidos,
    restante

};

await adicionar("produtos", produto);

  produtos = await listar("produtos");

   atualizarTabela();

  

document.getElementById("nome").value = "";
document.getElementById("cor").value = "";
document.getElementById("tamanho").value = "";
document.getElementById("preco").value = "";
document.getElementById("estoque").value = "";
document.getElementById("vendidos").value = "";

document.getElementById("tipo").selectedIndex = 0;
document.getElementById("genero").selectedIndex = 0;
document.getElementById("detalheManga").selectedIndex = 0;
document.getElementById("marca").selectedIndex = 0;

const movimento = {

    produto: nome,

    movimento: "Cadastro",

    quantidade: estoque,

    data: new Date().toLocaleString()

};

historico.push(movimento);

await adicionar("historico", movimento);
  
  aplicarFiltros();

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

        <td>${produto.marca}</td>

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

        <td>
          ${
            produto.genero === "Masculino"
            ? "👨 Masculino"
            : produto.genero === "Feminino"
            ? "👩 Feminino"
            : "🧑 Unissex"
          }
        </td>

        <td>
          ${
            produto.detalheManga === "✨Com Detalhes"
            ? "✨ Com detalhes"
            : "🚫 Sem detalhes"
          }
        </td>

        <td>${produto.estoque}</td>

        <td>${produto.vendidos}</td>

        <td>${produto.restante}</td>

        <td>

          <button
            class="btn editar"
            onclick="editarProduto(${index})">
            Editar
          </button>

          <button
            class="btn excluir"
            onclick="excluirProduto(${index})">
            Excluir
          </button>

        </td>

      </tr>

    `;
  });
}



async function excluirProduto(index){

    if(!confirm("Deseja excluir este produto?")){
        return;
    }

   const nomeProduto = produtos[index].nome;

await excluir("produtos", produtos[index].id);

const movimento = {

    produto: nomeProduto,
    movimento: "Exclusão",
    quantidade: 0,
    data: new Date().toLocaleString()

};

historico.push(movimento);

await adicionar("historico", movimento);

produtos = await listar("produtos");
historico = await listar("historico");

atualizarTabela();
atualizarHistorico();
atualizarGrafico();

}

  async function editarProduto(index){

    let novaVenda = prompt("Quantidade vendida:");

    if(novaVenda === null) return;

    produtos[index].vendidos = Number(novaVenda);

    produtos[index].restante =
        produtos[index].estoque -
        produtos[index].vendidos;

await atualizar("produtos", produtos[index]);

const movimento = {

    produto: produtos[index].nome,
    movimento: "Venda",
    quantidade: produtos[index].vendidos,
    data: new Date().toLocaleString()

};

historico.push(movimento);

await adicionar("historico", movimento);

produtos = await listar("produtos");
historico = await listar("historico");

atualizarTabela();
atualizarHistorico();
atualizarGrafico();

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

/* ===============================
   GRÁFICO DE VENDAS
================================ */

let grafico = null;

function atualizarGrafico(){

    const ctx =
        document.getElementById("graficoVendas");

    if(!ctx) return;

    const nomes =
        produtos.map(p => p.nome);

    const vendas =
        produtos.map(p => Number(p.vendidos) || 0);

    const cores =
        produtos.map(p => p.cor || "");


    // Evita criar um gráfico por cima do outro
    if(grafico){
        grafico.destroy();
    }


    grafico = new Chart(ctx, {

        type: "bar",

        data: {

            labels: nomes,

            datasets: [{

                label: "Vendas",

                data: vendas,

                /* Azul sofisticado */
                backgroundColor: function(context){

                    const chart = context.chart;
                    const { ctx, chartArea } = chart;

                    if(!chartArea){
                        return "#2469a8";
                    }

                    const gradient =
                        ctx.createLinearGradient(
                            0,
                            chartArea.top,
                            0,
                            chartArea.bottom
                        );

                    gradient.addColorStop(
                        0,
                        "rgba(190, 225, 255, 0.95)"
                    );

                    gradient.addColorStop(
                        0.20,
                        "rgba(80, 155, 225, 0.95)"
                    );

                    gradient.addColorStop(
                        0.55,
                        "rgba(30, 95, 160, 0.95)"
                    );

                    gradient.addColorStop(
                        1,
                        "rgba(8, 35, 70, 0.98)"
                    );

                    return gradient;
                },

                borderColor:
                    "rgba(190, 225, 255, 0.90)",

                borderWidth: 1.5,

                borderRadius: 6,

                /* Barras mais finas */
                barPercentage: 0.55,

                categoryPercentage: 0.70
            }]
        },


        options: {

            responsive: true,

            maintainAspectRatio: false,


            plugins: {

                legend: {
                    display: false
                },


                tooltip: {

                    backgroundColor:
                        "rgba(5, 8, 16, 0.96)",

                    titleColor:
                        "#ffffff",

                    bodyColor:
                        "#dcecff",

                    borderColor:
                        "rgba(100, 180, 255, 0.40)",

                    borderWidth: 1,

                    padding: 12,

                    displayColors: false,

                    callbacks: {

                        label: function(context){

                            return " Vendas: " +
                                context.raw;
                        }
                    }
                }
            },


            scales: {

                x: {

                    grid: {
                        display: false
                    },

                    border: {
                        display: false
                    },

                    ticks: {

                        color: "#ffffff",

                        font: {
                            size: 13,
                            weight: "600"
                        },

                        padding: 12,

                        callback: function(value){

                            const nome =
                                this.getLabelForValue(value);

                            const cor =
                                cores[value];

                            return cor
                                ? [nome, `(${cor})`]
                                : nome;
                        }
                    }
                },


                y: {

                    beginAtZero: true,

                    /* Evita espaço exagerado */
                    suggestedMax:
                        Math.max(...vendas, 0) + 3,

                    grid: {

                        color:
                            "rgba(255, 255, 255, 0.06)"
                    },

                    border: {
                        display: false
                    },

                    ticks: {

                        color:
                            "rgba(255,255,255,0.55)",

                        precision: 0
                    }
                }
            }
        },


        /* Número no topo das barras */
        plugins: [

            {

                id: "valoresTopo",

                afterDatasetsDraw(chart){

                    const { ctx } = chart;

                    chart.data.datasets.forEach(
                        (dataset, datasetIndex) => {

                            const meta =
                                chart.getDatasetMeta(
                                    datasetIndex
                                );

                            meta.data.forEach(
                                (bar, index) => {

                                    const valor =
                                        dataset.data[index];

                                    ctx.save();

                                    ctx.font =
                                        "600 14px Arial";

                                    ctx.fillStyle =
                                        "#ffffff";

                                    ctx.textAlign =
                                        "center";

                                    ctx.textBaseline =
                                        "bottom";

                                    ctx.shadowColor =
                                        "rgba(100, 180, 255, 0.55)";

                                    ctx.shadowBlur = 8;

                                    ctx.fillText(
                                        valor,
                                        bar.x,
                                        bar.y - 8
                                    );

                                    ctx.restore();
                                }
                            );
                        }
                    );
                }
            }
        ]
    });
}

//busca//

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

  produtos.forEach((produto,index)=>{

    let correspondeBusca =
    produto.nome.toLowerCase().includes(busca);

    let correspondeCor =
    cor === "" || produto.cor === cor;

    let correspondeTamanho =
    tamanho === "" || produto.tamanho === tamanho;

    let correspondeGenero =
    genero === "" || produto.genero === genero;

    if(
      correspondeBusca &&
      correspondeCor &&
      correspondeTamanho &&
      correspondeGenero
    ){

      tabela.innerHTML += `

        <tr class="${
          produto.restante <= 5
          ? "estoque-baixo"
          : ""
        }">

          <td>${produto.nome}</td>

          <td>${produto.marca}</td>

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

          <td>
            ${
              produto.genero === "Masculino"
              ? "👨 Masculino"
              : produto.genero === "Feminino"
              ? "👩 Feminino"
              : "🧑 Unissex"
            }
          </td>

          <td>
            ${
              produto.detalheManga === "✨Com Detalhes"
              ? "✨ Com detalhes"
              : "🚫 Sem detalhes"
            }
          </td>

          <td>${produto.estoque}</td>

          <td>${produto.vendidos}</td>

          <td>${produto.restante}</td>

          <td>

            <button
              class="btn editar"
              onclick="editarProduto(${index})">
              Editar
            </button>

            <button
              class="btn excluir"
              onclick="excluirProduto(${index})">
              Excluir
            </button>

          </td>

        </tr>

      `;
    }
  });
}
document
.getElementById("filtroCor")
.addEventListener("change", aplicarFiltros);

document
.getElementById("filtroTamanho")
.addEventListener("change", aplicarFiltros);

document
.getElementById("filtroGenero")
.addEventListener("change", aplicarFiltros);

document
.getElementById("busca")
.addEventListener("input", aplicarFiltros);

document.addEventListener("DOMContentLoaded", async () => {

    await abrirBanco();

    produtos = await listar("produtos");

    historico = await listar("historico");

    atualizarTabela();
    atualizarHistorico();
    atualizarGrafico();

});

