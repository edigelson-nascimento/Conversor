# Conversor de Moedas BTC/BRL — v2.0.0

Uma aplicação web minimalista e responsiva para converter Bitcoin (BTC) em Real Brasileiro (BRL) utilizando cotações em tempo real.

## 📋 Descrição

Este projeto foi desenvolvido com foco em **design minimalista**, **acessibilidade** e **performance**. A aplicação consome a API pública da CoinGecko para obter o valor atualizado do Bitcoin a cada 30 segundos, oferecendo uma interface limpa, modo escuro automático e histórico de conversões persistente.

### Funcionalidades Principais

*   **Cotação em Tempo Real:** Atualização automática a cada 30 segundos.
*   **Conversão Precisa:** Suporte para até 8 casas decimais no input.
*   **Histórico Local:** Salva as últimas 5 conversões no navegador (localStorage).
*   **Modo Escuro (Dark Mode):** Alternância manual ou baseada na preferência do sistema.
*   **Economia de Recursos:** O sistema pausa as requisições à API quando a aba não está visível.
*   **Design Responsivo:** Layout adaptável para Mobile, Tablet e Desktop.

## 🛠 Tecnologias Utilizadas

*   **HTML5:** Estrutura semântica.
*   **CSS3 (TailwindCSS):** Estilização utilitária via CDN.
*   **JavaScript (Vanilla ES6+):** Lógica de negócios sem frameworks.
*   **API CoinGecko:** Fonte de dados para a cotação.
*   **Google Fonts:** Tipografia (Inter).

## 📂 Estrutura de Arquivos

```
/
├── index.html       # Estrutura principal
├── css/
│   └── style.css    # Estilos complementares e animações
├── js/
│   └── script.js    # Lógica da aplicação
└── README.md        # Documentação
```

## 🚀 Como Usar

Não é necessária nenhuma instalação complexa ou gerenciador de pacotes (npm/yarn), pois o projeto utiliza Tailwind via CDN.

1.  **Baixe ou Clone** este repositório.
2.  **Abra o arquivo** `index.html` diretamente em seu navegador.
    *   *Opção recomendada:* Use uma extensão como "Live Server" no VS Code para simular um servidor local.

## 📝 Créditos e Licença

*   **Desenvolvedor:** Edigelson Nascimento
*   **Website:** [https://edigelson.pages.dev](https://edigelson.pages.dev)
*   **Ano:** 2025

Este projeto é **Open Source** sob a licença **MIT**. Sinta-se livre para usar, estudar e modificar.

---
*© 2022 • Edigelson Nascimento*
