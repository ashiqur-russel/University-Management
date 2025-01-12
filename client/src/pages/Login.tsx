import { Button } from "antd";
import { useForm } from "react-hook-form";
import { useLoginMutation } from "../redux/features/auth/authApi";
import { useAppDispatch } from "../redux/hooks";
import { setUser } from "../redux/features/auth/authSlice";
import { verifyToken } from "../utils/verifyToken";

const Login = () => {
  const dispatch = useAppDispatch();
  const { register, handleSubmit } = useForm({
    defaultValues: { id: "2025-01-0001", password: "12345" },
  });

  const [login, { data, error }] = useLoginMutation();

  const onSubmit = async (data) => {
    const userInfo = {
      id: data.id,
      password: data.password,
    };

    const result = await login(userInfo).unwrap();

    const token = result.data.accessToken;

    const user = verifyToken(token);

    dispatch(setUser({ user: user, token: result.data.accessToken }));
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <div
        style={{
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          width: "10%",
        }}
      >
        <div>
          <label htmlFor="id">ID:</label>
          <input
            type="text"
            id="id"
            {...register("id", { required: true })}
            style={{ border: "1px solid gray" }}
          />
        </div>

        <div>
          <label htmlFor="password">PASSWORD:</label>
          <input
            type="password"
            id="password"
            {...register("password", { required: true })}
            style={{ border: "1px solid gray" }}
          />
        </div>
        <Button htmlType="submit">Login</Button>
      </div>
    </form>
  );
};

export default Login;
