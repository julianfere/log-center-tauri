import styled from "styled-components";

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem;
  background-color: #000000;
  border-bottom: 1px solid #18500b;
`;

const NavButton = styled.button`
  padding: 0.4rem;
  background-color: #000000;
  border: none;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 100;
  cursor: pointer;
  border-bottom: 1px solid transparent;
  &:hover {
    color: #50aa3c;
    border-bottom: 1px solid #50aa3c;
    transition: all 0.5s ease-in-out;
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

export default NavContainer;
export { NavButton, LogsContainer };
