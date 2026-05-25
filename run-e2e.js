const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const net = require('net');

const rootDir = __dirname;
const frontendDir = path.join(rootDir, 'frontend');
const backendDir = path.join(rootDir, 'MedicApp-Backend');
const reportPath = path.join('C:', 'Users', 'nmigl', '.gemini', 'antigravity', 'brain', '9795efa9-9acd-4677-9024-cfe30a30e831', 'reporte_pruebas.md');

let backendProcess = null;
let frontendProcess = null;

// Helper para verificar si un puerto está activo
function checkPort(port) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    const onError = () => {
      socket.destroy();
      resolve(false);
    };
    socket.setTimeout(1000);
    socket.once('error', onError);
    socket.once('timeout', onError);
    // Probar primero con localhost para que resuelva tanto IPv4 como IPv6
    socket.connect(port, 'localhost', () => {
      socket.end();
      resolve(true);
    });
  });
}

// Helper para esperar que un puerto esté listo
async function waitForPort(port, timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const isOpen = await checkPort(port);
    if (isOpen) return true;
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

// Función para matar un proceso y todos sus descendientes en Windows
function killProcess(proc, name) {
  if (proc) {
    console.log(`[Runner] Cerrando servidor ${name} (PID: ${proc.pid})...`);
    try {
      // Usar taskkill en Windows para cerrar el árbol de procesos completo de forma limpia
      execSync(`taskkill /pid ${proc.pid} /t /f`, { stdio: 'ignore' });
    } catch (e) {
      // Si falla, intentamos kill común
      proc.kill();
    }
  }
}

async function run() {
  console.log('====================================================');
  console.log('🤖 MEDICAPP - EJECUTOR DE PRUEBAS INTEGRALES AUTOMATIZADO');
  console.log('====================================================');

  // 1. Instalar Playwright en el frontend si no existe
  console.log('\n[Paso 1] Verificando dependencias de testing...');
  const frontendPkg = JSON.parse(fs.readFileSync(path.join(frontendDir, 'package.json'), 'utf8'));
  const hasPlaywright = frontendPkg.devDependencies && frontendPkg.devDependencies['@playwright/test'];

  if (!hasPlaywright) {
    console.log('-> Playwright no detectado. Instalando @playwright/test en la carpeta frontend...');
    execSync('npm install -D @playwright/test', { cwd: frontendDir, stdio: 'inherit' });
  } else {
    console.log('-> Playwright ya está configurado en las dependencias.');
  }

  // Instalar los binarios de los navegadores (Chromium)
  console.log('-> Verificando/instalando navegadores de Playwright (Chromium)...');
  execSync('npx playwright install chromium', { cwd: frontendDir, stdio: 'inherit' });

  // 2. Levantar el Backend
  console.log('\n[Paso 2] Iniciando servidor Backend en puerto 3000...');
  backendProcess = spawn('npm', ['run', 'dev'], {
    cwd: backendDir,
    shell: true,
    env: { ...process.env, PORT: 3000 }
  });

  backendProcess.stdout.on('data', (data) => {
    // console.log(`[Backend] ${data.toString().trim()}`);
  });

  backendProcess.stderr.on('data', (data) => {
    console.error(`[Backend ERROR] ${data.toString().trim()}`);
  });

  // Esperar a que el backend esté listo
  const backendReady = await waitForPort(3000, 20000);
  if (!backendReady) {
    throw new Error('❌ El servidor Backend no inició en el puerto 3000 a tiempo.');
  }
  console.log('-> ¡Backend levantado y escuchando correctamente!');

  // 3. Levantar el Frontend
  console.log('\n[Paso 3] Iniciando servidor Frontend en puerto 5173...');
  frontendProcess = spawn('npm', ['run', 'dev', '--', '--host', '127.0.0.1'], {
    cwd: frontendDir,
    shell: true
  });

  frontendProcess.stdout.on('data', (data) => {
    // console.log(`[Frontend] ${data.toString().trim()}`);
  });

  frontendProcess.stderr.on('data', (data) => {
    console.error(`[Frontend ERROR] ${data.toString().trim()}`);
  });

  // Esperar a que el frontend esté listo
  const frontendReady = await waitForPort(5173, 20000);
  if (!frontendReady) {
    throw new Error('❌ El servidor Frontend no inició en el puerto 5173 a tiempo.');
  }
  console.log('-> ¡Frontend levantado y listo en http://localhost:5173!');

  // 4. Ejecutar las pruebas de Playwright
  console.log('\n[Paso 4] Ejecutando suite de pruebas Playwright en modo Headless...');
  console.log('----------------------------------------------------');
  
  let testStdout = '';
  let testError = null;
  let testExitCode = 0;

  try {
    // Ejecutamos playwright de forma sincrónica para capturar el resultado
    const testResult = execSync('npx playwright test', {
      cwd: frontendDir,
      encoding: 'utf8',
      env: { ...process.env, FORCE_COLOR: '0' }
    });
    testStdout = testResult;
    console.log(testStdout);
    console.log('-> ¡Todas las pruebas han finalizado exitosamente!');
  } catch (error) {
    testExitCode = error.status || 1;
    testStdout = error.stdout || '';
    testError = error.stderr || error.message;
    console.log(testStdout);
    console.error('⚠️  Algunas pruebas fallaron durante la ejecución.');
  }
  console.log('----------------------------------------------------');

  // 5. Generar reporte
  console.log('\n[Paso 5] Compilando el reporte en formato Markdown...');
  generateReport(testStdout, testExitCode, testError);
  console.log(`-> Reporte generado con éxito en: ${reportPath}`);
}

function generateReport(stdout, exitCode, stderr) {
  const dateStr = new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' });
  
  // Procesamos la salida estándar para determinar el estado de cada test
  const tests = [
    {
      id: 1,
      nombre: 'Autenticación exitosa y Dashboard para Administrador',
      descripcion: 'Valida que el usuario `admin_general` pueda iniciar sesión con contraseña correcta, acepte el mensaje de alerta de bienvenida y navegue al Dashboard.',
      status: '❌ Fallido',
      detalles: 'No se ejecutó.'
    },
    {
      id: 2,
      nombre: 'Control de accesos en Sidebar (Admin vs Médico)',
      descripcion: 'Comprueba que un Administrador vea todas las secciones (Pacientes, Profesionales, Turnos, Usuarios, Roles) y que un Médico (`doctor_nico`) solo tenga acceso a Pacientes y Turnos, bloqueando secciones administrativas.',
      status: '❌ Fallido',
      detalles: 'No se ejecutó.'
    },
    {
      id: 3,
      nombre: 'Creación de un Paciente por un Administrativo',
      descripcion: 'Simula el flujo de llenado de formulario de nuevo paciente (`PacientesForm`) con datos aleatorios (nombre, apellido, DNI, fecha de nacimiento, etc.) y verifica que el nuevo paciente se agregue y muestre en el listado.',
      status: '❌ Fallido',
      detalles: 'No se ejecutó.'
    },
    {
      id: 4,
      nombre: 'Creación de un Turno de atención',
      descripcion: 'Valida que se pueda agendar un nuevo turno futuro (año 2027) asignando el primer paciente y médico disponibles, guardando con motivo y notas, y verificándolo en la agenda.',
      status: '❌ Fallido',
      detalles: 'No se ejecutó.'
    },
    {
      id: 5,
      nombre: 'Validación de Horario de Atención y Agenda (Rol Yanina)',
      descripcion: 'Comprueba el flujo bajo el usuario Yanina: crea un médico con disponibilidad exclusiva los Martes (09:00 a 18:00), crea un paciente, y valida que la agenda rechace citas en días no laborables (Miércoles) y horarios fuera de rango (Martes 08:00), mientras que aprueba citas válidas con éxito.',
      status: '❌ Fallido',
      detalles: 'No se ejecutó.'
    },
    {
      id: 6,
      nombre: 'Restricciones de Privacidad de Pacientes para Médicos (doctor_nico)',
      descripcion: 'Valida que cuando un usuario con rol de Médico inicia sesión, no pueda visualizar los botones de creación, edición ni eliminación de pacientes, garantizando la privacidad e integridad de los datos.',
      status: '❌ Fallido',
      detalles: 'No se ejecutó.'
    }
  ];

  // Buscamos patrones en el output de Playwright para ver si pasaron o fallaron
  // Playwright list reporter saca líneas como: "  ✓  1. Autenticación exitosa..." o "  1) [chromium] › tests/e2e/admin-flows.spec.js:10:3..."
  
  if (stdout.includes('1. Autenticación exitosa') && !stdout.includes('1) [chromium] › tests/e2e/admin-flows.spec.js')) {
    tests[0].status = '✅ Exitoso';
    tests[0].detalles = 'El login de admin redireccionó correctamente y mostró el cartel de bienvenida.';
  } else if (stdout.includes('1. Autenticación exitosa')) {
    tests[0].status = '❌ Fallido';
    tests[0].detalles = 'Falló en la aserción de redirección o manejo del diálogo.';
  }

  if (stdout.includes('2. Control de accesos') && !stdout.includes('2) [chromium] › tests/e2e/admin-flows.spec.js')) {
    tests[1].status = '✅ Exitoso';
    tests[1].detalles = 'El sidebar ocultó correctamente las vistas críticas de Admin al médico doctor_nico, y las mostró todas al admin.';
  } else if (stdout.includes('2. Control de accesos')) {
    tests[1].status = '❌ Fallido';
    tests[1].detalles = 'Algún menú crítico se mostró al médico o no se mostró al administrador.';
  }

  if (stdout.includes('3. Creación de un Paciente') && !stdout.includes('3) [chromium] › tests/e2e/admin-flows.spec.js')) {
    tests[2].status = '✅ Exitoso';
    tests[2].detalles = 'Formulario completado y paciente insertado exitosamente. Se corroboró en la tabla de pacientes.';
  } else if (stdout.includes('3. Creación de un Paciente')) {
    tests[2].status = '❌ Fallido';
    tests[2].detalles = 'No se logró redirigir o el paciente no apareció en el listado.';
  }

  if (stdout.includes('4. Creación de un Turno') && !stdout.includes('4) [chromium] › tests/e2e/admin-flows.spec.js')) {
    tests[3].status = '✅ Exitoso';
    tests[3].detalles = 'Se agendó el turno para el año 2027 sin conflictos de horario laboral del médico.';
  } else if (stdout.includes('4. Creación de un Turno')) {
    tests[3].status = '❌ Fallido';
    tests[3].detalles = 'Error al seleccionar pacientes/profesionales o al guardar.';
  }
  
  if (stdout.includes('Validar agenda de turnos restringida') && 
      !stdout.includes(') [chromium] › tests/e2e/schedule-validations.spec.js') && 
      !stdout.includes(') [chromium] › tests\\e2e\\schedule-validations.spec.js')) {
    tests[4].status = '✅ Exitoso';
    tests[4].detalles = 'Se crearon con éxito el profesional y paciente, y se verificó que la aplicación bloquee reservas los miércoles o los martes fuera de hora, permitiendo la reserva en horario de atención correcto.';
  } else if (stdout.includes('Validar agenda de turnos restringida')) {
    tests[4].status = '❌ Fallido';
    tests[4].detalles = 'Alguna de las validaciones de horarios falló o no bloqueó el agendamiento incorrecto.';
  }
  
  if (stdout.includes('Validar que el médico no vea botones de Crear') && 
      !stdout.includes(') [chromium] › tests/e2e/doctor-restrictions.spec.js') && 
      !stdout.includes(') [chromium] › tests\\e2e\\doctor-restrictions.spec.js')) {
    tests[5].status = '✅ Exitoso';
    tests[5].detalles = 'Se inició sesión como médico, se navegó al listado y se corroboró la correcta ocultación de los botones Nuevo Paciente, Editar y Eliminar.';
  } else if (stdout.includes('Validar que el médico no vea botones de Crear')) {
    tests[5].status = '❌ Fallido';
    tests[5].detalles = 'Algún botón administrativo sensible quedó visible para el médico.';
  }

  // Si todas las pruebas pasaron
  const totalPassed = tests.filter(t => t.status === '✅ Exitoso').length;
  const totalFailed = tests.filter(t => t.status === '❌ Fallido').length;

  let reportContent = `# Reporte de Pruebas Integrales E2E - MedicApp

Este documento registra los resultados de las pruebas integrales de interfaz automatizadas, simulando el comportamiento de usuarios administrativos y médicos en el sistema.

**Fecha y Hora de Ejecución**: ${dateStr}  
**Entorno de Pruebas**: Local (Frontend en puerto 5173, Backend en puerto 3000, DB: Microsoft SQL Server local)  
**Herramienta utilizada**: Playwright (Navegador Chromium Headless)

---

## 📊 Resumen Ejecutivo

* **Total de Pruebas**: ${tests.length}
* **Exitosas**: ${totalPassed}
* **Fallidas**: ${totalFailed}
* **Resultado Global**: ${totalFailed === 0 ? '🟩 EXCELENTE / TODO APROBADO' : '🟥 ATENCIÓN / HAY ERRORES'}

---

## 📝 Detalle de Cada Prueba Realizada

`;

  tests.forEach(test => {
    reportContent += `### Test ${test.id}: ${test.nombre}\n`;
    reportContent += `* **Descripción**: ${test.descripcion}\n`;
    reportContent += `* **Estado**: ${test.status}\n`;
    reportContent += `* **Resultado / Detalle**: ${test.detalles}\n\n`;
  });

  reportContent += `---

## 📁 Registro de Ejecución (Logs de Playwright)

\`\`\`text
${stdout.trim()}
\`\`\`
`;

  if (exitCode !== 0 && stderr) {
    reportContent += `\n### Errores en Consola:
\`\`\`text
${stderr}
\`\`\`\n`;
  }

  // Escribir el reporte
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, reportContent, 'utf8');
}

// Ejecutar con control de errores y limpieza garantizada de procesos
run()
  .then(() => {
    console.log('\n[Runner] Ejecución finalizada correctamente.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('\n❌ ERROR DURANTE LA EJECUCIÓN:', err.message);
    process.exit(1);
  })
  .finally(() => {
    // Matar procesos en background pase lo que pase
    killProcess(backendProcess, 'Backend');
    killProcess(frontendProcess, 'Frontend');
  });
