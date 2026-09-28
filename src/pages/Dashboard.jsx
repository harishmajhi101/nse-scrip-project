import { useEffect, useState } from 'react';

import {
    getMaster,
    getStaging,
    getHistory,
    runTier1,
    createStaging,
    createMaster
} from '../api/scripApi';


export default function Dashboard() {

    // ==================================================
    // DATA
    // ==================================================

    const [master, setMaster] = useState([]);
    const [staging, setStaging] = useState([]);
    const [history, setHistory] = useState([]);


    // ==================================================
    // PAGE STATE
    // ==================================================

    const [loading, setLoading] = useState(true);
    const [running, setRunning] = useState(false);

    const [runResult, setRunResult] = useState(null);
    const [error, setError] = useState('');


    // ==================================================
    // MODAL STATE
    // ==================================================

    const [showStagingForm, setShowStagingForm] =
        useState(false);

    const [showMasterForm, setShowMasterForm] =
        useState(false);

    const [formLoading, setFormLoading] =
        useState(false);


    // ==================================================
    // STAGING FORM
    // ==================================================


const [stagingForm, setStagingForm] = useState({
    ISIN: '',
    Company_Name: '',
    Symbol: '',
    Series: 'EQ',
    Source_File: ''
});


    // ==================================================
    // MASTER FORM
    // ==================================================

    const [masterForm, setMasterForm] = useState({

        ISIN: '',

        Company_Name: '',

        Symbol: '',

        Series: 'EQ',

        Status: ''

    });


    // ==================================================
    // LOAD DASHBOARD
    // ==================================================

    useEffect(() => {

        loadDashboard();

    }, []);


    async function loadDashboard() {

        try {

            setLoading(true);

            setError('');


            const [
                masterResponse,
                stagingResponse,
                historyResponse
            ] = await Promise.all([

                getMaster(),

                getStaging(),

                getHistory()

            ]);


            // API functions already return arrays

            setMaster(
                masterResponse || []
            );

            setStaging(
                stagingResponse || []
            );

            setHistory(
                historyResponse || []
            );


        } catch (error) {

            console.error(
                'Dashboard loading error:',
                error
            );


            setError(
                error.message ||
                'Unable to load dashboard'
            );


        } finally {

            setLoading(false);

        }

    }


    // ==================================================
    // RUN TIER 1
    // ==================================================

    async function handleRunTier1() {

        try {

            setRunning(true);

            setError('');

            setRunResult(null);


            const response =
                await runTier1();


            console.log(
                'Tier 1 response:',
                response
            );


            setRunResult(response);


            // Refresh dashboard

            await loadDashboard();


        } catch (error) {

            console.error(
                'Tier 1 execution error:',
                error
            );


            setError(
                error.message ||
                'Tier 1 execution failed'
            );


        } finally {

            setRunning(false);

        }

    }

    // ==================================================
    // CREATE STAGING
    // ==================================================
    async function handleCreateStaging(event) {
    event.preventDefault();

    try {
        setFormLoading(true);
        setError('');

        const response = await createStaging({
            ISIN: stagingForm.ISIN.trim(),
            Company_Name: stagingForm.Company_Name.trim(),
            Symbol: stagingForm.Symbol.trim(),
            Series: stagingForm.Series,
            Source_File: stagingForm.Source_File.trim() || ' '
        });

        if (!response?.success) {
            throw new Error(
                response?.message || 'Failed to create staging record'
            );
        }

        setShowStagingForm(false);

        setStagingForm({
            ISIN: '',
            Company_Name: '',
            Symbol: '',
            Series: 'EQ',
            Source_File: ''
        });

        await loadDashboard();

    } catch (error) {
        console.error('Create Staging error:', error);
        setError(error.message || 'Failed to create staging record');
    } finally {
        setFormLoading(false);
    }
}
// ==================================================
    // CREATE master
    // ==================================================

   async function handleCreateMaster(event) {
    event.preventDefault();

    try {
        setFormLoading(true);
        setError('');

        console.log('Creating master record:', masterForm);

        const response = await createMaster({
            ISIN: masterForm.ISIN.trim(),
            Company_Name: masterForm.Company_Name.trim(),
            Symbol: masterForm.Symbol.trim(),
            Series: masterForm.Series,
            Status: masterForm.Status
        });

        console.log('Create Master response:', response);

        if (!response?.success) {
            throw new Error(
                response?.message || 'Failed to create master record'
            );
        }

        // Close modal
        setShowMasterForm(false);

        // Reset form
        setMasterForm({
            ISIN: '',
            Company_Name: '',
            Symbol: '',
            Series: 'EQ',
            Status: ''
        });

        // Reload dashboard data
        await loadDashboard();

    } catch (error) {
        console.error('Create Master error:', error);

        setError(
            error.message || 'Failed to create master record'
        );

    } finally {
        setFormLoading(false);
    }
}


    // ==================================================
    // STATISTICS
    // ==================================================

    const activeRecords =
        master.filter(
            item =>
                item.Status?.toLowerCase() ===
                'active'
        ).length;


    const unresolvedRecords =
        master.filter(
            item =>
                item.Status?.toLowerCase() ===
                'unresolved'
        ).length;


    // ==================================================
    // PAGE
    // ==================================================

    return (

        <div className="page">


            {/* ==================================================
                PAGE HEADER
            ================================================== */}

            <div className="page-header">

                <div>

                    <div className="eyebrow">
                        OVERVIEW
                    </div>


                    <h1>
                        Scrip Master Dashboard
                    </h1>


                    <p>
                        Monitor NSE scrip data,
                        staging records and Tier 1
                        updates.
                    </p>

                </div>


                {/* HEADER BUTTONS */}

                <div className="header-actions">


                    {/* ADD STAGING */}

                    <button
                        type="button"
                        className="secondary-button"
                        onClick={() =>
                            setShowStagingForm(true)
                        }
                        disabled={formLoading}
                    >
                        + Add Staging
                    </button>


                    {/* ADD MASTER */}

                    <button
                        type="button"
                        className="secondary-button"
                        onClick={() =>
                            setShowMasterForm(true)
                        }
                        disabled={formLoading}
                    >
                        + Add Master
                    </button>


                    {/* RUN TIER 1 */}

                    <button
                        type="button"
                        className="primary-button"
                        onClick={handleRunTier1}
                        disabled={running}
                    >

                        <span className="button-icon">
                            ↻
                        </span>


                        {running
                            ? 'Running...'
                            : 'Run Tier 1'}

                    </button>

                </div>

            </div>


            {/* ==================================================
                ERROR MESSAGE
            ================================================== */}

            {error && (

                <div className="alert alert-error">

                    <strong>
                        Error:
                    </strong>{' '}

                    {error}

                </div>

            )}


            {/* ==================================================
                STATISTICS
            ================================================== */}

            <div className="stats-grid">


                {/* MASTER RECORDS */}

                <div className="stat-card">

                    <div className="stat-top">

                        <div className="stat-label">
                            MASTER RECORDS
                        </div>


                        <div className="stat-icon blue">
                            ▦
                        </div>

                    </div>


                    <div className="stat-value">

                        {loading
                            ? '—'
                            : master.length}

                    </div>


                    <div className="stat-description">
                        Total scrip records
                    </div>

                </div>


                {/* ACTIVE */}

                <div className="stat-card">

                    <div className="stat-top">

                        <div className="stat-label">
                            ACTIVE
                        </div>


                        <div className="stat-icon green">
                            ✓
                        </div>

                    </div>


                    <div className="stat-value">

                        {loading
                            ? '—'
                            : activeRecords}

                    </div>


                    <div className="stat-description">
                        Active securities
                    </div>

                </div>


                {/* STAGING */}

                <div className="stat-card">

                    <div className="stat-top">

                        <div className="stat-label">
                            STAGING
                        </div>


                        <div className="stat-icon purple">
                            ▤
                        </div>

                    </div>


                    <div className="stat-value">

                        {loading
                            ? '—'
                            : staging.length}

                    </div>


                    <div className="stat-description">
                        Current NSE records
                    </div>

                </div>


                {/* UNRESOLVED */}

                <div className="stat-card">

                    <div className="stat-top">

                        <div className="stat-label">
                            UNRESOLVED
                        </div>


                        <div className="stat-icon orange">
                            !
                        </div>

                    </div>


                    <div className="stat-value">

                        {loading
                            ? '—'
                            : unresolvedRecords}

                    </div>


                    <div className="stat-description">
                        Need attention
                    </div>

                </div>

            </div>


            {/* ==================================================
                LATEST TIER 1 RUN
            ================================================== */}

            {runResult && (

                <div className="panel">

                    <div className="panel-header">

                        <div>

                            <h2>
                                Latest Tier 1 Run
                            </h2>


                            <p>

                                {runResult.summary?.runId ||
                                    'Run completed'}

                            </p>

                        </div>


                        <span className="badge badge-success">
                            Completed
                        </span>

                    </div>


                    {/* RUN SUMMARY */}

                    <div className="run-summary-grid">


                        {/* TOTAL */}

                        <div>

                            <span>
                                Total
                            </span>


                            <strong>

                                {
                                    runResult.summary
                                        ?.totalStaging ?? 0
                                }

                            </strong>

                        </div>


                        {/* MATCHED */}

                        <div>

                            <span>
                                Matched
                            </span>


                            <strong>

                                {
                                    runResult.summary
                                        ?.matched ?? 0
                                }

                            </strong>

                        </div>


                        {/* UPDATED */}

                        <div>

                            <span>
                                Updated
                            </span>


                            <strong>

                                {
                                    runResult.summary
                                        ?.updated ?? 0
                                }

                            </strong>

                        </div>


                        {/* UNMATCHED */}

                        <div>

                            <span>
                                Unmatched
                            </span>


                            <strong>

                                {
                                    runResult.summary
                                        ?.unmatched ?? 0
                                }

                            </strong>

                        </div>


                        {/* UNCHANGED */}

                        <div>

                            <span>
                                Unchanged
                            </span>


                            <strong>

                                {
                                    runResult.summary
                                        ?.unchanged ?? 0
                                }

                            </strong>

                        </div>


                        {/* ERRORS */}

                        <div>

                            <span>
                                Errors
                            </span>


                            <strong className="danger-text">

                                {
                                    runResult.summary
                                        ?.errors ?? 0
                                }

                            </strong>

                        </div>

                    </div>


                    {/* TIER 1 ERRORS */}

                    {runResult.summary?.errorDetails?.length > 0 && (

                        <div className="tier1-errors">

                            <h3>
                                Tier 1 Errors
                            </h3>


                            {runResult.summary.errorDetails.map(
                                (item, index) => (

                                    <div
                                        className="tier1-error-item"
                                        key={index}
                                    >

                                        <div className="error-isin">

                                            ISIN:{' '}

                                            {item.ISIN ||
                                                'Unknown'}

                                        </div>


                                        <div className="error-message">

                                            {item.error ||
                                                'Unknown error'}

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>

            )}


            {/* ==================================================
                RECENT CHANGES
            ================================================== */}

            <div className="panel">

                <div className="panel-header">

                    <div>

                        <h2>
                            Recent Changes
                        </h2>


                        <p>
                            Latest master field updates
                        </p>

                    </div>

                </div>


                {history.length === 0 ? (

                    <div className="empty-state">

                        <div className="empty-icon">
                            ◷
                        </div>


                        <h3>
                            No changes yet
                        </h3>


                        <p>
                            Tier 1 changes will appear
                            here.
                        </p>

                    </div>

                ) : (

                    <div className="table-wrapper">

                        <table>

                            <thead>

                                <tr>

                                    <th>
                                        ISIN
                                    </th>

                                    <th>
                                        FIELD
                                    </th>

                                    <th>
                                        OLD VALUE
                                    </th>

                                    <th>
                                        NEW VALUE
                                    </th>

                                    <th>
                                        SOURCE
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {history
                                    .slice(0, 8)
                                    .map(record => (

                                        <tr
                                            key={
                                                record.ROWID
                                            }
                                        >

                                            <td>

                                                <span className="isin">

                                                    {
                                                        record.ISIN
                                                    }

                                                </span>

                                            </td>


                                            <td>

                                                {
                                                    record.Field
                                                }

                                            </td>


                                            <td className="old-value">

                                                {
                                                    record.Old_Value ||
                                                    '—'
                                                }

                                            </td>


                                            <td className="new-value">

                                                {
                                                    record.New_Value ||
                                                    '—'
                                                }

                                            </td>


                                            <td>

                                                <span className="badge badge-neutral">

                                                    {
                                                        record.Source ||
                                                        'SYSTEM'
                                                    }

                                                </span>

                                            </td>

                                        </tr>

                                    ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


            {/* ==================================================
                ADD STAGING MODAL
            ================================================== */}

            {showStagingForm && (

                <div className="modal-overlay">

                    <div className="modal">

                        <div className="modal-header">

                            <div>

                                <h2>
                                    Add Staging Record
                                </h2>


                                <p>
                                    Manually add a record
                                    to scrip_staging.
                                </p>

                            </div>


                            <button
                                type="button"
                                className="modal-close"
                                onClick={() =>
                                    setShowStagingForm(false)
                                }
                            >
                                ×
                            </button>

                        </div>


                        <form
                            onSubmit={
                                handleCreateStaging
                            }
                        >

                            <div className="form-grid">


                                {/* ISIN */}

                                <div className="form-group">

                                    <label>
                                        ISIN
                                    </label>


                                    <input
                                        type="text"
                                        value={
                                            stagingForm.ISIN
                                        }
                                        onChange={(e) =>
                                            setStagingForm({
                                                ...stagingForm,
                                                ISIN:
                                                    e.target.value
                                                        .toUpperCase()
                                            })
                                        }
                                        placeholder="INE001A01001"
                                        required
                                    />

                                </div>


                                {/* SYMBOL */}

                                <div className="form-group">

                                    <label>
                                        Symbol
                                    </label>


                                    <input
                                        type="text"
                                        value={
                                            stagingForm.Symbol
                                        }
                                        onChange={(e) =>
                                            setStagingForm({
                                                ...stagingForm,
                                                Symbol:
                                                    e.target.value
                                                        .toUpperCase()
                                            })
                                        }
                                        placeholder="ABC"
                                        required
                                    />

                                </div>


                                {/* COMPANY NAME */}

                                <div className="form-group">

                                    <label>
                                        Company Name
                                    </label>


                                    <input
                                        type="text"
                                        value={
                                            stagingForm.Company_Name
                                        }
                                        onChange={(e) =>
                                            setStagingForm({
                                                ...stagingForm,
                                                Company_Name:
                                                    e.target.value
                                            })
                                        }
                                        placeholder="ABC Industries Limited"
                                        required
                                    />

                                </div>


                                {/* SERIES */}

                                <div className="form-group">
                        <label>Series</label>
                        <select
                            value={stagingForm.Series}
                            onChange={(e) =>
                                setStagingForm({
                                    ...stagingForm,
                                    Series: e.target.value
                                })
                            }
                        >
                            <option value="EQ">EQ</option>
                            <option value="BE">BE</option>
                            <option value="SM">SM</option>
                        </select>
                    </div>


                                {/* SOURCE FILE */}

                                <div className="form-group full-width">

                                    <label>
                                        Source File
                                    </label>


                                    <input
                                        type="text"
                                        value={
                                            stagingForm.Source_File
                                        }
                                        onChange={(e) =>
                                            setStagingForm({
                                                ...stagingForm,
                                                Source_File:
                                                    e.target.value
                                            })
                                        }
                                        placeholder="manual"
                                    />

                                </div>

                            </div>


                            {/* FORM BUTTONS */}

                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={() =>
                                        setShowStagingForm(false)
                                    }
                                    disabled={formLoading}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="primary-button"
                                    disabled={formLoading}
                                >

                                    {formLoading
                                        ? 'Saving...'
                                        : 'Create Staging'}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            {/* ==================================================
                ADD MASTER MODAL
            ================================================== */}

            {showMasterForm && (

                <div className="modal-overlay">

                    <div className="modal">

                        <div className="modal-header">

                            <div>

                                <h2>
                                    Add Master Record
                                </h2>


                                <p>
                                    Manually add a record
                                    to scrip_master.
                                </p>

                            </div>


                            <button
                                type="button"
                                className="modal-close"
                                onClick={() =>
                                    setShowMasterForm(false)
                                }
                            >
                                ×
                            </button>

                        </div>


                        <form
                            onSubmit={
                                handleCreateMaster
                            }
                        >

                            <div className="form-grid">


                                {/* ISIN */}

                                <div className="form-group">

                                    <label>
                                        ISIN
                                    </label>


                                    <input
                                        type="text"
                                        value={
                                            masterForm.ISIN
                                        }
                                        onChange={(e) =>
                                            setMasterForm({
                                                ...masterForm,
                                                ISIN:
                                                    e.target.value
                                                        .toUpperCase()
                                            })
                                        }
                                        placeholder="INE004A01004"
                                        required
                                    />

                                </div>


                                {/* SYMBOL */}

                                <div className="form-group">

                                    <label>
                                        Symbol
                                    </label>


                                    <input
                                        type="text"
                                        value={
                                            masterForm.Symbol
                                        }
                                        onChange={(e) =>
                                            setMasterForm({
                                                ...masterForm,
                                                Symbol:
                                                    e.target.value
                                                        .toUpperCase()
                                            })
                                        }
                                        placeholder="LMN"
                                        required
                                    />

                                </div>


                                {/* COMPANY NAME */}

                                <div className="form-group">

                                    <label>
                                        Company Name
                                    </label>


                                    <input
                                        type="text"
                                        value={
                                            masterForm.Company_Name
                                        }
                                        onChange={(e) =>
                                            setMasterForm({
                                                ...masterForm,
                                                Company_Name:
                                                    e.target.value
                                            })
                                        }
                                        placeholder="LMN Technologies Limited"
                                        required
                                    />

                                </div>


                                {/* SERIES */}

                                <div className="form-group">
                        <label>Series</label>
                        <select
                            value={stagingForm.Series}
                            onChange={(e) =>
                                setStagingForm({
                                    ...stagingForm,
                                    Series: e.target.value
                                })
                            }
                        >
                            <option value="EQ">EQ</option>
                            <option value="BE">BE</option>
                            <option value="SM">SM</option>
                            </select>

                                </div>


                                {/* STATUS */}

                                <div className="form-group full-width">

                                    <label>
                                        Status
                                    </label>


                                    <select
                                        value={
                                            masterForm.Status
                                        }
                                        onChange={(e) =>
                                            setMasterForm({
                                                ...masterForm,
                                                Status:
                                                    e.target.value
                                            })
                                        }
                                    >

                                        <option value="">
                                            Select status
                                        </option>


                                        <option value="active">
                                            Active
                                        </option>


                                        <option value="inactive">
                                            Inactive
                                        </option>


                                        <option value="unresolved">
                                            Unresolved
                                        </option>

                                    </select>

                                </div>

                            </div>


                            {/* FORM BUTTONS */}

                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={() =>
                                        setShowMasterForm(false)
                                    }
                                    disabled={formLoading}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="primary-button"
                                    disabled={formLoading}
                                >

                                    {formLoading
                                        ? 'Saving...'
                                        : 'Create Master'}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>

    );

}