import styled from "styled-components";

const NavContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding: 0.4rem;
  background-color: #000000;
  border-bottom: 1px solid #18500b;
`;

const NavButton = styled.button<{ watching?: boolean }>`
  padding: 0.4rem;
  background-color: #000000;
  border: none;
  color: ${(props) => (props.watching ? "#e73d31" : "#ffffff")};
  font-size: 1rem;
  font-weight: 100;
  cursor: pointer;
  border-bottom: 1px solid transparent;
  &:hover {
    color: ${(props) => (props.watching ? "#e73d31" : "#ffffff")};
    border-bottom: 1px solid
      ${(props) => (props.watching ? "#e73d31" : "#50aa3c")};
    transition: all 0.5s ease-in-out;
  }

  &:disabled {
    color: #7e7e7e;
    border-bottom: 1px solid transparent;
    cursor: not-allowed;
  }
`;

const LogsContainer = styled.div`
  display: flex;
  justify-content: center;
  height: 100%;
  width: 100%;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 0.4rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;

export default NavContainer;
export { NavButton, LogsContainer, ButtonContainer };
