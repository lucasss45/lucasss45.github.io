# Portfólio Pessoal — lucasss45.github.io

Site estático do portfólio de Lucas Vizeu, publicado no GitHub Pages.

## Estrutura

- `index.html`: marcação principal e conteúdo das seções.
- `assets/css/styles.css`: estilos globais, componentes e responsividade.
- `assets/js/main.js`: interações (tema, idioma, animações, previews e efeitos).

## Como rodar localmente

Como é um site estático, você pode abrir o `index.html` direto no navegador.

Se quiser um servidor local (recomendado):

```bash
# Python 3
python -m http.server 8080
```

Depois abra: `http://localhost:8080`

## Funcionalidades principais

- Tema claro/escuro com persistência em `localStorage`.
- Internacionalização básica (`pt`, `en`, `es`) por `data-*` attributes.
- Intro animation na primeira visita.
- Efeito de spotlight no mouse.
- Seções com reveal por `IntersectionObserver`.
- Count-up de métricas.
- Previews de projetos desenhados em `canvas`.
- Hero com animação de constelações e easter egg no teclado.

## Notas de manutenção

- Para textos multilíngues, manter `data-pt`, `data-en` e `data-es` no mesmo elemento.
- Links com `target="_blank"` devem usar `rel="noopener noreferrer"`.
- Evite adicionar CSS/JS inline no `index.html`; concentre em `assets/css` e `assets/js`.

## Publicação

Deploy via GitHub Pages no domínio:

- <https://lucasss45.github.io>
