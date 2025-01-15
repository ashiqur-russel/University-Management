import { ReactNode } from "react";
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import classNames from "classnames";
import "../../styles/FormStyles.css";
import { Form } from "antd";
type TFormConfig = {
  defaultValues?: Record<string, any>;
};

type TFromProps = {
  onSubmit: SubmitHandler<FieldValues>;
  children: ReactNode;
  formName?: string;
} & TFormConfig;

const AppForm = ({
  onSubmit,
  children,
  formName,
  defaultValues,
}: TFromProps) => {
  const formConfig: TFormConfig = {};

  const formStyle = classNames("basic-all", {
    "login-form": formName === "loginForm",
    "create-semester-form": formName === "creteSemesterForm",
  });

  if (defaultValues) {
    formConfig["defaultValues"] = defaultValues;
  }

  const methods = useForm(formConfig);

  return (
    <FormProvider {...methods}>
      <Form
        layout="vertical"
        onFinish={methods.handleSubmit(onSubmit)}
        className={formStyle}
      >
        {children}
      </Form>
    </FormProvider>
  );
};

export default AppForm;
