import React from "react";
import styled from "styled-components";
import contemplation from "../../../assets/img/contemplation.svg";

type FullPageErrorProps = {
  children: React.ReactNode;
  art?: boolean;
};

const ErrorComp = ({ children, art }: FullPageErrorProps) => {
  return (
    <ErrorWrap>
      {art ? (
        <ErrorArt>
          <img alt={`Beautiful error art here`} src={contemplation} />
        </ErrorArt>
      ) : null}
      <ErrorInner>{children}</ErrorInner>
    </ErrorWrap>
  );
};

const ErrorWrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ErrorArt = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    max-width: 50%;
  }
  margin-bottom: 2em;
`;

const ErrorInner = styled.div`
  padding: 2em;
  background: ${({ theme }) => theme.colors.errorRed};
  border-radius: 1em;
`;

export default ErrorComp;
