import LoginForm from '../../components/LoginForm'

export default function Login() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="w-[400px]">
        <h1 className="mb-4 text-center text-2xl font-bold">Log In</h1>
        <LoginForm />
      </div>
    </div>
  )
}
