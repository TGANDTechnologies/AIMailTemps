import Link from 'next/link'
import { Button } from './components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            EmailCraft
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
            AI-Powered Email Marketing Platform
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-xl mx-auto">
            Create and send personalized email campaigns with AI-powered content generation. 
            Manage your contacts, track performance, and grow your business.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link href="/dashboard">
            <Button size="lg" className="text-lg px-8 py-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700">
              Go to Dashboard
            </Button>
          </Link>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="text-3xl mb-4">🤖</div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">AI-Powered</h3>
              <p className="text-gray-600 dark:text-gray-300">Generate personalized emails using OpenAI</p>
            </div>
            
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Analytics</h3>
              <p className="text-gray-600 dark:text-gray-300">Track email performance and engagement</p>
            </div>
            
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Fast Setup</h3>
              <p className="text-gray-600 dark:text-gray-300">Upload contacts and launch campaigns quickly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}