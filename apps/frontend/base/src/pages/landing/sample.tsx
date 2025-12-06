import React from "react";

const Sample = () => {
  const [state, setState] = React.useState(0);
  const response = () => {
    for (let i = 0; i < 100000; i++) {
      setState(1);
    }
    return;
  };

  return (
    <>
      <div onClick={() => console.log({ response: response() })}>Sample</div>
      {state ? <p>{state}</p> : null}
    </>
  );
};

export default Sample;
