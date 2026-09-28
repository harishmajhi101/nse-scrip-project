import { useState } from 'react';

import Dashboard from './pages/Dashboard';
import Master from './pages/Master';
import Staging from './pages/Staging';
import History from './pages/History';

import './styles.css';

function App() {
    const [activePage, setActivePage] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    function renderPage() {
        switch (activePage) {
            case 'master':
                return <Master />;

            case 'staging':
                return <Staging />;

            case 'history':
                return <History />;

            default:
                return <Dashboard />;
        }
    }

    function navigate(page) {
        setActivePage(page);
        setSidebarOpen(false);
    }

    return (
        <div className="app">

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`sidebar ${
                    sidebarOpen ? 'sidebar-open' : ''
                }`}
            >

                <div className="sidebar-brand">

                    <div className="brand-icon">
                        NSE
                    </div>

                    <div>
                        <div className="brand-title">
                            Scrip Master 
                        </div>
{/* 
                        <div className="brand-subtitle">
                            NSE Data Management
                        </div> */}
                    </div>

                </div>


                {/* <div className="sidebar-section-title">
                    MAIN
                </div> */}


                <nav className="sidebar-nav">

                    <button
                        className={
                            activePage === 'dashboard'
                                ? 'nav-item active'
                                : 'nav-item'
                        }
                        onClick={() =>
                            navigate('dashboard')
                        }
                    >
                        <span className="nav-icon">
                            ◈
                        </span>

                        <span>Dashboard</span>
                    </button>


                    <button
                        className={
                            activePage === 'master'
                                ? 'nav-item active'
                                : 'nav-item'
                        }
                        onClick={() =>
                            navigate('master')
                        }
                    >
                        <span className="nav-icon">
                            ▦
                        </span>

                        <span>Scrip Master</span>
                    </button>


                    <button
                        className={
                            activePage === 'staging'
                                ? 'nav-item active'
                                : 'nav-item'
                        }
                        onClick={() =>
                            navigate('staging')
                        }
                    >
                        <span className="nav-icon">
                            ▤
                        </span>

                        <span>Staging</span>
                    </button>


                    <button
                        className={
                            activePage === 'history'
                                ? 'nav-item active'
                                : 'nav-item'
                        }
                        onClick={() =>
                            navigate('history')
                        }
                    >
                        <span className="nav-icon">
                            ◷
                        </span>

                        <span>Change History</span>
                    </button>

                </nav>


                <div className="sidebar-bottom">

                    <div className="system-status">

                        <span className="status-dot" />

                        <div>
                            <div className="system-status-title">
                                System Online
                            </div>

                            <div className="system-status-text">
                                Catalyst connected
                            </div>
                        </div>

                    </div>

                </div>

            </aside>


            {/* Main area */}
            <div className="main-wrapper">

                {/* Header */}
                <header className="topbar">

                    <button
                        className="mobile-menu"
                        onClick={() =>
                            setSidebarOpen(true)
                        }
                    >
                        ☰
                    </button>


                    <div className="topbar-left">

                        <div className="breadcrumb">
                            NSE Scrip Master
                            <span>/</span>

                            <strong>
                                {activePage === 'dashboard'
                                    ? 'Dashboard'
                                    : activePage === 'master'
                                    ? 'Scrip Master'
                                    : activePage === 'staging'
                                    ? 'Staging'
                                    : 'Change History'}
                            </strong>
                        </div>

                    </div>


                    <div className="topbar-right">

                        <div className="connection-status">
                            <span className="status-dot" />
                            Connected
                        </div>

                        <div className="user-avatar">
                            A
                        </div>

                    </div>

                </header>


                {/* Content */}
                <main className="content">

                    {renderPage()}

                </main>

            </div>

        </div>
    );
}

export default App;