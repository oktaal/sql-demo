import { useRef, useState } from "react";
import QueryComponent from "./QueryComponent";

type NotebookProperties = { queries: string[], readonly: boolean };

function NotebookComponent(props: NotebookProperties) {
    const [currIndex, setCurrIndex] = useState(0);
    const [showLast, setShowLast] = useState(true);

    const queryRef = useRef<HTMLDivElement>(null);

    function revealQuery() {
        setShowLast(true);
        setTimeout(() => {
            queryRef.current?.scrollIntoView();
        }, 100);
    }

    function renderQuery(queryText: string, index: number) {
        const hideQuery = index === currIndex && !showLast;
        return (<div className="row align-items-start my-3" key={index}>
            <div className="col col-1 text-center pt-3">
                {hideQuery ? '' : `[${index}]`}
            </div>
            <div className="col" ref={queryRef}>
                {
                    hideQuery
                        ? <span key={index} className="btn btn-secondary" onClick={revealQuery}>Reveal query</span>
                        : <QueryComponent queryText={queryText} readonly={props.readonly} onRun={(queryText) => {
                            props.queries[index] = queryText;

                            if (index + 1 > currIndex) {
                                setCurrIndex(index + 1);
                                setShowLast(false);
                            }

                            if (!props.readonly && currIndex + 1 >= props.queries.length) {
                                props.queries.push('');
                                setShowLast(true);
                            }

                            console.log(props.queries);
                        }} />
                }
            </div>
        </div>
        );
    }

    return (<>
        {props.queries.slice(0, currIndex + 1).map((queryText, index) => renderQuery(queryText, index))}
    </>
    );
}

export default NotebookComponent
