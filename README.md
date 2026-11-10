# Radar Territorial — Painel de Inteligência Territorial

Global Solution 2026.2 — Cross-Platform Application Development (FIAP)

## Integrantes do Grupo
* **Gustavo Lemos Diogenes** - RM: 565579
* **Pedro Paulo Barbosa Ross** - RM: 563038

---

## O Problema
Gestores públicos costumam descobrir problemas urbanos depois que eles afetam a população: um bairro que estoura a meta de consumo de água, uma rede de energia sobrecarregada, o lixo acumulado depois de uma semana de chuva. Os dados existem, mas ficam espalhados em planilhas e relatórios, sem uma leitura que aponte onde olhar primeiro.

## A Solução
O **Radar Territorial** é um app mobile que funciona como a central de decisões de um gestor público. Ele reúne dados de **água, energia, resíduos e clima**, mostra o cenário em dashboards e emite **alertas preditivos**. Todo alerta vem com **justificativa, nível de confiança e limitações**.

O app apoia a decisão, mas nunca decide sozinho: o gestor lê o alerta e registra a sua própria decisão (acionar equipe, continuar monitorando ou descartar), com justificativa e responsável.

## Os Usuários do App
* **Gestor público / secretário municipal:** consulta o painel, avalia os alertas e registra decisões rastreáveis.

---

## Funcionalidades

1. **Painel (dashboard):** filtros por bairro e por tema, indicadores (último mês, variação em 3 meses, % da meta), gráfico de barras dos últimos 12 meses com linha da meta e previsão de chuva dos próximos 7 dias.
2. **Alertas preditivos:** lista ordenada do mais grave para o menos grave, com selo de risco (**atenção**, **médio**, **alto**) e a confiança de cada previsão.
3. **Detalhe do alerta:** justificativa em linguagem simples, barra de confiança, gráfico de histórico + projeção com margem de erro e lista de limitações.
4. **Registro de decisão (formulário com validação):** o gestor escolhe a ação, escreve a justificativa e se identifica. O app barra dados pessoais (CPF, e-mail, telefone).
5. **Histórico de decisões:** lista persistida no aparelho (AsyncStorage), que sobrevive ao fechar e reabrir o app.
6. **Sobre:** fontes de dados, limitações e política de privacidade dentro do próprio app.

### Como cada requisito da Global Solution é atendido

| Requisito | Onde está |
|---|---|
| Flutter ou React Native | React Native + Expo + TypeScript |
| Navegação entre telas | `App.tsx` (estado `telaAtual`) + `components/TabBar.tsx` + botão voltar do Android |
| Gerenciamento de estado | `useState`/`useEffect`/`useMemo` no `App.tsx`; estado local de filtros no `PainelScreen` |
| Consumo de APIs | `services/climaService.ts` → API Open-Meteo |
| Persistência de dados | `services/storageService.ts` → AsyncStorage (decisões e cache do clima) |
| Formulários com validação | `screens/DecisaoScreen.tsx` + `utils/validacao.ts` |
| Componentes reutilizáveis com identidade visual | `src/components/` + `src/theme/index.ts` (verde-petróleo) |
| Acessibilidade | papéis e rótulos de acessibilidade, alvos de toque ≥ 48 px, contraste, erros em texto, gráficos com texto alternativo |
| Privacidade dos cidadãos | só dados agregados, validação contra dados pessoais, armazenamento local |
| Alertas com justificativa, confiança e limitações | `services/analiseService.ts` + `AlertaDetalheScreen.tsx` |
| Decisão humana | o app só registra a decisão; nenhuma ação é automática |

---

## Estrutura Técnica do Projeto

```text
radar-territorial/
├── src/
│   ├── components/     # Componentes visuais reutilizáveis
│   │   ├── Botao.tsx, Chip.tsx, Selo.tsx, Cabecalho.tsx, TabBar.tsx
│   │   ├── IndicadorCard.tsx, GraficoBarras.tsx, BarraConfianca.tsx
│   │   ├── AlertaCard.tsx, DecisaoCard.tsx, AvisoBox.tsx, CampoTexto.tsx
│   │   └── index.ts
│   ├── data/           # Dados sintéticos (séries mensais, bairros, metas)
│   │   └── mock.ts
│   ├── screens/        # Telas do app
│   │   ├── PainelScreen.tsx
│   │   ├── AlertasScreen.tsx
│   │   ├── AlertaDetalheScreen.tsx
│   │   ├── DecisaoScreen.tsx
│   │   ├── HistoricoScreen.tsx
│   │   ├── SobreScreen.tsx
│   │   └── index.ts
│   ├── services/       # Camada de dados e regras
│   │   ├── storageService.ts   # AsyncStorage (decisões e cache do clima)
│   │   ├── climaService.ts     # API Open-Meteo (com cache e fallback)
│   │   ├── analiseService.ts   # Indicadores, previsão e geração de alertas
│   │   └── index.ts
│   ├── theme/          # Cores e medidas (identidade visual)
│   ├── types/          # Tipagens globais (Alerta, Decisao, Serie...)
│   └── utils/          # formatadores.ts e validacao.ts
├── App.tsx             # Navegação e gerenciador de estado global
```

