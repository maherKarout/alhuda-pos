import { useDispatch } from "react-redux";
import { AppDispatch } from "src/redux-config/store";

export const useAppDispatch: () => AppDispatch = useDispatch;
