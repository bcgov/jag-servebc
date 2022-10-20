import React from "react";
import "./footer.scss";

const Footer = React.memo(() => {
  return (
    <footer class="footer">
      <div class="container">
        <ul>
          <li><a href=".">Home</a></li>
          <li><a href="https://www2.gov.bc.ca/gov/content/home/disclaimer">Disclaimer</a></li>
          <li><a href="https://www2.gov.bc.ca/gov/content/home/privacy">Privacy</a></li>
          <li><a href="https://www2.gov.bc.ca/gov/content/home/accessibility">Accessibility</a></li>
          <li><a href="https://www2.gov.bc.ca/gov/content/home/copyright">Copyright</a></li>
          <li><a href="https://www2.gov.bc.ca/gov/content/home/get-help-with-government-services">Contact Us</a></li>
        </ul>
      </div>
    </footer>
  );
});
export default Footer;
