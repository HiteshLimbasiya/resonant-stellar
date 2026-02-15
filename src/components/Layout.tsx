import React from 'react';
import './Layout.css';

interface LayoutProps {
    children: React.ReactNode;
    headerAction?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children, headerAction }) => {
    return (
        <div className="app-container">
            <header className="app-header">
                <div className="header-content">
                    <div className="logo-container">
                        <div className="logo-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <h1>Stellar Tasks</h1>
                    </div>
                    {headerAction && <div className="header-action">{headerAction}</div>}
                </div>
            </header>
            <main className="app-main">
                {children}
            </main>
        </div>
    );
};
