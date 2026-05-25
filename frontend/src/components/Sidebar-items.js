export const SIDEBAR_ITEMS = [
    {
        id: "pacientes",
        label: "Pacientes",
        icon: "people-outline",
        roles: [], // 🟢 Vacío significa que TODOS (Médicos, Admins, Recepción) lo ven
        children: [
            { id: "pacientes-list", label: "Listado", path: "/pacientes" },
            { id: "pacientes-new", label: "Nuevo Paciente", path: "/pacientes/nuevo" },
        ],
    },
    {
        id: "profesionales",
        label: "Profesionales",
        icon: "medkit-outline",
        roles: ['ADMIN', 'RECEPCION'], // 🔴 Candado: Solo Admin y Recepción
        children: [
            { id: "profesionales-list", label: "Listado", path: "/profesionales" },
            { id: "profesionales-new", label: "Nuevo Profesional", path: "/profesionales/nuevo" },
        ],
    },
    {
        id: "turnos",
        label: "Turnos",
        icon: "calendar-outline",
        roles: [], // 🟢 Todos lo ven
        children: [
            { id: "turnos-list", label: "Agenda", path: "/turnos" },
            { id: "turnos-new", label: "Nuevo Turno", path: "/turnos/nuevo", roles: ['ADMIN', 'RECEPCION'] },
        ],
    },
    {
        id: "usuarios",
        label: "Usuarios",
        icon: "person-outline",
        roles: ['ADMIN', 'RECEPCION'], // 🔴 Candado: Solo Admin y Recepción
        children: [
            { id: "usuarios-list", label: "Listado", path: "/usuarios" },
            { id: "usuarios-new", label: "Nuevo Usuario", path: "/usuarios/nuevo" },
        ],
    },
    {
        id: "roles",
        label: "Roles",
        icon: "key-outline",
        roles: ['ADMIN', 'RECEPCION'], // 🔴 Candado: Solo Admin y Recepción
        children: [
            { id: "roles-list", label: "Listado", path: "/roles" },
            { id: "roles-new", label: "Nuevo Rol", path: "/roles/nuevo" },
        ],
    },
    {
        id: "caja",
        label: "Caja Diaria",
        icon: "cash-outline",
        roles: ['ADMIN', 'RECEPCION'],
        children: [
            { id: "caja-control", label: "Control de Caja", path: "/caja" },
            { id: "caja-historial", label: "Historial de Cierres", path: "/caja/historial" },
        ],
    },
    {
        id: "liquidaciones",
        label: "Liquidaciones",
        icon: "calculator-outline",
        roles: ['ADMIN', 'RECEPCION'],
        children: [
            { id: "liquidaciones-calc", label: "Liquidar Médicos", path: "/liquidaciones" },
        ],
    }
];