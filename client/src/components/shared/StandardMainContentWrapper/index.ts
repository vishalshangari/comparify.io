import styled from "styled-components";

export default styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 4em 0;
  background: ${({ theme }) => theme.colors.mainContentBg};
`;
