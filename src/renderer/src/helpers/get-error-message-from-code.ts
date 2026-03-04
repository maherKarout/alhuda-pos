const errorCode: any = {
  error: 'networkError',
  '11000email': 'duplicate email',
  '11000username': 'duplicate username',
  '11000': 'duplicate data',
  '11000phoneNumber': 'duplicatePhoneNumber',
  '11000digitalId': 'duplicateID',
  '1000': "youDon'tHaveManagementToThisAccount",
  '1001': 'notSuperAdmin',
  '1002': 'oldPassword',
  '1003': 'canNotDeleteYourSelf',
  '2000': 'operatorNotFound',
  '4003': 'emailOrPasswordNotCorrect',
  '4001': 'userWithoutType',
  '4002': 'missingData',
  // '4003': 'userWithoutRole',
  '4004': 'wrongUser ',
  '6001': 'file content not valid',
  '11000name': 'duplicate name',
  '11002': 'Section has category',
  '110010': 'section has product',
  '50007': 'access token expired',
  '50005': 'access token expired',
  '4024': 'You are not registered as a pos for this branch',
  '140000': 'Product not found',
  "180003":"Customer name already exists"
}

export const getErrorMessageFromCode = (code: number | string) => {
  const message: string = errorCode[code]
  return message ? message : errorCode['error']
}
