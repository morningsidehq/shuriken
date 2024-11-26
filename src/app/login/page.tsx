/**
 * Login page component that provides user authentication functionality.
 * For more details on authentication flow, see Authentication section in app-documentation.md
 */

import LoginForm from '../../components/LoginForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * Login component that renders a centered card containing the login form
 * @returns JSX.Element A card with login form centered on the page
 */
export default function Login() {
  return (
    // Container div that centers the login card both vertically and horizontally
    <div className="flex h-screen w-screen items-center justify-center">
      {/* Card component with fixed width for login form */}
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-center">Log In</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  )
}
