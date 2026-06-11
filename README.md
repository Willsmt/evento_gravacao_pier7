# Pier 7 Music — Convite de Gravação ao Vivo

Página de convite (landing page) para a **gravação ao vivo das músicas da Pier 7 Music**, realizada na Igreja Evangelho Pleno. O objetivo é simples e direto: apresentar o evento, mostrar o repertório, indicar o local e permitir que as pessoas **confirmem presença** em poucos cliques.

## Por que tão simples?

Foi uma escolha consciente. O projeto é um convite rápido, com prazo curto e necessidade urgente. Em vez de adicionar frameworks (React, etc.) que só aumentariam a complexidade e o tempo de entrega, optei por **HTML, CSS e JavaScript puros** — sem build, sem dependências, sem servidor.

O resultado: uma página leve, **100% gratuita de hospedar**, com um fluxo de inscrição completo e funcional. O foco esteve em **resolver o problema por inteiro**, não em parecer sofisticado. As funcionalidades são poucas, mas são exatamente as que o cliente precisa.

## Funcionalidades

- **Hero com vídeo** — espaço reservado para a mensagem do artista (basta trocar o placeholder pelo embed do YouTube).
- **Repertório** — lista das músicas que serão tocadas, com links para Spotify e YouTube.
- **Confirmação de presença** — modal com formulário (nome + WhatsApp).
- **Mensagem direta no WhatsApp** — ao confirmar, gera uma mensagem pronta de confirmação para o inscrito.
- **Evento no Google Calendar** — botão que adiciona o evento direto na agenda do Google.
- **Mapa** — localização da igreja com link para abrir no Google Maps.
- **Responsivo** — adaptado para celular, tablet e telas pequenas.

## Estrutura dos arquivos

```
evento marcos/
├── index.html    → estrutura da página
├── styles.css    → todo o estilo visual
└── script.js     → lógica do modal, confirmação, WhatsApp e Calendar
```

## Como rodar

Não precisa de build nem servidor. Basta abrir o `index.html` no navegador.

(Opcional, para testar como em produção, com um servidor local:)

```bash
# Python
python -m http.server 8000

# ou Node
npx serve
```

## Configuração (antes de publicar)

Pontos a ajustar no código:

- **Vídeo** (`index.html`) — substituir o bloco `.video-placeholder` pelo `<iframe>` do YouTube.
- **Links das plataformas** (`index.html`) — apontar os botões de Spotify/YouTube para as URLs reais.
- **Repertório** (`index.html`) — preencher os nomes reais das músicas e durações.
- **Data/hora/local** (`index.html` e `script.js`) — conferir os valores do evento e a `calURL` do Google Calendar.
- **WhatsApp do organizador** (`script.js`) — trocar `NUM_ORGANIZADOR` (topo do arquivo) pelo número real.

## Status

Layout pronto. **Falta antes de publicar:**

- [ ] Adicionar o **vídeo** da mensagem do artista (embed do YouTube no `.video-placeholder`).
- [ ] Preencher as **músicas** que vão tocar no repertório.
- [ ] Conectar ao **Google Sheets** (ver abaixo).

## Integração com Google Sheets (registrar inscrições)

O código já está **todo preparado** — falta só criar o Apps Script e colar a URL.

No `script.js`, no topo, existe a constante:

```js
const SCRIPT_URL = '';
```

Enquanto ela estiver vazia, as inscrições **não são salvas** (o resto do fluxo — WhatsApp e Calendar — continua funcionando). Quando preenchida, cada confirmação envia `{ nome, phone, timestamp }` para a planilha automaticamente.

### Passo a passo

1. Crie uma planilha nova no **Google Sheets**.
2. Menu **Extensões → Apps Script**.
3. Cole o código abaixo, ajustando o nome da aba se precisar:

   ```js
   function doPost(e) {
     const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Página1');
     const dados = JSON.parse(e.postData.contents);
     sheet.appendRow([dados.timestamp, dados.nome, dados.phone]);
     return ContentService.createTextOutput('ok');
   }
   ```

4. Clique em **Implantar → Nova implantação → Tipo: App da Web**.
   - **Executar como:** Eu
   - **Quem pode acessar:** Qualquer pessoa
5. Copie a URL gerada (termina em `/exec`) e cole em `SCRIPT_URL` no `script.js`.

Pronto — a partir daí toda inscrição cai na planilha. Depois é só manipular esses dados (enviar mensagens, organizar o público, etc.) quando a planilha estiver completa.

## Stack

HTML · CSS · JavaScript (vanilla). Sem dependências.
