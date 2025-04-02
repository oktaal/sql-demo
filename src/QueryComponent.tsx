import { useState } from 'react';
import { Results } from "@electric-sql/pglite"
import { usePGlite } from '@electric-sql/pglite-react'
import SyntaxHighlighter from 'react-syntax-highlighter';
import TextareaAutosize from 'react-textarea-autosize';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import ResultsComponent from './ResultsComponent'

function QueryComponent(props: {
  queryText: string,
  readonly: boolean,
  onRun: (queryText: string) => void
}) {
  // see details https://pglite.dev/docs/framework-hooks/react#usepglite
  const db = usePGlite();

  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [firstRun, setFirstRun] = useState(true);
  const [loading, setLoading] = useState(false);
  const [queryText, setQueryText] = useState(props.queryText);
  const [results, setResults] = useState<Results<unknown> | undefined>(undefined);

  const query = async () => {
    if (!firstRun) {
      // show we are running the query again
      setLoading(true);
    }
    setError('');
    try {
      const results = await db.query(
        queryText
      );

      setResults(results);
      props.onRun(queryText);
      setSuccess(true);
      setTimeout(() => {
        setFirstRun(false);
      }, 2000);
    }
    catch (exception) {
      setError(`${exception}`);
    }

    // without a timeout quick queries have zero feedback
    setTimeout(() => {
      setLoading(false);
    }, 200);
  }

  return (
    <>
      <div className="mb-3">
        {props.readonly || !editing
          ? <SyntaxHighlighter language="sql" style={docco} onClick={() => {
            if (!props.readonly) {
              setEditing(true);
            }
          }}>
            {queryText}
          </SyntaxHighlighter>
          : <TextareaAutosize onBlur={() => setEditing(false)} className="form-control" name="queryText" minRows={1} maxRows={40} cols={40} value={queryText} onChange={e => setQueryText(e.target.value)} />
        }
      </div>
      <div className="mb-3">
        {
          loading
            ? <button className="btn btn-secondary" type="button" disabled>
              <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
              <span className="visually-hidden" role="status">Loading...</span>
            </button>
            : <button className={"btn " + (error ? 'btn-danger' : success ? 'btn-success' : 'btn-primary')} onClick={query}>
              {success ? '✓' : 'Run query'}</button>
        }
      </div>
      <ResultsComponent scrollIntoView={firstRun} results={results} key="pgliteItems"></ResultsComponent>
      {error && <div className="alert alert-danger" role="alert">
        {error}
      </div>}
    </>
  )
}

export default QueryComponent
