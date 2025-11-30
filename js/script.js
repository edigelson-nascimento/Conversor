/**
 * Lógica do Conversor de Moedas — v2.0.0
 * Autor: Edigelson Nascimento
 * 
 * Responsável por:
 * 1. Buscar cotação na CoinGecko API.
 * 2. Gerenciar conversão e validação de inputs.
 * 3. Persistir histórico e tema no localStorage.
 * 4. Controlar visibilidade da aba para economia de recursos.
 */

// --- Variáveis de Estado ---
let cotacaoAtual = 0;
let intervaloAtualizacao = null;
let historicoConversoes = [];
const INTERVALO_MS = 30000; // 30 segundos
const MAX_HISTORICO = 5;

// --- Seleção de Elementos do DOM ---
const elDisplayPreco = document.getElementById('price-display');
const elUltimaAtualizacao = document.getElementById('last-update');
const elSpinner = document.getElementById('spinner');
const elInputBtc = document.getElementById('btc-input');
const elBtnConverter = document.getElementById('btn-convert');
const elBtnLimpar = document.getElementById('btn-clear');
const elContainerResultado = document.getElementById('result-container');
const elValorResultado = document.getElementById('result-value');
const elListaHistorico = document.getElementById('history-list');
const elBtnLimparHistorico = document.getElementById('btn-clear-history');
const elBtnTema = document.getElementById('theme-toggle');
const elIconeSol = document.getElementById('icon-sun');
const elIconeLua = document.getElementById('icon-moon');

// --- Formatação Monetária (Intl) ---
const formatadorMoeda = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
});

const formatadorHora = new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
});

// --- Inicialização ---
function init() {
    // 1. Configurar Tema
    aplicarTemaInicial();

    // 2. Carregar Histórico
    carregarHistorico();

    // 3. Buscar cotação inicial
    buscarCotacao();

    // 4. Iniciar intervalo automático
    iniciarIntervalo();

    // 5. Configurar Listeners
    elBtnConverter.addEventListener('click', converterValor);
    elBtnLimpar.addEventListener('click', limparCampos);
    elBtnLimparHistorico.addEventListener('click', limparHistorico);
    elBtnTema.addEventListener('click', alternarTema);
    
    // Converter ao pressionar Enter no input
    elInputBtc.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') converterValor();
    });

    // Page Visibility API (Pausar quando aba oculta)
    document.addEventListener('visibilitychange', lidarComMudancaVisibilidade);
}

// --- Funções de API ---

/**
 * Busca a cotação do Bitcoin em BRL na CoinGecko.
 * Endpoint: simple/price
 */
async function buscarCotacao() {
    mostrarCarregando(true);
    
    try {
        // Timeout de 10 segundos para não travar a UI
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=brl', {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error('Falha na resposta da API');

        const data = await response.json();
        
        if (data.bitcoin && data.bitcoin.brl) {
            cotacaoAtual = data.bitcoin.brl;
            atualizarInterfaceCotacao();
        } else {
            throw new Error('Formato de dados inválido');
        }

    } catch (erro) {
        console.error('Erro ao buscar cotação:', erro);
        exibirErroCotacao();
    } finally {
        mostrarCarregando(false);
    }
}

/**
 * Atualiza o HTML com o preço atual e o horário.
 */
function atualizarInterfaceCotacao() {
    elDisplayPreco.textContent = formatadorMoeda.format(cotacaoAtual);
    elDisplayPreco.classList.remove('text-red-500'); // Remove cor de erro se houver
    
    const agora = new Date();
    elUltimaAtualizacao.innerHTML = `
        <span class="text-green-500">●</span> Última atualização: ${formatadorHora.format(agora)}
    `;
}

/**
 * Exibe estado de erro na interface.
 */
function exibirErroCotacao() {
    if (cotacaoAtual === 0) {
        elDisplayPreco.textContent = "Erro ao carregar";
        elDisplayPreco.classList.add('text-red-500');
    }
    elUltimaAtualizacao.textContent = "Falha na conexão. Tentando novamente em breve...";
}

function mostrarCarregando(estado) {
    if (estado) {
        elSpinner.classList.remove('hidden');
    } else {
        elSpinner.classList.add('hidden');
    }
}

// --- Funções de Lógica de Conversão ---

function converterValor() {
    // Obter valor e normalizar (trocar vírgula por ponto)
    let valorInput = elInputBtc.value.replace(',', '.').trim();

    if (!valorInput || isNaN(valorInput) || Number(valorInput) <= 0) {
        alert("Por favor, insira um valor válido de Bitcoin.");
        elInputBtc.focus();
        return;
    }

    if (cotacaoAtual <= 0) {
        alert("Aguarde o carregamento da cotação.");
        return;
    }

    const qtdBtc = parseFloat(valorInput);
    const valorConvertido = qtdBtc * cotacaoAtual;

    // Exibir resultado
    elValorResultado.textContent = formatadorMoeda.format(valorConvertido);
    elContainerResultado.classList.remove('hidden');

    // Salvar no histórico
    adicionarAoHistorico(qtdBtc, valorConvertido);
}

