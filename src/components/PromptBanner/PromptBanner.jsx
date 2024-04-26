import React from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;

  a{
    
    font-size: 1.7rem;
    font-weight: 600;
    color: #103755; 

    
    @media only screen and (min-width: 700px) {
        font-size: 2rem;
    }
  }
`;

const PromptBanner = () => {
  return (
    <Container>
        <a href="https://api.whatsapp.com/send?phone=2349060859789&text=Hi%20there,%20what%20product%20or%20service%20would%20you%20like%20me%20to%20help%20you%20find%20from%20one%20of%20our%20sellers%20within%20Bingham?">Can't find what your looking for?</a>
    </Container>
  );
};

export default PromptBanner;
