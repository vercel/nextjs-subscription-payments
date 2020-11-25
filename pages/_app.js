import '../assets/main.css';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function MyApp({ Component, pageProps }) {
  return (
    <div className="bg-primary">
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </div>
  );
}
