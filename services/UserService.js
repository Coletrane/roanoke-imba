import Auth from "@aws-amplify/auth"
import { authConfig } from "../constants"
import AuthService from "./AuthService"
import AwsStatuses from "../util/aws-statuses"

Auth.configure(authConfig)

const updateUser = async user => {
  try {
    const res = await Auth.updateUserAttributes(
      await Auth.currentAuthenticatedUser(),
      user
    )
    if (res === AwsStatuses.success) {
      return await AuthService.getLoggedInUser()
    }
  } catch (err) {
    return null
  }
}

const verifyNewEmail = async (email, code) => {
  try {
    const res = await Auth.verifyCurrentUserAttributeSubmit("email", code)
    if (res === AwsStatuses.success) {
      return await AuthService.getLoggedInUser()
    }
  } catch (err) {
    return null
  }
}

const resendVerificationCode = async () => {
  try {
    const res = await Auth.verifyCurrentUserAttribute("email")
    return res
  } catch (err) {
    return null
  }
}

const changePassword = async (oldPassword, newPassword) => {
  try {
    const res = await Auth.changePassword(
      await Auth.currentAuthenticatedUser(),
      oldPassword,
      newPassword
    )
    return res
  } catch (err) {
    return err.code
  }
}

export default {
  updateUser,
  verifyNewEmail,
  resendVerificationCode,
  changePassword
}
