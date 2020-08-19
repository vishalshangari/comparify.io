import React from "react";
import ComponentWithLoadingStateProps from "./models";
import Loader from "../../Loader";

const ComponentWithLoadingState = ({
  loading,
  children,
}: ComponentWithLoadingStateProps) => {
  return loading ? <Loader /> : <>{children}</>;
};

export default ComponentWithLoadingState;
