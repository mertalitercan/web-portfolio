export type PageView = {
  path: string
  timestamp: number
  referrer: string
  userAgent: string
}

export type AnalyticsData = {
  totalViews: number
  pathViews: Record<string, number>
  dailyVisitors: Record<string, string[]>
}

const STORAGE_KEY = "portfolio_analytics"

function getAnalyticsData(): AnalyticsData {
  if (typeof window === "undefined") {
    return { totalViews: 0, pathViews: {}, dailyVisitors: {} }
  }

  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    return { totalViews: 0, pathViews: {}, dailyVisitors: {} }
  }

  try {
    return JSON.parse(stored)
  } catch {
    return { totalViews: 0, pathViews: {}, dailyVisitors: {} }
  }
}

function saveAnalyticsData(data: AnalyticsData) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function trackPageView(data: PageView) {
  const analytics = getAnalyticsData()

  analytics.totalViews += 1
  analytics.pathViews[data.path] = (analytics.pathViews[data.path] || 0) + 1

  const today = new Date().toISOString().split("T")[0]
  if (!analytics.dailyVisitors[today]) {
    analytics.dailyVisitors[today] = []
  }
  if (!analytics.dailyVisitors[today].includes(data.userAgent)) {
    analytics.dailyVisitors[today].push(data.userAgent)
  }

  saveAnalyticsData(analytics)
  return { success: true }
}

export function getAnalytics() {
  const analytics = getAnalyticsData()

  const sections = ["", "about", "skills", "projects", "experience", "contact"]
  const sectionViews = sections.map((section) => {
    const path = section ? `/${section}` : "/"
    const views = analytics.pathViews[path] || 0
    return { path: section || "home", views }
  })

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date.toISOString().split("T")[0]
  })

  const dailyVisitors = last7Days
    .map((day) => {
      const visitors = analytics.dailyVisitors[day] || []
      return { day, count: visitors.length }
    })
    .reverse()

  return {
    totalViews: analytics.totalViews,
    sectionViews,
    dailyVisitors,
  }
}
