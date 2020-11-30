import '../assets/main.css';
import Layout from '../components/Layout';
import { UserContextProvider } from '../components/UserContext';

export default function MyApp({ Component, pageProps }) {
  return (
    <div className="bg-primary">
      <UserContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </UserContextProvider>
    </div>
  );
}
