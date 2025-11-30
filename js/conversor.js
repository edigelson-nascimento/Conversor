// IDs
var inputValor = document.getElementById("caixamsg");
var outputValor = document.getElementById("valor");
var btcPriceSpan = document.getElementById("btcPrice");

let precoBTC = null;

// Buscar preço do BTC em tempo real
async function atualizarPrecoBTC() {
  try {
    const req = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=brl");
    const data = await req.json();
    precoBTC = data.bitcoin.brl;

    // Atualiza o texto no HTML
    btcPriceSpan.textContent = "R$ " + precoBTC.toLocaleString("pt-BR");

  } catch (err) {
    btcPriceSpan.textContent = "Erro ao carregar";
    console.log("Falha ao pegar preço:", err);
  }
}

// Converte BTC → BRL usando o preço atualizado
function Converter() {
  if (!precoBTC) {
    outputValor.value = "Aguarde a cotação carregar...";
    return;
  }

  const valorDigitado = parseFloat(inputValor.value);

  if (isNaN(valorDigitado)) {
    outputValor.value = "Digite um valor válido";
    return;
  }

  const total = valorDigitado * precoBTC;
  outputValor.value = "R$ " + total.toLocaleString("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

// Limpar
function Limpar() {
  inputValor.value = "";
  outputValor.value = "";
}

// Atualiza a cotação assim que a página carregar
atualizarPrecoBTC();

// Atualiza a cada 30 segundos
setInterval(atualizarPrecoBTC, 30000);