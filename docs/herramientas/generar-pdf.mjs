// Genera los manuales en PDF (listos para compartir) a partir de los .md de docs/.
//   npm --prefix docs/herramientas install      (una sola vez)
//   npm --prefix docs/herramientas run pdf
// Salida: docs/pdf/MedCloud - Manual de uso.pdf y MedCloud - Manual tecnico.pdf
// Usa el Chrome o Edge instalado (variable CHROME_PATH para indicar otro).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';
import puppeteer from 'puppeteer-core';
import { PDFDocument } from 'pdf-lib';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const aqui = path.dirname(fileURLToPath(import.meta.url));
const DOCS = path.resolve(aqui, '..');
const SALIDA = path.join(DOCS, 'pdf');

const PRODUCTO = {
  nombre: 'MedCloud',
  descripcion: 'Gestión clínica integral',
  version: '1.0',
  fecha: (() => {
    const s = new Date().toLocaleDateString('es-AR', { month: 'long', year: 'numeric' }).replace(' de ', ' ');
    return s.charAt(0).toUpperCase() + s.slice(1);
  })()
};

const leer = (rel) => fs.readFileSync(path.join(DOCS, rel), 'utf8').replace(/\r\n/g, '\n');
const mayus = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Divide un .md en { titulo (h1), secciones: [{ titulo (h2), cuerpo }], intro }
const dividir = (md) => {
  const titulo = (md.match(/^# (.+)$/m) || [, ''])[1].trim();
  const sinH1 = md.replace(/^# .+\n/m, '');
  const partes = sinH1.split(/^## /m);
  const intro = partes.shift().trim();
  const secciones = partes.map(p => {
    const [primera, ...resto] = p.split('\n');
    return { titulo: primera.trim(), cuerpo: resto.join('\n').trim() };
  });
  return { titulo, intro, secciones };
};
const unir = (secciones) => secciones.map(s => `## ${s.titulo}\n\n${s.cuerpo}`).join('\n\n');

// ---------- Capítulos de cada manual ----------

const capitulosUsuario = () => {
  const readme = dividir(leer('manual-usuario/README.md'));
  const tabla = readme.secciones.find(s => s.titulo === 'Pantallas').cuerpo;
  const paginas = [];
  let seccion = '';
  for (const linea of tabla.split('\n')) {
    const m = linea.match(/^\|\s*([^|]*?)\s*\|\s*([^|]+?)\s*\|\s*\[[^\]]+\]\(([^)]+\.md)\)/);
    if (!m) continue;
    if (m[1]) seccion = m[1];
    if (!paginas.some(p => p.archivo === m[3])) paginas.push({ archivo: m[3], eyebrow: seccion });
  }
  const primeros = readme.secciones.filter(s => !['Pantallas', 'Novedades'].includes(s.titulo));
  const novedades = readme.secciones.find(s => s.titulo === 'Novedades');
  return [
    { id: 'README.md', eyebrow: 'Introducción', titulo: `Qué es ${PRODUCTO.nombre}`, md: `${readme.intro}\n\n${unir(primeros)}`, extra: 'pantallaGeneral' },
    ...paginas.map(p => {
      const md = leer(`manual-usuario/${p.archivo}`);
      return { id: p.archivo, eyebrow: p.eyebrow, titulo: dividir(md).titulo, md: md.replace(/^# .+\n/m, '') };
    }),
    { id: 'novedades', eyebrow: 'Historial', titulo: 'Novedades', md: novedades.cuerpo, anexo: 'A' }
  ];
};

const capitulosTecnico = () => {
  const readme = dividir(leer('manual-tecnico/README.md'));
  const introSinTabla = readme.intro.split('\n').filter(l => !l.startsWith('|') && !l.startsWith('Convenciones del proyecto')).join('\n');
  const archivos = [
    ['arquitectura.md', 'Arquitectura'],
    ['instalacion.md', 'Instalación'],
    ['base-de-datos.md', 'Base de datos'],
    ['api.md', 'API'],
    ['modulos.md', 'Módulos']
  ];
  return [
    { id: 'README.md', eyebrow: 'Introducción', titulo: 'Visión general', md: introSinTabla, extra: 'diagrama' },
    ...archivos.map(([archivo, eyebrow]) => {
      const md = leer(`manual-tecnico/${archivo}`);
      // Sin el esquema en texto de arquitectura.md: lo reemplaza la figura del capítulo 1
      return { id: archivo, eyebrow, titulo: dividir(md).titulo, md: md.replace(/^# .+\n/m, '').replace(/```[^`]*HTTP\/JSON[^`]*```\n*/, '') };
    }),
    (() => {
      const md = leer('manual-tecnico/changelog.md');
      return { id: 'changelog.md', eyebrow: 'Historial', titulo: 'Historial de cambios', md: md.replace(/^# .+\n/m, ''), anexo: 'A' };
    })()
  ];
};

const MANUALES = [
  {
    clave: 'uso',
    archivo: `${PRODUCTO.nombre} - Manual de uso.pdf`,
    etiqueta: 'Manual de uso',
    titulo: `Cómo usar ${PRODUCTO.nombre}`,
    subtitulo: 'Guía paso a paso para recepción, médicos y administradores: pacientes, turnos, historia clínica, caja diaria y liquidaciones.',
    ilustracion: 'app',
    aviso: {
      tipo: 'info',
      titulo: 'Cómo leer este manual',
      texto: 'Cada capítulo corresponde a una pantalla del menú e indica qué roles pueden usarla. Los nombres de botones y campos están en <b>negrita</b>. Los recuadros amarillos avisan de algo que conviene revisar antes de confirmar.'
    },
    capitulos: capitulosUsuario
  },
  {
    clave: 'tecnico',
    archivo: `${PRODUCTO.nombre} - Manual tecnico.pdf`,
    etiqueta: 'Manual técnico',
    titulo: 'Arquitectura y desarrollo',
    subtitulo: `Cómo está construido ${PRODUCTO.nombre}, qué tecnologías usa, dónde vive la lógica de negocio, cómo instalarlo y cómo extenderlo.`,
    ilustracion: null,
    versionTexto: 'React 19 · Node · SQL Server',
    aviso: {
      tipo: 'peligro',
      titulo: 'Datos de salud y base productiva',
      texto: 'MedCloud guarda datos de salud (Ley 25.326 y Ley 26.529). La base del servidor local es productiva: no se prueba contra ella y al levantar el backend se envían mails reales. Este documento no incluye contraseñas ni claves: solo el nombre de cada variable y dónde se configura.'
    },
    capitulos: capitulosTecnico
  }
];

// ---------- Markdown → HTML ----------

const renderCapitulo = (cap, numero, ids) => {
  let md = cap.md;
  let lead = '';
  const ficha = [];
  // Páginas del manual de usuario: "Para qué sirve / Quién puede usarla / Dónde está"
  md = md.replace(/^\*\*(Para qué sirve|Quién puede usarla|Quién puede usarlo|Dónde está):\*\*\s*(.+)$/gm, (_, clave, texto) => {
    if (clave === 'Para qué sirve') lead = mayus(texto);
    else ficha.push([clave.replace('usarlo', 'usarla'), mayus(texto)]);
    return '';
  }).trim();
  // Si el capítulo arranca con un párrafo común, se usa como bajada
  if (!lead) {
    const m = md.match(/^([^#|>\-\d`*\n][^\n]*(?:\n[^\n#|>\-`]+)*)\n*/);
    if (m && !m[1].startsWith('**')) { lead = m[1]; md = md.slice(m[0].length); }
  }

  const renderer = new marked.Renderer();
  renderer.link = function ({ href, tokens }) {
    const texto = this.parser.parseInline(tokens);
    if (/^https?:/.test(href)) return `<a href="${esc(href)}">${texto}</a>`;
    const destino = href.split('#')[0].split('/').pop();
    return ids[destino] ? `<a href="#${ids[destino]}">${texto}</a>` : `<span class="ref">${texto}</span>`;
  };
  const inline = (s) => marked.parseInline(s, { renderer });
  let html = marked.parse(md, { renderer, gfm: true });

  html = html
    .replace(/<blockquote>\s*<p>⚠️\s*/g, '<div class="aviso aviso--atencion"><span class="aviso-t">Atención</span><p>')
    .replace(/<blockquote>\s*<p>ℹ️\s*/g, '<div class="aviso aviso--info"><span class="aviso-t">Para tener en cuenta</span><p>')
    .replace(/<blockquote>/g, '<div class="aviso aviso--info">')
    .replace(/<\/blockquote>/g, '</div>')
    .replace(/<strong>(F\d{1,2}|Esc|Enter|Ctrl\+[A-Z]|Supr|Tab)<\/strong>/g, '<kbd>$1</kbd>')
    // Rutas y códigos largos: se cortan después de "/", "?" o "," y no en medio de una palabra
    .replace(/<code>([^<]{18,})<\/code>/g, (_, c) => `<code>${c.replace(/([/?,])/g, '$1<wbr>')}</code>`)
    .replace(/<table>/g, '<div class="tabla"><table>').replace(/<\/table>/g, '</table></div>');

  const numeroTxt = cap.anexo || String(numero);
  return `
<section class="cap" id="${ids[cap.id]}">
  <div class="cap-eyebrow"><span class="cap-num">${numeroTxt}</span>${esc(cap.eyebrow)}<span class="marca">@@CAP-${numeroTxt}@@</span></div>
  <h1>${esc(cap.titulo)}</h1>
  ${lead ? `<p class="lead">${inline(lead)}</p>` : ''}
  ${ficha.length ? `<div class="ficha">${ficha.map(([k, v]) => `<div><span class="ficha-k">${esc(k)}</span><span class="ficha-v">${inline(v)}</span></div>`).join('')}</div>` : ''}
  ${cap.extra === 'diagrama' ? DIAGRAMA : ''}
  ${html}
</section>`;
};

// Diagrama de capas (manual técnico)
const DIAGRAMA = `
<figure class="diagrama">
  <div class="dg-caja">
    <div class="dg-titulo">Navegador</div><div class="dg-sub">frontend · React 19 + Vite</div>
    <div class="dg-item">Pantallas por rol</div><div class="dg-item">ProtectedRoute</div><div class="dg-item dg-item--suave">Token en el navegador</div>
  </div>
  <div class="dg-flecha"><span>HTTP · JSON</span><i></i><span>token JWT</span></div>
  <div class="dg-caja dg-caja--oscura">
    <div class="dg-titulo">API</div><div class="dg-sub">backend · Node + Express</div>
    <div class="dg-item">verificarToken</div><div class="dg-item">permitirRoles · negarRoles</div><div class="dg-item dg-item--acento">execute(sp_*)</div>
  </div>
  <div class="dg-flecha"><span>TDS</span><i></i><span>&nbsp;</span></div>
  <div class="dg-base">
    <div class="dg-titulo">SQL Server</div><div class="dg-sub">base MedCloud</div>
    <div class="dg-item">Procedimientos sp_*</div><div class="dg-item">uploads/ en disco</div>
  </div>
</figure>
<p class="pie-figura">Figura 1. Capas del sistema. La API valida sesión y rol en cada ruta, ejecuta el procedimiento almacenado y responde.</p>`;

// Ilustración de portada (manual de uso): maqueta de la agenda (datos inventados)
const MAQUETA_APP = `
<div class="maqueta">
  <div class="mq-lateral">
    <div class="mq-logo"><span>M</span>${PRODUCTO.nombre}</div>
    <div class="mq-grupo">ATENCIÓN</div>
    <div class="mq-op">Pacientes</div><div class="mq-op mq-op--activa">Turnos</div><div class="mq-op">Profesionales</div>
    <div class="mq-grupo">ADMINISTRACIÓN</div>
    <div class="mq-op">Caja diaria</div><div class="mq-op">Liquidaciones</div><div class="mq-op">Usuarios</div>
  </div>
  <div class="mq-cuerpo">
    <div class="mq-h">Agenda de hoy</div>
    <div class="mq-buscar">Buscar paciente o profesional</div>
    <div class="mq-fila"><span>Paciente Demo Uno</span><span>09:00</span><b>Confirmado</b></div>
    <div class="mq-fila"><span>Paciente Demo Dos</span><span>09:30</span><b>Pendiente</b></div>
    <div class="mq-fila mq-fila--promo"><span>Paciente Demo Tres</span><span>10:00</span><b>Cobrar</b></div>
    <div class="mq-fila"><span>Paciente Demo Cuatro</span><span>10:30</span><b>Pendiente</b></div>
  </div>
  <div class="mq-total">
    <div class="mq-k">CAJA DEL DÍA</div><div class="mq-imp">$ 48.000</div>
    <div class="mq-linea"><span>Turnos hoy</span><span>12</span></div><div class="mq-linea"><span>Cobrados</span><span>5</span></div>
    <div class="mq-btn">Agendar turno</div>
  </div>
</div>`;

// ---------- Estilos ----------

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=JetBrains+Mono:wght@400;500&display=swap');
/* Paleta de MedCloud (frontend: azul #1A73E8 / #155CB4, tinta #0F172A, acento #38BDF8). Los nombres --verde* se mantienen por la plantilla. */
:root {
  --tinta: #0F172A; --verde: #1A73E8; --verde-claro: #E3EEFD; --verde-borde: #B6D0F7; --verde-luz: #38BDF8;
  --fondo: #F1F5F9; --gris: #64748B; --gris-claro: #94A3B8; --linea: #E2E8F0;
  --ambar: #8A4300; --ambar-fondo: #FDF1E3; --ambar-borde: #F3D3AE;
  --rojo: #8E2B20; --rojo-fondo: #FBEAE7; --rojo-borde: #F1C9C2;
}
* { box-sizing: border-box; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { margin: 0; font-family: 'Public Sans', system-ui, sans-serif; color: var(--tinta); font-size: 9.6pt; line-height: 1.55; }
code, kbd, pre { font-family: 'JetBrains Mono', ui-monospace, monospace; }
a { color: var(--verde); text-decoration: none; }
b, strong { font-weight: 700; }

/* Portada */
.portada { height: 297mm; padding: 26mm 20mm 20mm; display: flex; flex-direction: column; position: relative; overflow: hidden; }
.portada::after { content: ''; position: absolute; right: -60mm; top: -60mm; width: 150mm; height: 150mm; border-radius: 50%; background: var(--fondo); z-index: -1; }
.logo { width: 17mm; height: 17mm; border-radius: 4.5mm; background: var(--verde); color: #fff; display: grid; place-items: center; font-weight: 800; font-size: 20pt; }
.eyebrow { margin-top: 15mm; font-size: 7.5pt; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; color: var(--gris); }
.portada h1 { font-size: 38pt; line-height: 1.02; letter-spacing: -.02em; font-weight: 800; margin: 4mm 0 5mm; max-width: 150mm; }
.portada .sub { font-size: 12.5pt; line-height: 1.5; color: #334155; max-width: 135mm; margin: 0; }
.portada .ilustracion { margin-top: 12mm; }
.portada .datos { margin-top: auto; background: var(--tinta); color: #fff; border-radius: 4mm; padding: 9mm 10mm; display: grid; grid-template-columns: 1.2fr 1fr 1fr; gap: 6mm; }
.datos .k { font-size: 7pt; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--verde-luz); margin-bottom: 2mm; }
.datos .v { font-size: 11pt; font-weight: 600; line-height: 1.35; }

/* Maqueta de la app en la portada */
.maqueta { display: grid; grid-template-columns: 44mm 1fr 46mm; border-radius: 4mm; overflow: hidden; border: 1px solid var(--linea); box-shadow: 0 6mm 14mm rgba(27,26,23,.14); background: var(--fondo); font-size: 7pt; height: 82mm; }
.mq-lateral { background: var(--tinta); color: #E2E8F0; padding: 5mm 3.5mm; }
.mq-logo { display: flex; align-items: center; gap: 2mm; font-weight: 800; font-size: 9pt; margin-bottom: 4mm; }
.mq-logo span { width: 6mm; height: 6mm; border-radius: 1.6mm; background: var(--verde); display: grid; place-items: center; font-size: 7pt; }
.mq-grupo { font-size: 5.5pt; letter-spacing: .14em; color: #94A3B8; margin: 3mm 0 1.2mm; font-weight: 700; }
.mq-op { padding: 1.3mm 2mm; border-radius: 1.5mm; color: #CBD5E1; }
.mq-op--activa { background: #1E293B; color: #fff; font-weight: 600; box-shadow: inset 2px 0 0 var(--verde-luz); }
.mq-cuerpo { padding: 5mm; }
.mq-h { font-size: 11pt; font-weight: 800; margin-bottom: 3mm; }
.mq-buscar { background: #fff; border: 1.5px solid var(--verde); border-radius: 2mm; padding: 2.4mm 3mm; color: var(--gris); margin-bottom: 3mm; display: flex; justify-content: space-between; }
.mq-buscar b { font-family: 'JetBrains Mono'; font-size: 6pt; background: var(--verde-claro); color: var(--verde); border-radius: 1mm; padding: 0 1.2mm; }
.mq-fila { display: grid; grid-template-columns: 1fr auto 17mm; gap: 3mm; background: #fff; border-radius: 1.8mm; padding: 2.3mm 3mm; margin-bottom: 1.6mm; }
.mq-fila b { text-align: right; font-family: 'JetBrains Mono'; }
.mq-fila span:nth-child(2) { color: var(--gris); font-family: 'JetBrains Mono'; }
.mq-fila--promo { background: var(--ambar-fondo); color: var(--ambar); }
.mq-total { background: #fff; padding: 5mm 4mm; border-left: 1px solid var(--linea); display: flex; flex-direction: column; }
.mq-k { font-size: 6pt; letter-spacing: .14em; font-weight: 700; color: var(--gris); }
.mq-imp { font-family: 'JetBrains Mono'; font-size: 15pt; font-weight: 500; margin: 1mm 0 4mm; }
.mq-linea { display: flex; justify-content: space-between; color: var(--gris); padding: 1mm 0; border-top: 1px solid var(--linea); }
.mq-btn { margin-top: auto; background: var(--verde); color: #fff; font-weight: 700; text-align: center; border-radius: 2mm; padding: 3mm; font-size: 8pt; }
.mq-btn b { font-family: 'JetBrains Mono'; font-size: 6pt; background: rgba(255,255,255,.2); border-radius: 1mm; padding: 0 1.2mm; margin-left: 1mm; }

/* Contenido (índice) */
.indice h1 { font-size: 22pt; font-weight: 800; margin: 2mm 0 5mm; letter-spacing: -.01em; }
.indice .eyebrow { margin-top: 0; }
.fila-indice { display: grid; grid-template-columns: 10mm 1fr auto; align-items: baseline; padding: 2.2mm 0; border-bottom: 1px solid var(--linea); font-size: 9.6pt; }
.fila-indice b { color: var(--verde); font-weight: 800; }
.fila-indice .sec { color: var(--gris-claro); font-size: 7pt; letter-spacing: .12em; text-transform: uppercase; margin-left: 3mm; }
.fila-indice .pag { color: var(--gris); font-variant-numeric: tabular-nums; }
.indice .aviso { margin-top: 8mm; }

/* Capítulos */
.cap { break-before: page; }
.cap-eyebrow { display: flex; align-items: center; gap: 3mm; font-size: 7.5pt; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: var(--gris); }
.cap-num { min-width: 7mm; height: 7mm; padding: 0 1.8mm; border-radius: 3.5mm; background: var(--verde); color: #fff; display: inline-grid; place-items: center; font-size: 8.5pt; letter-spacing: 0; }
.marca { font-size: 5px; letter-spacing: 0; color: #fff; margin-left: auto; }
.cap h1 { font-size: 20pt; line-height: 1.15; font-weight: 800; letter-spacing: -.01em; margin: 2.5mm 0 3mm; }
.lead { font-size: 11.5pt; line-height: 1.55; color: #334155; margin: 0 0 5mm; max-width: 150mm; }
.ficha { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; margin: 0 0 6mm; }
.ficha > div { border: 1px solid var(--linea); border-radius: 3mm; padding: 3.5mm 4.5mm; background: #F8FAFC; }
.ficha-k { display: block; font-size: 7pt; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--verde); margin-bottom: 1mm; }
.ficha-v { font-size: 9.2pt; }
h2 { font-size: 13pt; font-weight: 800; margin: 7mm 0 2.5mm; break-after: avoid; }
h3 { font-size: 10.8pt; font-weight: 700; margin: 5mm 0 2mm; break-after: avoid; }
h4 { font-size: 9.8pt; margin: 4mm 0 1.5mm; break-after: avoid; }
p { margin: 0 0 2.6mm; }
ul { padding-left: 5mm; margin: 0 0 3mm; }
ul li { margin: .6mm 0; }
ul li::marker { color: var(--verde); }
ol { list-style: none; counter-reset: paso; padding: 0; margin: 1mm 0 4mm; }
ol > li { counter-increment: paso; position: relative; padding: .6mm 0 .6mm 9.5mm; margin: 1.6mm 0; break-inside: avoid; }
ol > li::before { content: counter(paso); position: absolute; left: 0; top: .2mm; width: 6.2mm; height: 6.2mm; border-radius: 1.5mm; background: var(--tinta); color: var(--verde-luz); font-weight: 800; font-size: 8pt; display: grid; place-items: center; }
code { font-size: 8.2pt; background: #EEF2F7; border-radius: 1mm; padding: .2mm 1.2mm; overflow-wrap: break-word; }
pre { background: #F8FAFC; border: 1px solid var(--linea); border-radius: 3mm; padding: 4mm 5mm; white-space: pre-wrap; font-size: 8pt; line-height: 1.5; margin: 2mm 0 4mm; }
pre code { background: none; padding: 0; font-size: inherit; }
kbd { font-size: 7.6pt; font-weight: 500; background: var(--verde-claro); color: var(--verde); border: 1px solid var(--verde-borde); border-radius: 1.2mm; padding: 0 1.3mm; white-space: nowrap; }
.tabla { margin: 2mm 0 5mm; }
table { width: 100%; border-collapse: collapse; font-size: 8.8pt; }
th { text-align: left; font-size: 7pt; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--gris); padding: 2mm 3mm 2mm 0; border-bottom: 1.5px solid var(--tinta); vertical-align: bottom; }
td { padding: 2.2mm 3mm 2.2mm 0; border-bottom: 1px solid var(--linea); vertical-align: top; }
tr { break-inside: avoid; }
td:first-child { font-weight: 600; }
.aviso { border-radius: 3mm; padding: 3.5mm 5mm; margin: 3mm 0 4mm; break-inside: avoid; border: 1px solid; }
.aviso p:last-child { margin-bottom: 0; }
.aviso--info { background: var(--verde-claro); border-color: var(--verde-borde); }
.aviso--atencion { background: var(--ambar-fondo); border-color: var(--ambar-borde); }
.aviso--peligro { background: var(--rojo-fondo); border-color: var(--rojo-borde); }
.aviso-t { display: block; font-weight: 800; margin-bottom: 1mm; }
.aviso--atencion .aviso-t { color: var(--ambar); }
.aviso--peligro .aviso-t { color: var(--rojo); }
.aviso--info .aviso-t { color: var(--verde); }

/* Diagrama */
.diagrama { display: grid; grid-template-columns: 1fr 22mm 1fr 22mm 1fr; align-items: center; margin: 4mm 0 2mm; font-size: 8pt; }
.dg-caja, .dg-base { border-radius: 3.5mm; padding: 4mm; border: 1.5px solid var(--tinta); background: #fff; text-align: center; }
.dg-caja--oscura { background: var(--tinta); color: #fff; }
.dg-base { background: var(--verde); border-color: var(--verde); color: #fff; border-radius: 12mm / 5mm; padding-top: 7mm; }
.dg-titulo { font-weight: 800; font-size: 10pt; }
.dg-sub { font-size: 7pt; opacity: .7; margin-bottom: 2.5mm; }
.dg-item { border-radius: 1.5mm; padding: 1.3mm 2mm; margin-top: 1.4mm; background: #F1F5F9; color: var(--tinta); }
.dg-caja--oscura .dg-item { background: #1E293B; color: #E2E8F0; }
.dg-base .dg-item { background: rgba(255,255,255,.14); color: #fff; }
.dg-item--suave { background: var(--ambar-fondo); color: var(--ambar); }
.dg-caja--oscura .dg-item--acento { background: #1E293B; color: var(--verde-luz); font-family: 'JetBrains Mono'; }
.dg-flecha { text-align: center; font-size: 6.5pt; color: var(--gris); }
.dg-flecha i { display: block; height: 1.5px; background: var(--tinta); margin: 1.5mm 2mm; position: relative; }
.dg-flecha i::after { content: ''; position: absolute; right: -1px; top: -1.3mm; border: 1.4mm solid transparent; border-left: 2mm solid var(--tinta); border-right: 0; }
.pie-figura { font-size: 7.8pt; color: var(--gris); margin: 2mm 0 5mm; }
`;

// ---------- Armado ----------

const chrome = () => {
  const candidatos = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  ].filter(Boolean);
  const encontrado = candidatos.find(p => fs.existsSync(p));
  if (!encontrado) throw new Error('No se encontró Chrome ni Edge. Indicá la ruta con la variable CHROME_PATH.');
  return encontrado;
};

const documento = (cuerpo) => `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>${CSS}</style></head><body>${cuerpo}</body></html>`;

const aviso = ({ tipo, titulo, texto }) => `<div class="aviso aviso--${tipo}"><span class="aviso-t">${titulo}</span>${texto}</div>`;

const htmlPortada = (m) => documento(`
<div class="portada">
  <div class="logo">M</div>
  <div class="eyebrow">${esc(m.etiqueta)}</div>
  <h1>${esc(m.titulo)}</h1>
  <p class="sub">${esc(m.subtitulo)}</p>
  ${m.ilustracion === 'app' ? `<div class="ilustracion">${MAQUETA_APP}</div>` : ''}
  <div class="datos">
    <div><div class="k">Producto</div><div class="v">${PRODUCTO.nombre} ·<br>${PRODUCTO.descripcion}</div></div>
    <div><div class="k">Versión</div><div class="v">${esc(m.versionTexto || `Versión ${PRODUCTO.version}`)}</div></div>
    <div><div class="k">Fecha</div><div class="v">${PRODUCTO.fecha}</div></div>
  </div>
</div>`);

const htmlCuerpo = (m, capitulos, paginas) => {
  const ids = Object.fromEntries(capitulos.map((c, i) => [c.id, `cap-${i + 1}`]));
  let n = 0;
  const numeros = capitulos.map(c => (c.anexo ? c.anexo : String(++n)));
  const indice = `
<section class="indice">
  <div class="eyebrow">${esc(m.etiqueta)} · v${PRODUCTO.version}</div>
  <h1>Contenido</h1>
  ${capitulos.map((c, i) => `<div class="fila-indice"><b>${numeros[i]}</b><span>${esc(c.titulo)}<span class="sec">${esc(c.eyebrow)}</span></span><span class="pag">${paginas?.[numeros[i]] ?? '00'}</span></div>`).join('')}
  ${aviso(m.aviso)}
</section>`;
  n = 0;
  const caps = capitulos.map((c, i) => renderCapitulo(c, numeros[i], ids)).join('');
  return documento(indice + caps);
};

// Busca en qué página quedó cada capítulo (marca invisible @@CAP-n@@)
const paginasDeCapitulos = async (buffer) => {
  const pdf = await getDocument({ data: new Uint8Array(buffer), verbosity: 0 }).promise;
  const res = {};
  for (let i = 1; i <= pdf.numPages; i++) {
    const texto = (await (await pdf.getPage(i)).getTextContent()).items.map(t => t.str).join('');
    for (const m of texto.matchAll(/@@CAP-([A-Z0-9]+)@@/g)) res[m[1]] ??= i;
  }
  return res;
};

const pie = (m) => `
<div style="width:100%; font-family:'Public Sans',Arial,sans-serif; font-size:7px; color:#94A3B8; padding:0 17mm; display:flex; justify-content:space-between;">
  <span>${PRODUCTO.nombre} · ${esc(m.etiqueta)}</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span>
</div>`;

const aPdf = async (browser, html, opciones) => {
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  const buf = await page.pdf({ format: 'A4', printBackground: true, preferCSSPageSize: false, ...opciones });
  await page.close();
  return buf;
};

const generar = async () => {
  fs.mkdirSync(SALIDA, { recursive: true });
  const browser = await puppeteer.launch({ executablePath: chrome(), headless: true });
  try {
    for (const m of MANUALES) {
      const capitulos = m.capitulos();
      const opcionesCuerpo = {
        margin: { top: '18mm', bottom: '18mm', left: '17mm', right: '17mm' },
        displayHeaderFooter: true, headerTemplate: '<span></span>', footerTemplate: pie(m)
      };
      // Dos pasadas: la primera ubica cada capítulo para numerar el índice
      const borrador = await aPdf(browser, htmlCuerpo(m, capitulos, null), opcionesCuerpo);
      const paginas = await paginasDeCapitulos(borrador);
      const cuerpo = await aPdf(browser, htmlCuerpo(m, capitulos, paginas), opcionesCuerpo);
      const control = await paginasDeCapitulos(cuerpo);
      if (JSON.stringify(control) !== JSON.stringify(paginas)) console.warn(`Aviso: el índice de ${m.archivo} puede tener páginas corridas.`);

      const portada = await aPdf(browser, htmlPortada(m), { margin: { top: 0, bottom: 0, left: 0, right: 0 } });
      const final = await PDFDocument.create();
      for (const buf of [portada, cuerpo]) {
        const doc = await PDFDocument.load(buf);
        (await final.copyPages(doc, doc.getPageIndices())).forEach(p => final.addPage(p));
      }
      final.setTitle(`${PRODUCTO.nombre} — ${m.etiqueta}`);
      final.setAuthor(PRODUCTO.nombre);
      final.setSubject(m.titulo);
      final.setCreator(`${PRODUCTO.nombre} · docs/herramientas/generar-pdf.mjs`);
      final.setProducer(PRODUCTO.nombre);
      const destino = path.join(SALIDA, m.archivo);
      fs.writeFileSync(destino, await final.save());
      console.log(`${m.archivo}: ${final.getPageCount()} páginas`);
    }
  } finally {
    await browser.close();
  }
};

generar().catch(err => { console.error(err.message || err); process.exit(1); });
