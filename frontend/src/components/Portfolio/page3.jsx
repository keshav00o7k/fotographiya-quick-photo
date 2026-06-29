import './page3.css';

const Page3 = () => {
  return (
    <div className="main">
      <div className="box">
        <img src="/image/face-detection2.png" alt="Face Icon" />
        <div className="box-text">
          <h2>200M</h2>
          <p>Total Faces Scanned</p>
        </div>
      </div>

      <div className="box">
        <img src="/image/photos-delivered.png" alt="Photos Icon" />
        <div className="box-text">
          <h2>70M</h2>
          <p>Photos Delivered to Users</p>
        </div>
      </div>

      <div className="box">
        <img src="/image/accuracy.png" alt="Accuracy Icon" />
        <div className="box-text">
          <h2>99.9%</h2>
          <p>Face Recognition Accuracy</p>
        </div>
      </div>
    </div>
  );
};

export default Page3;