import { useRef } from "react"
import { Results } from "@electric-sql/pglite"

function ResultsComponent(props: { results: Results<unknown> | undefined, scrollIntoView: boolean }) {
  const resultRef = useRef<HTMLDivElement>(null);
  if (!props || !props.results) return <></>
  if (props.scrollIntoView) {
    setTimeout(() => {
      resultRef.current?.scrollIntoView();
    }, 200);
  }
  return (
    <>
      {(props.results.affectedRows || 0) > 0 && <div ref={resultRef}>{props.results.affectedRows} rows affected</div>}
      {props.results.fields.length > 0 && <div className="card" ref={resultRef}>
        <table className="table" style={{ width: '100%' }}>
          <caption className="p-2">{props.results.rows.length} rows returned</caption>
          <thead>
            <tr className="table-primary">
              {props.results.fields.map((field, fieldIndex) =>
                <td key={fieldIndex}>{field.name}</td>
              )}
            </tr>
          </thead>
          <tbody>
            {props.results.rows.map((row, index) => (
              <tr key={index}>
                {props.results!.fields.map((field, fieldIndex) =>
                  <td key={fieldIndex}>{`${(row as { [key: string]: unknown })[field.name]}`}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      }
    </>
  )
}

export default ResultsComponent
