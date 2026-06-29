import "./page6.css";

const Page6 = () => {
  return (
    <div className="page6-main">
      <div className="page6-top">
        <div className="page6-left">
          <div className="imagrrr">
            <img className="ie" src="/image/page6.jpg" alt="illustration" />
          </div>
        </div>

        <div className="page6-right">
          <p className="section-subtitle">WHY CHOOSE US?</p>
          <h2 className="text3">
            Fotographiya segregates thousands of photographs from an event so
            you don’t have to!
          </h2>
          <div className="highlight-line4"></div>
          <div className="feature-grid">
            <div className="feature-box">
              <h4>Facial Recognition</h4>
              <p>
                Fotographiya uses facial recognition to find photos of just you!
              </p>
            </div>
            <div className="feature-box">
              <h4>Quality Retention</h4>
              <p>No quality loss while sharing and downloading photos</p>
            </div>
            <div className="feature-box">
              <h4>Unlimited Event Groups</h4>
              <p>You can create multiple event groups for easy browsing</p>
            </div>
            <div className="feature-box">
              <h4>One Shot Upload</h4>
              <p>Upload multiple folders at once, hassle free!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page6;
