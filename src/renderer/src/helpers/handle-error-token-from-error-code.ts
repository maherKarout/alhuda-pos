const errorCode: Array<number> = [50007, 50005];
const handleErrorTokenFromErrorCode = (code: string) => {
  return errorCode.includes(+code);
};

export default handleErrorTokenFromErrorCode;
