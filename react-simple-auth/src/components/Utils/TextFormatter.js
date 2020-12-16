import React from 'react';

export const TextFormatter = props => {
    let formttedText = props.children;

    // Add line breaks
    formttedText = formttedText.split("\n").map((el, i) => 
        <React.Fragment key={i}>{el}<br /></React.Fragment>
    );

    // Scanning for elements
    let elements = [];
    let lastElement = null;

    let lineIndex = 0;
    for (let el of formttedText) {
        let line = el.props.children[0];

        if (["[table]", "[ol]", "[ul]"].includes(line.trim())) {
            lastElement = {
                type: line.replace("[", "").replace("]", ""),
                beginLine: lineIndex,
                endLine: null,
                children: []
            };
        }
        else if (["[/table]", "[/ol]", "[/ul]"].includes(line.trim()) && lastElement !== null) {
            lastElement.endLine = lineIndex;
            elements.push(lastElement);
            lastElement = null;
        }
        else if (lastElement) {
            lastElement.children.push(el);
        }

        lineIndex++;
    }

    // Creating elements
    let linesDeleted = 0;
    let elementIndex = 0;
    for (let el of elements) {
        let createdElement = null;
        if (el.type === "table") {
            createdElement = <table key={`table_${elementIndex}`} className="text_formatter--table">
                                    <tbody>
                                        {
                                            el.children.map((ln, i) => <tr key={i} className="text_formatter--table--row">
                                                                    {
                                                                        ln.props.children[0].split(";").map((col, j) => {
                                                                            if (col[0] === "^") {
                                                                                return  <th key={j} className="text_formatter--table--row--data text_formatter--table--row--data-header-top">
                                                                                            {col.substring(1)}
                                                                                        </th>;
                                                                            }
                                                                            else if (col[0] === "<") {
                                                                                return  <th key={j} className="text_formatter--table--row--data text_formatter--table--row--data-header-left">
                                                                                            {col.substring(1)}
                                                                                        </th>;
                                                                            }
                                                                            return  <td key={j} className={`text_formatter--table--row--data ${col === "" ? "text_formatter--table--row--data-no_border" : ""}`}>
                                                                                        {col}
                                                                                    </td>;
                                                                        })
                                                                    }
                                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>;
        }
        else if (el.type === "ol") {
            createdElement =    <div key={`ol_${elementIndex}`} className="text_formatter--ol">
                                    {
                                        el.children.map((ln, i) =>  <div key={i} className="text_formatter--ol--row">
                                                                        <span className="text_formatter--ol--row--number">{i+1}</span>
                                                                        {ln.props.children[0]}
                                                                    </div>)

                                    }
                                </div>;
        }
        else if (el.type === "ul") {
            createdElement =    <div key={`ul_${elementIndex}`} className="text_formatter--ul">
                                    {
                                        el.children.map((ln, i) =>  <div key={i} className="text_formatter--ul--row">
                                                                        <span className="text_formatter--ul--row--circle"></span>
                                                                        {ln.props.children[0]}
                                                                    </div>)

                                    }
                                </div>;
        }
        formttedText.splice(el.beginLine - linesDeleted, el.endLine - el.beginLine + 1, createdElement);
        linesDeleted += el.endLine - el.beginLine;
        elementIndex++;
    }


    return (
        <React.Fragment>
            {formttedText}
        </React.Fragment>
    );
};
