import { ReactNode } from "react";
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import classNames from "classnames";
import "../../styles/FormStyles.css";
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

  const formStyle = classNames("", {
    "login-form": formName === "loginForm",
  });

  if (defaultValues) {
    formConfig["defaultValues"] = defaultValues;
  }

  const methods = useForm(formConfig);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className={formStyle}>
        {children}
      </form>
    </FormProvider>
  );
};

export default AppForm;
