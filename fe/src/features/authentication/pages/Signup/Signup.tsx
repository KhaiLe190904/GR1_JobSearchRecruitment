import { Link, useNavigate } from "react-router-dom";
import { Box } from "../../components/Box/Box";
import { Button } from "../../components/Button/Button";
import { Input } from "../../components/Input/Input";
import { Layout } from "../../components/Layout/Layout";
import { Seperator } from "../../components/Seperator/Seperator";
import classes from "./Signup.module.scss";
import { FormEvent, useState } from "react";
import { useAuthentication } from "../../context/AuthenticationContextProvider";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export function Signup() {
    const [errorMessage, setErrorMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const {signup} = useAuthentication()
    const navigate = useNavigate()

    const doSignup = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        const email = e.currentTarget.email.value
        const password = e.currentTarget.password.value
        try {
            await signup(email, password)
            navigate("/")
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                setErrorMessage("Đã xảy ra lỗi không xác định")
            }
        } finally {
            setIsLoading(false)
        }
    }
    return(
    <Layout className={classes.root}>
        <Box>
        <h1>Đăng ký</h1>
        <p>Tận dụng tối đa cuộc sống nghề nghiệp của bạn</p>
        <form onSubmit={doSignup}>
            <Input type="email" id="email" label="Email"/>
            <Input type="password" id="password" label="Password"/>
            {errorMessage  && <p className={classes.error}>{errorMessage}</p> }
            <p className={classes.disclaimer}>
            Khi nhấp vào Đồng ý và tham gia hoặc Tiếp tục, bạn đồng ý với.{" "}
            <a href="">Thỏa thuận người dùng</a>, <a href="">Chính sách riêng tư</a> và{" "}
            <a href="">Chính sách Cookie</a> của HustLink.
            </p>
            <Button type="submit" disabled={isLoading}>Đồng ý và tham gia</Button>
        </form>
        <Seperator>Hoặc</Seperator>
            <div className={classes.register}>
                Đã có tài khoản trên HustLink? <Link to="/login">Đăng nhập</Link>
            </div>
        </Box>
        <ToastContainer/>
    </Layout>);
}