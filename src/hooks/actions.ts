import { useDispatch } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import { githubActions } from "../store/github/github.slice";

const actions = {
  ...githubActions,
};

export const useActions = () => {
  const dispath = useDispatch();
  return bindActionCreators(actions, dispath);
};
