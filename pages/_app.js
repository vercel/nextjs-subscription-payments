import '../assets/main.css';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { AuthProvider } from '../utils/useAuth';

export default function MyApp({ Component, pageProps }) {
  return (
    <div className="bg-primary">
      <AuthProvider>
        <Navbar />
        <Component {...pageProps} />
        <Footer />
      </AuthProvider>
    </div>
  );
}