function limparCampos() {
    elInputBtc.value = '';
    elContainerResultado.classList.add('hidden');
    elInputBtc.focus();
}

// --- Gerenciamento de Histórico ---

function adicionarAoHistorico(btc, brl) {
    const novaEntrada = {
        btc: btc,
        brl: brl,
        timestamp: new Date().toISOString()
    };

    // Adiciona no início e limita a 5 itens
    historicoConversoes.unshift(novaEntrada);
    if (historicoConversoes.length > MAX_HISTORICO) {
        historicoConversoes = historicoConversoes.slice(0, MAX_HISTORICO);
    }

    salvarHistoricoLocalStorage();
    renderizarHistorico();
}

function renderizarHistorico() {
    elListaHistorico.innerHTML = '';

    if (historicoConversoes.length === 0) {
        elListaHistorico.innerHTML = `
            <li class="text-center py-8 text-slate-400 text-sm italic empty-msg">
                Nenhuma conversão recente.
            </li>`;
        return;
    }

    historicoConversoes.forEach(item => {
        const li = document.createElement('li');
        li.className = "flex justify-between items-center bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-100 dark:border-slate-600 text-sm";
        
        const dataItem = new Date(item.timestamp);
        const horaFormatada = formatadorHora.format(dataItem);

        li.innerHTML = `
            <div class="flex flex-col">
                <span class="font-bold text-slate-700 dark:text-slate-200">${item.btc.toString().replace('.', ',')} BTC</span>
                <span class="text-xs text-slate-400">${horaFormatada}</span>
            </div>
            <div class="text-blue-600 dark:text-blue-400 font-medium">
                ${formatadorMoeda.format(item.brl)}
            </div>
        `;
        elListaHistorico.appendChild(li);
    });
}

function salvarHistoricoLocalStorage() {
    localStorage.setItem('btc_converter_history', JSON.stringify(historicoConversoes));
}

function carregarHistorico() {
    const salvo = localStorage.getItem('btc_converter_history');
    if (salvo) {
        try {
            historicoConversoes = JSON.parse(salvo);
            renderizarHistorico();
        } catch (e) {
            console.error("Erro ao ler histórico", e);
            historicoConversoes = [];
        }
    }
}

function limparHistorico() {
    if (confirm("Deseja apagar todo o histórico?")) {
        historicoConversoes = [];
        localStorage.removeItem('btc_converter_history');
        renderizarHistorico();
    }
}

// --- Gerenciamento de Tema (Light/Dark) ---

function aplicarTemaInicial() {
    // Verifica preferência salva ou do sistema
    const temaSalvo = localStorage.getItem('theme');
    const prefereDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (temaSalvo === 'dark' || (!temaSalvo && prefereDark)) {
        document.documentElement.classList.add('dark');
        atualizarIconeTema(true);
    } else {
        document.documentElement.classList.remove('dark');
        atualizarIconeTema(false);
    }
}

function alternarTema() {
    const html = document.documentElement;
    html.classList.toggle('dark');
    
    const isDark = html.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    atualizarIconeTema(isDark);
}

function atualizarIconeTema(isDark) {
    if (isDark) {
        elIconeSol.classList.remove('hidden'); // No escuro, mostra o sol para voltar pro claro
        elIconeLua.classList.add('hidden');
    } else {
        elIconeSol.classList.add('hidden');
        elIconeLua.classList.remove('hidden'); // No claro, mostra a lua para ir pro escuro
    }
}

// --- Gerenciamento de Intervalos e Visibilidade ---

function iniciarIntervalo() {
    if (intervaloAtualizacao) clearInterval(intervaloAtualizacao);
    intervaloAtualizacao = setInterval(buscarCotacao, INTERVALO_MS);
}

function pararIntervalo() {
    if (intervaloAtualizacao) {
        clearInterval(intervaloAtualizacao);
        intervaloAtualizacao = null;
    }
}

function lidarComMudancaVisibilidade() {
    if (document.hidden) {
        // Aba oculta: pausa atualizações para economizar recursos
        console.log("Aba oculta: Pausando atualizações...");
        pararIntervalo();
    } else {
        // Aba visível: retoma imediatamente
        console.log("Aba visível: Retomando...");
        buscarCotacao(); // Busca imediata
        iniciarIntervalo(); // Reinicia ciclo
    }
}

// Inicia o app quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', init);
