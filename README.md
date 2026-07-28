# 🏢 Consulta CNPJ Pro

<p align="center">
  <img src="https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/RFB-IN%202.229%20Alfanum%C3%A9rico-8b5cf6?style=for-the-badge" alt="Novo CNPJ Alfanumérico" />
  <img src="https://img.shields.io/badge/Style-Glassmorphism-FF69B4?style=for-the-badge" alt="Glassmorphism" />
  <img src="https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel Status" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License" />
</p>

Aplicação web moderna, rápida e altamente estilizada para **consulta de dados cadastrais de empresas (CNPJ)** junto à Receita Federal do Brasil. Desenvolvida em **React + Vite** com visual em **Glassmorphism**, suporte ao **Novo Modelo de CNPJ Alfanumérico (Instrução Normativa RFB nº 2.229)** e ao modelo tradicional, **Tema Escuro/Claro**, **Fallback Automático de APIs**, exportação oficial em **PDF/JSON** e gerenciamento local de histórico e favoritos.

---

## 🔤 Suporte ao Novo CNPJ Alfanumérico (RFB IN 2.229)

A Receita Federal do Brasil estabeleceu o formato de **CNPJ Alfanumérico** mantendo a estrutura de 14 caracteres:
- **Base (8 posições)**: Letras (A-Z) e Números (0-9)
- **Ordem/Filial (4 posições)**: Letras (A-Z) e Números (0-9)
- **Dígitos Verificadores (2 posições)**: Números (0-9) calculados pelo algoritmo oficial Módulo 11 (tabela de equivalência ASCII - 48).

A aplicação valida e formata perfeitamente tanto o novo padrão alfanumérico (ex: `12.ABC.345/A001-90`) quanto o padrão numérico tradicional (ex: `33.000.167/0001-01`).

---

## ✨ Funcionalidades Principais

- 🔍 **Busca Inteligente com Máscara Alfanumérica**: Formatação dinâmica (`XX.XXX.XXX/XXXX-XX`) aceitando letras e números.
- 🛡️ **Validador Módulo 11 da Receita Federal**: Algoritmo que calcula os dois dígitos verificadores para sequências numéricas e alfanuméricas.
- ⚡ **Fallback Automático de APIs**:
  - **Principal**: [BrasilAPI](https://brasilapi.com.br/) (`https://brasilapi.com.br/api/cnpj/v1/{cnpj}`)
  - **Secundária (Fallback)**: [Minha Receita](https://minhareceita.org/) (`https://minhareceita.org/{cnpj}`)
- 📊 **Visualização por Abas Organizadas**:
  - **Visão Geral**: Badge de Situação Cadastral (ATIVA, BAIXADA, SUSPENSA), Tag de Padrão (Alfanumérico / Numérico), Razão Social, Nome Fantasia, Capital Social formatado em R$, Data de Abertura, Porte e Natureza Jurídica.
  - **Quadro de Sócios (QSA)**: Cards com avatares, nomes, cargos/qualificações, país de origem e faixa etária.
  - **Atividades Econômicas (CNAE)**: CNAE Principal destacado com código/descrição e lista completa de CNAEs Secundários.
  - **Endereço & Contato**: Logradouro completo, Bairro, CEP, Município/UF, E-mail, Telefone e **Mapa Embed Interativo (Google Maps / OpenStreetMap)**.
- 📄 **Exportação de Comprovante em PDF**: Gerador de comprovantes cadastrais em formato idêntico ao modelo oficial da Receita Federal (utilizando `jsPDF`).
- 💾 **Exportação em JSON & Copiar Resumo**: Baixe o objeto completo em `.json` ou copie os dados estruturados em texto com 1 clique.
- ⭐ **Histórico & Favoritos**: Salvamento automático das consultas recentes no `localStorage` com opção de favoritar empresas.
- 🌓 **Tema Escuro / Claro**: Alternância de temas em tempo real com preservação de preferência do usuário.
- 🚀 **Atalhos Rápidos**: Botões de 1 clique para testar CNPJs numéricos e **Gerador de CNPJ Alfanumérico Válido**.

---

## 🚀 Link da Aplicação em Produção (Vercel)

👉 **[https://cosulta-cnpj-ten.vercel.app](https://cosulta-cnpj-ten.vercel.app)**

---

## 🛠️ Tecnologias Utilizadas

- **Core**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Estilização**: Vanilla CSS com variáveis customizadas, Glassmorphism, gradientes modernos e tipografia [Google Fonts (Inter & Outfit)](https://fonts.google.com/)
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Gerador de PDF**: [jsPDF](https://github.com/parallax/jsPDF)
- **APIs Púbicas**: BrasilAPI & Minha Receita
- **Hospedagem**: [Vercel](https://vercel.com/)

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

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<p align="center"> Desenvolvido com 💙 em React + Vite </p>
