export const LoginStart = userCredentials => ({
  type: 'LOGIN_START'
})

export const LoginSuccess = user => ({
  type: 'LOGIN_SUCCESS',
  payload: user
})

export const LoginFailure = () => ({
  type: 'LOGIN_FAILURE'
})

export const Logout = () => ({
  type: 'LOG_OUT'
})

export const Follow = userId => ({
  type: 'FOLLOW',
  payload: userId
})

export const Unfollow = userId => ({
  type: 'UNFOLLOW',
  payload: userId
})

export const UpdateCover = userId => ({
  type: 'UPDTAECPVER',
  payload: userId
})

export const UpdateAvatar = userId => ({
  type: 'UPDTAEAVATAR',
  payload: userId
})

export const UpdateUser = userId => ({
  type: 'UPDATEUSER',
  payload: userId
})
