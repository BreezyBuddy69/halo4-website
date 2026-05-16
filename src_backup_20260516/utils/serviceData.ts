import {
  Briefcase, Star, MessageSquare, CalendarCheck, Users, RotateCcw,
  Clock, Lightbulb, CheckCircle, Shield, Settings, Link,
  BarChart2, DollarSign, Activity, Target, TrendingUp,
  Wrench, ArrowLeftRight, Database
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type FilterGroup = 'agents' | 'faq' | 'roi'
export type ChatContext = 'general' | 'lead-generation' | 'custom-solutions' | 'save-time' | 'examples'

export interface ServiceNode {
  id: number
  icon: LucideIcon
  filterGroup: FilterGroup
  context: ChatContext
}

export const SERVICE_NODES: ServiceNode[] = [
  { id: 1,  icon: Briefcase,      filterGroup: 'agents', context: 'lead-generation' },
  { id: 2,  icon: Star,           filterGroup: 'agents', context: 'examples' },
  { id: 3,  icon: MessageSquare,  filterGroup: 'agents', context: 'examples' },
  { id: 4,  icon: CalendarCheck,  filterGroup: 'agents', context: 'examples' },
  { id: 5,  icon: Users,          filterGroup: 'agents', context: 'save-time' },
  { id: 6,  icon: RotateCcw,      filterGroup: 'agents', context: 'save-time' },
  { id: 7,  icon: Clock,          filterGroup: 'faq',    context: 'save-time' },
  { id: 8,  icon: Lightbulb,      filterGroup: 'faq',    context: 'examples' },
  { id: 9,  icon: CheckCircle,    filterGroup: 'faq',    context: 'save-time' },
  { id: 10, icon: Shield,         filterGroup: 'faq',    context: 'custom-solutions' },
  { id: 11, icon: Settings,       filterGroup: 'faq',    context: 'custom-solutions' },
  { id: 12, icon: Link,           filterGroup: 'faq',    context: 'custom-solutions' },
  { id: 13, icon: BarChart2,      filterGroup: 'roi',    context: 'examples' },
  { id: 14, icon: DollarSign,     filterGroup: 'roi',    context: 'save-time' },
  { id: 15, icon: Activity,       filterGroup: 'roi',    context: 'examples' },
  { id: 16, icon: Target,         filterGroup: 'roi',    context: 'lead-generation' },
  { id: 17, icon: TrendingUp,     filterGroup: 'roi',    context: 'lead-generation' },
  { id: 18, icon: CheckCircle,    filterGroup: 'roi',    context: 'save-time' },
  { id: 19, icon: Wrench,         filterGroup: 'agents', context: 'custom-solutions' },
  { id: 20, icon: ArrowLeftRight, filterGroup: 'agents', context: 'custom-solutions' },
  { id: 21, icon: Database,       filterGroup: 'agents', context: 'custom-solutions' },
  { id: 22, icon: TrendingUp,     filterGroup: 'faq',    context: 'examples' },
  { id: 23, icon: Lightbulb,      filterGroup: 'faq',    context: 'examples' },
  { id: 24, icon: BarChart2,      filterGroup: 'roi',    context: 'examples' },
]
