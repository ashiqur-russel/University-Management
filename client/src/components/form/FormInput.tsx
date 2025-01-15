import { Input } from "antd";
import { Controller } from "react-hook-form";

const FormInput = ({ type, name, label }) => {
  return (
    <div style={{ marginBottom: "10px" }}>
      {label ? label : null}
      <Controller
        name={name}
        render={({ field }) => (
          <Input
            {...field}
            type={type}
            id={name}
            style={{ border: "1px solid gray" }}
          />
        )}
      />
    </div>
  );
};

export default FormInput;
