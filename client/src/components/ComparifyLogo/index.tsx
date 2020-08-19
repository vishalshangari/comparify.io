import React from "react";
import styled from "styled-components";

type ComparifyLogo = {
  color: string;
  size: string;
};

const ComparifyLogo = ({ color, size }: ComparifyLogo) => {
  return (
    <LogoContainer color={color} size={size}>
      <a href="/">Comparify</a>
    </LogoContainer>
  );
};

const LogoContainer = styled.div<{
  color: string;
  size: string;
}>`
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */
  -ms-user-select: none; /* IE 10+ */
  a {
    transition: 0.2s ease all;
    opacity: 0.7;
    color: ${({ color }) => color};
    font-size: ${({ size }) => size};
    font-family: "Roboto Slab", serif;
    &:hover {
      opacity: 1;
    }
  }
`;

export default ComparifyLogo;
