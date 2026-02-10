import errorImage from "../assets/Error-404.png";

const ErrorPage = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <img src={errorImage} alt="404" className="w-4/5 h-4/5 object-contain" />
    </div>
  );
};

export default ErrorPage;
