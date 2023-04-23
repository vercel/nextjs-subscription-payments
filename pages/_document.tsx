import Document, {
  Head,
  Html,
  Main,
  NextScript,
  DocumentInitialProps,
  DocumentContext
} from 'next/document';

type MyDocumentProps = {
  page: string;
  __NEXT_DATA__: any;
};
type MyDocumentInitialProps = MyDocumentProps & DocumentInitialProps;

export default function MyDocument(props: MyDocumentInitialProps) {
  const isDashboard = props?.__NEXT_DATA__?.page.startsWith('/dashboard');
  return (
    <Html lang="en" className={isDashboard ? 'dashboard' : ''}>
      <Head />
      <body className="loading">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

export const getServerSideProps = async (ctx: DocumentContext) => {
  const initialProps = await Document.getInitialProps(ctx);
  return { initialProps };
};
