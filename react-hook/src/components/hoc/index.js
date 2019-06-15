import React from "react";
import WithStupidCom, { WithLog } from "./Hoc1";

function HocTest(props) {
    const { name } = props;
    return (
        <div className="wrapper">
            {name}
        </div>
    )
}

export default WithLog(WithStupidCom(HocTest));