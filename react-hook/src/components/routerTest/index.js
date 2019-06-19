import React, {useEffect} from "react";

function RouterTest(props) {

  useEffect(() => {
    console.log(props);
  }, []);

  return (
      <div>
        React Router
      </div>
  )
}

export default RouterTest;
