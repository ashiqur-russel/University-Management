import { FieldValues, SubmitHandler } from "react-hook-form";
import AppForm from "../../../components/form/AppForm";
import { Button, Col, Flex } from "antd";
import FormSelect from "../../../components/form/FormSelect";

const currentYear = new Date().getFullYear();

const yearOptions = [0, 1, 2, 3, 4].map((number) => ({
  value: String(currentYear + number),
  label: String(currentYear + number),
}));

const semesterOptions = [
  { value: "01", label: "Autumn" },
  { value: "02", label: "Summer" },
  { value: "03", label: "Fall" },
];

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const monthOptions = monthNames.map((item) => ({
  value: item,
  label: item,
}));

const CreateAcademicSemester = () => {
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    const name = semesterOptions[Number(data?.name) - 1]?.label;

    const semesterData = {
      name,
      code: data.name,
      year: data.year,
      startMonth: data.startMonth,
      endMonth: data.endMonth,
    };

    console.log(semesterData);
  };

  return (
    <Flex justify="center" align="center">
      <Col span={6}>
        <AppForm onSubmit={onSubmit} formName="creteSemesterForm">
          <FormSelect label="Name" name="name" options={semesterOptions} />
          <FormSelect label="Year" name="year" options={yearOptions} />

          <FormSelect
            label="Start Month"
            name="startMonth"
            options={monthOptions}
          />
          <FormSelect
            label="End Month"
            name="endMonth"
            options={monthOptions}
          />

          <Button htmlType="submit">Submit</Button>
        </AppForm>
      </Col>
    </Flex>
  );
};

export default CreateAcademicSemester;
