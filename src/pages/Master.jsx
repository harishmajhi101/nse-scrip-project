import { useEffect, useMemo, useState } from 'react';

import { getMaster } from '../api/scripApi';


export default function Master() {

    const [records, setRecords] = useState([]);

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');


    // --------------------------------------------------
    // Load Master
    // --------------------------------------------------

    useEffect(() => {

        loadMaster();

    }, []);


    async function loadMaster() {

        try {

            setLoading(true);
            setError('');

            const data = await getMaster();

            // IMPORTANT:
            // getMaster() already returns json.data
            setRecords(data || []);

        } catch (error) {

            console.error(
                'Master loading error:',
                error
            );

            setError(
                error.message ||
                'Unable to load master records'
            );

        } finally {

            setLoading(false);

        }

    }


    // --------------------------------------------------
    // Filter Records
    // --------------------------------------------------

    const filteredRecords = useMemo(() => {

        const searchText =
            search.trim().toLowerCase();


        return records.filter(record => {

            // Status filter
            if (
                statusFilter !== 'all' &&
                String(
                    record.Status || ''
                ).toLowerCase() !==
                    statusFilter.toLowerCase()
            ) {

                return false;

            }


            // Search
            if (!searchText) {

                return true;

            }


            return [

                record.ISIN,
                record.Company_Name,
                record.Symbol

            ].some(value =>
                String(value || '')
                    .toLowerCase()
                    .includes(searchText)
            );

        });

    }, [
        records,
        search,
        statusFilter
    ]);


    // --------------------------------------------------
    // Status Badge
    // --------------------------------------------------

    function getStatusClass(status) {

        const value =
            String(status || '')
                .toLowerCase();

        if (value === 'active') {
            return 'badge badge-success';
        }

        if (value === 'inactive') {
            return 'badge badge-neutral';
        }

        if (value === 'unresolved') {
            return 'badge badge-warning';
        }

        return 'badge badge-neutral';

    }


    function getStatusText(status) {

        if (!status) {
            return '—';
        }

        return status;

    }


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
                        DATA
                    </div>

                    <h1>
                        Scrip Master
                    </h1>

                    <p>
                        Current NSE security master
                        records.
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
                    Filters
                -------------------------------------------------- */}

                <div className="filters">

                    <div className="search-box">

                        <span className="search-icon">
                            ⌕
                        </span>

                        <input
                            type="text"
                            placeholder="Search ISIN, company or symbol..."
                            value={search}
                            onChange={event =>
                                setSearch(
                                    event.target.value
                                )
                            }
                        />

                    </div>


                    <select
                        value={statusFilter}
                        onChange={event =>
                            setStatusFilter(
                                event.target.value
                            )
                        }
                    >

                        <option value="all">
                            All Status
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


                {/* --------------------------------------------------
                    Loading
                -------------------------------------------------- */}

                {loading && (

                    <div className="loading-state">

                        <div className="spinner"></div>

                        <p>
                            Loading master records...
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
                            ▦
                        </div>

                        <h3>
                            No records found
                        </h3>

                        <p>
                            Try changing your search
                            or filter.
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
                                        STATUS
                                    </th>

                                    <th>
                                        LAST UPDATE SOURCE
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredRecords.map(
                                    record => (

                                    <tr
                                        key={
                                            record.ROWID ||
                                            record.ISIN
                                        }
                                    >

                                        <td>

                                            <span className="isin">
                                                {
                                                    record.ISIN ||
                                                    '—'
                                                }
                                            </span>

                                        </td>


                                        <td>

                                            {
                                                record.Company_Name ||
                                                '—'
                                            }

                                        </td>


                                        <td>

                                            {
                                                record.Symbol ||
                                                '—'
                                            }

                                        </td>


                                        <td>

                                            {
                                                record.Series ||
                                                '—'
                                            }

                                        </td>


                                        <td>

                                            <span
                                                className={
                                                    getStatusClass(
                                                        record.Status
                                                    )
                                                }
                                            >
                                                {
                                                    getStatusText(
                                                        record.Status
                                                    )
                                                }
                                            </span>

                                        </td>


                                        <td>

                                            {
                                                record.Last_Update_Source ||
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

}