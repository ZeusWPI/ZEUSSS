import { Navigate } from "react-router-dom";

export const MainPage = () => {
  return (
    <div>
      Welcome on the Student Street Soccer livesite
      <Navigate to={"/poules"} />
    </div>
  );
};
