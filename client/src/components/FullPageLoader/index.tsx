import React from "react";
import styled from "styled-components";
import ScaleLoader from "react-spinners/ScaleLoader";

const FullPageLoader = () => {
  return (
    <LoadCover>
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
    </LoadCover>
  );
};

const LoadContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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

export default FullPageLoader;
