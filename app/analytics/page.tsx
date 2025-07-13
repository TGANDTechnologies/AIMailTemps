'use client'

import { Layout } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Analytics() {
  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Track your email campaign performance and engagement metrics.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Analytics Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Analytics dashboard coming soon. This will show detailed campaign performance, 
                open rates, click-through rates, and engagement metrics.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}