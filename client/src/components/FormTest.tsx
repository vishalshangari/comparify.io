import * as React from "react";
import { useForm } from "react-hook-form";
import db from "../db";
import AwesomeDebouncePromise from "awesome-debounce-promise";

type FormData = {
  firstName: string;
  lastName: string;
};

export default function App() {
  const { register, setValue, handleSubmit, errors } = useForm<FormData>({
    mode: "onChange",
  });
  const onSubmit = handleSubmit(async ({ firstName, lastName }) => {
    const page = await db.collection("users").doc("smaleki517").get();
  }); // firstName and lastName will have correct type

  const validateName = async (name: string) => {
    if (name.length < 10) {
      return false;
    }
    return true;
  };

  return (
    <form onSubmit={onSubmit}>
      <label>First Name</label>
      <input
        name="firstName"
        ref={register({
          required: true,
          validate: {
            minLength: AwesomeDebouncePromise(async (value) => {
              return (await validateName(value)) || "Name is too short";
            }, 500),
            maxLength: (value) => value.length < 50 || "lol",
          },
        })}
      />
      <label>Last Name</label>
      <input name="lastName" ref={register} />
      <input type="submit" value="Go" />
      <br />
      {errors.firstName?.message}
      {/* <button
        type="button"
        onClick={() => {
          setValue("lastName", "luo"); // ✅
          // setValue("firstName", true); // ❌: true is not string
          // errors.bill; // ❌: property bill does not exist
        }}
      >
        SetValue
      </button> */}
    </form>
  );
}
