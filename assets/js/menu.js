const dataAtual = document.getElementById("dataAtual");

const hoje = new Date();

dataAtual.innerHTML =
hoje.toLocaleDateString("pt-BR");