/* =========================================================================
   ARCHIVO: src/utils/paginaTurno.js
   DESCRIPCIÓN: Página simple (sin scripts) que ve el paciente al tocar un botón del mail
   de recordatorio. Todos los datos se escapan.
   ========================================================================= */

const escapar = (t) => String(t ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const TONOS = {
    ok: { icono: '✅', color: '#15803d' },
    aviso: { icono: '📅', color: '#1A73E8' },
    peligro: { icono: '⚠️', color: '#B42318' },
    error: { icono: 'ℹ️', color: '#64748b' }
};

// detalle: [[etiqueta, valor], ...]  ·  formulario: { accion, boton, peligro }
const paginaTurno = ({ titulo, mensaje, tono = 'aviso', detalle = [], formulario = null }) => {
    const { icono, color } = TONOS[tono] || TONOS.aviso;
    const filas = detalle.map(([k, v]) => `<div class="fila"><span>${escapar(k)}</span><strong>${escapar(v)}</strong></div>`).join('');
    const form = formulario ? `
        <form method="post" action="${escapar(formulario.accion)}">
            <button type="submit" class="${formulario.peligro ? 'peligro' : ''}">${escapar(formulario.boton)}</button>
        </form>` : '<p class="pie">Ya podés cerrar esta ventana.</p>';

    return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>MedCloud — ${escapar(titulo)}</title>
<style>
  body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f1f5f9;
         font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #0f172a; }
  .tarjeta { background: #fff; width: 90%; max-width: 440px; margin: 20px; border-radius: 16px; box-shadow: 0 10px 30px rgba(15,23,42,.08); overflow: hidden; }
  .cabecera { padding: 22px 24px; border-bottom: 1px solid #e2e8f0; font-weight: 700; font-size: 18px; }
  .cuerpo { padding: 24px; text-align: center; }
  .icono { font-size: 40px; }
  h1 { font-size: 21px; margin: 10px 0; color: ${color}; }
  p { font-size: 15px; line-height: 1.55; color: #475569; margin: 0 0 18px; }
  .detalle { text-align: left; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px 16px; margin-bottom: 20px; }
  .fila { display: flex; justify-content: space-between; gap: 12px; padding: 5px 0; font-size: 14px; }
  .fila span { color: #64748b; }
  button { width: 100%; border: 0; border-radius: 10px; padding: 14px; font-size: 16px; font-weight: 700; color: #fff; background: #1A73E8; cursor: pointer; }
  button.peligro { background: #B42318; }
  .pie { font-size: 13px; color: #94a3b8; margin: 0; }
</style>
</head>
<body>
  <div class="tarjeta">
    <div class="cabecera">MedCloud</div>
    <div class="cuerpo">
      <div class="icono">${icono}</div>
      <h1>${escapar(titulo)}</h1>
      <p>${escapar(mensaje)}</p>
      ${filas ? `<div class="detalle">${filas}</div>` : ''}
      ${form}
    </div>
  </div>
</body>
</html>`;
};

module.exports = { paginaTurno };
