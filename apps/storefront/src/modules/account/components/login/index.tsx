import { login } from "@/lib/data/customer"
import { LOGIN_VIEW } from "@/modules/account/templates/login-template"
import { useActionState } from "react"
import {
  AuthError,
  AuthField,
  AuthHeading,
  AuthSubmit,
  AuthSwitch,
} from "../auth-ui"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(login, null)

  return (
    <div
      className="flex w-full max-w-md flex-col gap-8"
      data-testid="login-page"
    >
      <AuthHeading sub="Order faster and keep your quotes in one place.">
        Log in
      </AuthHeading>
      <form className="flex flex-col gap-5" action={formAction}>
        <AuthField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          data-testid="email-input"
        />
        <AuthField
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          data-testid="password-input"
        />
        <AuthError error={message} data-testid="login-error-message" />
        <AuthSubmit data-testid="sign-in-button">Log in</AuthSubmit>
      </form>
      <AuthSwitch
        prompt="New to Raaga?"
        action="Create a company account"
        onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
        data-testid="register-button"
      />
    </div>
  )
}

export default Login
