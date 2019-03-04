import * as React from "react";
import * as ReactDOM from "react-dom";
import styled from "react-emotion";
import useAnchor from "./useAnchor";

const range = n => Array.from({ length: n }, (_, i) => i);

const getRandomScrollTarget = () =>
  Math.abs((Math.random() * 100).toFixed(0) - 1);

const goToAnchor = () => {
  // window.location.hash = `${getRandomScrollTarget()}`;
  window.location.assign(
    `${window.location.origin}/#${getRandomScrollTarget()}`
  );
  window.location.reload();
};

const List = styled("div")``;

const Card = styled("div")`
  width: 500px;
  height: 40px;
  margin: 10px;
  font-size: 20px;
  font-weight: 700;
  padding-top: 15px;
  text-align: center;
  color: white;

  background-color: turquoise;
  border-radius: 4px;
`;

const Button = styled("button")`
  position: fixed;
  height: 50px;
`;

const Anchorage = () => {
  useAnchor();

  return (
    <>
      <Button onClick={goToAnchor}>Click me</Button>
      <List>
        {range(100).map(i => (
          <Card key={i} name={i}>
            {i}
          </Card>
        ))}
      </List>
    </>
  );
};

ReactDOM.render(<Anchorage />, document.getElementById("root"));
