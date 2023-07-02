import styled from "styled-components";

const AppBarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2e2e2e;
`;

const AppBarButtonContainer = styled.div`
  display: flex;
  height: 100%;
`;

const AppbarButton = styled.button<{ isCloseButton?: boolean }>`
  width: 100%;
  height: 100%;
  background-color: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 0rem 0.5rem 0 0.5rem;
  &:hover {
    background-color: ${(props) =>
      props.isCloseButton ? "#ff0000" : "#7c7878;"};
  }
`;

export { AppBarContainer, AppBarButtonContainer, AppbarButton };
