import "./footer.css";

const Footer = () => {
  return (
    <>
      <div className="main4">
        <div>
          <div className="logo2">
            <img src="\image\logo.png" alt="Fotographiya Logo" />
          </div>
          <div className="ul-btn">
            <div className="listfooter">
              <ul className="ull">
                <a href="" rel="noopener noreferrer">
                  <li>Home</li>
                </a>
                <li>Photographer Benefits</li>
                <a
                  href="https://www.fotographiya.com/about"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <li>About Us</li>
                </a>
                <a
                  href="https://www.fotographiya.com/contact"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <li>Contact Us</li>
                </a>

                {/* <li>Pricing</li> */}
                <a
                  href=" https://www.fotographiya.com/blog"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <li>Blog</li>
                </a>
                {/* <li>FAQs</li> */}
              </ul>
            </div>

            <div className="bttn">
              <a
                href="https://www.instagram.com/fotographiyawedding/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://img.icons8.com/ios-filled/24/1da1f2/instagram-new.png"
                  alt="Instagram"
                />
              </a>

              <a
                href="https://www.linkedin.com/company/fotographiya-the-wedding-photography/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://img.icons8.com/ios-filled/24/0a66c2/linkedin.png"
                  alt="LinkedIn"
                />
              </a>

              <a
                href="https://www.youtube.com/@Fotographiya_wedding/videos"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://img.icons8.com/ios-filled/24/ff0000/youtube-play.png"
                  alt="YouTube"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom Text */}
        <div className="footerbottom">
          <p className="leftside">© 2024 Fotographiya. All rights reserved.</p>
          <p className="rightside">
            <a href="#">Privacy policy</a> |<a href="#">Terms & conditions</a> |
            <a href="#">Refunds</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Footer;
