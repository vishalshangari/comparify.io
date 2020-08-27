import React from "react";
import styled from "styled-components";
import ScaleLoader from "react-spinners/ScaleLoader";

type LoaderProps = {
  fullscreen?: boolean;
  label: boolean;
};

type LoaderInnerProps = {
  label: boolean;
};

const LoaderInner = ({ label }: LoaderInnerProps) => {
  return (
    <LoadContent>
      <ScaleLoader
        height={75}
        width={10}
        radius={5}
        margin={5}
        color={"#333"}
      />
      {label ? <div className="loadingLabel">Loading...</div> : null}
    </LoadContent>
  );
};

const Loader = ({ fullscreen, label }: LoaderProps) => {
  if (fullscreen) {
    return (
      <LoadCover>
        <LoaderInner label={label}></LoaderInner>
      </LoadCover>
    );
  } else {
    return <LoaderInner label={label} />;
  }
};

const LoadContent = styled.div`
  display: flex;
  height: 100%;
  flex-grow: 1;
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
