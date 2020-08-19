import React from "react";
import styled from "styled-components";
import ScaleLoader from "react-spinners/ScaleLoader";

type LoaderProps = {
  fullscreen?: boolean;
};

const LoaderInner = () => {
  return (
    <LoadContent>
      <ScaleLoader
        height={75}
        width={10}
        radius={5}
        margin={5}
        color={"#333"}
      />
      <div className="loadingLabel">Loading...</div>
    </LoadContent>
  );
};

const Loader = ({ fullscreen }: LoaderProps) => {
  if (fullscreen) {
    return (
      <LoadCover>
        <LoaderInner></LoaderInner>
      </LoadCover>
    );
  } else {
    return <LoaderInner />;
  }
};

const LoadContent = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: inherit;
  .loadingLabel {
    width: 100%;
    text-align: center;
    color: #999;
    margin-top: 50px;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
`;

const LoadCover = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default Loader;
