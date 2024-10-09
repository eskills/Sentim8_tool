"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthContext } from '@/components/AuthProvider'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const { login, loginWithGoogle, loginWithMicrosoft } = useAuthContext()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await login(email, password)
    if (result.success) {
      router.push('/dashboard')
    } else {
      console.error(result.error)
      // Handle error (e.g., show error message to user)
    }
  }

  const handleGoogleLogin = async () => {
    const result = await loginWithGoogle()
    if (result.success) {
      router.push('/dashboard')
    } else {
      console.error(result.error)
      // Handle error
    }
  }

  const handleMicrosoftLogin = async () => {
    const result = await loginWithMicrosoft()
    if (result.success) {
      router.push('/dashboard')
    } else {
      console.error(result.error)
      // Handle error
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Sign In to Sentim8</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Input
                  id="email"
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Input
                  id="password"
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full">Sign In</Button>
            <div className="flex justify-between w-full">
              <Button type="button" variant="outline" className="flex-1 mr-2" onClick={handleGoogleLogin}>
                Google
              </Button>
              <Button type="button" variant="outline" className="flex-1 ml-2" onClick={handleMicrosoftLogin}>
                Microsoft
              </Button>
            </div>
            <div className="text-center">
              <Link href="/auth/register" className="text-sm text-blue-600 hover:underline">
                Don't have an account? Register here
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}