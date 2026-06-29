import "./page4.css";

const Page4 = () => {
  return (
    <div className="main2 container">
      <div className="image">
        <img src="/image/hello.jpg" alt="Preview" />
      </div>
      <div className="container">
        <div className="uppertext">
          <p>HOW Fotographiya WORKS?</p>
          <h2>Get Started with Fotographiya</h2>
          <div className="highlight-line4"></div>
        </div>
        <div className="box11">
          <div className="textflex">
            <img src="\image\face.jpg" alt="Sign Up" />
            <div>
              <h5>Sign Up</h5>
              <p>
                Sign up using phone number or email ID and register your face by
                clicking a selfie
              </p>
            </div>
          </div>
          <div className="textflex">
            <img src="\image\alaender.jpg" alt="Groups" />
            <div>
              <h5>Join and Create Groups</h5>
              <p>
                Join and create private or public event groups and upload photos
                to share them with people present there!
              </p>
            </div>
          </div>
          <div className="textflex">
            <img src="\image\heart.jpg" alt="Share Memories" />
            <div>
              <h5>Share Memories</h5>
              <p>
                Anecdotes are sweeter when they’re shared! Upload photos from
                multiple sources to take a trip down memory lane with people
                you’ve experienced them with.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page4;
