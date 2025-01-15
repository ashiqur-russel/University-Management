import { Form, Input } from "antd";
import { Controller } from "react-hook-form";
import "../../styles/FormStyles.css";

type TInputProps = {
  type: string;
  name: string;
  label?: string;
};

const FormInput = ({ type, name, label }: TInputProps) => {
  return (
    <div style={{ marginBottom: "10px" }}>
      <Controller
        name={name}
        render={({ field }) => (
          <Form.Item label={label} className="custom-form-item">
            <Input
              {...field}
              type={type}
              id={name}
              style={{ border: "1px solid gray", color: "white" }}
            />
          </Form.Item>
        )}
      />
    </div>
  );
};

export default FormInput;
