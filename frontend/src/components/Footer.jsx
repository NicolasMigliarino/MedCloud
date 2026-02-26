// src/components/Footer.jsx
import React from 'react';
import { clinicConfig } from "./config";

const Footer = () => {
    return (
        // Usamos mt-auto para empujarlo siempre hacia abajo
        <footer className="text-light mt-auto py-4" style={{ backgroundColor: '#212529' }}>
            <div className="container-fluid px-4">
                <div className="row align-items-center">
                    
                    {/* COLUMNA 1: Logo y Copyright */}
                    <div className="col-md-4 mb-3 mb-md-0">
                        <h4 className="fw-bold d-flex align-items-center gap-2">
                            {/* Un pequeño cuadradito simulando tu logo */}
                            <span className="bg-primary rounded p-1 d-inline-block" style={{ width: '24px', height: '24px' }}></span>
                            {clinicConfig.nombre}
                        </h4>
                        <p className="small mb-0 text-white-50">
                            {clinicConfig.nombre} © {clinicConfig.copyrightYear} - Sistema de Gestión Médica
                        </p>
                    </div>

                    {/* COLUMNA 2: Links y Contacto */}
                    <div className="col-md-5 mb-3 mb-md-0">
                        <div className="d-flex gap-3 mb-2 small">
                            <a href="#" className="text-light text-decoration-none">Acerca de</a>
                            <a href="#" className="text-light text-decoration-none">Soporte</a>
                            <a href="#" className="text-light text-decoration-none">Contacto</a>
                            <a href="#" className="text-light text-decoration-none">Política de Privacidad</a>
                        </div>
                        <div className="small text-white-50">
                            <p className="mb-0">Teléfono: {clinicConfig.telefono} &nbsp;|&nbsp; Email: {clinicConfig.email}</p>
                            <p className="mb-0">{clinicConfig.sitioWeb}</p>
                        </div>
                    </div>

                    {/* COLUMNA 3: Redes Sociales Dinámicas */}
                    <div className="col-md-3 text-md-end">
                        <p className="mb-2 small">Síguenos en</p>
                        <div className="d-flex justify-content-md-end gap-2">
                            {clinicConfig.social.facebook && (
                                <a href={clinicConfig.social.facebook} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                                    <i className="bi bi-facebook"></i>
                                </a>
                            )}
                            {clinicConfig.social.twitter && (
                                <a href={clinicConfig.social.twitter} target="_blank" rel="noreferrer" className="btn btn-info btn-sm rounded-circle d-flex align-items-center justify-content-center text-white" style={{ width: '32px', height: '32px' }}>
                                    <i className="bi bi-twitter-x"></i>
                                </a>
                            )}
                            {clinicConfig.social.instagram && (
                                <a href={clinicConfig.social.instagram} target="_blank" rel="noreferrer" className="btn btn-danger btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                                    <i className="bi bi-instagram"></i>
                                </a>
                            )}
                            {clinicConfig.social.whatsapp && (
                                <a href={clinicConfig.social.whatsapp} target="_blank" rel="noreferrer" className="btn btn-success btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                                    <i className="bi bi-whatsapp"></i>
                                </a>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </footer>
    );
};

export default Footer;