import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div>
          <div className="footer-logo-row">
            <span className="footer-logo-text">AiCruzz</span>
          </div>
          <p className="footer-brand-desc">
            The most powerful AI video creation platform for creators, marketers, and developers worldwide.
          </p>
        </div>
        <div className="footer-col">
          <h4>Product</h4>
          <Link href="/features" className="footer-link">Features</Link>
          <Link href="/pricing" className="footer-link">Pricing</Link>
          <Link href="/api-docs" className="footer-link">API</Link>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <Link href="/about" className="footer-link">About</Link>
          <Link href="/blog" className="footer-link">Blog</Link>
          <Link href="/contact" className="footer-link">Contact</Link>
        </div>
        <div className="footer-col">
          <h4>Legal</h4>
          <Link href="#" className="footer-link">Privacy</Link>
          <Link href="#" className="footer-link">Terms</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2025 AiCruzz Inc.</span>
        <span>Made for creators everywhere</span>
      </div>
    </footer>
  );
}
