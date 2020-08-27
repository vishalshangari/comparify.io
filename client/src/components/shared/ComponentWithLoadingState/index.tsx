import React from "react";
import ComponentWithLoadingStateProps from "./models";
import Loader from "../../Loader";

export default ({
  loading,
  children,
  label,
}: ComponentWithLoadingStateProps) => {
  return loading ? <Loader label={label} /> : <>{children}</>;
};
