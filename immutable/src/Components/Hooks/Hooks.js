import React, {useState, useEffect} from 'react';

function Hooks() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        document.title = `you clicked ${count} times`;
    });

    return (
        <React.Fragment>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>
                Click me
            </button>
        </React.Fragment>
    );
}

export default Hooks;
