import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styled from 'styled-components';
import PuzzleCanvas from '../components/canvasPuzzle';
import Header from '../components/common/header';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  return (
    <Container>
      <Header />
      <PuzzleCanvas />
    </Container>
  );
};

export default Home;

const Container = styled.div`
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
`;
