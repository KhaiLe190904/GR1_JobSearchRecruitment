import { Link, useLocation, useNavigate } from "react-router-dom";
import { Box } from "../../components/Box/Box";
import { Button } from "../../components/Button/Button";
import { Input } from "../../components/Input/Input";
import { Layout } from "../../components/Layout/Layout";
import { Seperator } from "../../components/Seperator/Seperator";
import { toast } from "react-toastify";
import { FormEvent, useState } from "react";
import { useAuthentication } from "../../context/AuthenticationContextProvider";
import "react-toastify/dist/ReactToastify.css";
import classes from "./Login.module.scss";
export function Login() {
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const authentication = useAuthentication();
  const navigate = useNavigate();
  const location = useLocation();
  const doLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const email = e.currentTarget.email.value;
    const password = e.currentTarget.password.value;
    try {
      if (authentication && authentication.login) {
        await authentication.login(email, password);
        const destination = location.state?.from?.pathname || "/";
        navigate(destination);
      } else {
        throw new Error("Dịch vụ xác thực không khả dụng");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Đã xảy ra lỗi không xác định");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Layout className={classes.root}>
      <Box>
        <h1>Đăng nhập</h1>
        <p>Chào mừng bạn đến với HustLink</p>
        <form onSubmit={doLogin}>
          <Input
            type="email"
            id="email"
            label="Email"
            onFocus={() => setErrorMessage("")}
          />
          <Input
            type="password"
            id="password"
            label="Password"
            onFocus={() => setErrorMessage("")}
          />
          {errorMessage && <p className={classes.error}>{errorMessage}</p>}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
          <Link to="/request-password-reset">Quên mật khẩu?</Link>
        </form>
        <Seperator>Hoặc</Seperator>
        <div className={classes.register}>
          Chưa có tài khoản trên HustLink?{" "}
          <Link to="/signup">Tham gia ngay</Link>
        </div>
      </Box>
    </Layout>
  );
}