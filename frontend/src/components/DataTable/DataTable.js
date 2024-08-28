import React from "react";

import "./DataTable.css"
const DataTable = ({children}) => { 
    
    return (
        <table className="table">
            <thead>
                <tr className="table-row">
                    <th id="name-column" className="table-head">Name</th>
                    <th id="musclegroup-column" className="table-head">Muscle Group</th>
                    <th id="equipment-column" className="table-head">Equipment Needed</th>
                </tr>
            </thead>
            {children}
        </table>
    )
}

export default DataTable