# Pier 7 Music — Convite de Gravação ao Vivo

Página de convite (landing page) para a **gravação ao vivo das músicas da Pier 7 Music**, realizada na Igreja Evangelho Pleno. O objetivo é simples e direto: apresentar o evento, mostrar o repertório, indicar o local e permitir que as pessoas **confirmem presença** em poucos cliques.

## Por que tão simples?

Foi uma escolha consciente. O projeto é um convite rápido, com prazo curto e necessidade urgente. Em vez de adicionar frameworks (React, etc.) que só aumentariam a complexidade e o tempo de entrega, optei por **HTML, CSS e JavaScript puros** — sem build, sem dependências, sem servidor.

O resultado: uma página leve, **100% gratuita de hospedar**, com um fluxo de inscrição completo e funcional. O foco esteve em **resolver o problema por inteiro**, não em parecer sofisticado. As funcionalidades são poucas, mas são exatamente as que o cliente precisa.

## Funcionalidades

- **Hero com vídeo** — espaço reservado para a mensagem do artista (basta trocar o placeholder pelo embed do YouTube).
- **Repertório** — as 3 músicas da noite, cada uma com botões para ouvir no YouTube e no Spotify (mais os links do perfil do artista).
- **Avisos** — dress code (paleta branco/preto/marrom, por ser uma gravação) e recomendação de chegar mais cedo.
- **Confirmação de presença** — modal com formulário (nome + WhatsApp), com máscara e validação.
- **Registro no Google Sheets** — cada confirmação é gravada automaticamente numa planilha.
- **Compartilhar convite** — ao confirmar, gera uma mensagem pronta para o inscrito repassar o convite a um amigo pelo WhatsApp.
- **Evento no Google Calendar** — botão que adiciona o evento (com data, local e avisos) direto na agenda do Google.
- **Prévia de compartilhamento** — meta tags Open Graph + imagem de capa (`capa.jpg`) para o link exibir uma prévia bonita no WhatsApp/redes.
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

## Configuração

Já configurado:

- [x] **Links das plataformas** e do **repertório** (Spotify/YouTube por música + perfil do artista).
- [x] **Data/hora/local** — 15 de agosto de 2026, 20h, Igreja Evangelho Pleno (Estr. Iguatemi, 3853), refletido também na `calURL` do Google Calendar.
- [x] **Google Sheets** — `SCRIPT_URL` preenchida no topo do `script.js`; as inscrições já são gravadas.
- [x] **Prévia de compartilhamento** — meta tags Open Graph + `capa.jpg`.

Opcional (desativado por padrão):

- **WhatsApp do organizador** (`script.js`) — preencher `NUM_ORGANIZADOR` e descomentar a linha de notificação no fim de `confirmar()` para receber um aviso a cada nova inscrição.

## Status

**Falta antes de publicar:**

- [ ] Adicionar o **vídeo** da mensagem do artista (embed do YouTube no `.video-placeholder`, em `index.html`) — aguardando a gravação.

Depois de publicar no Vercel, para a prévia nova aparecer no WhatsApp (que faz cache), teste o link com um parâmetro de versão, ex.: `https://evento-gravacao-pier7.vercel.app/?v=2`.

## Integração com Google Sheets (registrar inscrições)

**Já conectado** — cada confirmação envia `{ nome, phone, timestamp }` para a planilha automaticamente, via a `SCRIPT_URL` preenchida no topo do `script.js`. Se ela ficar vazia (`''`), as inscrições deixam de ser salvas (o resto do fluxo — compartilhar e Calendar — continua funcionando).

O passo a passo abaixo fica como referência, caso seja preciso recriar a planilha ou o Web App.

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
