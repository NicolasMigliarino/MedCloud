import { useRef, useState, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SIDEBAR_ITEMS } from "./sidebar-items";
import "./Sidebar.css";

const Submenu = ({ isOpen, activePath, items, onNavigate }) => {
    const listRef = useRef(null);
    const [height, setHeight] = useState(0);

    useLayoutEffect(() => {
        if (listRef.current) {
            setHeight(listRef.current.getBoundingClientRect().height);
        }
    }, [items, isOpen]); // Recalcula si se abre

    return (
        <div className="sub-menu" style={{ height: isOpen ? `${height}px` : "0px" }}>
            <ul ref={listRef}>
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
};

const SidebarItem = ({ item, openSubmenuId, onMenuToggle, onNavigate }) => {
    const isOpen = openSubmenuId === item.id;
    // Para marcar el botón principal activo si un hijo está activo
    const isChildActive = item.children.some(child => window.location.pathname === child.path);

    return (
        <li>
            <button
                className={isOpen || isChildActive ? "active text-white fw-bold" : ""}
                onClick={() => onMenuToggle(item.id)}
            >
                <ion-icon name={item.icon} />
                <span>{item.label}</span>
                <ion-icon name="chevron-down-outline" />
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

const Sidebar = () => {
    const [openSubmenuId, setOpenSubmenuId] = useState(null);
    const navigate = useNavigate();

    const handleMenuToggle = (id) => {
        setOpenSubmenuId((prev) => (prev === id ? null : id));
    };

    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <aside className="sidebar shadow">
            <header className="d-flex align-items-center">
                {/* Botón rápido para volver al Dashboard */}
                <button onClick={() => handleNavigate("/")} className="text-white text-decoration-none fs-4 fw-bold p-0 m-0 w-100 text-start" style={{background: 'none'}}>
                    🏥 MedicApp
                </button>
            </header>
            <ul>
                {SIDEBAR_ITEMS.map((item) => (
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