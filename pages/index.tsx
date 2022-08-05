import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import PuzzleCanvas from '../components/canvasPuzzle';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <PuzzleCanvas puzzleImg={'/test.jpg'} />
    </div>
  );
};

export default Home;
