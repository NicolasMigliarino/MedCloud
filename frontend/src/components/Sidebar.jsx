import { useRef, useState, useLayoutEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { SIDEBAR_ITEMS } from "./Sidebar-items";
import "./Sidebar.css";

/* ─── Submenu ─────────────────────────────────────────────────────────────── */
const Submenu = ({ isOpen, activePath, items, onNavigate }) => (
    <div className={`sub-menu${isOpen ? ' is-open' : ''}`}>
        <ul>
            {items.map((child) => (
                <li key={child.id}>
                    <button
                        className={activePath === child.path ? "active text-white fw-bold" : ""}
                        onClick={() => onNavigate(child.path)}
                    >
                        {child.label}
                    </button>
                </li>
            ))}
        </ul>
    </div>
);

/* ─── SidebarItem ─────────────────────────────────────────────────────────── */
const SidebarItem = ({ item, openSubmenuId, onMenuToggle, onNavigate }) => {
    const isOpen = openSubmenuId === item.id;
    const isChildActive = item.children.some(child => window.location.pathname === child.path);

    return (
        <li className="sidebar-item">
            <button
                className={isOpen || isChildActive ? "active text-white fw-bold" : ""}
                onClick={() => onMenuToggle(item.id)}
            >
                <ion-icon name={item.icon} />
                <span>{item.label}</span>
                <ion-icon
                    name="chevron-down-outline"
                    className={isOpen ? "rotated" : ""}
                    style={{ transform: isOpen ? 'rotate(-180deg)' : 'rotate(0deg)', transition: '0.3s' }}
                />
            </button>

            <Submenu
                isOpen={isOpen}
                activePath={window.location.pathname}
                items={item.children}
                onNavigate={onNavigate}
            />
        </li>
    );
};

/* ─── Sidebar ─────────────────────────────────────────────────────────────── */
const Sidebar = () => {
    const [openSubmenuId, setOpenSubmenuId] = useState(null);
    const navigate = useNavigate();

    const usuarioLogueado = JSON.parse(localStorage.getItem('user'));
    const userRole = usuarioLogueado?.rol || usuarioLogueado?.codigo || 'USER';

    const menuFiltrado = useMemo(() => {
        return SIDEBAR_ITEMS.filter(item => {
            if (!item.roles || item.roles.length === 0) return true;
            return item.roles.includes(userRole);
        });
    }, [userRole]);

    const handleMenuToggle = (id) => {
        setOpenSubmenuId((prev) => (prev === id ? null : id));
    };

    const handleNavigate = (path) => navigate(path);

    return (
        <aside className="sidebar shadow">
            <header className="d-flex align-items-center">
                <button
                    onClick={() => handleNavigate("/")}
                    className="text-white text-decoration-none fs-4 fw-bold p-0 m-0 w-100 text-start"
                    style={{ background: 'none' }}
                >
                    🏥 MedicApp
                </button>
            </header>
            <ul>
                {menuFiltrado.map((item) => (
                    <SidebarItem
                        key={item.id}
                        item={item}
                        openSubmenuId={openSubmenuId}
                        onMenuToggle={handleMenuToggle}
                        onNavigate={handleNavigate}
                    />
                ))}
            </ul>
        </aside>
    );
};

export default Sidebar;