---

## Como o Alerta Preditivo Funciona

Escolhemos um modelo simples e explicável, em vez de uma "caixa-preta", para que o gestor consiga entender e contestar o alerta.

1. **Projeção:** ajustamos uma **reta (regressão linear)** aos 12 últimos meses de cada bairro/tema e a prolongamos por 3 meses.
2. **Nível de risco:** comparamos a projeção com a **meta** do tema.
   * projeção ≥ 105% da meta → **alto**
   * projeção ≥ 100% → **médio**
   * projeção ≥ 95% → **atenção**
   * abaixo disso → sem alerta
3. **Confiança:** é o **R²** da reta (quanto da variação histórica ela explica), limitado a 95%, porque nenhuma previsão é certeza. Séries muito oscilantes geram confiança **baixa** e um aviso explícito.
4. **Margem de erro:** ±1,96 desvio-padrão dos resíduos (cerca de 95% dos meses).
5. **Alerta de clima:** soma a chuva prevista para 7 dias (limiares didáticos de 25, 40 e 80 mm; ou pico diário de 30 e 50 mm). A confiança diminui para os dias mais distantes.

| Tema | Unidade | Meta (limite) |
|---|---|---|
| Água | L/hab/dia | 160 |
| Energia | kWh/domicílio/mês | 200 |
| Resíduos | kg/hab/mês | 34 |

---

## Fontes de Dados

* **Clima (dados reais):** API pública [Open-Meteo](https://open-meteo.com), sem chave, previsão de 7 dias para o centro de São Paulo (`-23.55, -46.63`). Resiliência em 3 níveis, com a origem exibida no painel:
  1. API disponível → **"Dados ao vivo"**
  2. API indisponível → **última consulta salva** no aparelho (cache)
  3. sem cache → **dados de demonstração**
* **Consumo de água, energia e resíduos (dados sintéticos):** séries fictícias de 12 meses para 4 bairros (Itaquera, Capão Redondo, Pinheiros e Santana), criadas em `src/data/mock.ts` para exercitar diferentes cenários. **Não representam o consumo real** de nenhum bairro. Em produção, viriam da concessionária ou da prefeitura.

## Limitações
* O modelo é uma **tendência linear** com 12 pontos: não captura **sazonalidade** (verão/inverno, feriados) nem eventos pontuais.
* A **confiança** é uma estimativa estatística do modelo, não uma garantia.
* O clima é **único para a cidade inteira**, sem detalhe por bairro, relevo ou drenagem.
* Os **limiares** de chuva e as metas de consumo são referências didáticas, não normas oficiais (ex.: Defesa Civil).
* Os dados de consumo são **sintéticos**.
* Os alertas indicam **onde olhar primeiro** e não substituem a avaliação de campo.

## Privacidade e Acessibilidade
* **Dados agregados:** o app trabalha só com dados por bairro. Nenhum dado pessoal de cidadão é coletado, modelado ou armazenado.
* **Proteção contra dados pessoais:** o formulário recusa textos com CPF, e-mail ou telefone.
* **Armazenamento local:** o histórico de decisões fica apenas no aparelho. A única informação enviada à internet são as coordenadas do centro da cidade.
* **Acessibilidade:** componentes com `accessibilityRole`/`accessibilityLabel`; áreas de toque de pelo menos 48 px; contraste entre texto e fundo; erros de formulário em texto (e não só em cor) e anunciados por leitores de tela; gráficos com descrição textual dos valores.

---

## Como Executar o App

Este projeto foi construído com React Native, Expo e TypeScript.

### Pré-requisitos
* [Node.js](https://nodejs.org/) instalado.
* Aplicativo **Expo Go** no celular (Android ou iOS) ou um emulador configurado.

### Passo a Passo
1. Clone o repositório e abra o terminal na pasta raiz.
2. Instale as dependências:
```bash
npm install
```
3. Inicie o servidor do Expo:
```bash
npx expo start
```
4. Escaneie o QR Code com o **Expo Go**. Para abrir no navegador, use `npm run web`.

### Fluxo do Aplicativo (Ponta a Ponta)
1. **Painel:** o gestor escolhe bairro e tema e vê os indicadores, o gráfico e a previsão de chuva (vinda da API).
2. **Alertas:** toca em **Ver alertas** e escolhe um alerta, começando pelos de risco alto.
3. **Detalhe:** lê a justificativa, a confiança, a projeção e as limitações.
4. **Decisão:** toca em **Registrar decisão**, escolhe a ação, justifica e se identifica. Campos inválidos mostram mensagens de erro.
5. **Histórico:** a decisão aparece no topo da lista e **continua lá** ao fechar e reabrir o app.
6. **Teste de resiliência:** coloque o aparelho em modo avião e toque em **Atualizar clima**. O painel avisa que está usando dados salvos.
