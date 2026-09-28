import { useEffect, useMemo, useState } from 'react';

import { getHistory } from '../api/scripApi';


export default function History() {

    const [records, setRecords] = useState([]);

    const [search, setSearch] = useState('');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');


    // --------------------------------------------------
    // Load History
    // --------------------------------------------------

    useEffect(() => {

        loadHistory();

    }, []);


    async function loadHistory() {

        try {

            setLoading(true);
            setError('');

            const data = await getHistory();

            // IMPORTANT:
            // getHistory() already returns json.data
            setRecords(data || []);

        } catch (error) {

            console.error(
                'History loading error:',
                error
            );

            setError(
                error.message ||
                'Unable to load history'
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
                record.Field,
                record.Old_Value,
                record.New_Value,
                record.Source,
                record.Applied_By,
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
                        AUDIT
                    </div>

                    <h1>
                        Change History
                    </h1>

                    <p>
                        Track changes applied to the
                        NSE scrip master.
                    </p>

                </div>


                <div className="record-count">

                    <strong>
                        {records.length}
                    </strong>

                    <span>
                        changes
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
                            placeholder="Search ISIN, field, old value, new value..."
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
                            Loading change history...
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
                            ◷
                        </div>

                        <h3>
                            No changes found
                        </h3>

                        <p>
                            Change history will appear
                            here when Tier 1 updates
                            master records.
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

                                    <th>
                                        RUN ID
                                    </th>

                                    <th>
                                        TIME
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredRecords.map(
                                    record => (

                                    <tr
                                        key={
                                            record.ROWID ||
                                            `${record.ISIN}-${record.Field}-${record.MODIFIEDTIME}`
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


                                        {/* Field */}

                                        <td>

                                            <span className="field-name">

                                                {
                                                    record.Field ||
                                                    '—'
                                                }

                                            </span>

                                        </td>


                                        {/* Old Value */}

                                        <td>

                                            <span className="old-value">

                                                {
                                                    record.Old_Value ||
                                                    '—'
                                                }

                                            </span>

                                        </td>


                                        {/* New Value */}

                                        <td>

                                            <span className="new-value">

                                                {
                                                    record.New_Value ||
                                                    '—'
                                                }

                                            </span>

                                        </td>


                                        {/* Source */}

                                        <td>

                                            <span className="badge badge-neutral">

                                                {
                                                    record.Source ||
                                                    'SYSTEM'
                                                }

                                            </span>

                                        </td>


                                        {/* Run ID */}

                                        <td>

                                            {
                                                record.Run_ID ||
                                                '—'
                                            }

                                        </td>


                                        {/* Timestamp */}

                                        <td>

                                            {
                                                record.Time_stamp ||
                                                record.MODIFIEDTIME ||
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