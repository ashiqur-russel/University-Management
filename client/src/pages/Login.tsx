import { Button, Row } from "antd";
import { FieldValues } from "react-hook-form";
import { useLoginMutation } from "../redux/features/auth/authApi";
import { useAppDispatch } from "../redux/hooks";
import { setUser, TUser } from "../redux/features/auth/authSlice";
import { verifyToken } from "../utils/verifyToken";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import AppForm from "../components/form/AppForm";
import FormInput from "../components/form/FormInput";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // const { register, handleSubmit } = useForm({
  //   defaultValues: { id: "A-0001", password: "12345" },
  // });

  const defaultValues = {
    id: "A-0001",
    password: "12345",
  };

  const [login] = useLoginMutation();

  const onSubmit = async (data: FieldValues) => {
    console.log(data);
    const toastId = toast.loading("Logging in...");
    const userInfo = {
      id: data.id,
      password: data.password,
    };
    try {
      const result = await login(userInfo).unwrap();
      const token = result.data.accessToken;
      const user = verifyToken(token) as TUser;
      toast.success("Logged in Successfully", { id: toastId, duration: 200 });
      dispatch(setUser({ user: user, token: result.data.accessToken }));
      navigate(`/${user.role}/dashboard`);
    } catch {
      toast.error("Something went wrong!", { id: toastId, duration: 2000 });
    }
  };

  return (
    <Row justify="center" align="middle" style={{ height: "100vh" }}>
      <AppForm onSubmit={onSubmit} defaultValues={defaultValues}>
        <FormInput type="id" name="id" label="ID:" />

        <FormInput type="password" name="password" label="PASSWORD:" />
        <Button htmlType="submit">Login</Button>
      </AppForm>
    </Row>
  );
};

export default Login;
