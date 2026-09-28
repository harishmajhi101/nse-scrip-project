import { useEffect, useMemo, useState } from 'react';

import { getStaging } from '../api/scripApi';


export default function Staging() {

    const [records, setRecords] = useState([]);

    const [search, setSearch] = useState('');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');


    // --------------------------------------------------
    // Load Staging
    // --------------------------------------------------

    useEffect(() => {

        loadStaging();

    }, []);


    async function loadStaging() {

        try {

            setLoading(true);
            setError('');

            const data = await getStaging();

            // IMPORTANT:
            // getStaging() already returns json.data
            setRecords(data || []);

        } catch (error) {

            console.error(
                'Staging loading error:',
                error
            );

            setError(
                error.message ||
                'Unable to load staging records'
            );

        } finally {

            setLoading(false);

        }

    }


    // --------------------------------------------------
    // Search
    // --------------------------------------------------

    const filteredRecords = useMemo(() => {

        const searchText =
            search.trim().toLowerCase();

        if (!searchText) {
            return records;
        }

        return records.filter(record => {

            return [

                record.ISIN,
                record.Company_Name,
                record.Symbol,
                record.Series,
                record.Source_File,
                record.Run_ID

            ].some(value =>
                String(value || '')
                    .toLowerCase()
                    .includes(searchText)
            );

        });

    }, [records, search]);


    // --------------------------------------------------
    // Render
    // --------------------------------------------------

    return (

        <div className="page">


            {/* --------------------------------------------------
                Header
            -------------------------------------------------- */}

            <div className="page-header">

                <div>

                    <div className="eyebrow">
                        PIPELINE
                    </div>

                    <h1>
                        Staging
                    </h1>

                    <p>
                        NSE records waiting for Tier 1
                        processing.
                    </p>

                </div>


                <div className="record-count">

                    <strong>
                        {records.length}
                    </strong>

                    <span>
                        records
                    </span>

                </div>

            </div>


            {/* --------------------------------------------------
                Error
            -------------------------------------------------- */}

            {error && (

                <div className="alert alert-error">

                    <strong>
                        Error:
                    </strong>{' '}

                    {error}

                </div>

            )}


            {/* --------------------------------------------------
                Main Panel
            -------------------------------------------------- */}

            <div className="panel">


                {/* --------------------------------------------------
                    Search
                -------------------------------------------------- */}

                <div className="filters">

                    <div className="search-box">

                        <span className="search-icon">
                            ⌕
                        </span>

                        <input
                            type="text"
                            placeholder="Search ISIN, company, symbol, run ID..."
                            value={search}
                            onChange={event =>
                                setSearch(
                                    event.target.value
                                )
                            }
                        />

                    </div>

                </div>


                {/* --------------------------------------------------
                    Loading
                -------------------------------------------------- */}

                {loading && (

                    <div className="loading-state">

                        <div className="spinner"></div>

                        <p>
                            Loading staging records...
                        </p>

                    </div>

                )}


                {/* --------------------------------------------------
                    Empty
                -------------------------------------------------- */}

                {!loading &&
                    !error &&
                    filteredRecords.length === 0 && (

                    <div className="empty-state">

                        <div className="empty-icon">
                            ▤
                        </div>

                        <h3>
                            No staging records
                        </h3>

                        <p>
                            NSE records will appear here
                            after the staging process runs.
                        </p>

                    </div>

                )}


                {/* --------------------------------------------------
                    Table
                -------------------------------------------------- */}

                {!loading &&
                    filteredRecords.length > 0 && (

                    <div className="table-wrapper">

                        <table>

                            <thead>

                                <tr>

                                    <th>
                                        ISIN
                                    </th>

                                    <th>
                                        COMPANY NAME
                                    </th>

                                    <th>
                                        SYMBOL
                                    </th>

                                    <th>
                                        SERIES
                                    </th>

                                    <th>
                                        SOURCE FILE
                                    </th>

                                    <th>
                                        RUN ID
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredRecords.map(
                                    record => (

                                    <tr
                                        key={
                                            record.ROWID ||
                                            `${record.ISIN}-${record.Run_ID}`
                                        }
                                    >

                                        {/* ISIN */}

                                        <td>

                                            <span className="isin">

                                                {
                                                    record.ISIN ||
                                                    '—'
                                                }

                                            </span>

                                        </td>


                                        {/* Company */}

                                        <td>

                                            {
                                                record.Company_Name ||
                                                '—'
                                            }

                                        </td>


                                        {/* Symbol */}

                                        <td>

                                            {
                                                record.Symbol ||
                                                '—'
                                            }

                                        </td>


                                        {/* Series */}

                                        <td>

                                            {
                                                record.Series ||
                                                '—'
                                            }

                                        </td>


                                        {/* Source File */}

                                        <td>

                                            {
                                                record.Source_File ||
                                                '—'
                                            }

                                        </td>


                                        {/* Run ID */}

                                        <td>

                                            {
                                                record.Run_ID ||
                                                '—'
                                            }

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
        

    );
    {showStagingForm && (

    <div className="modal-overlay">

        <div className="modal">

            <div className="modal-header">

                <div>
                    <h2>
                        Add Staging Record
                    </h2>

                    <p>
                        Manually add a record to scrip_staging.
                    </p>
                </div>

                <button
                    className="modal-close"
                    onClick={() => setShowStagingForm(false)}
                >
                    ×
                </button>

            </div>


            <form onSubmit={handleCreateStaging}>

                <div className="form-grid">

                    <div className="form-group">

                        <label>
                            ISIN
                        </label>

                        <input
                            type="text"
                            value={stagingForm.ISIN}
                            onChange={(e) =>
                                setStagingForm({
                                    ...stagingForm,
                                    ISIN: e.target.value
                                })
                            }
                            placeholder="INE001A01001"
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Symbol
                        </label>

                        <input
                            type="text"
                            value={stagingForm.Symbol}
                            onChange={(e) =>
                                setStagingForm({
                                    ...stagingForm,
                                    Symbol: e.target.value
                                })
                            }
                            placeholder="ABC"
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Company Name
                        </label>

                        <input
                            type="text"
                            value={stagingForm.Company_Name}
                            onChange={(e) =>
                                setStagingForm({
                                    ...stagingForm,
                                    Company_Name: e.target.value
                                })
                            }
                            placeholder="ABC Industries Limited"
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Series
                        </label>

                        <input
                            type="text"
                            value={stagingForm.Series}
                            onChange={(e) =>
                                setStagingForm({
                                    ...stagingForm,
                                    Series: e.target.value
                                })
                            }
                            placeholder="EQ"
                        />

                    </div>


                    <div className="form-group full-width">

                        <label>
                            Source File
                        </label>

                        <input
                            type="text"
                            value={stagingForm.Source_File}
                            onChange={(e) =>
                                setStagingForm({
                                    ...stagingForm,
                                    Source_File: e.target.value
                                })
                            }
                            placeholder="manual"
                        />

                    </div>

                </div>


                <div className="modal-actions">

                    <button
                        type="button"
                        className="cancel-button"
                        onClick={() =>
                            setShowStagingForm(false)
                        }
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

}