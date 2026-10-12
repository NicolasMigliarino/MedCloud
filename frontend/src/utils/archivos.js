import axios from 'axios';
import Swal from 'sweetalert2';

// Los archivos subidos (estudios, comprobantes y recibos) requieren sesión:
// se descargan con el token (interceptor de axios) y se muestran en una pestaña nueva.

// Normaliza a "/uploads/<archivo>" aunque la base tenga guardada una URL completa o solo el nombre
const rutaUploads = (ruta = '') => {
    const i = ruta.indexOf('/uploads/');
    return i >= 0 ? ruta.slice(i) : `/uploads/${ruta}`;
};

export const abrirArchivo = async (ruta) => {
    // La pestaña se abre en el mismo clic para que el navegador no la bloquee
    const ventana = window.open('', '_blank');
    try {
        const { data } = await axios.get(rutaUploads(ruta), { responseType: 'blob' });
        const url = URL.createObjectURL(data);
        if (ventana) {
            ventana.location.href = url;
        } else {
            window.open(url, '_blank');
        }
        setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (error) {
        console.error('Error al abrir archivo:', error);
        if (ventana) ventana.close();
        Swal.fire('Error', 'No se pudo abrir el archivo. Probá de nuevo o avisá a soporte.', 'error');
    }
};

// Para HTML de SweetAlert: conecta los botones con atributo data-archivo="<ruta>".
// Uso: Swal.fire({ html: '<button data-archivo="/uploads/x.pdf">Ver</button>', didOpen: conectarBotonesArchivo })
export const conectarBotonesArchivo = (contenedor) => {
    contenedor.querySelectorAll('[data-archivo]').forEach((boton) => {
        boton.addEventListener('click', () => abrirArchivo(boton.getAttribute('data-archivo')));
    });
};
