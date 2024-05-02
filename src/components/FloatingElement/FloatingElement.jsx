import React from "react";
import styled from "styled-components";

const Container = styled.div`
  position: fixed;
  bottom: 20px;
  right: -10px;
  background-color: #EEB808;
  padding: 10px 15px;
  opacity: 70%;
  z-index: 2000;
  color: #103755;
  border-top-left-radius: 50px;
  border-bottom-left-radius: 50px;
  cursor: pointer;
  font-weight: 600;
  transition: .2s;

  :hover{
    opacity: 100%;
    color: #fff;
    right: 10px;
  }

  @media only screen and (max-width: 600px) {

  }
`;

const FloatingElement = () => {
  return (
    <Container>
      <a href="https://api.whatsapp.com/send?phone=2349060859789&text=Hi%20there,%20what%20product%20or%20service%20would%20you%20like%20me%20to%20help%20you%20find%20from%20one%20of%20our%20sellers%20within%20Bingham?">Can't find what your looking for?</a>
    </Container>
  );
};

export default FloatingElement;
