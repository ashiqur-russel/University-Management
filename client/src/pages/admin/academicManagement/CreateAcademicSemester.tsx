import { FieldValues, SubmitHandler } from "react-hook-form";
import AppForm from "../../../components/form/AppForm";
import FormInput from "../../../components/form/FormInput";
import { Button, Col, Flex } from "antd";
import FormSelect from "../../../components/form/FormSelect";

const CreateAcademicSemester = () => {
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    console.log(data);
  };

  return (
    <Flex justify="center" align="center">
      <Col span={6}>
        <AppForm onSubmit={onSubmit} formName="creteSemesterForm">
          <FormInput type="text" name="name" label="Name" />
          <FormSelect label="Name" />
          <Button htmlType="submit">Submit</Button>
        </AppForm>
      </Col>
    </Flex>
  );
};

export default CreateAcademicSemester;
