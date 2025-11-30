// Referências dos campos
const inputValor = document.getElementById("caixamsg");
const outputValor = document.getElementById("valor");
const btcPriceSpan = document.getElementById("btcPrice");

let precoBTC = null;

// Função para buscar o preço do BTC em tempo real
async function atualizarPrecoBTC() {
  try {
    const req = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=brl");
    const data = await req.json();

    precoBTC = data.bitcoin.brl;

    // Atualiza a cotação na tela
    btcPriceSpan.textContent =
      "R$ " +
      precoBTC.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });

  } catch (err) {
    btcPriceSpan.textContent = "Erro ao carregar";
    console.log("Erro ao pegar preço:", err);
  }
}

// Converter BTC → BRL
function Converter() {
  if (!precoBTC) {
    outputValor.value = "Aguarde a cotação...";
    return;
  }

  let valorDigitado = inputValor.value.replace(",", "."); // permite vírgula no input
  valorDigitado = parseFloat(valorDigitado);

  if (isNaN(valorDigitado)) {
    outputValor.value = "Digite um valor válido";
    return;
  }

  const total = valorDigitado * precoBTC;

  outputValor.value =
    "R$ " +
    total.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
}

// Limpar campos
function Limpar() {
  inputValor.value = "";
  outputValor.value = "";
}

// Ao carregar a página, busca a cotação
atualizarPrecoBTC();

// Atualiza a cada 30 segundos
setInterval(atualizarPrecoBTC, 30000);