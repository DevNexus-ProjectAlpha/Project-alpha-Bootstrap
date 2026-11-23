# 🏋️ Project Alpha - Website

[![Vercel Deployment](https://img.shields.io/badge/deployment-vercel-informational?style=flat-square&logo=vercel&logoColor=white)](https://www.projectalpha.com.br/)
[![HTML5](https://img.shields.io/badge/HTML5-E34C26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
[![Bootstrap](https://img.shields.io/badge/Bootstrap_5-7952B3?style=flat-square&logo=bootstrap&logoColor=white)](https://getbootstrap.com)
[![Font Awesome](https://img.shields.io/badge/Font_Awesome-528DD7?style=flat-square&logo=fontawesome&logoColor=white)](https://fontawesome.com)

<p align="center">
  <a href="https://www.projectalpha.com.br/">
    <img src="Project%20Alpha%20-%20Website%20Source/assets/images/Logo-nav.png" alt="Project Alpha" width="271">
  </a>
</p>

> Uma plataforma digital moderna e responsiva para uma academia localizada em Presidente Prudente – SP, com matrícula online, gestão de avaliações físicas e recursos de acessibilidade.

**Acesse o site:** [https://www.projectalpha.com.br/](https://www.projectalpha.com.br/)

---

## 📋 Sobre a Project Alpha

### 🏢 A Empresa

A **Project Alpha** é uma academia de musculação localizada em **Presidente Prudente – SP**, criada com o propósito de promover saúde, qualidade de vida e bem-estar por meio da atividade física. Com uma estrutura moderna e uma loja especializada em suplementos e produtos naturais, a academia busca oferecer aos seus alunos uma experiência completa, integrando musculação, suplementação e tecnologia.

#### 🎯 Missão, Visão e Valores

| Aspecto | Descrição |
|--------|-----------|
| **Missão** | Transformar vidas por meio da saúde e do condicionamento físico |
| **Visão** | Ser referência regional em inovação, suplementação e performance |
| **Valores** | Comprometimento, Qualidade, Eficiência, Inovação e Ética |

### 🔍 Contexto de Desenvolvimento

O desenvolvimento deste projeto teve início com uma **pesquisa de campo**, incluindo:
- Visita técnica à academia Life Fit Pirapozinho
- Entrevista detalhada com o gestor do estabelecimento
- Análise das condições ergonômicas e da infraestrutura
- Identificação dos principais processos operacionais
- Relatório de ergonomia com recomendações de segurança e acessibilidade

### 📊 Análise de Mercado

O mercado de academias em Presidente Prudente e região apresenta:
- ✅ **Crescimento acelerado** — impulsionado pela maior conscientização sobre saúde
- ⚠️ **Alta concorrência** — necessidade contínua de inovação e diferenciação
- 🎯 **Desafios operacionais** — retenção de alunos e gestão eficiente de processos

### 💼 Soluções Desenvolvidas

A **DevNexus** (consultoria parceira) desenvolveu um conjunto de soluções:
- 🌐 **Website Institucional** (este projeto)
- 💻 **Sistema Desktop** — gestão interna da academia, em linguagem C com arquivos binários · [Repositório no GitHub](https://github.com/DevNexus-ProjectAlpha/Project-alpha-Sistema-Desktop)
- 🎨 **Identidade Visual** — branding completo
- ♿ **Diretrizes de Acessibilidade e Ergonomia**
- 📋 **Business Model Canvas** — estratégia de negócio
- 📄 **Especificação de Requisitos de Software (ERS)**

### 🎓 Propósito Acadêmico

Projeto desenvolvido na disciplina **Projeto Integrador de Disciplinas II**, do curso de **Análise e Desenvolvimento de Sistemas** da **Unoeste** (2026), contemplando:
- ✅ **Design Responsivo** — celular, tablet e computador
- ✅ **Ergonomia e Acessibilidade Web** — boas práticas da WCAG
- ✅ **Experiência do Usuário (UX)** — interface intuitiva
- ✅ **Formulários com validação em JavaScript e DOM** — máscaras e mensagens de erro do Bootstrap
- ✅ **HTML5 Semântico** — estrutura correta e acessível

> **Protótipo de alta fidelidade:** não há backend. Os dados ficam em vetores de objetos JavaScript e voltam ao estado inicial quando a página é recarregada. O pagamento é simulado.

## ✨ Funcionalidades Principais

### 🌐 Página Inicial
- Hero section, apresentação da academia, história, ergonomia e acessibilidade
- Modalidades e equipe de profissionais
- **Planos Start, Fit, Performance e Full** com benefícios, botão **Mensal / Anual** (mostra o valor anual com 15% de desconto), **aulas adicionais** com desconto por quantidade e **Alpha Pass**
- **Galeria de fotos** com "ver mais" e ampliação em modal
- Botão "Escolher plano" que leva ao cadastro com o pacote já selecionado

### 📝 Cadastro e Matrícula
- Formulário completo com **máscaras** (CPF, telefone, CEP, altura) e **validações** com o *Invalid Input* do Bootstrap, sem `alert()`
- Preenchimento automático do endereço pelo **ViaCEP**
- Escolha de pacote, aulas adicionais, Alpha Pass e período (mensal, trimestral, semestral ou anual), com resumo do valor total
- **Pagamento simulado** por Pix, cartão de crédito (com validação do número) ou na recepção, e tela de matrícula concluída

### 👤 Área do Aluno
- Login e perfil com os dados de cadastro e da matrícula

### 📊 Dashboard de Avaliações Físicas
- Tabela dinâmica com adicionar, excluir, excluir selecionados, busca, ordenação e paginação
- Contadores, histórico de alterações e tema claro/escuro
- Fluxo completo: **agendar → confirmar → realizar avaliação (IMC) → relatório para impressão**
- Reagendamento e validações de data, horário e conflito de agenda

### ♿ Acessibilidade
- **Widget de acessibilidade** em todas as páginas ([sinanisler/accessibility-widget](https://github.com/sinanisler/accessibility-widget)): tamanho do texto, alto contraste, filtros para daltonismo, fonte para dislexia, cursor maior, leitura em voz alta e mais
- **Widget VLibras** — tradução para LIBRAS
- **Navegação por teclado** e atributos **ARIA** em botões e elementos interativos

### 📱 Design Responsivo
- Adaptação para todos os tamanhos de tela
- Tabelas com rolagem lateral no tablet e layout em cards no celular

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Descrição |
|-----------|-----------|
| **HTML5** | Estrutura semântica |
| **CSS3** | Estilos e responsividade |
| **JavaScript** | Interatividade, validações e regras de negócio |
| **Bootstrap 5.3** | Layout, componentes e validação de formulários |
| **Template FitCore** | Base visual do site ([TemplateMonster](https://www.templatemonster.com/pt-br/templates-de-site/504542.html)) |
| **AdminLTE 4** | Tema das páginas de cadastro e login |
| **jQuery 3.7, Owl Carousel e VenoBox** | Interações da página inicial |
| **Font Awesome 6** | Ícones |
| **ViaCEP** | Busca de endereço pelo CEP |
| **VLibras** | Tradução para LIBRAS |
| **Vercel** | Hospedagem e deployment |

## 📁 Estrutura do Projeto

```
Project-alpha-Bootstrap/
│
├── README.md                         # Documentação do projeto
├── 📁 documentation/                 # Documentação do template
│
└── 📁 Project Alpha - Website Source/
    ├── index.html                    # Página inicial
    ├── cadastro.html                 # Cadastro e matrícula
    ├── login.html                    # Login do aluno
    ├── aluno.html                    # Perfil do aluno
    ├── dashboard.html                # Dashboard de avaliações físicas
    │
    └── 📁 assets/
        ├── 📁 css/                   # custom-home.css = identidade visual da Project Alpha
        ├── 📁 images/                # Logo, galeria, equipe e imagens do site
        └── 📁 js/
            ├── script.js             # Interações da página inicial
            ├── dashboard.js          # Lógica do dashboard
            ├── planos.js             # Botão Mensal / Anual dos planos
            ├── matricula.js          # Planos, valores e pagamento
            ├── acessibilidade.js     # Carrega o widget de acessibilidade
            ├── 📁 accessibility-widget/  # Widget de acessibilidade (GPL-3.0)
            ├── 📁 mask/              # Máscaras dos campos
            └── 📁 validation/        # Validações do cadastro
```

## 🚀 Como Executar

### Opção 1: Abrir localmente
1. Clone ou baixe o repositório:
   ```bash
   git clone https://github.com/DevNexus-ProjectAlpha/Project-alpha-Bootstrap.git
   ```
2. Abra `Project Alpha - Website Source/index.html` no navegador

### Opção 2: Com um servidor local (recomendado)
```bash
# Dentro da pasta "Project Alpha - Website Source"

# Usando Python 3
python -m http.server 8000

# Ou usando Node.js
npx http-server

# Ou no VS Code: instale a extensão Live Server e clique em "Open with Live Server"
```

Acesse `http://localhost:8000` (ou o endereço indicado).

### Opção 3: Deployment no Vercel
1. Importe o repositório no [Vercel](https://vercel.com)
2. Em **Root Directory**, selecione a pasta `Project Alpha - Website Source`
3. Framework Preset: **Other** (site estático, sem build)
4. Cada push na branch `main` atualiza o site automaticamente

> Algumas partes precisam de internet: as bibliotecas carregadas por CDN, a busca de CEP e o VLibras.

## 📖 Páginas do Sistema

| Página | Arquivo | Descrição |
|--------|---------|-----------|
| Início | `index.html` | Apresentação da academia, planos, aulas, galeria e equipe |
| Cadastro | `cadastro.html` | Cadastro, escolha do plano e pagamento da matrícula |
| Entrar | `login.html` | Login do aluno |
| Área do aluno | `aluno.html` | Perfil com dados de cadastro e matrícula |
| Dashboard | `dashboard.html` | Agendamento e acompanhamento das avaliações físicas |

## 🎯 Objetivos do Projeto

### Educacional
- Demonstrar a aplicação prática de conceitos de desenvolvimento web
- Integrar HTML5, CSS3, JavaScript e Bootstrap em um projeto real
- Aplicar design responsivo, acessibilidade e ergonomia web
- Implementar validações e máscaras de formulário com JavaScript e DOM

### Prático/Comercial
- Fortalecer a competitividade da Project Alpha no mercado
- Otimizar processos operacionais da academia
- Proporcionar uma melhor experiência aos alunos
- Integrar tecnologia aos serviços de fitness e suplementação

### Técnico
- Código organizado por página e responsabilidade
- Deploy contínuo no Vercel
- Boas práticas de código limpo e semântico
- Conformidade com padrões web

## 📚 Recursos e Referências

- [MDN Web Docs - HTML5](https://developer.mozilla.org/pt-BR/docs/Web/HTML)
- [MDN Web Docs - CSS3](https://developer.mozilla.org/pt-BR/docs/Web/CSS)
- [Documentação do Bootstrap 5](https://getbootstrap.com/docs/5.3/)
- [Guia de Acessibilidade Web (W3C)](https://www.w3.org/WAI/fundamentals/accessibility-intro/pt-BR)
- [VLibras](https://www.gov.br/governodigital/pt-br/acessibilidade-e-usuario/vlibras)
- [ViaCEP](https://viacep.com.br/)
- [Documentação Vercel](https://vercel.com/docs)

## 📝 Histórico de Versões

### v3.0.0 - Nova versão em Bootstrap
**Data:** 2026-11-21

#### 🚀 Adicionado
- **Dashboard de avaliações físicas** funcional: tabela dinâmica, contadores, histórico, cálculo de IMC, reagendamento e relatório para impressão
- **Plano e matrícula no cadastro:** pacotes, aulas adicionais, Alpha Pass, períodos com desconto e pagamento simulado
- **Planos e aulas adicionais** na página inicial, com botão Mensal / Anual
- **Widget de acessibilidade** e **VLibras** em todas as páginas
- **Galeria de fotos** e **página do aluno**

#### 🔧 Modificado
- Site reconstruído com **Bootstrap 5**
- Validações do cadastro sem `alert()` e com correções de usabilidade
- Removidas as páginas e imagens antigas do template

### v2.0.0 - Atualização Geral de Acessibilidade (site anterior)
**Data:** 2026-08-15
- Menu flutuante de acessibilidade, filtros de daltonismo, modo alto contraste e VLibras
- Correção da ordem de navegação por teclado, atributos ARIA e textos alternativos nas imagens

---

## 🤝 Parceria e Consultoria

Este projeto foi desenvolvido em parceria com a **DevNexus**, consultoria especializada em soluções digitais e estratégicas. A equipe DevNexus contribuiu com:

- Análise de requisitos e pesquisa de mercado
- Arquitetura da solução digital
- Design e prototipagem
- Implementação e testes
- Suporte e manutenção

### 📍 Project Alpha - Academia

**Localização:** Presidente Prudente – SP  
**Ramo:** Fitness, Musculação e Suplementação  
**Website:** [https://www.projectalpha.com.br/](https://www.projectalpha.com.br/)

---

## 👥 Equipe DevNexus

| Integrante | Função |
|---|---|
| **Gustavo Santos Ribeiro de Goes** | Líder do Projeto |
| Ana Clara Lima Amorim | Desenvolvedora |
| Igor Domingos Marques | Desenvolvedor |
| Igor dos Santos Pereira | Desenvolvedor |
| Ismael Renan Pirondi Gola | Desenvolvedor |
| Kauan Felipe Oliveira Gois | Desenvolvedor |
| Luiggi de Aguiar Bezerra | Desenvolvedor |
| William Eduardo di Martini Minorelli | Desenvolvedor |

### 🧩 Contribuições

| Área | Responsáveis |
|---|---|
| **Sistema Desktop** | Toda a equipe ([partes de cada integrante](https://github.com/DevNexus-ProjectAlpha/Project-alpha-Sistema-Desktop#-contribuições)) |
| **Website** | Gustavo Santos, William Minorelli, com feedback e revisão de toda a equipe |
| **Modelo de planos e aulas adicionais** | Kauan Gois e Gustavo Santos |
| **Documentação (ERS) e organização** | Gustavo Santos, com revisão da equipe |
| **Gestão, alinhamento e integração da versão final** | Gustavo Santos |

Acadêmicos de **Análise e Desenvolvimento de Sistemas (ADS)** da **Unoeste**.

## 📞 Contato e Suporte

Para dúvidas ou sugestões sobre o projeto, entre em contato pelo repositório no GitHub.

## 🙏 Créditos

- **Template base:** [FitCore – Fitness & Gym HTML5 Template](https://www.templatemonster.com/pt-br/templates-de-site/504542.html), da TemplateMonster, gratuito para fins educacionais. O layout foi adaptado à identidade visual da Project Alpha, e as páginas de matrícula, área do aluno e dashboard foram criadas pela equipe.
- **Widget de acessibilidade:** [sinanisler/accessibility-widget](https://github.com/sinanisler/accessibility-widget) (GPL-3.0).
- **VLibras:** Governo Federal.

## 📄 Licença

Este projeto é fornecido como material educacional. Todos os direitos reservados aos autores.

O widget de acessibilidade em `assets/js/accessibility-widget/` é de terceiros e segue a própria licença (GPL-3.0), incluída na pasta.

---

<div align="center">

**Desenvolvido para fins acadêmicos · Presidente Prudente – SP · 2026**

</div>
