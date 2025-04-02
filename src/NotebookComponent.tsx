import { useState } from "react";
import QueryComponent from "./QueryComponent";

type NotebookProperties = { queries: string[] };

function NotebookComponent(props: NotebookProperties) {
    const [currIndex, setCurrIndex] = useState(0);

    function renderQuery(queryText: string, index: number) {
        return (<div className="row align-items-center my-3" key={index}>
            <div className="col col-1 text-center">
                [{index}]
            </div>
            <div className="col">
                <QueryComponent queryText={queryText} onRun={(queryText) => {
                    props.queries[index] = queryText;

                    if (index + 1 > currIndex) {
                        setCurrIndex(index + 1);
                    }

                    if (currIndex + 1 >= props.queries.length) {
                        props.queries.push('');
                    }

                    console.log(props.queries);
                }} />
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
