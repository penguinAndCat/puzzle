import Head from 'next/head';

interface ISeoProps {
  title: string;
  description?: string;
  image?: string;
}

const Seo = ({ title, description, image }: ISeoProps) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="og:title" content={title} />
      <meta property="og:title" content={title} />
      <meta
        name="keyword"
        content="puzzle, jigsaw, 퍼즐, 직소, 직소퍼즐, 퍼즐방, 다같이, 여럿이, 퍼즐게임, 게임, 친구초대, 초대"
      />
      <meta name="og:type" content="website" />
      <meta name="og:url" content="https://pengcatpuzzle.vercel.app" />
      <meta name="author" content="catca kyk1211" />
      {description && (
        <>
          <meta name="description" content={description} />
          <meta name="og:description" content={description} />
          <meta property="og:description" content={description} />
        </>
      )}
      {image && <meta name="og:image" content={image} />}
      {image && <meta property="og:image" content={image} />}
    </Head>
  );
};

export default Seo;
