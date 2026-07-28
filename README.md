# 🏢 Consulta CNPJ Pro

<p align="center">
  <img src="https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Style-Glassmorphism-FF69B4?style=for-the-badge" alt="Glassmorphism" />
  <img src="https://img.shields.io/badge/API-BrasilAPI%20%2F%20MinhaReceita-22c55e?style=for-the-badge" alt="API Status" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License" />
</p>

Aplicação web moderna, rápida e altamente estilizada para **consulta de dados cadastrais de empresas (CNPJ)** junto à Receita Federal do Brasil. Desenvolvida em **React + Vite** com visual em **Glassmorphism**, suporte a **Tema Escuro/Claro**, **Fallback Automático de APIs**, exportação oficial em **PDF/JSON** e gerenciamento local de histórico e favoritos.

---

## ✨ Funcionalidades Principais

- 🔍 **Busca Inteligente com Máscara**: Formatação dinâmica (`00.000.000/0000-00`) e remoção automática de caracteres especiais.
- 🛡️ **Validação Matemática de CNPJ**: Algoritmo oficial da Receita Federal que verifica os dois dígitos verificadores antes do envio da requisição.
- ⚡ **Fallback Automático de APIs**:
  - **Principal**: [BrasilAPI](https://brasilapi.com.br/) (`https://brasilapi.com.br/api/cnpj/v1/{cnpj}`)
  - **Secundária (Fallback)**: [Minha Receita](https://minhareceita.org/) (`https://minhareceita.org/{cnpj}`)
- 📊 **Visualização por Abas Organizadas**:
  - **Visão Geral**: Badge de Situação Cadastral (ATIVA, BAIXADA, SUSPENSA), Razão Social, Nome Fantasia, Capital Social formatado em R$, Data de Abertura, Porte e Natureza Jurídica.
  - **Quadro de Sócios (QSA)**: Cards com avatares, nomes, cargos/qualificações, país de origem e faixa etária.
  - **Atividades Econômicas (CNAE)**: CNAE Principal destacado com código/descrição e lista completa de CNAEs Secundários.
  - **Endereço & Contato**: Logradouro completo, Bairro, CEP, Município/UF, E-mail, Telefone e **Mapa Embed Interativo (Google Maps / OpenStreetMap)**.
- 📄 **Exportação de Comprovante em PDF**: Gerador de comprovantes cadastrais em formato idêntico ao modelo oficial da Receita Federal (utilizando `jsPDF`).
- 💾 **Exportação em JSON & Copiar Resumo**: Baixe o objeto completo em `.json` ou copie os dados estruturados em texto com 1 clique.
- ⭐ **Histórico & Favoritos**: Salvamento automático das consultas recentes no `localStorage` com opção de favoritar empresas.
- 🌓 **Tema Escuro / Claro**: Alternância de temas em tempo real com preservação de preferência do usuário.
- 🚀 **Atalhos Rápidos**: Botões de 1 clique com CNPJs reais de grandes empresas (Petrobras, Magazine Luiza, Itaú, Nubank, Google Brasil) e **Gerador de CNPJ aleatório válido** para testes.

---

## 🛠️ Tecnologias Utilizadas

- **Core**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Estilização**: Vanilla CSS com variáveis customizadas, Glassmorphism, gradientes modernos e tipografia [Google Fonts (Inter & Outfit)](https://fonts.google.com/)
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Gerador de PDF**: [jsPDF](https://github.com/parallax/jsPDF)
- **APIs Púbicas**: BrasilAPI & Minha Receita

---

## 📂 Estrutura do Projeto

```
cosulta-cnpj/
├── index.html                    # HTML5 base com meta tags SEO e fontes
├── package.json                  # Dependências e scripts do projeto
├── vite.config.js                # Configuração do Vite
├── README.md                     # Documentação completa do projeto
├── src/
│   ├── main.jsx                  # Ponto de entrada da aplicação React
│   ├── App.jsx                   # Componente raiz e gerenciador de estado
│   ├── index.css                 # Design System global & variáveis de temas (Dark/Light)
│   ├── App.css                   # Estilos de layout, grid, cards e badges
│   ├── services/
│   │   └── cnpjApi.js            # Cliente HTTP com fallback e normalizador de dados
│   ├── utils/
│   │   ├── cnpjValidator.js      # Funções de máscara, limpeza e validação de dígitos
│   │   └── pdfExport.js          # Utilitário de exportação de PDF (jsPDF)
│   └── components/
│       ├── Header.jsx            # Cabeçalho com logo, status da API e alternador de tema
│       ├── SearchForm.jsx        # Formulário de busca, atalhos rápidos e validações
│       ├── CnpjDetails.jsx       # Card principal com abas de detalhes e botões de ação
│       ├── HistorySidebar.jsx    # Barra lateral de histórico recente e favoritos
│       └── SkeletonLoader.jsx    # Efeito Shimmer para estado de carregamento
```

---

## ⚙️ Como Instalar e Rodar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

### Passos

1. **Clonar o repositório**:
   ```bash
   git clone https://github.com/lucasitdias/cosulta-cnpj.git
   cd cosulta-cnpj
   ```

2. **Instalar as dependências**:
   ```bash
   npm install
   ```

3. **Iniciar o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

4. **Acessar no navegador**:
   Abra a URL `http://localhost:5173/` no seu navegador.

---

## 🏗️ Gerar Build de Produção

Para criar a versão otimizada e minificada para produção:

```bash
npm run build
```

Os arquivos de produção serão gerados na pasta `dist/`, prontos para deploy na Vercel, Netlify, GitHub Pages ou qualquer servidor estático.

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<p align="center"> Desenvolvido com 💙 em React + Vite </p>
