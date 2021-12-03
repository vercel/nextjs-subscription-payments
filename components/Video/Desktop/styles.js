import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  width: 100%;
`;

export const Container = styled.div`
  position: relative;
  overflow: hidden;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Video = styled.video`
  position: absolute;

  &::-webkit-media-controls-play-button {
    display: none !important;
    -webkit-appearance: none;
  }
  width: 100vw;
  height: 100%;
`;

export const Button = styled.button`
  width: 75%;
  min-width: 100px;
  max-width: 250px;
  margin-top: 24px;
  padding: 12px 24px;
  background: silver;
`;
