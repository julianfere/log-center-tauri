import styled from "styled-components";

const LogArea = styled.textarea`
  width: 100%;
  height: 100%;
  resize: none;
  border: none;
  background-color: #0a0a0a;
  padding: 0.4rem;
  color: white;
  font-size: 1.2rem;
  outline: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Title = styled.p`
  font-size: 1.5rem;
  font-weight: 400;
  color: #8cee76;
  margin: 0;
  text-align: center;
`;

const LogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  border-bottom: 1px solid #18500b;
`;

const CloseIcon = styled.img`
  cursor: pointer;
`;

export default LogArea;
export { Title, LogHeader, CloseIcon };
