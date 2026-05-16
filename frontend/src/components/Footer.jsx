const Footer = () => {
  return (
    <footer className="footer glass">
      <div className="container">
        {/* Automatic Year Update */}
        <p>&copy; {new Date().getFullYear()} CPPAnalyzer Pro. All rights reserved.</p>
        <div className="footer-links">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
