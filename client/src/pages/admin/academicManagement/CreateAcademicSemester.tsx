import { FieldValues, SubmitHandler } from "react-hook-form";
import AppForm from "../../../components/form/AppForm";
import { Button, Col, Flex } from "antd";
import FormSelect from "../../../components/form/FormSelect";

const semesterOptions = [
  { value: "01", label: "Autumn" },
  { value: "02", label: "Summer" },
  { value: "03", label: "Fall" },
];

const CreateAcademicSemester = () => {
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    const name = semesterOptions[Number(data?.name) - 1]?.label;

    const semesterData = {
      name,
      code: data.name,
    };

    console.log(semesterData);
  };

  return (
    <Flex justify="center" align="center">
      <Col span={6}>
        <AppForm onSubmit={onSubmit} formName="creteSemesterForm">
          <FormSelect label="Name" name="name" options={semesterOptions} />
          <FormSelect label="Year" name="name" options={semesterOptions} />

          <FormSelect
            label="Start Month"
            name="name"
            options={semesterOptions}
          />
          <FormSelect label="End Month" name="name" options={semesterOptions} />

          <Button htmlType="submit">Submit</Button>
        </AppForm>
      </Col>
    </Flex>
  );
};

export default CreateAcademicSemester;
