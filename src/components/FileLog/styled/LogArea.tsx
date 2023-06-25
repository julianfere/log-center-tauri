import styled from "styled-components";

const LogArea = styled.textarea`
  width: 100%;
  height: 100%;
  resize: none;
  border: none;
  border-top: 1px solid #18500b;
  background-color: transparent;
  color: white;
  font-size: 1.2rem;
  outline: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export default LogArea;
