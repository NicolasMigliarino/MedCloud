export const SIDEBAR_ITEMS = [
    {
        id: "pacientes", label: "Pacientes", icon: "people-outline", type: "submenu", children: [
            { id: "pacientes-list", label: "Listado", path: "/pacientes" },
            { id: "pacientes-nuevo", label: "Nuevo Paciente", path: "/pacientes/nuevo" }
        ]
    },
    {
        id: "profesionales", label: "Profesionales", icon: "medkit-outline", type: "submenu", children: [
            { id: "profesionales-list", label: "Listado", path: "/profesionales" },
            { id: "profesionales-nuevo", label: "Nuevo Profesional", path: "/profesionales/nuevo" }
        ]
    },
    {
        id: "turnos", label: "Turnos", icon: "calendar-outline", type: "submenu", children: [
            { id: "turnos-list", label: "Listado", path: "/turnos" },
            { id: "turnos-nuevo", label: "Nuevo Turno", path: "/turnos/nuevo" }
        ]
    },
    {
        id: "usuarios", label: "Usuarios", icon: "person-outline", type: "submenu", children: [
            { id: "usuarios-list", label: "Listado", path: "/usuarios" },
            { id: "usuarios-nuevo", label: "Nuevo Usuario", path: "/usuarios/nuevo" }
        ]
    },
    {
        id: "roles", label: "Roles", icon: "key-outline", type: "submenu", children: [
            { id: "roles-list", label: "Listado", path: "/roles" },
            { id: "roles-nuevo", label: "Nuevo Rol", path: "/roles/nuevo" }
        ]
    }
];