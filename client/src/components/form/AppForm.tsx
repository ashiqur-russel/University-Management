import { FormProvider, useForm } from "react-hook-form";

const AppForm = ({ onSubmit, children }) => {
  const { handleSubmit } = useForm();
  const methods = useForm();
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  );
};

export default AppForm;
