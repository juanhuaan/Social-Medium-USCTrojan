const AuthReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        user: null,
        isFetching: true,
        error: false
      }
    case 'LOGIN_SUCCESS':
      return {
        user: action.payload,
        isFetching: false,
        error: false
      }
    case 'LOGIN_FAILURE':
      return {
        user: null,
        isFetching: false,
        error: true
      }
    case 'LOG_OUT':
      return {
        user: null,
        isFetching: false,
        error: false
      }
    case 'FOLLOW':
      return {
        ...state,
        user: {
          ...state.user,
          followings: [...state.user.followings, action.payload]
        }
      }
    case 'UNFOLLOW':
      return {
        ...state,
        user: {
          ...state.user,
          followings: state.user.followings.filter(following => following !== action.payload)
        }
      }
    case 'UPDTAECPVER':
      return {
        ...state,
        user: {
          ...state.user,
          coverPicture: action.payload
        }
      }
      case 'UPDTAEAVATAR':
        return {
          ...state,
          user: {
            ...state.user,
            profilePicture: action.payload
          }
        }
      case 'UPDATEUSER':
        return {
          ...state,
          user: {
            ...state.user,
            //username: action.payload,
            city: action.payload,
            from: action.payload,
            desc: action.payload,
            relationship: action.payload
          }
        }
    default:
      return state
  }
}

export default AuthReducer
