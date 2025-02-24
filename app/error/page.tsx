import { XCircle } from "lucide-react"

export default function ErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <XCircle className="mx-auto h-16 w-16 text-red-500" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Error</h1>
        <p className="mt-2 text-gray-600">We're sorry, but an error has occurred.</p>
      </div>
    </div>
  )
}

