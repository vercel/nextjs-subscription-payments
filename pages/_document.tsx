import Document, { Head, Html, Main, NextScript } from 'next/document';
import { createGetInitialProps } from '@mantine/next';

const getInitialProps = createGetInitialProps();

class MyDocument extends Document {
  static getInitialProps = getInitialProps;
  render() {
    return (
      <Html lang="en">
        <Head />
        <body className="loading">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
