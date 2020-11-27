import '../assets/main.css';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { UserContextProvider } from '../components/UserContext';

export default function MyApp({ Component, pageProps }) {
  return (
    <div className="bg-primary">
      <UserContextProvider>
        <Navbar />
        <Component {...pageProps} />
        <Footer />
      </UserContextProvider>
    </div>
  );
}
